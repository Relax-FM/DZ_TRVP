import {
    MOUSE_CLICK_EVENT,
} from '@configs/common_config.js';
import navbarTmpl from '@components/Navbar/navbar.handlebars';


import {Api} from '@modules/api';
import css from './navbar.scss';

const NAVBAR_ELEMENT_ID = '#navbar';
const LOGOUT_BUTTON_ID = 'exit-btn';
const SHIPMENTS_BUTTON_ID = 'ships-button';

const Navbar = () => {
    const navbarElement = document.querySelector(NAVBAR_ELEMENT_ID);
    navbarElement.innerHTML = navbarTmpl({});
};

export default Navbar;
