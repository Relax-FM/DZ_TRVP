import {
    ROOT_ELEMENT_ID,
    MOUSE_CLICK_EVENT,
    DRAGSTART_EVENT,
    DRAGEND_EVENT,
    TOUCHSTART_EVENT,
    TOUCHEND_EVENT,
    CHANGE_EVENT,
    INPUT_EVENT,
    SUBMIT_EVENT,
    CLOSE_EVENT,
    DRAGOVER_EVENT,
    TOUCHMOVE_EVENT,
    MAIN_COLOR, DISPLAY_BLOCK, DIV_ELEMENT, H3_ELEMENT, OPTION_ELEMENT, INPUT_ELEMENT, PX_MEASUREMENT, DISPLAY_NONE
} from "@configs/common_config";
import shipmentsTemplate from '@components/Shipments/shipments.handlebars'
import cargoTemplate from '@components/Cargo/cargo.handlebars'
import shipmentTemplate from '@components/Shipment/shipment.handlebars'
import {Api} from "@modules/api";
import * as uuid from "uuid";


import css from '@components/Shipments/shipments.scss'
import cargoCss from '@components/Cargo/cargo.scss'
import shipmentCss from '@components/Shipment/shipment.scss'


const CARGO_CLASS = '.cargo';
const CARGO_DROPPABLE_CLASS = 'cargo_droppable';
const CARGO_AMOUNT_CLASS = '.cargo__data-amount';
const CARGO_VOLUME_CLASS = '.cargo__data-volume';
const CARGO_NAME_CLASS = '.cargo__data-name'
const CARGO_SELECTED_CLASS = 'cargo_selected';
const CARGO_SELECTED_FAKE_CLASS = 'cargo_fake-selected';
const CARGO_EDIT_BUTTON_CLASS = '.cargo__edit-button';
const CARGO_REMOVE_BUTTON_CLASS = '.cargo__remove-button';

const NEW_CARGO_DIALOG_CLASS = '.new-cargo-dialog';
const NEW_CARGO_FORM_CLASS = '.new-cargo-dialog__form'
const NEW_CARGO_ERROR_CLASS = '.new-cargo-dialog__error';
const NEW_CARGO_VOLUME_CLASS = '.new-cargo-dialog__cargo-volume';
const NEW_CARGO_NAME_CLASS = '.new-cargo-dialog__cargo-name';
const NEW_CARGO_AMOUNT_CLASS = '.new-cargo-dialog__cargo-amount';
const NEW_CARGO_OK_BUTTON_CLASS = '.new-cargo-dialog__ok-button';
const NEW_CARGO_CANCEL_BUTTON_CLASS = '.new-cargo-dialog__cancel-button';

const CONFIRM_REMOVE_DIALOG_CLASS = '.confirm-remove-dialog';
const CONFIRM_REMOVE_DIALOG_TYPE = '.confirm-remove-dialog_type';
const CONFIRM_REMOVE_BUTTON_CLASS = '.confirm-remove-dialog__ok-button';
const CANCEL_REMOVE_BUTTON_CLASS = '.confirm-remove-dialog__cancel-button';

const SHIPMENT_CLASS = '.shipment';
const SHIPMENT_PLACES_CLASS = '.shipment__places'
const SHIPMENT_CARGO_LIST = '.shipment__cargo-list';
const SHIPMENT_ID_CLASS = '.shipment__id';
const SHIPMENT_SELECT_CAR_CLASS = '.shipment__select-car';
const SHIPMENT_DELETE_BUTTON_CLASS = '.shipment__delete';
const SHIPMENT_EDIT_BUTTON_CLASS = '.shipment__edit';
const SHIPMENT_DESTINATION_ERROR_CLASS = '.shipment__destination-error';
const SHIPMENT_LOADABILITY_ERROR_CLASS = '.shipment__loadability-error';

const SHIPMENTS_CLASS = '.shipments';
const SHIPMENTS_NEW_SHIPMENT_BUTTON_CLASS = '.shipments__new-shipment-btn';
const SHIPMENT_NEW_CARGO_BUTTON_CLASS = '.shipment__new-cargo';

const DESTINATIONS_ID = '#destinations';
const CARS_ID = '#cars';

const DRAG_FORBIDDEN_CLASS = 'drag_forbidden';

const CAR_SIZE_ERROR = 'В машине не хватит места!';
const CAR_SIZE_SOURCE_CODE_ERROR = 'Машина не расширится от редактирования исходного кода =(';
const FREE_CARS_ERROR = 'Нет свободных машин!';

const EMPTY_STR = '';

const SAVE_TEXT = 'Сохранить';

const CLASS_SELECTOR = '.';

let busyCars = []


function dragStartListener(event, touch = false) {
    let evt = event.target;
    if (touch) {
        const lastTouch = evt.changedTouches[evt.changedTouches.length - 1];
        const pointEls = document.elementsFromPoint(lastTouch.clientX, lastTouch.clientY);
        evt = pointEls[0].closest(CARGO_CLASS);
    }
    evt.classList.add(CARGO_SELECTED_CLASS);
    evt.dataset.from = evt.parentNode.parentNode.querySelector(SHIPMENT_ID_CLASS).textContent;
    evt.dataset.child = String(Array.prototype.indexOf.call(event.target.parentNode.children, event.target));
    const amount = evt.querySelector(CARGO_AMOUNT_CLASS).textContent;
    const volume = evt.querySelector(CARGO_VOLUME_CLASS).textContent;
    const realSize = Number(amount) * Number(volume);
    document.querySelectorAll(SHIPMENT_CLASS).forEach((taskListEl) => {
            if (taskListEl.querySelector(SHIPMENT_ID_CLASS).textContent === evt.dataset.from) {
                return;
            }
            const destinationsEl = taskListEl.querySelector(DESTINATIONS_ID);
            const newDestinationsEl = evt.parentNode.parentNode.querySelector(DESTINATIONS_ID)
            if (destinationsEl.options[destinationsEl.selectedIndex].value !== newDestinationsEl.options[newDestinationsEl.selectedIndex].value) {
                taskListEl.querySelector(SHIPMENT_CARGO_LIST).classList.add(DRAG_FORBIDDEN_CLASS);
                taskListEl.classList.add(DRAG_FORBIDDEN_CLASS);
                taskListEl.querySelector(SHIPMENT_DESTINATION_ERROR_CLASS).style.display = DISPLAY_BLOCK;
            } else {
                const loadability = Number(taskListEl.querySelector(SHIPMENT_PLACES_CLASS).textContent);
                const leftVolume = loadability - busyVolume(taskListEl.querySelector(SHIPMENT_CARGO_LIST));
                if (realSize > leftVolume) {
                    taskListEl.querySelector(SHIPMENT_CARGO_LIST).classList.add(DRAG_FORBIDDEN_CLASS);
                    taskListEl.classList.add(DRAG_FORBIDDEN_CLASS);
                    taskListEl.querySelector(SHIPMENT_LOADABILITY_ERROR_CLASS).style.display = DISPLAY_BLOCK;
                }
            }
        }
    )
    if (touch) {
        const fakeElement = evt.cloneNode(true);
        fakeElement.classList.add(CARGO_SELECTED_FAKE_CLASS);
        document.getElementById('root').appendChild(fakeElement);
    }
}

async function okCargoListener(event, list) {
    const cargoElement = document.createElement(DIV_ELEMENT);
    const count = event.target.elements.amount.value;
    const name = event.target.elements.name.value;
    const volume = event.target.elements.volume.value;

    let done = false;
    Array.from(list.children).forEach((currCargo) => {
        const currCargoVolume = Number(currCargo.querySelector(CARGO_VOLUME_CLASS).textContent);
        const currCargoCount = Number(currCargo.querySelector(CARGO_AMOUNT_CLASS).textContent);
        const currCargoName = currCargo.querySelector(CARGO_NAME_CLASS).textContent;
        if ((currCargoName === name) && (currCargoVolume === Number(volume))) {
            currCargo.querySelector(CARGO_AMOUNT_CLASS).textContent = Number(currCargoCount) + Number(count);
            done = true;
        }
    })

    if (done) {
        return;
    }

    const api = new Api();
    const cid = uuid.v4();
    const sid = list.parentNode.querySelector(SHIPMENT_ID_CLASS).textContent;
    const addResponse = await api.addCargo(cid, sid, count, volume, name);

    if (addResponse.status !== 200) {
        alert(CAR_SIZE_SOURCE_CODE_ERROR);
        return;
    }

    cargoElement.innerHTML = cargoTemplate({amount: count, name: name, volume: volume});
    cargoElement.firstChild.dataset.id = cid;
    const newCargo = list.appendChild(cargoElement.firstChild);

    newCargo.addEventListener(DRAGSTART_EVENT, (event) => dragStartListener(event));
    newCargo.addEventListener(TOUCHSTART_EVENT, (event) => dragStartListener(event, true));

    newCargo.addEventListener(DRAGEND_EVENT, (evt) => evt.target.classList.remove(CARGO_SELECTED_CLASS));
    newCargo.addEventListener(TOUCHEND_EVENT, (evt) => document.querySelector(CLASS_SELECTOR + CARGO_SELECTED_CLASS).classList.remove(CARGO_SELECTED_CLASS));

    const deleteCargoButton = newCargo.querySelector(CARGO_REMOVE_BUTTON_CLASS);
    deleteCargoButton.addEventListener(MOUSE_CLICK_EVENT, (event) => {
        event.target.parentNode.parentNode.removeChild(event.target.parentNode);
    });

    const changeCargoButton = newCargo.querySelector(CARGO_EDIT_BUTTON_CLASS);
    changeCargoButton.addEventListener(MOUSE_CLICK_EVENT, (event) => editCargoListener(event));

}

function busyVolume(list) {
    let ttl = 0;
    list.querySelectorAll(CARGO_CLASS).forEach((cargo) => {
        const volume = cargo.querySelector(CARGO_VOLUME_CLASS).textContent;
        const amount = cargo.querySelector(CARGO_AMOUNT_CLASS).textContent;
        ttl = ttl + Number(volume) * Number(amount);
    });
    return ttl;
}

function checkCargoFit(list, volumeInput, amountInput, decrease = 0) {
    const totalVolume = Number(volumeInput.value) * Number(amountInput.value);

    const errorElement = document.querySelector(NEW_CARGO_ERROR_CLASS);

    const okButton = document.querySelector(NEW_CARGO_OK_BUTTON_CLASS);

    const loadability = Number(list.parentNode.querySelector(SHIPMENT_PLACES_CLASS).textContent);
    const leftVolume = loadability - busyVolume(list) + decrease;

    if (totalVolume > leftVolume) {
        errorElement.textContent = CAR_SIZE_ERROR;
        okButton.disabled = true;
    } else {
        errorElement.textContent = EMPTY_STR;
        okButton.disabled = false;
    }
}

function editShipmentListener(event) {
    const shipment = event.target.parentNode;
    const carList = shipment.querySelector(CARS_ID);
    const destinationsList = shipment.querySelector(DESTINATIONS_ID);
    const options = carList.querySelectorAll(OPTION_ELEMENT);
    const oldDestination = destinationsList.options[destinationsList.selectedIndex].value;
    let selected = carList.options[carList.selectedIndex].value
    options.forEach((option) => {
        if (option.dataset.load < busyVolume(shipment)) {
            option.disabled = true
        } else option.disabled = (busyCars.includes(option.value) && (option.selected === false));
        carList.addEventListener(CHANGE_EVENT, (evt) => {
            busyCars.splice(busyCars.indexOf(selected), 1);
            selected = evt.target.options[evt.target.selectedIndex].value;
            busyCars.push(selected);
        })
    })
    carList.disabled = false;
    destinationsList.disabled = false;
    const saveButton = document.createElement(H3_ELEMENT);
    saveButton.style.color = MAIN_COLOR;
    saveButton.textContent = SAVE_TEXT;
    saveButton.addEventListener(MOUSE_CLICK_EVENT, async (evt) => {
        const destinationsEl = shipment.querySelector(DESTINATIONS_ID);
        const destination = destinationsEl.options[destinationsEl.selectedIndex].value;
        const optionsEl = shipment.querySelector(CARS_ID);
        const selected = optionsEl.options[optionsEl.selectedIndex].value;
        const api = new Api()
        const apiResponse = await api.updateShipment(shipment.querySelector(SHIPMENT_ID_CLASS).textContent, destination, selected);
        if (apiResponse.status !== 200) {
            shipment.querySelector(DESTINATIONS_ID).value = destination;
            shipment.querySelector(CARS_ID).value = selected;
            if (apiResponse.status === 429) {
                evt.target.parentNode.replaceChild(event.target, saveButton);
            }
        } else {
            evt.target.parentNode.replaceChild(event.target, saveButton);
        }
        carList.disabled = true;
        destinationsList.disabled = true;
    })
    event.target.parentNode.replaceChild(saveButton, event.target);
}

function newCargoListener(newCargoEvent) {
    const modal = document.querySelector(NEW_CARGO_DIALOG_CLASS);


    //избавляемся от старых эвент листенеров без смс и регистрации
    let modalCopy = modal.cloneNode(true);
    modal.parentNode.replaceChild(modalCopy, modal);

    const volumeInput = modalCopy.querySelector(NEW_CARGO_VOLUME_CLASS);
    const amountInput = modalCopy.querySelector(NEW_CARGO_AMOUNT_CLASS);

    [volumeInput, amountInput].forEach((input) => input.addEventListener(INPUT_EVENT, () => checkCargoFit(newCargoEvent.target.parentNode.querySelector(SHIPMENT_CARGO_LIST), volumeInput, amountInput)))

    modalCopy.querySelector(NEW_CARGO_FORM_CLASS).addEventListener(
        SUBMIT_EVENT, (event) =>
            okCargoListener(event, newCargoEvent.target.parentNode.querySelector(SHIPMENT_CARGO_LIST)))
    modalCopy.querySelector(NEW_CARGO_CANCEL_BUTTON_CLASS).addEventListener(MOUSE_CLICK_EVENT, (event) => event.target.parentNode.parentNode.close())

    modalCopy.addEventListener(CLOSE_EVENT, (event) => {
        event.target.querySelectorAll(INPUT_ELEMENT).forEach((input) => {
            input.value = EMPTY_STR;
            const errorElement = document.querySelector(NEW_CARGO_ERROR_CLASS);
            const okButton = document.querySelector(NEW_CARGO_OK_BUTTON_CLASS);
            errorElement.textContent = EMPTY_STR;
            okButton.disabled = false;
        })
    })

    modalCopy.showModal();
}

function editCargoListener(event) {
    const modal = document.querySelector(NEW_CARGO_DIALOG_CLASS);

    //избавляемся от старых эвент листенеров без смс и регистрации
    let modalCopy = modal.cloneNode(true);
    modal.parentNode.replaceChild(modalCopy, modal);

    const volumeInput = modalCopy.querySelector(NEW_CARGO_VOLUME_CLASS);
    const volume = Number(event.target.parentNode.querySelector(CARGO_VOLUME_CLASS).textContent);
    volumeInput.value = volume;
    const amountInput = modalCopy.querySelector(NEW_CARGO_AMOUNT_CLASS);
    const amount = Number(event.target.parentNode.querySelector(CARGO_AMOUNT_CLASS).textContent)
    amountInput.value = amount;
    const nameInput = modalCopy.querySelector(NEW_CARGO_NAME_CLASS);
    nameInput.value = event.target.parentNode.querySelector(CARGO_NAME_CLASS).textContent;

    [volumeInput, amountInput].forEach((input) => input.addEventListener(INPUT_EVENT, () => checkCargoFit(event.target.parentNode.parentNode.parentNode.querySelector(SHIPMENT_CARGO_LIST), volumeInput, amountInput, volume * amount)))

    modalCopy.querySelector(NEW_CARGO_FORM_CLASS).addEventListener(
        SUBMIT_EVENT, async (evt) => {
            const api = new Api();
            const volume = evt.target.elements.volume.value;
            const amount = evt.target.elements.amount.value;
            const name = evt.target.elements.name.value;
            const uResponse = await api.updateCargo(event.target.parentNode.dataset.id, amount, volume, name);
            if (uResponse.status === 200) {
                event.target.parentNode.querySelector(CARGO_VOLUME_CLASS).textContent = volume;
                event.target.parentNode.querySelector(CARGO_AMOUNT_CLASS).textContent = amount;
                event.target.parentNode.querySelector(CARGO_NAME_CLASS).textContent = name;
            } else {
                alert(CAR_SIZE_SOURCE_CODE_ERROR);
            }
        });

    modalCopy.querySelector(NEW_CARGO_CANCEL_BUTTON_CLASS).addEventListener(MOUSE_CLICK_EVENT, (evt) => evt.target.parentNode.parentNode.close())

    modalCopy.addEventListener(CLOSE_EVENT, (evt) => {
        evt.target.querySelectorAll(INPUT_ELEMENT).forEach((input) => {
            input.value = EMPTY_STR;
            const errorElement = document.querySelector(NEW_CARGO_ERROR_CLASS);
            const okButton = document.querySelector(NEW_CARGO_OK_BUTTON_CLASS);
            errorElement.textContent = EMPTY_STR;
            okButton.disabled = false;
        })
    })

    modalCopy.showModal();
}

function dragOverListener(event, touch) {
    event.preventDefault();

    let target = null;


    const draggedElement = document.querySelector(CLASS_SELECTOR + CARGO_SELECTED_CLASS);

    if (draggedElement === null) {
        return;
    }

    if (touch) {
        const moving = document.querySelector(CLASS_SELECTOR + CARGO_SELECTED_FAKE_CLASS);
        if (!moving) {
            return;
        }
        moving.style.left = String(event.changedTouches[0].clientX - moving.clientWidth / 2) + PX_MEASUREMENT;
        moving.style.top = String(event.changedTouches[0].clientY - moving.clientHeight / 2) + PX_MEASUREMENT;
        const len = event.touches.length;
        if (len !== 0) {
            const lastTouch = event.touches[len - 1];
            const pointEls = document.elementsFromPoint(lastTouch.clientX, lastTouch.clientY);
            if (pointEls.length > 0) {
                target = pointEls[0];
            }
        } else {
            return;
        }
    } else {
        target = event.target;
    }

    if (target === null) {
        return;
    }

    const draggedElementPrevList = draggedElement.closest(SHIPMENT_CARGO_LIST);

    const currentElement = target
    const prevDroppable = document.querySelector(CLASS_SELECTOR + CARGO_DROPPABLE_CLASS);

    let curDroppable = target;

    while (!curDroppable.matches(SHIPMENT_CARGO_LIST) && curDroppable !== document.body) {
        curDroppable = curDroppable.parentElement;
        if (curDroppable === null) {
            return;
        }
    }

    if (!curDroppable.matches(SHIPMENT_CARGO_LIST)) {
        return;
    }

    if (curDroppable !== prevDroppable) {
        if (prevDroppable) prevDroppable.classList.remove(CARGO_DROPPABLE_CLASS);

        if (curDroppable.matches(SHIPMENT_CARGO_LIST)) {
            if (curDroppable.matches(DRAG_FORBIDDEN_CLASS)) {
                return;
            } else {
                curDroppable.classList.add(CARGO_DROPPABLE_CLASS);
            }
        }
    }

    if (draggedElement === currentElement) {
        return;
    }

    if (curDroppable === draggedElementPrevList) {
        if (!currentElement.matches(CARGO_CLASS)) {
            return;
        }

        const nextElement = (currentElement === draggedElement.nextElementSibling)
            ? currentElement.nextElementSibling
            : currentElement;

        curDroppable.insertBefore(draggedElement, nextElement);

        return;
    }

    if (currentElement.matches(CARGO_CLASS)) {
        curDroppable.insertBefore(draggedElement, currentElement);
        return;
    }
    curDroppable.appendChild(draggedElement);
}

function carSelectChangeListener(event) {
    const selectList = event.target;
    event.target.parentNode.querySelector(SHIPMENT_PLACES_CLASS).textContent = selectList.options[selectList.selectedIndex].dataset.load;
}

function insertChildAtIndex(array, child, index) {
    if (!index) index = 0
    if (index >= array.children.length) {
        array.appendChild(child)
    } else {
        array.insertBefore(child, array.children[index])
    }
}

async function onDragEndEvent(evt, api, touch = false) {
    evt.preventDefault();
    evt.target.classList.remove(CARGO_SELECTED_CLASS);
    let target = evt.target;
    let newShipment;
    if (touch) {
        const lastTouch = evt.changedTouches[evt.changedTouches.length - 1];
        const pointEls = document.elementsFromPoint(lastTouch.clientX, lastTouch.clientY);
        if (pointEls.length > 0) {
            newShipment = pointEls[0].closest(SHIPMENT_CLASS);
        }
        target = evt.target.closest(CARGO_CLASS);
    } else {
        newShipment = target.closest(SHIPMENT_CLASS);
    }
    const newShipmentId = newShipment.querySelector(SHIPMENT_ID_CLASS).textContent;
    const oldShipmentId = target.dataset.from;
    const volume = target.querySelector(CARGO_VOLUME_CLASS);
    const amount = target.querySelector(CARGO_AMOUNT_CLASS);
    if (newShipmentId !== oldShipmentId) {
        const moveResult = await api.moveCargo(target.dataset.id, newShipmentId, oldShipmentId, amount, volume);
        if (moveResult.status !== 200) {
            target.parentNode.removeChild(target);
            const oldIdx = Number(target.dataset.child);
            const list = document.querySelector(`.list-${oldShipmentId}`);
            insertChildAtIndex(list, target, oldIdx);
        }
    }
    const cargoSelected = document.querySelector(CLASS_SELECTOR + CARGO_SELECTED_CLASS);
    if (cargoSelected) {
        cargoSelected.classList.remove(CARGO_SELECTED_CLASS);
    }
}

function onShipmentDragEnd(touch = false) {
    const forbidden = document.querySelectorAll(DRAG_FORBIDDEN_CLASS);
    forbidden.forEach((forb) => forb.classList.remove(DRAG_FORBIDDEN_CLASS));
    if (touch) {
        const fake = document.querySelectorAll(CLASS_SELECTOR + CARGO_SELECTED_FAKE_CLASS);
        fake.forEach((fakeEl) => fakeEl.parentNode.removeChild(fakeEl));
    }
    const wrongDestination = document.querySelectorAll(SHIPMENT_DESTINATION_ERROR_CLASS);
    const wrongLoad = document.querySelectorAll(SHIPMENT_LOADABILITY_ERROR_CLASS);
    wrongDestination.forEach((wd) => wd.style.display = DISPLAY_NONE);
    wrongLoad.forEach((wl) => wl.style.display = DISPLAY_NONE);
}

async function newShipment(event, cars, destinations, api) {
    const shipments = document.querySelectorAll(SHIPMENT_CLASS);
    if (cars.length === shipments.length) {
        alert(FREE_CARS_ERROR);
        return cars;
    } else {
        const newShipment = document.createElement(DIV_ELEMENT);

        const sid = uuid.v4();
        newShipment.innerHTML = shipmentTemplate({cars: cars, destinations: destinations, shipment: {id: sid}});
        const selectCarsList = newShipment.querySelector(CARS_ID);
        const selected = selectCarsList.options[selectCarsList.selectedIndex].value;
        const selectDestList = newShipment.querySelector(DESTINATIONS_ID);
        const destination = selectDestList.options[selectDestList.selectedIndex].value;

        const addShipmentResponse = await api.addShipment(sid, destination, selected);

        if (addShipmentResponse.status !== 200) {
            alert(FREE_CARS_ERROR);
            return;
        }

        const cargoList = newShipment.querySelector(SHIPMENT_CARGO_LIST);
        cargoList.addEventListener(DRAGOVER_EVENT, (event) => dragOverListener(event, false));
        cargoList.addEventListener(TOUCHMOVE_EVENT, (event) => dragOverListener(event, true));
        newShipment.querySelector(SHIPMENT_NEW_CARGO_BUTTON_CLASS).addEventListener(MOUSE_CLICK_EVENT, (event) => newCargoListener(event));
        newShipment.querySelector(SHIPMENT_EDIT_BUTTON_CLASS).addEventListener(MOUSE_CLICK_EVENT, (event) => editShipmentListener(event));
        newShipment.querySelector(SHIPMENT_DELETE_BUTTON_CLASS).addEventListener(MOUSE_CLICK_EVENT, (event) => {
            const selectList = event.target.parentNode.querySelector(CARS_ID);
            const selected = selectList.options[selectList.selectedIndex].value;
            busyCars.splice(busyCars.indexOf(selected), 1);
            event.target.parentNode.parentNode.removeChild(event.target.parentNode);
        });
        newShipment.querySelector(SHIPMENT_SELECT_CAR_CLASS).addEventListener(CHANGE_EVENT, (event) => carSelectChangeListener(event));
        const newNode = document.querySelector(SHIPMENTS_CLASS).insertBefore(newShipment.firstChild, event.target.parentNode);
        const selectList = newNode.querySelector(CARS_ID);
        newNode.querySelector(SHIPMENT_PLACES_CLASS).textContent = selectList.options[selectList.selectedIndex].dataset.load;
        busyCars.push(selectList.options[selectList.selectedIndex].value);
        cars[selectList.selectedIndex].busy = true;
        return cars;
    }
}

async function deleteShipment(event, api) {
    const shipmentId = event.target.parentNode.querySelector(SHIPMENT_ID_CLASS).textContent;
    const confirmDeleteModal = document.querySelector(CONFIRM_REMOVE_DIALOG_CLASS);
    let modalCopy = confirmDeleteModal.cloneNode(true);
    confirmDeleteModal.parentNode.replaceChild(modalCopy, confirmDeleteModal);
    modalCopy.showModal();
    document.querySelector(CONFIRM_REMOVE_DIALOG_TYPE).textContent = `рейс #${shipmentId}?`;
    document.querySelector(CONFIRM_REMOVE_BUTTON_CLASS).addEventListener(MOUSE_CLICK_EVENT, async () => {
        const deleteResponse = await api.removeShipment(shipmentId);
        if (deleteResponse.status !== 200) {
            return;
        }
        const selectList = event.target.parentNode.querySelector(CARS_ID);
        const selected = selectList.options[selectList.selectedIndex].value;
        busyCars.splice(busyCars.indexOf(selected), 1);
        event.target.parentNode.parentNode.removeChild(event.target.parentNode);
        modalCopy.close();
    })
    document.querySelector(CANCEL_REMOVE_BUTTON_CLASS).addEventListener(MOUSE_CLICK_EVENT, () => {
        modalCopy.close();
    })
}

async function deleteCargo(event, api) {
    const confirmDeleteModal = document.querySelector(CONFIRM_REMOVE_DIALOG_CLASS);
    let modalCopy = confirmDeleteModal.cloneNode(true);
    confirmDeleteModal.parentNode.replaceChild(modalCopy, confirmDeleteModal);
    modalCopy.showModal();
    document.querySelector(CONFIRM_REMOVE_DIALOG_TYPE).textContent = `груз "${event.target.parentNode.querySelector(CARGO_NAME_CLASS).textContent}"?`
    document.querySelector(CONFIRM_REMOVE_BUTTON_CLASS).addEventListener(MOUSE_CLICK_EVENT, () => {
        const cargoId = event.target.parentNode.dataset.id;
        api.removeCargo(cargoId);
        event.target.parentNode.parentNode.removeChild(event.target.parentNode);
        modalCopy.close();
    })
    document.querySelector(CANCEL_REMOVE_BUTTON_CLASS).addEventListener(MOUSE_CLICK_EVENT, () => {
        modalCopy.close();
    })
}

const Shipments = async () => {
    const rootElement = document.querySelector(ROOT_ELEMENT_ID);

    const api = new Api();
    const carsResponse = await api.getCars();
    const shipmentsResponse = await api.getShipments();
    const destinationsResponse = await api.getDestinations();

    let cars = carsResponse.data;
    const exShipments = shipmentsResponse.data;
    const destinations = destinationsResponse.data;


    for (let car of cars) {
        for (let sh of exShipments) {
            if (sh.car_plate === car.plate) {
                car.busy = true;
                busyCars.push(car.plate);
                sh.places = car.load;
            }
        }
    }

    rootElement.innerHTML = shipmentsTemplate({cars: cars, shipments: exShipments, destinations: destinations});


    const draggableItems = document.querySelectorAll(CARGO_CLASS);
    draggableItems.forEach((draggableItem) => {
        draggableItem.addEventListener(DRAGSTART_EVENT, (event) => dragStartListener(event));
        draggableItem.addEventListener(TOUCHSTART_EVENT, (event) => dragStartListener(event, true));

        draggableItem.addEventListener(DRAGEND_EVENT, (evt) => onDragEndEvent(evt, api));
        draggableItem.addEventListener(TOUCHEND_EVENT, (evt) => onDragEndEvent(evt, api, true));
    });


    const shipments = document.querySelectorAll(SHIPMENT_CLASS);
    shipments.forEach((shipment) => shipment.addEventListener(DRAGOVER_EVENT, (event) => dragOverListener(event, false)));
    shipments.forEach((shipment) => shipment.addEventListener(TOUCHMOVE_EVENT, (event) => dragOverListener(event, true)));

    draggableItems.forEach((shipment) => shipment.addEventListener(DRAGEND_EVENT, () => onShipmentDragEnd()));
    draggableItems.forEach((shipment) => shipment.addEventListener(TOUCHEND_EVENT, () => onShipmentDragEnd(true)));

    const newCargoButtons = document.querySelectorAll(SHIPMENT_NEW_CARGO_BUTTON_CLASS);
    newCargoButtons.forEach((newCargoBtn) => {
        newCargoBtn.addEventListener(MOUSE_CLICK_EVENT, (event) => newCargoListener(event));
    })


    const newShipmentBtn = document.querySelector(SHIPMENTS_NEW_SHIPMENT_BUTTON_CLASS);
    newShipmentBtn.addEventListener(MOUSE_CLICK_EVENT, async (event) => {
        cars = await newShipment(event, cars, destinations, api)
    });


    const editShipmentButtons = document.querySelectorAll(SHIPMENT_EDIT_BUTTON_CLASS);
    editShipmentButtons.forEach((btn) => btn.addEventListener(MOUSE_CLICK_EVENT, (event) => editShipmentListener(event)))


    const deleteShipmentsButtons = document.querySelectorAll(SHIPMENT_DELETE_BUTTON_CLASS);
    deleteShipmentsButtons.forEach((btn) => btn.addEventListener(MOUSE_CLICK_EVENT, async (event) => deleteShipment(event, api)));


    const carSelect = document.querySelectorAll(SHIPMENT_SELECT_CAR_CLASS);
    carSelect.forEach((select) => select.addEventListener(CHANGE_EVENT, (event) => carSelectChangeListener(event)));


    const deleteCargoButtons = document.querySelectorAll(CARGO_REMOVE_BUTTON_CLASS);
    deleteCargoButtons.forEach((btn) => btn.addEventListener(MOUSE_CLICK_EVENT, (event) => deleteCargo(event, api)));


    const changeCargoButtons = document.querySelectorAll(CARGO_EDIT_BUTTON_CLASS);
    changeCargoButtons.forEach((btn) => btn.addEventListener(MOUSE_CLICK_EVENT, (event) => editCargoListener(event)))
};

export default Shipments;
