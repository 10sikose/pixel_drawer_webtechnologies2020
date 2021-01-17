import { ELEMENTS } from "../shared/shared.js";

/*
MESSAGE VIEW
FOR POPUP MESSAGES AND RELATED MATTERS
*/

export default class MessageView {
    constructor() {
        this._filter = ELEMENTS.filter;
        this._popupContainer = ELEMENTS.popupContainer;
        this._popupMessage = ELEMENTS.popupMessage;
        this._popupClose = ELEMENTS.popupClose;
    }

    //
    //GETTERS
    getFilter() {
        return this._filter;
    }

    getPopupContainer() {
        return this._popupContainer;
    }

    getPopupClose() {
        return this._popupClose;
    }

    ////

    //
    //SETTERS
    setMessage(text) {
        this._popupMessage.innerHTML = text;
    }

    ////

    // Activate Filter
    activateFilter() {
        this._filter.classList.add('active-filter');
    }

    // Deactivate Filter
    deactivateFilter() {
        this._filter.classList.remove('active-filter');
    }

    // Check Popup state
    isPopupActive() {
        if(this.popupContainer.classList.contains('active-popup'))
        {
            return true;
        }
        else return false;
    }

    // Open Popup
    activatePopup() {
        this._popupContainer.classList.add('active-popup');
    }

    // Close Popup
    deactivatePopup() {
        this._popupContainer.classList.remove('active-popup');
    }


}
