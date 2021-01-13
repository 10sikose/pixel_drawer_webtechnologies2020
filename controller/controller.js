import { COLORS, MESSAGES } from '../shared/shared.js';

/*
THIS IS THE MAIN CONTROLLER
IT WILL COORDINATE THE WORKFLOW OF THE APP
ALL EVENT LISTENERS GO HERE

*/

export default class Controller {
    constructor(gridView, toolBoxView, messageView, saveModel) {
        this._grid = gridView;
        this._toolBox = toolBoxView;
        this._popup = messageView;
        this._saveModel = saveModel;
        this._isMouseDown = false;
        this._draw = true;
        this._erase = false;
        this._currentColor = COLORS.black;
        this._addEventListeners();
    }

    _addEventListeners() {
        this._controlDrawing();
        this._setMouseDown();
        this._setMouseUp();
        this._setMouseClick();
        this._setMouseOver();
        this._setInput();
    }

    //
    //MOUSE DOWN LISTENERS
    _setMouseDown() {
        //IF USER PRESSES MOUSE WHILE OVER GRID, SET _isMouseDown TO TRUE
        this._grid.getGridRoot().addEventListener('mousedown', event => {
          this._isMouseDown = true;
        });

        //IF USER PRESSES MOUSE WHILE OVER TOOLBOX HEADER, ACTIVATE DRAGGING
        this._toolBox.getHeader().addEventListener('mousedown', event => {
            event = event || window.event;
            event.preventDefault();

            let newx = event.clientX;
            let newy = event.clientY;

            const dragElement = e => {
              e = e || window.event;
              e.preventDefault();
              // calculate the new cursor position:
              let oldx = newx - e.clientX;
              let oldy = newy - e.clientY;
              newx = e.clientX;
              newy = e.clientY;
              // set the element's new position:

              this._toolBox.setPosY(oldy);
              this._toolBox.setPosX(oldx);
            }

            document.onmouseup = function(){document.onmouseup = null;
                                             document.onmousemove = null}

            document.onmousemove = dragElement;
        });
    }

    //
    //MOUSE UP LISTENERS
    _setMouseUp() {
        //IF USER RELEASES MOUSE, SET _isMouseDown TO FALSE
        document.addEventListener('mouseup', event => {
          this._isMouseDown = false;
        });

    }

    //
    //MOUSE CLICK LISTENERS
    _setMouseClick() {

        this._toolBox.getDrawButton().addEventListener('click', event => {
          this._draw = true;
          this._currentColor = this._toolBox.getColorBox().value;
          this._erase = false;
        });

        this._toolBox.getEraser().addEventListener('click', event => {
          this._draw = false;
          this._currentColor = COLORS.empty;
          this._erase = true;
        })

        this._toolBox.getSaveButton().addEventListener('click', event => {
          this._draw = false;
          this._erase = false;

          if(this._grid.isGridEmpty()) {
            this._popup.activateFilter();
            this._popup.setMessage(MESSAGES.emptySave);
            this._popup.activatePopup();
          }
          else {
            this._saveModel.savePicture(this._grid.getGridRoot());
          }

        });
        ////////////////// DOWNLOAD ////////////////////////////////////////
        this._toolBox.getDownloadButton().addEventListener('click', event => {
          this._draw = false;
          this._erase = false;

          if(this._grid.isGridEmpty()) {
            this._popup.activateFilter();
            this._popup.setMessage(MESSAGES.emptySave);
            this._popup.activatePopup();
          }
          else {
            let img = this._saveModel.downloadPicture(this._grid.getGridRoot());
            //console.log("Inside Controllers");
            let downloadLink = document.createElement('a'), ev;
            downloadLink.href = img;
            let fileName = this._grid.getTitleForm().value;
            if (fileName == "")
              fileName = "pic";

            downloadLink.download = fileName + '.png';

            if (document.createEvent) {
              ev = document.createEvent("MouseEvents");
              ev.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
              downloadLink.dispatchEvent(ev);
            } else if (downloadLink.fireEvent) {
              downloadLink.fireEvent("onclick");
            }
            }

        });

        ////////////////// DOWNLOAD ////////////////////////////////////////

        this._toolBox.getToolBoxIcons().forEach(icon => {
          icon.addEventListener('click', event => {
            this._toolBox.markPressed(icon.id);
          });
        });

        //Following two event listeners hide the popup
        this._popup.getPopupClose().addEventListener('click', event => {
          this._popup.deactivatePopup();
          this._popup.deactivateFilter();
        });

        this._popup.getFilter().addEventListener('click', event => {
          this._popup.deactivatePopup();
          this._popup.deactivateFilter();
        });
    }

    //
    //MOUSE OVER LISTENERS
    _setMouseOver() {
      //EMPTY SO FAR, ADD THINGS IF NECESSARY
      //IF NOTHING NEEDS TO BE ADDED, DELETE THIS FUNCTION AND ALL CALLS TO IT
    }

    //
    //INPUT CHANGE LISTENERS
    _setInput() {
      this._toolBox.getColorBox().addEventListener('input', event => {
        this._currentColor = event.target.value;
      })
    }

    //
    //EVENT LISTENERS FOR DRAWING ON GRID
    _controlDrawing() {
      //IF USER PRESSES MOUSE WHILE OVER GRID, FILL PIXELS
      this._grid.getPixels().forEach(pixel => {
        pixel.addEventListener('mousedown', event => {

          if(this._draw || this._erase) {
            this._grid.fillPixel(pixel.firstChild.id, this._currentColor);
          }


          if (this._draw && !this._erase){
            this._grid.markAsFilled(pixel.firstChild.id);
          }
          else if(!this._draw && this._erase) {
            this._grid.markAsEmpty(pixel.firstChild.id);
          }

        });
      });

      //IF USER MOVES MOUSE OVER GRID WHILE _isMouseDown TRUE, FILL PIXELS
      this._grid.getPixels().forEach(pixel => {
        pixel.addEventListener('mouseover', event => {

            if(this._isMouseDown)
            {
              if(this._draw || this._erase) {
                this._grid.fillPixel(pixel.firstChild.id, this._currentColor);
              }

              if (this._draw && !this._erase){
                this._grid.markAsFilled(pixel.firstChild.id);
              }
              else if(!this._draw && this._erase) {
                this._grid.markAsEmpty(pixel.firstChild.id);
              }
            }
        });
      });

    }
}
