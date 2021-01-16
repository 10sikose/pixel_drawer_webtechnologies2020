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
        this._initFirstPixelMap();


    }

    _addEventListeners() {
        this._controlDrawing();
        this._setMouseDown();
        this._setMouseUp();
        this._setMouseClick();
        this._setMouseOver();
        this._setInput();
        this._manageThumbnails();

    }

/*
    function handleDragStart(e) {
        this.style.opacity = '0.4';
      }

      function handleDragEnd(e) {
        this.style.opacity = '1';
      }

      let items = document.querySelectorAll('.container .box');
      items.forEach(function(item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragend', handleDragEnd, false);
      });
*/


//Saves a empty pixelMap to the DB
_initFirstPixelMap(){
    //Wait 500 msec to be sure that DB is created
    setTimeout(() => {
        this._autoSave(this._saveModel._generatePixelMap(this._grid));
    }, 500);

}

_manageThumbnails(){

  let dragging = null;

        function handleDragStart(e) {
          this.style.opacity = '0.5';

          dragging = this;

        //  console.log(":Picker Up :");

          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/html', this.innerHTML);
        //  console.log(e.dataTransfer.getData('text/html'));
        }


        function handleDragEnd(e) {
          this.style.opacity = '1';

          thumbs.forEach(function(thumb) {
            if(thumb.nodeName == 'DIV'){
              thumb.classList.remove('over');
            }

        });
        }

        function handleDragOver(e) {
          //????
          if (e.preventDefault) {
            e.preventDefault();
          }

          e.dataTransfer.dropEffect = 'move';

          return false;
        }

        function handleDragEnter(e) {
          this.classList.add('over');
          return false;
        }

        function handleDragLeave(e) {
          this.classList.remove('over');
        }


          function handleDrop(e) {
              e.stopPropagation();

            //console.log(":Drop:");
            if (dragging != this) {

            //  console.log(e.dataTransfer.getData('text/html'));
              dragging.innerHTML = this.innerHTML; //swap thumbnails
              this.innerHTML = e.dataTransfer.getData('text/html');
              dragging.style.opacity = '1';
            }

            return false;
          }

        let thumbs = this._grid.getThumbnailContainer().childNodes;
        //console.log(thumbs);
        thumbs.forEach(function(thumb) {
          if(thumb.nodeName == 'DIV'){
          //  console.log(thumb.firstChild.id);
            thumb.addEventListener('dragstart', handleDragStart, false);
            thumb.addEventListener('dragenter', handleDragEnter, false);
            thumb.addEventListener('dragover', handleDragOver, false);
            thumb.addEventListener('dragleave', handleDragLeave, false);
            thumb.addEventListener('drop', handleDrop, false);
            thumb.addEventListener('dragend', handleDragEnd, false);

          }

        });

}
    //register the web worker
    _registerWorker() {

        //Create Worker, check if already created
        if (typeof (this._worker) == "undefined") {
            this._worker = new Worker("./model/worker.js");
        }

        //Callback when messages received from web worker
        this._worker.onmessage = event => {

            //Update the GridStep with the latest from the DB
            this._actualGridStep = event.data;
            //redraw grid with the latest pixelMap
            this._redrawGrid(this._actualGridStep.pixelMap);

        };
    }

    _redrawGrid(data) {

        let i = 0;
        //iterate over each pixel on the grid
        this._grid.getPixels().forEach(pixel => {

            //check if the actual pixel in the pixelMap is empty or filled
            if(data[i+4] == 1) {

                //if filled, mark pixel grid as filled
                this._grid.markAsFilled(pixel.firstChild.id);
                //fill pixel on grid with the color from the pixel in the pixelMap (rgba -> is needed)
                this._grid.fillPixel(pixel.firstChild.id, this._rgbaToHex(data[i], data[i + 1], data[i + 2], data[i + 3]));
            }else{
                //if empty, mark as empty
                this._grid.markAsEmpty(pixel.firstChild.id);
                //fill pixel on the grid with the defined color for empty pixels
                this._grid.fillPixel(pixel.firstChild.id, COLORS.empty);

            }

            i=i+5;

        });

    }

    //clear the DB
    _clearHistory(){

        this._sendData.command = "CLEAR";
        this._worker.postMessage(this._sendData);

}

    //saves the actual pixels on the grid to the DB
    _autoSave(buff){

        //build sendData Object
        //Define command for the DB worker
        this._sendData.command = "ADD";
        //update pixelMap with actual buffer(pixels on grid)
        this._sendData.pixelMap = buff;
        //set timestamp to now
        this._sendData.timestamp = Date.now();
        //set prev_timestamp to the timestamp of last gridStep
        this._sendData.prev_timestamp = this._actualGridStep.timestamp;
        //send object to worker
        this._worker.postMessage(this._sendData);

        //Set command to get last saved gridStep
        this._sendData.command = "GET_ACTUAL";
        //send object to worker
        this._worker.postMessage(this._sendData);


    }

    _getPrevPixel(){

        //build sendData Object
        //Define command for the DB worker
        this._sendData.command = "GET_PREV";
        //set timestamp to timestamp of the actual gridStep
        this._sendData.timestamp = this._actualGridStep.timestamp;
        //set prev_timestamp to prev_timestamp of the actual gridStep
        this._sendData.prev_timestamp = this._actualGridStep.prev_timestamp;
        //send object to worker
        this._worker.postMessage(this._sendData);

    }

    //Converts the red,green,blue,alpha to HEX
    _rgbaToHex(red,green,blue,alpha) {
        red = red.toString(16);
        green = green.toString(16);
        blue = blue.toString(16);
        alpha = alpha.toString(16);

        if (red.length == 1)
            red = "0" + red;
        if (green.length == 1)
            green = "0" + green;
        if (blue.length == 1)
            blue = "0" + blue;
        if (alpha.length == 1)
            alpha = "0" + alpha;

        return "#" + red + green + blue + alpha;
    }

    //
    //MOUSE DOWN LISTENERS
    _setMouseDown() {
        //IF USER PRESSES MOUSE WHILE OVER GRID, SET _isMouseDown TO TRUE
        this._grid.getPixels().forEach(pixel => {
          pixel.addEventListener('mousedown', event => {
            this._isMouseDown = true;
          });
        })

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
          if(this._isMouseDown) {
            this._autoSave(this._saveModel._generatePixelMap(this._grid));
          }

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
          this._toolBox.markPressed(this._toolBox.getDrawButton().id);
        });

        this._toolBox.getEraser().addEventListener('click', event => {
          this._draw = false;
          this._currentColor = COLORS.empty;
          this._erase = true;
          this._toolBox.markPressed(this._toolBox.getEraser().id);
        })

        this._toolBox.getSaveButton().addEventListener('click', event => {
          this._draw = false;
          this._erase = false;
          this._toolBox.markPressed(this._toolBox.getSaveButton().id);
          let uncropped = this._grid.getSaveUncropped();

          if(this._grid.isGridEmpty()) {
            this._popup.activateFilter();
            this._popup.setMessage(MESSAGES.emptySave);
            this._popup.activatePopup();
          }
          else {
            //TODO: SET SAVE CAP TO 5

            let img = this._saveModel.downloadPicture(this._grid.getGridRoot(), uncropped);
            let downloadLink = document.createElement('a'), ev;

            let thumbs = this._grid.getThumbnailContainer().childNodes;
            console.log(thumbs[1].lastElementChild.src);
            let before = thumbs[1].lastElementChild.src;
            let b_width = thumbs[1].lastElementChild.style.width;
            let b_height = thumbs[1].lastElementChild.style.height;

            for(let i = 3; i<thumbs.length; i+=2){
              if(thumbs[i].nodeName == 'DIV'){
                //console.log(thumb.firstChild.src);
                let inter = thumbs[i].lastElementChild.src;
                let i_width = thumbs[i].lastElementChild.style.width;
                let i_height = thumbs[i].lastElementChild.style.height;

              //  thumbs[i].firstChild.style.width = b_width;
              //  thumbs[i].firstChild.style.height = b_height;
                thumbs[i].lastElementChild.src = before;


                before = inter;
            //    b_width = i_width;
              //  b_height = i_height;
              }
            }


          //  thumbs[1].firstChild.style.width = '330px';
          //  thumbs[1].firstChild.style.height = 'auto';



            thumbs[1].lastElementChild.src = img;

            this._draw = true;
            this._toolBox.markPressed(this._toolBox.getDrawButton().id);


          }

        });
        ////////////////// DOWNLOAD ////////////////////////////////////////
        this._toolBox.getDownloadButton().addEventListener('click', event => {
          this._draw = false;
          this._erase = false;
          this._toolBox.markPressed(this._toolBox.getDownloadButton().id);
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

          this._draw = true;
          this._toolBox.markPressed(this._toolBox.getDrawButton().id);

        });

        let thumbs = this._grid.getThumbnailContainer().childNodes;
        for(let i = 1; i<thumbs.length; i+=2)
          thumbs[i].firstElementChild.addEventListener('click', event => {
          console.log(thumbs[i].lastElementChild.src);

          if(thumbs[i].lastElementChild.src.match(".*(empty\.png)$")) {
            this._popup.activateFilter();
            this._popup.setMessage(MESSAGES.emptySave);
            this._popup.activatePopup();
          }
          else {

            //console.log("Inside Controllers");
            let downloadLink = document.createElement('a'), ev;
            //console.log(thumbs[i].lastElementChild.src);
            downloadLink.href = thumbs[i].lastElementChild.src;
            //console.log(downloadLink.href);

            downloadLink.download = (Math.floor(i/2) + 1).toString() + '.png';

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
          this._draw = false;
          this._erase = false;
          this._toolBox.markPressed(this._toolBox.getClearButton().id);

          this._grid.getPixels().forEach(pixel => {

                this._grid.fillPixel(pixel.firstChild.id, COLORS.empty);
                this._grid.markAsEmpty(pixel.firstChild.id);


          });

          this._draw = true;

          this._toolBox.markPressed(this._toolBox.getDrawButton().id);
        });
        ////////////////// CLEAR ////////////////////////////////////////

        ////////////////// PREV ////////////////////////////////////////
        this._toolBox.getPrevButton().addEventListener('click', event => {
            this._draw = false;
            this._erase = false;
            this._toolBox.markPressed(this._toolBox.getPrevButton().id);
            this._getPrevPixel();

            this._draw = true;
            this._toolBox.markPressed(this._toolBox.getDrawButton().id);

        });

        ////////////////// PREV ////////////////////////////////////////

        ////////////////// HELP ////////////////////////////////////////

        this._toolBox.getHelpButton().addEventListener('click', event => {
          this._draw = false;
          this._erase = false;
          this._toolBox.markPressed(this._toolBox.getHelpButton().id);

          this._popup.activateFilter();
          this._popup.setMessage(MESSAGES.drawHelp + MESSAGES.colorHelp
            + MESSAGES.prevHelp + MESSAGES.eraseHelp + MESSAGES.saveHelp
            + MESSAGES.downloadHelp + MESSAGES.clearHelp);
          this._popup.activatePopup();
        });
        ////////////////// HELP ////////////////////////////////////////

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
