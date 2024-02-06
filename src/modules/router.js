import {routes} from '@configs/link_config.js';

/**
 * Класс роутинга по приложению
 * @class
 */
export class Router {
    /**
     * Добавляет в окно обработчики перехода по ссылке и нажатия на стрелки вперёд/назад
     * @constructor
     */
    constructor() {
        /**
         * Добавляет обработку нажатия на ссылки
         */
        window.addEventListener('click', (event) => {
            const target = event.target.getAttribute('href');
            if (target !== null) {
                event.preventDefault();
                this.redirect(target);
            }
        });

        /**
         * Добавляет обработку нажатия на стрелки
         */
        window.addEventListener('popstate', (event) => {
            const path = window.location.pathname;
            this.redirect(path, window.history.state);
        });
    }

    /**
     * Редиректит пользователя по указанному пути внутри приложения
     * @param path - путь внутри приложения
     * @param state - состояние (unused)
     */
    redirect(path, state = null) {
        const bodyElement = document.body;
        const renderer = path.replace(/[/0-9]*/g, ''); // удалить лишние цифры если ссылка связана с каким-то id (e.g. id профиля)
        let route = routes[renderer];
        if (!path.startsWith('blob')) {
            window.history.pushState(state, null, path);
            if (route === undefined) {
                route = routes.notfound;
            }
            return route.render();
        }
    }
}
