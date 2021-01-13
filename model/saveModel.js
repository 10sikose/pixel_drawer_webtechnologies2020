import { CONSTANTS } from "../shared/shared.js";

export default class SaveModel {
    constructor() {

    }

    savePicture(grid, uncropped) {
        let limits;
        if(!uncropped)
          limits = this._setLimits(grid);
        else {
          limits = {
             top: 0,
             bottom: grid.childNodes.length - 1,
             left: 0,
             right: grid.childNodes[0].childNodes.length -1
         }
        }

        this._redrawInCanvas(grid, limits);

    }

    downloadPicture(grid, uncropped){
    //  console.log("Inside SaveModel");
      let limits;
      if(!uncropped)
        limits = this._setLimits(grid);
      else {
        //console.log("Bottom:" + (grid.childNodes.length - 1));
        //console.log("right:" + (grid.childNodes[0].childNodes.length - 1));

         limits = {
            top: 0,
            bottom: grid.childNodes.length - 1,
            left: 0,
            right: grid.childNodes[0].childNodes.length -1
        }
      }
      return this._redrawInCanvas(grid, limits);


    }

    _setLimits(grid) {
        let top = -1;
        let bottom = -1;
        let left = -1;
        let right = -1;

        let rows = grid.childNodes;

        for(let i = 0; i < rows.length; i++)
        {
          let row = rows[i].childNodes;
          for(let j = 0; j < row.length; j++)
          {
            let pixel = row[j].firstChild;

            if(!pixel.classList.contains('filled'))
            {
              continue;
            }

            if(top == -1)
            {
              top = i;
            }

            bottom = i;

            if(left == -1 || j < left)
            {
              left = j;
            }

            if(j > right)
            {
              right = j;
            }

          }
        }

        const limits = {
            top: top,
            bottom: bottom,
            left: left,
            right: right
        }

        return limits;
    }

    _redrawInCanvas(grid, limits) {

        let w = (limits.right - limits.left + 1) * CONSTANTS.pixelWidth;
        let h = (limits.bottom - limits.top + 1) * CONSTANTS.pixelHeight;

        let buff = this._populateClampedArray(grid, limits, w, h);

        //TEMP SOLUTION
        let cnvas = document.createElement('canvas'),
        ctx = cnvas.getContext('2d');

        cnvas.width = w;
        cnvas.height = h;
        //  var imgData = ctx.createImageData(w, h);
        console.log(buff);
        let imgData = new ImageData(buff, w, h);

        ctx.putImageData(imgData,0,0);
        let dataUri = cnvas.toDataURL();
        console.log(dataUri);
        //console.log("I am here");
        return dataUri;
    }

    _populateClampedArray(grid, limits, width, height) {

        let buff = new Uint8ClampedArray(width * height * 4);
        let curr_w = 0;
        let curr_h = 0;

        for(let pix = 0; pix < buff.length; pix += 4)
        {
            let r = 0;
            let g = 0;
            let b = 0;
            let a = 0;

            let col_index = limits.left + Math.floor(curr_w / CONSTANTS.pixelWidth);
            let row_index = limits.top + Math.floor(curr_h / CONSTANTS.pixelHeight);

            let curr_svg = grid.childNodes[row_index].childNodes[col_index].firstChild;

            if(curr_svg.classList.contains('filled'))
            {
                let rgb = curr_svg.style.fill;

                rgb = rgb.substring(4,rgb.length-1);
                rgb = rgb.replace(" ", "");
                rgb = rgb.replace(" ", "");
                rgb = rgb.split(',');

                r = (+rgb[0]);
                g = (+rgb[1]);
                b = (+rgb[2]);
                a = CONSTANTS.maxAlpha;
            }

            buff[pix] = r;
            buff[pix + 1] = g;
            buff[pix + 2] = b;
            buff[pix + 3] = a;

            curr_w++;

            if(curr_w == width)
            {
                curr_w = 0;
                curr_h++;
            }

            if(curr_h == height)
            {
                break;
            }

        }

        return buff;
    }

}
