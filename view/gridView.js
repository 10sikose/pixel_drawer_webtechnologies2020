import { ELEMENTS } from '../shared/shared.js';

const GRID_WIDTH = 45;
const GRID_HEIGHT = 70;
//NOTE: THE PIXEL DIMENSIONS DEPEND ON CSS RULES
//const PIXEL_WIDTH = 15;
//const PIXEL_HEIGHT = 15;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

/*
THIS IS THE UI OF THE DRAWING GRID
*/

export default class GridView {
    constructor() {
        this._gridRoot = ELEMENTS.gridRoot;
        this._titleForm = ELEMENTS.titleForm;
        //this._addTitleForm();
        this._drawGrid();

    }

    _addTitleForm() {
    }

    _drawGrid() {
        for(let w = 0; w < GRID_WIDTH; w++)
        {
            let row = document.createElement('div');
            row.classList.add('row');

            for(let h = 0; h < GRID_HEIGHT; h++)
            {
                let svg = document.createElementNS(
                    SVG_NAMESPACE, 'svg'
                );

                let pixel = document.createElementNS(
                    SVG_NAMESPACE, 'rect'
                );

                pixel.id = w + ", " + h;
                pixel.classList.add('interior');
                pixel.classList.add('empty');

                svg.classList.add('pixel');

                svg.appendChild(pixel);

                row.appendChild(svg);
            }

            this._gridRoot.appendChild(row);
        }
    }


    //
    //GETTERS
    getGridRoot() {
        return this._gridRoot;
    }

    getSaveUncropped() {
        console.log(ELEMENTS.saveUncropped.checked);
        return ELEMENTS.saveUncropped.checked;
    }

    getTitleForm() {
        return this._titleForm;
    }

    getPixels() {
        return document.querySelectorAll('.pixel');
    }

    ////

    fillPixel(id, color) {
        let pixel = document.getElementById(id);

        pixel.style.fill = color;
    }


    markAsFilled(id) {
        let pixel = document.getElementById(id);

        pixel.classList.add('filled');
        pixel.classList.remove('empty');
    }

    markAsEmpty(id) {
        let pixel = document.getElementById(id);

        pixel.classList.add('empty');
        pixel.classList.remove('filled');
    }

    isGridEmpty() {
        let filledPixel = document.querySelector('.filled');

        if(filledPixel) {
            return false;
        }
        else {
            return true;
        }
    }
}
