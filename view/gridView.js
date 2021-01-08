import { elements } from './base.js';

const GRID_WIDTH = 45;
const GRID_HEIGHT = 70;
//NOTE: THE PIXEL DIMENSIONS DEPEND ON CSS RULES
//const PIXEL_WIDTH = 15;
//const PIXEL_HEIGHT = 15;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export default class Grid {
    constructor() {
        this.gridRoot = elements.gridRoot;

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
        
                pixel.classList.add('interior');
                pixel.classList.add('empty');
        
                svg.classList.add('pixel');
        
                svg.appendChild(pixel);
        
                row.appendChild(svg);
            }

            this.gridRoot.appendChild(row);
        }
    }

}