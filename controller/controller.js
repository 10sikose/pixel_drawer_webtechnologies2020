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
        this._sendData = new Object();
        this._registerWorker();
        this._actualGridStep = new Object();
        this._actualGridStep.timestamp = Date.now();
    }

    _addEventListeners() {
        this._controlDrawing();
        this._setMouseDown();
        this._setMouseUp();
        this._setMouseClick();
        this._setMouseOver();
        this._setInput();
    }

    _registerWorker() {

        //Create Worker
        if (typeof (w) == "undefined") {
            this._worker = new Worker("./model/worker.js");
        }

        //Caller from Worker when transmitting Data
        this._worker.onmessage = event => {

            console.log("Recieved Data from Worker");
            console.log(event.data.timestamp);
            console.log(event.data.prev_timestamp);
            console.log(event.data.pixelMap);


            this._actualGridStep = event.data;
            this._redrawGrid(this._actualGridStep.pixelMap);
            this._toolBox.markPressed(this._toolBox.getDrawButton().id);

        };
    }

    _redrawGrid(data) {

        let i = 0;

        this._grid.getPixels().forEach(pixel => {

            if(data[i+4] == 1) {
                this._grid.markAsFilled(pixel.firstChild.id);
                this._grid.fillPixel(pixel.firstChild.id, this._RGBAToHexA(data[i], data[i + 1], data[i + 2], data[i + 3]));
            }else{
                this._grid.markAsEmpty(pixel.firstChild.id);
                this._grid.fillPixel(pixel.firstChild.id, COLORS.empty);



            }

            i=i+5;

        });

    }

    _clearHistory(){

        this._sendData.command = "CLEAR";
        this._worker.postMessage(this._sendData);
}

    _autoSave(buff){



        this._sendData.command = "ADD";
        this._sendData.pixelMap = buff;
        this._sendData.timestamp = Date.now();
        this._sendData.prev_timestamp = this._actualGridStep.timestamp;
        this._worker.postMessage(this._sendData);

        this._sendData.command = "GET_ACTUAL";
        this._worker.postMessage(this._sendData);


    }

    _getPrevPixel(){

        this._sendData.command = "GET_PREV";
        this._sendData.timestamp = this._actualGridStep.timestamp;
        this._sendData.prev_timestamp = this._actualGridStep.prev_timestamp;

        this._worker.postMessage(this._sendData);

    }

    _RGBAToHexA(r,g,b,a) {
        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);
        a = a.toString(16);

        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;
        if (a.length == 1)
            a = "0" + a;

        return "#" + r + g + b + a;
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

        this._grid.getGridRoot().addEventListener('mouseup',event =>{

            this._autoSave(this._saveModel._generatePixelMap(this._grid));
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
          let uncropped = this._grid.getSaveUncropped();

          if(this._grid.isGridEmpty()) {
            this._popup.activateFilter();
            this._popup.setMessage(MESSAGES.emptySave);
            this._popup.activatePopup();
          }
          else {
            this._saveModel.savePicture(this._grid.getGridRoot(), uncropped);
          }

        });
        ////////////////// DOWNLOAD ////////////////////////////////////////
        this._toolBox.getDownloadButton().addEventListener('click', event => {
          this._draw = false;
          this._erase = false;
          let uncropped = this._grid.getSaveUncropped();

          if(this._grid.isGridEmpty()) {
            this._popup.activateFilter();
            this._popup.setMessage(MESSAGES.emptySave);
            this._popup.activatePopup();
          }
          else {
            let img = this._saveModel.downloadPicture(this._grid.getGridRoot(), uncropped);
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

        ////////////////// CLEAR ////////////////////////////////////////
        this._toolBox.getClearButton().addEventListener('click', event => {
          this._isMouseDown = false;
          this._draw = true;
          this._erase = false;
          this._currentColor = COLORS.black;

          this._grid.getPixels().forEach(pixel => {

                this._grid.fillPixel(pixel.firstChild.id, COLORS.empty);
                this._grid.markAsEmpty(pixel.firstChild.id);


          });
        });
        ////////////////// CLEAR ////////////////////////////////////////

        ////////////////// PREV ////////////////////////////////////////
        this._toolBox.getPrevButton().addEventListener('click', event => {
            this._getPrevPixel();

        });

        ////////////////// PREV ////////////////////////////////////////

        ////////////////// HELP ////////////////////////////////////////

        this._toolBox.getHelpButton().addEventListener('click', event => {
          this._popup.activateFilter();
          this._popup.setMessage(MESSAGES.drawHelp + MESSAGES.colorHelp
            + MESSAGES.prevHelp + MESSAGES.eraseHelp + MESSAGES.saveHelp
            + MESSAGES.downloadHelp + MESSAGES.clearHelp);
          this._popup.activatePopup();
        });
        ////////////////// HELP ////////////////////////////////////////




        this._toolBox.getToolBoxIcons().forEach(icon => {
          icon.addEventListener('click', event => {
            this._toolBox.markPressed(icon.id);
          });
        });

        //Following two event listeners hide the popup
        this._popup.getPopupClose().addEventListener('click', event => {
          this._popup.deactivatePopup();
          this._popup.deactivateFilter();
          this._toolBox.markPressed(this._toolBox.getDrawButton().id);
        });

        this._popup.getFilter().addEventListener('click', event => {
          this._popup.deactivatePopup();
          this._popup.deactivateFilter();
          this._draw = true;
          this._toolBox.markPressed(this._toolBox.getDrawButton().id);
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
          if(this._erase)
            this._currentColor = COLORS.empty;

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
