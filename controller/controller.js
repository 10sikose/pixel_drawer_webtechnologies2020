import { COLORS, MESSAGES } from '../shared/shared.js';

/*
THIS IS THE MAIN CONTROLLER
IT WILL COORDINATE THE WORKFLOW OF THE APP
ALL EVENT LISTENERS GO HERE

*/

export default class Controller {
    constructor(gridView, toolBoxView, thumbnailView, messageView, saveModel) {
        this._grid = gridView;
        this._toolBox = toolBoxView;
        this._thumbnails = thumbnailView;
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
        this._activateIsMouseDownListeners();
        this._manageToolBoxHeader();
        this._manageDrawButton();
        this._manageEraseButton();
        this._manageSaveButton();
        this._manageDownloadButtons();
        this._managePrevButton();
        this._manageHelpButton();
        this._manageClearButton();
        this._managePopupFilter();
        this._manageColor();
        this._manageThumbnails();

    }




    //Saves a empty pixelMap to the DB
    _initFirstPixelMap() {
        //Wait 500 msec to be sure that DB is created
        setTimeout(() => {
            this._autoSave(this._saveModel._generatePixelMap(this._grid));
        }, 500);

    }
    // Add event listeners to the thumbnails boxes
    _manageThumbnails() {
      let contr = this;
      let dragging = null;

            // Begin the Dragging Process
            function handleDragStart(e) {
              this.style.opacity = '0.5';

              // Copy reference to Box being Dragged
              dragging = this;

              // Propagate the current contents of dragged box
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/html', this.innerHTML);
            }

            // Handle Drag End
            function handleDragEnd(e) {
              this.style.opacity = '1';

              // Reset Box States back to normal
              thumbs.forEach(function(thumb) {
                if(thumb.nodeName == 'DIV'){
                  thumb.classList.remove('over');
                }

            });
            }

            // Handle box overlap while dragging
            function handleDragOver(e) {
              // If we just drag the the thumbnail over something the event should
              // be propagated further and the default action (ening the drag) should
              // be prevented
              if (e.preventDefault) {
                e.preventDefault();
              }
              // Propagate Data of dragged Box
              e.dataTransfer.dropEffect = 'move';
              return false;
            }

            // Handle boxes starting to overlap while dragging
            function handleDragEnter(e) {
              this.classList.add('over');
              return false;
            }

            // Handle boxes stopping to overlap while dragging
            function handleDragLeave(e) {
              this.classList.remove('over');
            }

            // Complete Box Drop
            function handleDrop(e) {
                // Stop event propagation
                  e.stopPropagation();

                // If element is draged to different slot than self
                if (dragging != this) {

                  //swap thumbnail box contens
                  dragging.innerHTML = this.innerHTML;
                  this.innerHTML = e.dataTransfer.getData('text/html');
                  dragging.style.opacity = '1';

                // Re-Add Event listener for the download Buttons of the swaped thumbnails
                this.firstElementChild.addEventListener('click', event => {

                if(this.lastElementChild.src.match(".*(empty\.png)$")) {
                  contr._popup.activateFilter();
                  contr._popup.setMessage(MESSAGES.emptySave);
                  contr._popup.activatePopup();
                }
                else {
                  let downloadLink = document.createElement('a');
                  let ev;
                  downloadLink.href = this.lastElementChild.src;
                  downloadLink.download = ( 'frame.png');
                  if (document.createEvent) {
                    ev = document.createEvent("MouseEvents");
                    ev.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    downloadLink.dispatchEvent(ev);
                  } else if (downloadLink.fireEvent) {
                    downloadLink.fireEvent("onclick");
                  }
                }
                });


                dragging.firstElementChild.addEventListener('click', event => {
                if(dragging.lastElementChild.src.match(".*(empty\.png)$")) {
                  contr._popup.activateFilter();
                  contr._popup.setMessage(MESSAGES.emptySave);
                  contr._popup.activatePopup();
                }
                else {
                  let downloadLink = document.createElement('a');
                  let ev;
                  downloadLink.href = dragging.lastElementChild.src;
                  downloadLink.download = ( 'frame.png');
                  if (document.createEvent) {
                    ev = document.createEvent("MouseEvents");
                    ev.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    downloadLink.dispatchEvent(ev);
                  } else if (downloadLink.fireEvent) {
                    downloadLink.fireEvent("onclick");
                  }
                }
                });
                }
                return false;
              }

            // Add event listeners for DnD grid
            let thumbs = this._thumbnails.getContainer().childNodes;
            thumbs.forEach(function(thumb) {
              if(thumb.nodeName == 'DIV'){
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

    _activateIsMouseDownListeners() {
        //IF USER PRESSES MOUSE WHILE OVER GRID, SET _isMouseDown TO TRUE
        this._grid.getPixels().forEach(pixel => {
          pixel.addEventListener('mousedown', event => {
            this._isMouseDown = true;
          });
        });

        //IF USER RELEASES MOUSE, SET _isMouseDown TO FALSE
        document.addEventListener('mouseup', event => {
          //If isMouseDown is true, this means user was changing the grad
          //auto save their progress
          if(this._isMouseDown) {
            this._autoSave(this._saveModel._generatePixelMap(this._grid));
          }

          this._isMouseDown = false;

        });

    }

    _manageToolBoxHeader() {
      //IF USER PRESSES MOUSE WHILE OVER TOOLBOX HEADER, ACTIVATE DRAGGING
      this._toolBox.getHeader().addEventListener('mousedown', event => {
        event = event || window.event;
        event.preventDefault();

        let newx = event.clientX;
        let newy = event.clientY;

        const dragElement = e => {
          e = e || window.event;
          // Propagate Event
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

        document.onmouseup = function(){
          document.onmouseup = null;
          document.onmousemove = null
        }

        document.onmousemove = dragElement;
      });
    }

    _manageDrawButton() {
      //IF USER PRESSES DRAW BUTTON, ACTIVATE DRAWING MODE
      this._toolBox.getDrawButton().addEventListener('click', event => {
        this._draw = true;
        this._currentColor = this._toolBox.getColorBox().value;
        this._erase = false;
        this._toolBox.markPressed(this._toolBox.getDrawButton().id);
      });
    }

    _manageEraseButton() {
      //IF USER PRESSES ERASE BUTTON, ACTIVATE ERASE MODE
      this._toolBox.getEraser().addEventListener('click', event => {
        this._draw = false;
        this._currentColor = COLORS.empty;
        this._erase = true;
        this._toolBox.markPressed(this._toolBox.getEraser().id);
      });
    }

    _manageSaveButton() {
      //MANAGES THE SAVE FUNCTIONALITY
      this._toolBox.getSaveButton().addEventListener('click', event => {
        //determine if user wants cropped or uncropped image
        let uncropped = this._grid.getSaveUncropped();

        //If grid empty, warn user with popup message
        if(this._grid.isGridEmpty()) {
          this._popup.activateFilter();
          this._popup.setMessage(MESSAGES.emptySave);
          this._popup.activatePopup();
        }
        //Else convert image to png and save it in thumbnail container
        else {
          let img = this._saveModel.downloadPicture(this._grid.getGridRoot(), uncropped);
          let downloadLink = document.createElement('a'), ev;

          //shift previously saved images to the right
          //most recent image always occupies the leftmost thumbnail
          this._thumbnails.shiftRight();

          this._thumbnails.setNewThumbnail(img);

        }
      });
    }

    _manageDownloadButtons() {
      //IF USER CLICKS TOOLBOX DOWNLOAD ICON, DOWNLOAD THE GRID IMAGE
      this._toolBox.getDownloadButton().addEventListener('click', event => {
        //determine if user wants cropped or uncropped image
        let uncropped = this._grid.getSaveUncropped();

        //If grid empty, warn user with popup message
        if(this._grid.isGridEmpty()) {
          this._popup.activateFilter();
          this._popup.setMessage(MESSAGES.emptySave);
          this._popup.activatePopup();
        }
        //else convert image to png and commence download
        else {
          let img = this._saveModel.downloadPicture(this._grid.getGridRoot(), uncropped);
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

      //IF USER PRESSES A THUMBNAIL'S DOWNLOAD ICON, DOWNLOADS THE IMAGE
      let thumbs = this._thumbnails.getContainer().childNodes;
      for(let i = 1; i<thumbs.length; i+=2)
        thumbs[i].firstElementChild.addEventListener('click', event => {

        //If thumbnail empty, warn user with popup message
        if(thumbs[i].lastElementChild.src.match(".*(empty\.png)$")) {
          this._popup.activateFilter();
          this._popup.setMessage(MESSAGES.emptySave);
          this._popup.activatePopup();
        }
        //else commence download
        else {

          let downloadLink = document.createElement('a');
          let ev;
          downloadLink.href = thumbs[i].lastElementChild.src;

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
    }

    _manageClearButton() {
      //IF USER PRESSES CLEAR BUTTON, RESETS THE GRID
      this._toolBox.getClearButton().addEventListener('click', event => {
        this._isMouseDown = false;

        this._grid.getPixels().forEach(pixel => {

          //To reset the grid, we need to fill each pixel with the empty color (default color of grid)
          //and then mark them as empty
          this._grid.fillPixel(pixel.firstChild.id, COLORS.empty);
          this._grid.markAsEmpty(pixel.firstChild.id);


        });
      });
    }

    _managePrevButton() {
      //IF USER PRESSES UNDO BUTTON, RESETS LATEST CHANGE(S)
      this._toolBox.getPrevButton().addEventListener('click', event => {

        this._getPrevPixel();

      });
    }

    _manageHelpButton() {
      //IF USER PRESSES HELP BUTTON, A HELPFUL POPUP MESSAGE APPEARS
      this._toolBox.getHelpButton().addEventListener('click', event => {
        this._toolBox.markPressed(this._toolBox.getHelpButton().id);

        this._popup.activateFilter();
        this._popup.setMessage(MESSAGES.drawHelp + MESSAGES.colorHelp
          + MESSAGES.prevHelp + MESSAGES.eraseHelp + MESSAGES.saveHelp
          + MESSAGES.downloadHelp + MESSAGES.clearHelp);
        this._popup.activatePopup();
      });
    }

    _managePopupFilter() {

        //callback for event listeners below
        const turnOffFilter = event => {
          this._popup.deactivatePopup();
          this._popup.deactivateFilter();
          if(this._draw) {
            this._toolBox.markPressed(this._toolBox.getDrawButton().id);
          }
          else {
            this._toolBox.markPressed(this._toolBox.getEraser().id);
          }
        }

        //Following two event listeners hide the popup
        this._popup.getPopupClose().addEventListener('click', turnOffFilter);

        this._popup.getFilter().addEventListener('click', turnOffFilter);

    }


    _manageColor() {
      //SETS this._currentColor WHENEVER USERS PICKS A NEW COLOR
      this._toolBox.getColorBox().addEventListener('input', event => {
        this._currentColor = event.target.value;

        //if user picks a new color, it is implied he wants to draw again
        //set draw to true and erase to false
        this._draw = true;
        this._erase = false;
        this._toolBox.markPressed(this._toolBox.getDrawButton().id);
      })
    }

    //
    //EVENT LISTENERS FOR DRAWING ON GRID (DRAW + ERASE)
    _controlDrawing() {
      //IF USER PRESSES MOUSE WHILE OVER GRID, FILL PIXELS
      this._grid.getPixels().forEach(pixel => {
        pixel.addEventListener('mousedown', event => {
          //If erase is true, set color to empty
          if(this._erase)
            this._currentColor = COLORS.empty;

          if(this._draw || this._erase) {
            this._grid.fillPixel(pixel.firstChild.id, this._currentColor);
          }

          //If draw is true and erase false, mark pixel as filled
          if (this._draw && !this._erase){
            this._grid.markAsFilled(pixel.firstChild.id);
          }
          //if erase is true and draw false, mark pixel as empty
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
              //If draw is true and erase false, mark pixel as filled
              if (this._draw && !this._erase){
                this._grid.markAsFilled(pixel.firstChild.id);
              }
              //if erase is true and draw false, mark pixel as empty
              else if(!this._draw && this._erase) {
                this._grid.markAsEmpty(pixel.firstChild.id);
              }
            }
        });
      });

    }
}
