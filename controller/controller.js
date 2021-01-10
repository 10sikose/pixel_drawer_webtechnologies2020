import { COLORS } from '../shared/shared.js';

/*
THIS IS THE MAIN CONTROLLER
IT WILL COORDINATE THE WORKFLOW OF THE APP
ALL EVENT LISTENERS GO HERE

*/

export default class Controller {
    constructor(gridView, toolBoxView, saveModel) {
        this._grid = gridView;
        this._toolBox = toolBoxView;
        this._saveModel = saveModel;
        this._isMouseDown = false;
        this._erase = false;
        this._currentColor = COLORS.black;
        this._addEventListeners();
    }

    _addEventListeners() {
        this._controlDrawing();
        this._setMouseDown();
        this._setMouseUp();
        this._setMouseClick();
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

        this._toolBox.getEraser().addEventListener('click', event => {
          this._currentColor = COLORS.empty;
          this._erase = true;
        })

        this._toolBox.getSaveButton().addEventListener('click', event => {
          this._saveModel.savePicture(this._grid.getGridRoot());
        });
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
  
          this._grid.fillPixel(pixel.firstChild.id, this._currentColor);
    
          if (!this._erase){
            this._grid.markAsFilled(pixel.firstChild.id);
          }
          else {
            this._grid.markAsEmpty(pixel.firstChild.id);
          }

        });
      });

      //IF USER MOVES MOUSE OVER GRID WHILE _isMouseDown TRUE, FILL PIXELS
      this._grid.getPixels().forEach(pixel => {
        pixel.addEventListener('mouseover', event => {

            if(this._isMouseDown)
            {
              this._grid.fillPixel(pixel.firstChild.id, this._currentColor);

              if (!this._erase){
                this._grid.markAsFilled(pixel.firstChild.id);
              }
              else {
                this._grid.markAsEmpty(pixel.firstChild.id);
              }
            }
        });
      });

    }
}