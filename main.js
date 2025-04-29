document.addEventListener('DOMContentLoaded', () => {
    // UI элементы
    const appStatus = document.getElementById('app-status');
    const videoInput = document.getElementById('video-input');
    const fileName = document.getElementById('file-name');
    const videoError = document.getElementById('video-error');
    const inputVideo = document.getElementById('input-video');
    
    // Элементы управления хромакеем
    const keyColorInput = document.getElementById('key-color');
    const similaritySlider = document.getElementById('similarity');
    const smoothnessSlider = document.getElementById('smoothness');
    const spillSlider = document.getElementById('spill');
    const similarityValue = document.getElementById('similarity-value');
    const smoothnessValue = document.getElementById('smoothness-value');
    const spillValue = document.getElementById('spill-value');
    const playPauseButton = document.getElementById('play-pause');
    const resetParamsButton = document.getElementById('reset-params');
    const toggleControlsButton = document.getElementById('toggle-controls');
    const controlsBody = document.querySelector('.controls-body');
    
    // Элементы управления позиционированием
    const positionXSlider = document.getElementById('position-x');
    const positionYSlider = document.getElementById('position-y');
    const positionZSlider = document.getElementById('position-z');
    const rotationXSlider = document.getElementById('rotation-x');
    const rotationYSlider = document.getElementById('rotation-y');
    const rotationZSlider = document.getElementById('rotation-z');
    const scaleSlider = document.getElementById('scale');
    const positionXValue = document.getElementById('position-x-value');
    const positionYValue = document.getElementById('position-y-value');
    const positionZValue = document.getElementById('position-z-value');
    const rotationXValue = document.getElementById('rotation-x-value');
    const rotationYValue = document.getElementById('rotation-y-value');
    const rotationZValue = document.getElementById('rotation-z-value');
    const scaleValue = document.getElementById('scale-value');
    const resetPositionButton = document.getElementById('reset-position');
    const togglePositionControlsButton = document.getElementById('toggle-position-controls');
    const positionControlsBody = document.getElementById('position-controls-body');
    const toggleGridButton = document.getElementById('toggle-grid');
    
    // Элементы камеры для AR
    const cameraContainer = document.getElementById('camera-container');
    const cameraVideo = document.getElementById('camera-video');
    const enableCameraButton = document.getElementById('enable-camera');
    const cameraError = document.getElementById('camera-error');
    
    // Элементы для оптимизации и UI
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    const helpOverlay = document.getElementById('help-overlay');
    const showHelpButton = document.getElementById('show-help');
    const closeHelpButton = document.getElementById('close-help');
    const fpsCounter = document.getElementById('fps-counter');
    
    // Элементы управления производительностью
    const resolutionScaleSlider = document.getElementById('resolution-scale');
    const resolutionScaleValue = document.getElementById('resolution-scale-value');
    const shaderQualitySelect = document.getElementById('shader-quality');
    const throttleFpsSlider = document.getElementById('throttle-fps');
    const throttleFpsValue = document.getElementById('throttle-fps-value');
    const showFpsCheckbox = document.getElementById('show-fps');
    const togglePerformanceControlsButton = document.getElementById('toggle-performance-controls');
    const performanceControlsBody = document.getElementById('performance-controls-body');
    
    // Переменные для мониторинга производительности
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;
    let lastFrameTime = 0;
    let targetFrameTime = 1000 / 60; // По умолчанию 60fps
    
    // Параметры масштабирования разрешения
    let resolutionScale = 1.0;
    
    // Качество шейдера
    let shaderQuality = 'medium';
    
    // Создание подсказки для сенсорного управления
    const touchHint = document.createElement('div');
    touchHint.className = 'touch-hint';
    touchHint.textContent = 'Перетащите для перемещения видео';
    document.body.appendChild(touchHint);
    
    // Флаг инициализации
    let isInitialized = false;
    
    // Инициализация слушателей событий
    function initializeEventListeners() {
        // Обработчик для выбора файла видео
        videoInput.addEventListener('change', (e) => {
            handleFileSelect(e, fileName, videoError, inputVideo, appStatus, isInitialized, initThreeJSWrapper, createVideoTextureWrapper);
        });
        
        // Хромакей слайдеры
        keyColorInput && keyColorInput.addEventListener('input', updateShaderParamsWrapper);
        
        similaritySlider && similaritySlider.addEventListener('input', () => {
            similarityValue.textContent = similaritySlider.value;
            updateShaderParamsWrapper();
        });
        
        smoothnessSlider && smoothnessSlider.addEventListener('input', () => {
            smoothnessValue.textContent = smoothnessSlider.value;
            updateShaderParamsWrapper();
        });
        
        spillSlider && spillSlider.addEventListener('input', () => {
            spillValue.textContent = spillSlider.value;
            updateShaderParamsWrapper();
        });
        
        // Кнопки управления видео
        playPauseButton && playPauseButton.addEventListener('click', togglePlayPauseWrapper);
        resetParamsButton && resetParamsButton.addEventListener('click', resetParametersWrapper);
        
        // Переключение панелей
        if (toggleControlsButton && controlsBody) {
            toggleControlsButton.addEventListener('click', () => {
                controlsBody.classList.toggle('collapsed');
                toggleControlsButton.classList.toggle('collapsed');
                toggleControlsButton.textContent = toggleControlsButton.classList.contains('collapsed') ? '►' : '▼';
            });
        }
        
        // Позиционирование
        positionXSlider && positionXSlider.addEventListener('input', () => {
            positionXValue.textContent = positionXSlider.value;
            updatePositionWrapper();
        });
        
        positionYSlider && positionYSlider.addEventListener('input', () => {
            positionYValue.textContent = positionYSlider.value;
            updatePositionWrapper();
        });
        
        positionZSlider && positionZSlider.addEventListener('input', () => {
            positionZValue.textContent = positionZSlider.value;
            updatePositionWrapper();
        });
        
        rotationXSlider && rotationXSlider.addEventListener('input', () => {
            rotationXValue.textContent = rotationXSlider.value;
            updatePositionWrapper();
        });
        
        rotationYSlider && rotationYSlider.addEventListener('input', () => {
            rotationYValue.textContent = rotationYSlider.value;
            updatePositionWrapper();
        });
        
        rotationZSlider && rotationZSlider.addEventListener('input', () => {
            rotationZValue.textContent = rotationZSlider.value;
            updatePositionWrapper();
        });
        
        scaleSlider && scaleSlider.addEventListener('input', () => {
            scaleValue.textContent = scaleSlider.value;
            updatePositionWrapper();
        });
        
        // Управление позицией
        resetPositionButton && resetPositionButton.addEventListener('click', resetPositionWrapper);
        
        if (togglePositionControlsButton && positionControlsBody) {
            togglePositionControlsButton.addEventListener('click', () => {
                positionControlsBody.classList.toggle('collapsed');
                togglePositionControlsButton.classList.toggle('collapsed');
                togglePositionControlsButton.textContent = togglePositionControlsButton.classList.contains('collapsed') ? '►' : '▼';
            });
        }
        
        // Сетка
        toggleGridButton && toggleGridButton.addEventListener('click', () => {
            toggleGrid(toggleGridButton);
        });
        
        // Камера
        enableCameraButton && enableCameraButton.addEventListener('click', toggleCameraWrapper);
        
        // Help overlay
        if (showHelpButton && helpOverlay && closeHelpButton) {
            showHelpButton.addEventListener('click', () => {
                helpOverlay.classList.remove('hidden');
            });
            
            closeHelpButton.addEventListener('click', () => {
                helpOverlay.classList.add('hidden');
            });
        }
        
        // Производительность
        resolutionScaleSlider && resolutionScaleSlider.addEventListener('input', () => {
            resolutionScale = parseFloat(resolutionScaleSlider.value);
            resolutionScaleValue.textContent = resolutionScale.toFixed(2);
            onWindowResize(resolutionScale, appStatus);
        });
        
        shaderQualitySelect && shaderQualitySelect.addEventListener('change', () => {
            shaderQuality = shaderQualitySelect.value;
            updateShaderQuality(videoPlane, videoTexture, shaderQuality, appStatus);
        });
        
        throttleFpsSlider && throttleFpsSlider.addEventListener('input', () => {
            const targetFps = parseInt(throttleFpsSlider.value);
            targetFrameTime = 1000 / targetFps;
            throttleFpsValue.textContent = targetFps;
        });
        
        showFpsCheckbox && fpsCounter && showFpsCheckbox.addEventListener('change', () => {
            fpsCounter.style.display = showFpsCheckbox.checked ? 'block' : 'none';
        });
        
        if (togglePerformanceControlsButton && performanceControlsBody) {
            togglePerformanceControlsButton.addEventListener('click', () => {
                performanceControlsBody.classList.toggle('collapsed');
                togglePerformanceControlsButton.classList.toggle('collapsed');
                togglePerformanceControlsButton.textContent = togglePerformanceControlsButton.classList.contains('collapsed') ? '►' : '▼';
            });
        }
        
        // Click on scene for play/pause
        document.getElementById('scene-container')?.addEventListener('click', togglePlayPauseWrapper);
        
        // Touch controls for mobile
        initTouchControls('scene-container', touchHint, updatePositionSlidersWrapper);
        
        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            disableCameraWrapper();
        });
    }
    
    // Wrapper-функции для обеспечения доступа к элементам UI
    function updateShaderParamsWrapper() {
        updateShaderParams(keyColorInput, similaritySlider, smoothnessSlider, spillSlider, appStatus);
    }
    
    function updatePositionWrapper() {
        updatePosition(positionXSlider, positionYSlider, positionZSlider,
                      rotationXSlider, rotationYSlider, rotationZSlider,
                      scaleSlider, appStatus);
    }
    
    function updatePositionSlidersWrapper() {
        updatePositionSliders(positionXSlider, positionYSlider, positionZSlider,
                             rotationXSlider, rotationYSlider, rotationZSlider,
                             scaleSlider, positionXValue, positionYValue, positionZValue,
                             rotationXValue, rotationYValue, rotationZValue, scaleValue);
    }
    
    function resetPositionWrapper() {
        resetPosition(positionXSlider, positionYSlider, positionZSlider,
                     rotationXSlider, rotationYSlider, rotationZSlider,
                     scaleSlider, positionXValue, positionYValue, positionZValue,
                     rotationXValue, rotationYValue, rotationZValue, scaleValue,
                     appStatus, updatePositionWrapper);
    }
    
    function resetParametersWrapper() {
        resetParameters(keyColorInput, similaritySlider, smoothnessSlider, spillSlider,
                       similarityValue, smoothnessValue, spillValue, 
                       appStatus, updateShaderParamsWrapper);
    }
    
    function togglePlayPauseWrapper() {
        togglePlayPause(inputVideo, playPauseButton);
    }
    
    function toggleCameraWrapper() {
        toggleCamera(cameraContainer, enableCameraButton, enableCameraWrapper, disableCameraWrapper, showCameraErrorWrapper);
    }
    
    function enableCameraWrapper() {
        return enableCamera(cameraVideo, cameraContainer, cameraError, appStatus);
    }
    
    function disableCameraWrapper() {
        disableCamera(cameraVideo, cameraContainer, appStatus);
    }
    
    function showCameraErrorWrapper(error) {
        showCameraError(cameraError, error);
    }
    
    function createVideoTextureWrapper() {
        createVideoTexture(inputVideo, appStatus, playPauseButton, shaderQuality, updatePositionWrapper);
        return true;
    }
    
    function initThreeJSWrapper() {
        const result = initThreeJS(appStatus, 'scene-container', resolutionScale, inputVideo, createVideoTextureWrapper);
        isInitialized = result;
        startAnimationLoop();
        return result;
    }
    
    // Цикл анимации
    function startAnimationLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            const now = performance.now();
            const elapsed = now - lastFrameTime;
            
            // Ограничиваем рендеринг если нужно
            if (elapsed < targetFrameTime) {
                return;
            }
            
            lastFrameTime = now;
            
            // Обновляем счетчик FPS
            const fpsResult = updateFPS(frameCount, lastTime, fpsCounter);
            if (fpsResult.fps !== null) {
                frameCount = fpsResult.frameCount;
                lastTime = fpsResult.lastTime;
                fps = fpsResult.fps;
            } else {
                frameCount = fpsResult.frameCount;
            }
            
            // Если у нас есть тестовый куб, вращаем его
            if (scene) {
                const cube = scene.children.find(child => child.geometry instanceof THREE.BoxGeometry);
                if (cube) {
                    cube.rotation.x += 0.01;
                    cube.rotation.y += 0.01;
                }
            }
            
            // Обновляем видеотекстуру, если она существует
            if (videoTexture && videoPlane && videoPlane.material) {
                if (videoPlane.material instanceof THREE.ShaderMaterial) {
                    // Обновляем униформы, если необходимо
                    videoPlane.material.uniforms.videoTexture.value = videoTexture;
                    videoTexture.needsUpdate = true;
                } else if (videoPlane.material.map) {
                    videoTexture.needsUpdate = true;
                }
            }
            
            // Рендерим сцену
            if (renderer && scene && camera) {
                renderer.render(scene, camera);
            }
        };
        
        animate();
    }
    
    // Инициализация приложения
    function init() {
        console.log('Инициализация приложения...');
        
        // Проверка поддержки WebGL перед продолжением
        if (checkWebGLSupport(appStatus, shaderQualitySelect, resolutionScaleSlider, resolutionScaleValue)) {
            // Инициализируем обработчики событий
            initializeEventListeners();
            
            // Инициализируем Three.js сцену
            initThreeJSWrapper();
            
            // Скрываем оверлей загрузки если он есть
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
        }
    }
    
    // Запускаем инициализацию
    init();
});
