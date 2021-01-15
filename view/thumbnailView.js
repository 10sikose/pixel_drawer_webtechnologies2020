import { ELEMENTS, COLORS } from '../shared/shared.js';

/*
ThumbnailView
CONTAINS thumbnail containers
*/

export default class ThumbnailView {
    constructor() {
        this._container = ELEMENTS.thumbnailContainer;



        console.log(this);
        this._setThumbnails();
    }

    _setThumbnails() {
              console.log(this.getContainer());
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
