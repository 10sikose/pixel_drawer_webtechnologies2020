import { ELEMENTS, COLORS } from '../shared/shared.js';

/*
TOOLBOX
CONTAINS COLOR PICKER, ERASER AND SAVE BUTTON
*/

export default class ToolboxView {
    constructor() {
        this._container = ELEMENTS.toolBoxContainer;
        this._header = ELEMENTS.toolBoxHeader;
        this._colorBox = ELEMENTS.colorBox;
        this._saveButton = ELEMENTS.saveButton;
        this._eraseButton = ELEMENTS.eraseButton;

        this._createColorButtons();
    }
    
    static color_arr = [COLORS.lightPurple, COLORS.blue, COLORS.cyan,
                        COLORS.magenta, COLORS.pink, COLORS.brown,
                        COLORS.red, COLORS.orange, COLORS.yellow,
                        COLORS.lightGreen, COLORS.darkGreen, COLORS.grey,
                        COLORS.white, COLORS.black, COLORS.darkPurple];

    _createColorButtons() {
        for(let idx = 0; idx < ToolboxView.color_arr.length; idx++)
        {
            let button = document.createElement('button');
            button.classList.add('color');
            button.style.background = ToolboxView.color_arr[idx];
            button.style.width = '20px';
            button.style.height = '20px';
            button.style.border = '1px solid ' + ToolboxView.color_arr[idx];

            this._colorBox.appendChild(button);
        }
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