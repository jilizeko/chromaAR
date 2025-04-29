// Функционал работы с камерой устройства для AR

// Включить или выключить камеру устройства
async function toggleCamera(cameraContainer, enableCameraButton, enableCamera, disableCamera, showCameraError) {
    if (!cameraContainer || !enableCameraButton) return;
    
    if (cameraContainer.classList.contains('active')) {
        // Выключаем камеру
        disableCamera();
        enableCameraButton.textContent = 'Включить камеру';
    } else {
        // Включаем камеру
        try {
            await enableCamera();
            enableCameraButton.textContent = 'Выключить камеру';
        } catch (error) {
            showCameraError(error);
        }
    }
}

// Включить камеру устройства
async function enableCamera(cameraVideo, cameraContainer, cameraError, appStatus) {
    try {
        // Получаем ограничения для медиа - предпочитаем внешнюю камеру (задняя камера на мобильных)
        const constraints = {
            video: {
                facingMode: 'environment',
                width: { ideal: window.innerWidth },
                height: { ideal: window.innerHeight }
            }
        };
        
        // Запрашиваем поток камеры
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Устанавливаем поток как источник для видеоэлемента
        cameraVideo.srcObject = stream;
        
        // Ждем, пока видео будет готово
        await new Promise(resolve => {
            cameraVideo.onloadedmetadata = () => {
                cameraVideo.play().then(resolve);
            };
        });
        
        // Показываем контейнер камеры
        cameraContainer.classList.add('active');
        
        // Скрываем предыдущие ошибки
        hideCameraError(cameraError);
        
        // Обновляем статус
        if (appStatus) {
            appStatus.textContent = 'Камера включена для AR фона';
        }
        
        return stream;
    } catch (error) {
        console.error('Ошибка доступа к камере:', error);
        throw error;
    }
}

// Выключить камеру устройства
function disableCamera(cameraVideo, cameraContainer, appStatus) {
    // Останавливаем все треки в видеопотоке
    if (cameraVideo.srcObject) {
        const tracks = cameraVideo.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        cameraVideo.srcObject = null;
    }
    
    // Скрываем контейнер камеры
    cameraContainer.classList.remove('active');
    
    // Обновляем статус
    if (appStatus) {
        appStatus.textContent = 'Камера выключена';
    }
}

// Показать сообщение об ошибке камеры
function showCameraError(cameraError, error) {
    if (!cameraError) return;
    
    let errorMessage = 'Произошла ошибка при доступе к камере.';
    
    // Пытаемся предоставить более специфичные сообщения об ошибках
    if (error.name === 'NotAllowedError') {
        errorMessage = 'Доступ к камере запрещен. Пожалуйста, разрешите доступ к камере и попробуйте снова.';
    } else if (error.name === 'NotFoundError') {
        errorMessage = 'Камера не найдена на вашем устройстве.';
    } else if (error.name === 'NotReadableError') {
        errorMessage = 'Камера уже используется другим приложением.';
    } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Запрошенные настройки камеры не поддерживаются вашим устройством.';
    } else if (error.name === 'SecurityError') {
        errorMessage = 'Доступ к камере не разрешен в этом контексте.';
    } else if (error.name === 'TypeError') {
        errorMessage = 'Нет доступной камеры или ограничения не могут быть удовлетворены.';
    }
    
    // Отображаем сообщение об ошибке
    cameraError.textContent = errorMessage;
    cameraError.style.display = 'block';
    console.error('Ошибка камеры:', error);
}

// Скрыть сообщение об ошибке камеры
function hideCameraError(cameraError) {
    if (cameraError) {
        cameraError.textContent = '';
        cameraError.style.display = 'none';
    }
}
