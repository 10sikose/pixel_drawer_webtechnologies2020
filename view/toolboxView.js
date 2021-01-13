import { ELEMENTS, COLORS } from '../shared/shared.js';

/*
TOOLBOX
CONTAINS COLOR PICKER, ERASER AND SAVE BUTTON
*/

export default class ToolBoxView {
    constructor() {
        this._container = ELEMENTS.toolBoxContainer;
        this._header = ELEMENTS.toolBoxHeader;
        this._drawButton = ELEMENTS.drawButton;
        this._colorBox = ELEMENTS.colorBox;
        this._saveButton = ELEMENTS.saveButton;
        this._eraseButton = ELEMENTS.eraseButton;
        this._toolBoxIcons = ELEMENTS.toolBoxIcons;
        this._downloadButton = ELEMENTS.downloadButton;

        //this._createColorButtons();
        this._setToolBox();
    }

    _setToolBox() {
        this._container.style.backgroundColor = COLORS.toolBoxColor;
        this._colorBox.style.backgroundColor = COLORS.toolBoxColor;
        this._colorBox.value = COLORS.black;
    }

    //
    //GETTERS

    getDrawButton() {
        return this._drawButton;
    }

    getColorBox() {
        return this._colorBox;
    }

    getSaveButton() {
        return this._saveButton;
    }

    //////////////////// GABI
    getDownloadButton() {
        return this._downloadButton;
    }
    //////////////////// GABI


    getEraser() {
        return this._eraseButton;
    }

    getHeader() {
        return this._header;
    }

    getContainer() {
        return this._container;
    }

    getToolBoxIcons() {
        return this._toolBoxIcons;
    }

    ////

    //
    //SETTERS

    setPosX(oldX) {
        this._container.style.left = (this._container.offsetLeft - oldX) + "px";
    }

    setPosY(oldY) {
        this._container.style.top = (this._container.offsetTop - oldY) + "px";
    }

    ////

    //
    //Mark icon as pressed
    markPressed(id) {
        let newPressedIcon = document.getElementById(id);
        let oldPressedIcon = document.querySelector('.pressed');

        if(oldPressedIcon) {
          oldPressedIcon.classList.remove('pressed');
        }

        newPressedIcon.classList.add('pressed');
    }


}
