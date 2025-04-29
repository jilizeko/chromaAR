// Шейдерные константы и функции

// Шейдерный код - вертексный шейдер
const vertexShader = `
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// Высококачественный фрагментный шейдер
const highQualityFragmentShader = `
    uniform sampler2D videoTexture;
    uniform vec3 keyColor;
    uniform float similarity;
    uniform float smoothness;
    uniform float spill;
    
    varying vec2 vUv;
    
    // Конвертация RGB в HSV
    vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
        
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }
    
    // Конвертация HSV в RGB
    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    void main() {
        // Семплируем видео текстуру
        vec4 videoColor = texture2D(videoTexture, vUv);
        
        // Конвертируем RGB в HSV
        vec3 hsvColor = rgb2hsv(videoColor.rgb);
        vec3 hsvKey = rgb2hsv(keyColor);
        
        // Вычисляем цветовую дистанцию в HSV пространстве
        float colorDistance = distance(hsvColor.x, hsvKey.x);
        
        // Корректируем для цветового круга
        colorDistance = min(colorDistance, 1.0 - colorDistance);
        
        // Вычисляем альфа-маску на основе схожести цвета
        float alphaMask = smoothstep(similarity, similarity + smoothness, colorDistance);
        
        // Применяем подавление разлива для уменьшения зеленого оттенка по краям
        if (spill > 0.0) {
            // Определяем доминирование зеленого (типично для разлива зеленого экрана)
            float greenDominance = videoColor.g - max(videoColor.r, videoColor.b);
            
            if (greenDominance > 0.0) {
                // Уменьшаем зеленый канал на основе значения разлива
                videoColor.g -= greenDominance * spill;
            }
        }
        
        // Применяем альфа-маску
        gl_FragColor = vec4(videoColor.rgb, videoColor.a * alphaMask);
    }
`;

// Шейдер среднего качества (упрощенный)
const mediumQualityFragmentShader = `
    uniform sampler2D videoTexture;
    uniform vec3 keyColor;
    uniform float similarity;
    uniform float smoothness;
    uniform float spill;
    
    varying vec2 vUv;
    
    void main() {
        // Семплируем видео текстуру
        vec4 videoColor = texture2D(videoTexture, vUv);
        
        // Более простое вычисление цветовой дистанции в RGB пространстве
        float colorDistance = distance(videoColor.rgb, keyColor);
        
        // Вычисляем альфа-маску на основе схожести цвета
        float alphaMask = smoothstep(similarity * 0.5, similarity * 0.5 + smoothness, colorDistance);
        
        // Упрощенное подавление разлива
        if (spill > 0.0 && keyColor.g > 0.5) {
            videoColor.g = min(videoColor.g, videoColor.r + videoColor.b);
        }
        
        // Применяем альфа-маску
        gl_FragColor = vec4(videoColor.rgb, videoColor.a * alphaMask);
    }
`;

// Низкокачественный фрагментный шейдер (базовый)
const lowQualityFragmentShader = `
    uniform sampler2D videoTexture;
    uniform vec3 keyColor;
    uniform float similarity;
    
    varying vec2 vUv;
    
    void main() {
        // Семплируем видео текстуру
        vec4 videoColor = texture2D(videoTexture, vUv);
        
        // Базовое сравнение цвета
        float colorMatch = step(distance(videoColor.rgb, keyColor), similarity);
        
        // Простое вычисление альфы
        float alpha = 1.0 - colorMatch;
        
        // Применяем альфу
        gl_FragColor = vec4(videoColor.rgb, videoColor.a * alpha);
    }
`;

// Получение текущего фрагментного шейдера на основе настройки качества
function getFragmentShader(quality) {
    switch (quality) {
        case 'high':
            return highQualityFragmentShader;
        case 'medium':
            return mediumQualityFragmentShader;
        case 'low':
            return lowQualityFragmentShader;
        default:
            return mediumQualityFragmentShader;
    }
}
