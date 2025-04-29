// Обработка видео и создание видеотекстур

let videoTexture = null;

// Создать видеотекстуру и применить ее к плоскости
function createVideoTexture(inputVideo, appStatus, playPauseButton, shaderQuality, updatePosition) {
    if (!inputVideo.src || !scene) return;
    
    // Удаляем тестовый куб, если он есть
    const cube = scene.children.find(child => child.geometry instanceof THREE.BoxGeometry);
    if (cube) {
        scene.remove(cube);
    }
    
    // Создаем видеотекстуру из входного видео
    videoTexture = new THREE.VideoTexture(inputVideo);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat;
    
    // Вычисляем соотношение сторон видео
    const videoAspect = inputVideo.videoWidth / inputVideo.videoHeight;
    
    // Обновляем геометрию плоскости, чтобы соответствовать соотношению сторон видео
    const planeWidth = 3 * videoAspect;
    const planeHeight = 3;
    
    // Если плоскость уже существует, обновляем ее геометрию
    if (videoPlane) {
        scene.remove(videoPlane);
    }
    
    // Создаем новую плоскость с правильным соотношением сторон
    const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    
    // Получаем элементы управления хромакея из DOM
    const keyColorInput = document.getElementById('key-color');
    const similaritySlider = document.getElementById('similarity');
    const smoothnessSlider = document.getElementById('smoothness');
    const spillSlider = document.getElementById('spill');
    
    // Создаем шейдерный материал вместо базового материала
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            videoTexture: { value: videoTexture },
            keyColor: { value: new THREE.Color(keyColorInput ? keyColorInput.value : 0x00ff00) },
            similarity: { value: similaritySlider ? parseFloat(similaritySlider.value) : 0.4 },
            smoothness: { value: smoothnessSlider ? parseFloat(smoothnessSlider.value) : 0.08 },
            spill: { value: spillSlider ? parseFloat(spillSlider.value) : 0.3 }
        },
        vertexShader: vertexShader,
        fragmentShader: getFragmentShader(shaderQuality),
        transparent: true,
        side: THREE.DoubleSide
    });
    
    videoPlane = new THREE.Mesh(planeGeometry, shaderMaterial);
    
    // Позиционируем плоскость по центру вида
    videoPlane.position.set(0, 0, 0);
    
    scene.add(videoPlane);
    
    // Добавляем слушатели событий воспроизведения видео
    inputVideo.addEventListener('play', () => {
        console.log('Видео воспроизводится');
    });
    
    inputVideo.addEventListener('pause', () => {
        console.log('Видео на паузе');
    });
    
    inputVideo.addEventListener('ended', () => {
        console.log('Видео закончилось');
        // Зацикливаем видео, если необходимо
        inputVideo.play().catch(e => console.error('Ошибка повторного воспроизведения видео:', e));
    });
    
    // Обновляем статус
    if (appStatus) {
        appStatus.textContent = 'Видеотекстура создана с шейдерным материалом';
    }
    
    // Включаем кнопку play/pause
    if (playPauseButton) {
        playPauseButton.disabled = false;
        playPauseButton.textContent = 'Пауза';
    }
    
    // После создания плоскости инициализируем ее позицию
    if (typeof updatePosition === 'function') {
        updatePosition();
    }
}

// Обработка выбора файла
function handleFileSelect(e, fileName, videoError, inputVideo, appStatus, isInitialized, initThreeJS, createVideoTexture) {
    const file = e.target.files[0];
    
    if (!file) {
        fileName.textContent = 'Файл не выбран';
        resetVideo(inputVideo, playPauseButton);
        return;
    }
    
    // Показываем имя файла
    fileName.textContent = file.name;
    
    // Проверяем, является ли файл видео
    if (!file.type.match('video.*')) {
        showError(videoError, 'Пожалуйста, выберите видеофайл.');
        resetVideo(inputVideo, playPauseButton);
        return;
    }
    
    // Скрываем предыдущие ошибки
    hideError(videoError);
    
    // Создаем URL объект для видео
    const videoURL = URL.createObjectURL(file);
    
    // Настраиваем видеоэлемент
    inputVideo.src = videoURL;
    inputVideo.onloadedmetadata = () => {
        console.log('Видео загружено. Длительность:', inputVideo.duration, 'секунд');
        console.log('Размеры видео:', inputVideo.videoWidth, 'x', inputVideo.videoHeight);
        
        // Начинаем воспроизведение видео (оно отключено)
        inputVideo.play().catch(error => {
            console.error('Ошибка воспроизведения видео:', error);
            showError(videoError, 'Не удалось воспроизвести видео.');
        });
        
        // Обновляем статус
        appStatus.textContent = 'Видео загружено: ' + file.name;
        
        // Создаем видеотекстуру, если Three.js уже инициализирован
        if (isInitialized) {
            createVideoTexture();
        } else {
            // Инициализируем Three.js, если он еще не инициализирован
            if (initThreeJS()) {
                createVideoTexture();
            }
        }
    };
    
    inputVideo.onerror = () => {
        console.error('Ошибка загрузки видео.');
        showError(videoError, 'Не удалось загрузить видео. Формат может не поддерживаться.');
        resetVideo(inputVideo, playPauseButton);
    };
}

// Переключить видео play/pause
function togglePlayPause(inputVideo, playPauseButton) {
    if (!inputVideo.src) return;
    
    if (inputVideo.paused) {
        inputVideo.play().catch(e => console.error('Ошибка воспроизведения видео:', e));
        if (playPauseButton) {
            playPauseButton.textContent = 'Пауза';
        }
    } else {
        inputVideo.pause();
        if (playPauseButton) {
            playPauseButton.textContent = 'Воспроизвести';
        }
    }
}

// Сбросить видео
function resetVideo(inputVideo, playPauseButton) {
    inputVideo.src = '';
    if (inputVideo.srcObject) {
        inputVideo.srcObject = null;
    }
    
    // Сбрасываем видеотекстуру, если она существует
    if (videoTexture) {
        videoTexture.dispose();
        videoTexture = null;
    }
    
    // Сбрасываем материал плоскости видео, если он существует
    if (videoPlane && videoPlane.material) {
        if (videoPlane.material.map) {
            videoPlane.material.map = null;
        }
        // Также уничтожаем шейдерный материал, если он существует
        videoPlane.material.dispose();
        videoPlane.material.needsUpdate = true;
    }
    
    // Отключаем кнопку play/pause, когда видео не загружено
    if (playPauseButton) {
        playPauseButton.disabled = true;
    }
}

// Показать сообщение об ошибке для видео
function showError(videoError, message) {
    if (videoError) {
        videoError.textContent = message;
        videoError.style.display = 'block';
    }
}

// Скрыть сообщение об ошибке для видео
function hideError(videoError) {
    if (videoError) {
        videoError.textContent = '';
        videoError.style.display = 'none';
    }
}

// Обновление качества шейдера
function updateShaderQuality(videoPlane, videoTexture, shaderQuality, appStatus) {
    if (!videoPlane || !videoTexture) return;
    
    const fragmentShader = getFragmentShader(shaderQuality);
    
    // Сохраняем текущие униформы
    const currentUniforms = videoPlane.material.uniforms;
    
    // Уничтожаем старый материал
    if (videoPlane.material) {
        videoPlane.material.dispose();
    }
    
    // Создаем новый материал с обновленным шейдером
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: currentUniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    // Применяем новый материал
    videoPlane.material = shaderMaterial;
    
    if (appStatus) {
        appStatus.textContent = 'Качество шейдера установлено на: ' + shaderQuality;
    }
}
