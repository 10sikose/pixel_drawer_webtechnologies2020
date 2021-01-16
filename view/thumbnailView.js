import { ELEMENTS } from '../shared/shared.js';

/*
ThumbnailView
CONTAINS thumbnail containers
*/

export default class ThumbnailView {
    constructor() {
        this._container = ELEMENTS.thumbnailContainer;
    }

    shiftRight() {
        const THUMBS = this._container.childNodes;
        let before = THUMBS[1].lastElementChild.src;

        for(let i = 3; i < THUMBS.length; i+=2){
            if(THUMBS[i].nodeName == 'DIV'){

              let inter = THUMBS[i].lastElementChild.src;

              THUMBS[i].lastElementChild.src = before;


              before = inter;

            }
        }
    }

    setNewThumbnail(img) {
        const THUMBS = this._container.childNodes;

        THUMBS[1].lastElementChild.src = img;
    }
    
    //
    //GETTERS

    getContainer() {
        return this._container;
    }

    getBoxes() {
        console.log(this._container);
        return this._container.querySelectorAll('thumbnail-box');
    }



}
