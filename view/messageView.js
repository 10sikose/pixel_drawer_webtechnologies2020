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

    activateFilter() {
        this._filter.classList.add('active-filter');
    }

    deactivateFilter() {
        this._filter.classList.remove('active-filter');
    }

    isPopupActive() {
        if(this.popupContainer.classList.contains('active-popup'))
        {
            return true;
        }
        else return false;
    }

    activatePopup() {
        this._popupContainer.classList.add('active-popup');
    }

    deactivatePopup() {
        this._popupContainer.classList.remove('active-popup');
    }


}