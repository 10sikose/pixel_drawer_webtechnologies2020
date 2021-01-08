/*
THIS IS THE MAIN CONTROLLER
IT WILL COORDINATE THE WORKFLOW OF THE APP
ALL EVENT LISTENERS GO HERE

*/

export default class Controller {
    constructor(gridView) {
        this.view = gridView;
        this.isMouseDown = false;
        this.erase = false;
        this.currentColor = 'red';
        this.addEventListeners();
    }

    addEventListeners() {
        this.setMouseDown();
        this.setMouseUp();
        this.setMouseOver();
    }

    setMouseDown() {
        document.addEventListener('mousedown', event => {
            this.isMouseDown = true;
        });

        this.view.getPixels().forEach(pixel => {
            pixel.addEventListener('mousedown', event => {

                this.view.fillPixel(pixel.firstChild.id, this.currentColor);

                if (!this.erase){
                  this.view.markAsFilled(pixel.firstChild.id);
                }
                else {
                  this.view.markAsEmpty(pixel.firstChild.id);
                }
            });
        });
    }

    setMouseUp() {
        document.addEventListener('mouseup', event => {
            this.isMouseDown = false;
        });
    }

    setMouseOver() {
        this.view.getPixels().forEach(pixel => {
            pixel.addEventListener('mouseover', event => {

                if(this.isMouseDown)
                {
                  this.view.fillPixel(pixel.firstChild.id, this.currentColor);

                  if (!this.erase){
                    this.view.markAsFilled(pixel.firstChild.id);
                  }
                  else {
                    this.view.markAsEmpty(pixel.firstChild.id);
                  }
                }
              });
        });
    }
}