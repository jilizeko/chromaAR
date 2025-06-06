# AR Chroma Key Video

Веб-приложение для отображения видео с хромакеем (зеленым экраном) в дополненной реальности (AR) с использованием Three.js и WebGL.

## Особенности

- Загрузка видео с устройства пользователя
- Удаление зеленого фона через хромакей-шейдер
- Интеграция с камерой устройства для создания AR-эффекта
- Настраиваемые параметры хромакей-эффекта (цвет ключа, чувствительность, сглаживание, подавление разлива)
- Управление позиционированием видео в 3D-пространстве (перемещение, вращение, масштабирование)
- Оптимизации производительности для различных устройств
- Адаптивный интерфейс для мобильных и десктопных устройств

## Использование

1. **Загрузка видео**: Нажмите на кнопку "Выбрать видеофайл" и выберите видео с зеленым фоном.
2. **Включение камеры**: Нажмите "Включить камеру", чтобы использовать камеру устройства в качестве фона для AR.
3. **Настройка хромакея**: Используйте ползунки для настройки параметров удаления зеленого фона.
4. **Позиционирование видео**: Используйте элементы управления или перетаскивание для размещения видео в AR-пространстве.
5. **Настройка производительности**: При необходимости скорректируйте настройки производительности для оптимальной работы на вашем устройстве.

## Технические детали

### Структура проекта

Проект имеет модульную структуру с разделением функциональности по различным файлам:

- `index.html` - Основная HTML-страница
- `style.css` - Стили приложения
- `main.js` - Главный файл JavaScript, инициализирующий приложение
- `js/shaders.js` - Определения шейдеров для хромакея
- `js/three-setup.js` - Настройка Three.js сцены
- `js/ui-controls.js` - Логика пользовательского интерфейса
- `js/camera-handler.js` - Функционал для работы с камерой устройства
- `js/video-handler.js` - Обработка видео и создание текстур

### Технологии

- **Three.js**: Библиотека для 3D-графики в веб-браузере
- **WebGL**: Для рендеринга графики и шейдеров
- **JavaScript ES6+**: Для логики приложения
- **CSS3**: Для стилизации интерфейса
- **Шейдеры GLSL**: Для реализации эффекта хромакея
- **MediaDevices API**: Для доступа к камере устройства

### Шейдер хромакея

Шейдер использует преобразование из RGB в HSV для более точного определения цветов хромакея. Реализованы три уровня качества:

1. **Высокое качество**: Полное преобразование в HSV с точной обработкой цветовых расстояний
2. **Среднее качество**: Упрощенный алгоритм с балансом качества и производительности
3. **Низкое качество**: Базовый алгоритм для устройств с ограниченной производительностью

## Требования

- Современный веб-браузер с поддержкой WebGL
- Устройство с камерой для AR-функциональности
- Для наилучших результатов рекомендуется использовать Chrome, Firefox или Safari последних версий

## Разработка

1. Клонируйте репозиторий:
   ```
   git clone https://github.com/yourusername/ar-chroma-key-video.git
   ```

2. Откройте проект в любом современном редакторе кода (например, VS Code)

3. Для локального тестирования запустите веб-сервер (из-за ограничений CORS):
   ```
   npx http-server
   ```

4. Откройте `http://localhost:8080` в браузере

## Лицензия

MIT

## Автор

Создано как образовательный проект по работе с WebGL, Three.js и обработкой медиаданных в веб-браузере.
