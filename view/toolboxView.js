import { ELEMENTS, COLORS } from '../shared/shared.js';

/*
TOOLBOX
CONTAINS COLOR PICKER, ERASER AND SAVE BUTTON
*/

export default class ToolBoxView {
    constructor() {
        this._container = ELEMENTS.toolBoxContainer;
        this._header = ELEMENTS.toolBoxHeader;
        this._colorBox = ELEMENTS.colorBox;
        this._saveButton = ELEMENTS.saveButton;
        this._eraseButton = ELEMENTS.eraseButton;

        //this._createColorButtons();
        this._setToolBox();
    }

    _setToolBox() {
        this._container.style.backgroundColor = COLORS.toolBoxColor;
        this._colorBox.style.backgroundColor = COLORS.toolBoxColor;
        this._colorBox.value = COLORS.black;
    }

    getColorBox() {
        return this._colorBox;
    }

    getSaveButton() {
        return this._saveButton;
    }

    getEraser() {
        return this._eraseButton;
    }

    getHeader() {
        return this._header;
    }

    getContainer() {
        return this._container;
    }

    setPosX(oldX) {
        this._container.style.left = (this._container.offsetLeft - oldX) + "px";
    }

    setPosY(oldY) {
        this._container.style.top = (this._container.offsetTop - oldY) + "px";
    }
}