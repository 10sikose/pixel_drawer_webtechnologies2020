import { ELEMENTS } from '../shared/shared.js';

/*
ThumbnailView
CONTAINS thumbnail containers
*/

export default class ThumbnailView {
    constructor() {
        this._container = ELEMENTS.thumbnailContainer;
    }

    // Create Space in Thumbnail list for new Save
    shiftRight() {
        let THUMBS = this._container.childNodes;
        let before = THUMBS[1].lastElementChild.src; // last child element is the Image element

        // We need to skip over the empty text elements between the
        // thumbnail boxes
        for(let i = 3; i < THUMBS.length; i+=2){
            if(THUMBS[i].nodeName == 'DIV'){

              let inter = THUMBS[i].lastElementChild.src;

              THUMBS[i].lastElementChild.src = before;


              before = inter;

            }
        }
    }

    // Replace Thumbnail Image
    setNewThumbnail(img) {
        let THUMBS = this._container.childNodes;

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
