Романтическое предложение

Лёгкий одностраничный интерактивный сайт-предложение: вопрос с кнопками «Да» и «Нет», игровое «убегание» карточки и финальный экран с поздравлением. Всё работает только в браузере, без сервера и внешних зависимостей.

Локальный запуск

Откройте файл index.html в браузере (двойной клик или «Open with Live Server» не обязателен).

Публикация на GitHub Pages





Создайте репозиторий на GitHub и загрузите в корень файлы:





index.html



style.css



script.js



README.md



В репозитории откройте Settings → Pages.



В разделе Build and deployment выберите:





Source: Deploy from a branch



Branch: main (или master) и папку / (root)



Сохраните настройки. Через 1–2 минуты сайт будет доступен по адресу вида:

https://<ваш-username>.github.io/<имя-репозитория>/



Убедитесь, что в корне репозитория лежит именно index.html — GitHub Pages отдаёт его как главную страницу.



Стек





HTML5, CSS3, vanilla JavaScript (ES6+)



Mobile-first, поддержка safe-area-inset и prefers-reduced-motion

