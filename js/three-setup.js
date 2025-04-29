// Настройка Three.js сцены, камеры и рендерера

// Глобальные Three.js переменные
let scene, camera, renderer;
let videoPlane;
let gridHelper;
let gridVisible = false;

// Инициализация Three.js сцены
function initThreeJS(appStatus, container, resolutionScale, inputVideo, createVideoTexture) {
    if (typeof THREE === 'undefined') {
        appStatus.textContent = 'Ошибка: Three.js не загружен';
        appStatus.style.backgroundColor = '#ffdddd';
        appStatus.style.color = '#ff0000';
        console.error('Three.js не загружен. Проверьте интернет-соединение или ссылку на CDN.');
        return false;
    }
    
    // Создаем сцену
    scene = new THREE.Scene();
    scene.background = null; // Прозрачный фон
    
    // Создаем камеру (перспективную)
    camera = new THREE.PerspectiveCamera(
        75, // Поле зрения
        window.innerWidth / window.innerHeight, // Соотношение сторон
        0.1, // Ближняя плоскость отсечения
        1000 // Дальняя плоскость отсечения
    );
    camera.position.z = 5;
    
    // Создаем рендерер с прозрачностью
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true, // Включаем прозрачность
        powerPreference: 'high-performance' // Запрашиваем режим высокой производительности
    });
    
    // Применяем масштабирование разрешения
    const width = window.innerWidth * resolutionScale;
    const height = window.innerHeight * resolutionScale;
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    
    // Включаем оптимизации шейдеров
    renderer.precision = 'mediump'; // Используем среднюю точность для лучшей производительности
    
    // Устанавливаем прозрачный фон
    renderer.setClearColor(0x000000, 0);
    
    // Добавляем canvas рендерера в DOM
    const sceneContainer = document.getElementById(container);
    if (sceneContainer) {
        sceneContainer.appendChild(renderer.domElement);
    }
    
    // Добавляем освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Создаем плоскость для видео (временный цветной материал)
    const planeGeometry = new THREE.PlaneGeometry(4, 3); // Соотношение сторон 4:3 изначально
    const planeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
    });
    videoPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(videoPlane);
    
    // Добавляем тестовый куб для проверки работы сцены
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x3366ff });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-2, 0, 0); // Позиционируем слева от плоскости
    scene.add(cube);
    
    // Добавляем обработчик изменения размера окна
    window.addEventListener('resize', () => {
        onWindowResize(resolutionScale, appStatus);
    });
    
    // Если видео уже загружено, создаем видеотекстуру
    if (inputVideo.src && typeof createVideoTexture === 'function') {
        createVideoTexture();
    }
    
    return true;
}

// Обработка изменения размера окна
function onWindowResize(resolutionScale, appStatus) {
    if (!camera || !renderer) return;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Применяем масштабирование разрешения
    const width = window.innerWidth * resolutionScale;
    const height = window.innerHeight * resolutionScale;
    
    renderer.setSize(width, height, false);
    
    if (appStatus) {
        appStatus.textContent = 'Разрешение обновлено: ' + width.toFixed(0) + 'x' + height.toFixed(0);
    }
}

// Переключение видимости сетки
function toggleGrid(toggleGridButton) {
    if (!scene) return;
    
    if (gridVisible) {
        // Удаляем сетку
        if (gridHelper) {
            scene.remove(gridHelper);
        }
        gridVisible = false;
        if (toggleGridButton) {
            toggleGridButton.textContent = 'Показать сетку';
        }
    } else {
        // Добавляем сетку
        gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x444444);
        gridHelper.position.y = -1.5; // Позиционируем под плоскостью по умолчанию
        scene.add(gridHelper);
        gridVisible = true;
        if (toggleGridButton) {
            toggleGridButton.textContent = 'Скрыть сетку';
        }
    }
}

// Проверка поддержки WebGL для возможностей
function checkWebGLSupport(appStatus, shaderQualitySelect, resolutionScaleSlider, resolutionScaleValue) {
    // Проверяем поддержку WebGL
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            // WebGL не поддерживается
            if (appStatus) {
                appStatus.textContent = 'WebGL не поддерживается. Пожалуйста, используйте современный браузер.';
                appStatus.style.backgroundColor = '#ffdddd';
                appStatus.style.color = '#ff0000';
            }
            return false;
        }
        
        // Проверяем необходимые расширения
        const extensions = {
            anisotropic: gl.getExtension('EXT_texture_filter_anisotropic'),
            floatTextures: gl.getExtension('OES_texture_float'),
            depthTextures: gl.getExtension('WEBGL_depth_texture')
        };
        
        // Корректируем настройки на основе доступных функций
        if (!extensions.anisotropic) {
            console.warn('EXT_texture_filter_anisotropic не поддерживается. Качество текстур может быть снижено.');
        }
        
        if (!extensions.floatTextures) {
            console.warn('OES_texture_float не поддерживается. Качество шейдера может быть снижено.');
            if (shaderQualitySelect) {
                shaderQualitySelect.value = 'low';
            }
        }
        
        // Проверяем максимальный размер текстуры
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        console.log('Максимальный размер текстуры: ' + maxTextureSize);
        
        // Если размер текстуры ограничен, корректируем масштаб разрешения
        if (maxTextureSize < 4096) {
            if (resolutionScaleSlider && resolutionScaleValue) {
                resolutionScaleSlider.value = '0.75';
                resolutionScaleValue.textContent = '0.75';
            }
        }
        
        return true;
    } catch (e) {
        console.error('Ошибка проверки поддержки WebGL', e);
        if (appStatus) {
            appStatus.textContent = 'Ошибка проверки поддержки WebGL. Пожалуйста, используйте современный браузер.';
            appStatus.style.backgroundColor = '#ffdddd';
            appStatus.style.color = '#ff0000';
        }
        return false;
    }
}
