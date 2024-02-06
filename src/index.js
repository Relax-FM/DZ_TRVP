import {Router} from '@modules/router.js';
import navbar from '@components/Navbar/Navbar.js';

import reset from '@components/Shared/reset.scss';

const router = new Router();
window.router = router;

async function init() {
    let url = window.location.href.split('/').pop();
    navbar();
    return window.router.redirect(url);
}

await init();

