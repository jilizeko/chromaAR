// Логика пользовательского интерфейса и элементов управления

// Значения по умолчанию для шейдерных параметров
const defaultParams = {
    keyColor: '#00ff00',
    similarity: 0.4,
    smoothness: 0.08,
    spill: 0.3
};

// Значения по умолчанию для позиционирования
const defaultPosition = {
    x: 0,
    y: 0,
    z: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scale: 1.0
};

// Инициализация сенсорных элементов управления для мобильного позиционирования
function initTouchControls(sceneContainerId, touchHint, updatePositionSliders) {
    const sceneContainer = document.getElementById(sceneContainerId);
    if (!sceneContainer) return;
    
    let isDragging = false;
    let previousTouch = { x: 0, y: 0 };
    
    // Событие начала касания
    sceneContainer.addEventListener('touchstart', (e) => {
        if (!videoPlane) return;
        
        isDragging = true;
        const touch = e.touches[0];
        previousTouch.x = touch.clientX;
        previousTouch.y = touch.clientY;
        
        // Показываем подсказку
        touchHint.classList.add('visible');
        setTimeout(() => {
            touchHint.classList.remove('visible');
        }, 2000);
    });
    
    // Событие перемещения касания
    sceneContainer.addEventListener('touchmove', (e) => {
        if (!isDragging || !videoPlane) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - previousTouch.x;
        const deltaY = touch.clientY - previousTouch.y;
        
        // Обновляем позицию на основе движения касания
        const moveSpeed = 0.01;
        
        // Корректируем позицию на основе ориентации камеры
        videoPlane.position.x += deltaX * moveSpeed;
        videoPlane.position.y -= deltaY * moveSpeed; // Инвертируем ось Y для более интуитивного управления
        
        // Обновляем ползунки, чтобы отразить новую позицию
        if (typeof updatePositionSliders === 'function') {
            updatePositionSliders();
        }
        
        previousTouch.x = touch.clientX;
        previousTouch.y = touch.clientY;
    });
    
    // Событие окончания касания
    sceneContainer.addEventListener('touchend', () => {
        isDragging = false;
        touchHint.classList.remove('visible');
    });
    
    // Событие отмены касания
    sceneContainer.addEventListener('touchcancel', () => {
        isDragging = false;
        touchHint.classList.remove('visible');
    });
}

// Обновление ползунков позиционирования в соответствии с текущей позицией плоскости
function updatePositionSliders(positionXSlider, positionYSlider, positionZSlider,
                               rotationXSlider, rotationYSlider, rotationZSlider,
                               scaleSlider, positionXValue, positionYValue, positionZValue,
                               rotationXValue, rotationYValue, rotationZValue, scaleValue) {
    if (!videoPlane) return;
    
    // Обновляем ползунки позиционирования
    if (positionXSlider && positionXValue) {
        positionXSlider.value = videoPlane.position.x;
        positionXValue.textContent = videoPlane.position.x.toFixed(1);
    }
    
    if (positionYSlider && positionYValue) {
        positionYSlider.value = videoPlane.position.y;
        positionYValue.textContent = videoPlane.position.y.toFixed(1);
    }
    
    if (positionZSlider && positionZValue) {
        positionZSlider.value = videoPlane.position.z;
        positionZValue.textContent = videoPlane.position.z.toFixed(1);
    }
    
    // Обновляем ползунки вращения (конвертируем из радиан в градусы)
    if (rotationXSlider && rotationXValue) {
        rotationXSlider.value = THREE.MathUtils.radToDeg(videoPlane.rotation.x) % 360;
        rotationXValue.textContent = Math.round(THREE.MathUtils.radToDeg(videoPlane.rotation.x) % 360);
    }
    
    if (rotationYSlider && rotationYValue) {
        rotationYSlider.value = THREE.MathUtils.radToDeg(videoPlane.rotation.y) % 360;
        rotationYValue.textContent = Math.round(THREE.MathUtils.radToDeg(videoPlane.rotation.y) % 360);
    }
    
    if (rotationZSlider && rotationZValue) {
        rotationZSlider.value = THREE.MathUtils.radToDeg(videoPlane.rotation.z) % 360;
        rotationZValue.textContent = Math.round(THREE.MathUtils.radToDeg(videoPlane.rotation.z) % 360);
    }
    
    // Обновляем ползунок масштабирования (предполагая равномерное масштабирование)
    if (scaleSlider && scaleValue) {
        scaleSlider.value = videoPlane.scale.x;
        scaleValue.textContent = videoPlane.scale.x.toFixed(1);
    }
}

// Обновление позиции видеоплоскости из элементов управления UI
function updatePosition(positionXSlider, positionYSlider, positionZSlider,
                       rotationXSlider, rotationYSlider, rotationZSlider,
                       scaleSlider, appStatus) {
    if (!videoPlane) return;
    
    // Применяем позицию
    if (positionXSlider) {
        videoPlane.position.x = parseFloat(positionXSlider.value);
    }
    
    if (positionYSlider) {
        videoPlane.position.y = parseFloat(positionYSlider.value);
    }
    
    if (positionZSlider) {
        videoPlane.position.z = parseFloat(positionZSlider.value);
    }
    
    // Применяем вращение (конвертируем из градусов в радианы)
    if (rotationXSlider) {
        videoPlane.rotation.x = THREE.MathUtils.degToRad(parseFloat(rotationXSlider.value));
    }
    
    if (rotationYSlider) {
        videoPlane.rotation.y = THREE.MathUtils.degToRad(parseFloat(rotationYSlider.value));
    }
    
    if (rotationZSlider) {
        videoPlane.rotation.z = THREE.MathUtils.degToRad(parseFloat(rotationZSlider.value));
    }
    
    // Применяем масштаб (равномерное масштабирование)
    if (scaleSlider) {
        const scale = parseFloat(scaleSlider.value);
        videoPlane.scale.set(scale, scale, scale);
    }
    
    // Обновляем сообщение о статусе
    if (appStatus) {
        appStatus.textContent = 'Позиция обновлена';
    }
}

// Сброс позиции к значениям по умолчанию
function resetPosition(positionXSlider, positionYSlider, positionZSlider,
                      rotationXSlider, rotationYSlider, rotationZSlider,
                      scaleSlider, positionXValue, positionYValue, positionZValue,
                      rotationXValue, rotationYValue, rotationZValue, scaleValue,
                      appStatus, updatePosition) {
    if (!videoPlane) return;
    
    // Сбрасываем ползунки позиции
    if (positionXSlider && positionXValue) {
        positionXSlider.value = defaultPosition.x;
        positionXValue.textContent = defaultPosition.x;
    }
    
    if (positionYSlider && positionYValue) {
        positionYSlider.value = defaultPosition.y;
        positionYValue.textContent = defaultPosition.y;
    }
    
    if (positionZSlider && positionZValue) {
        positionZSlider.value = defaultPosition.z;
        positionZValue.textContent = defaultPosition.z;
    }
    
    if (rotationXSlider && rotationXValue) {
        rotationXSlider.value = defaultPosition.rotationX;
        rotationXValue.textContent = defaultPosition.rotationX;
    }
    
    if (rotationYSlider && rotationYValue) {
        rotationYSlider.value = defaultPosition.rotationY;
        rotationYValue.textContent = defaultPosition.rotationY;
    }
    
    if (rotationZSlider && rotationZValue) {
        rotationZSlider.value = defaultPosition.rotationZ;
        rotationZValue.textContent = defaultPosition.rotationZ;
    }
    
    if (scaleSlider && scaleValue) {
        scaleSlider.value = defaultPosition.scale;
        scaleValue.textContent = defaultPosition.scale;
    }
    
    // Применяем изменения к плоскости
    if (typeof updatePosition === 'function') {
        updatePosition();
    }
    
    // Обновляем сообщение о статусе
    if (appStatus) {
        appStatus.textContent = 'Позиция сброшена к значениям по умолчанию';
    }
}

// Обновление параметров шейдера из элементов управления UI
function updateShaderParams(keyColorInput, similaritySlider, smoothnessSlider, spillSlider, appStatus) {
    if (!videoPlane || !videoPlane.material || !(videoPlane.material instanceof THREE.ShaderMaterial)) {
        return;
    }
    
    // Конвертируем шестнадцатеричный цвет в RGB
    if (keyColorInput) {
        const keyColorHex = keyColorInput.value;
        const keyColorObject = new THREE.Color(keyColorHex);
        
        // Обновляем униформы шейдера
        videoPlane.material.uniforms.keyColor.value = keyColorObject;
    }
    
    if (similaritySlider) {
        videoPlane.material.uniforms.similarity.value = parseFloat(similaritySlider.value);
    }
    
    if (smoothnessSlider) {
        videoPlane.material.uniforms.smoothness.value = parseFloat(smoothnessSlider.value);
    }
    
    if (spillSlider) {
        videoPlane.material.uniforms.spill.value = parseFloat(spillSlider.value);
    }
    
    // Обновляем сообщение о статусе
    if (appStatus) {
        appStatus.textContent = 'Параметры хромакея обновлены';
    }
}

// Сброс параметров к значениям по умолчанию
function resetParameters(keyColorInput, similaritySlider, smoothnessSlider, spillSlider,
                        similarityValue, smoothnessValue, spillValue, appStatus, updateShaderParams) {
    if (keyColorInput) {
        keyColorInput.value = defaultParams.keyColor;
    }
    
    if (similaritySlider && similarityValue) {
        similaritySlider.value = defaultParams.similarity;
        similarityValue.textContent = defaultParams.similarity;
    }
    
    if (smoothnessSlider && smoothnessValue) {
        smoothnessSlider.value = defaultParams.smoothness;
        smoothnessValue.textContent = defaultParams.smoothness;
    }
    
    if (spillSlider && spillValue) {
        spillSlider.value = defaultParams.spill;
        spillValue.textContent = defaultParams.spill;
    }
    
    // Применяем к шейдеру
    if (typeof updateShaderParams === 'function') {
        updateShaderParams();
    }
    
    // Обновляем сообщение о статусе
    if (appStatus) {
        appStatus.textContent = 'Параметры сброшены к значениям по умолчанию';
    }
}

// Обновление счетчика FPS
function updateFPS(frameCount, lastTime, fpsCounter) {
    frameCount++;
    
    const now = performance.now();
    const elapsed = now - lastTime;
    
    // Обновляем счетчик FPS каждые 0.5 секунд
    if (elapsed >= 500) {
        const fps = Math.round(frameCount / (elapsed / 1000));
        if (fpsCounter) {
            fpsCounter.textContent = 'FPS: ' + fps;
            
            // Добавляем цветовое кодирование к счетчику FPS
            if (fps >= 50) {
                fpsCounter.style.color = '#4CAF50'; // Зеленый для хорошего
            } else if (fps >= 30) {
                fpsCounter.style.color = '#FF9800'; // Оранжевый для среднего
            } else {
                fpsCounter.style.color = '#F44336'; // Красный для плохого
            }
        }
        
        return {
            frameCount: 0,
            lastTime: now,
            fps: fps
        };
    }
    
    return {
        frameCount: frameCount,
        lastTime: lastTime,
        fps: null
    };
}
