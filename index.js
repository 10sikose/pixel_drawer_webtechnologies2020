const GRID_WIDTH = 45;
const GRID_HEIGHT = 70;
//NOTE: THE PIXEL DIMENSIONS DEPEND ON CSS RULES
const PIXEL_WIDTH = 15;
const PIXEL_HEIGHT = 15;
const MAX_ALPHA = 255;

let current_color = '#ffffff';
let empty_color = '#44475a';
let erase = false;
let is_mouse_down = false;

let svgNamespace = "http://www.w3.org/2000/svg";

let canvas = document.getElementById('canvas');

for(let w = 0; w < GRID_WIDTH; w++)
{
    let row = document.createElement('div');
    row.classList.add('row')
    canvas.appendChild(row);
}

document.querySelectorAll('.row').forEach(row => {

    for(let h = 0; h < GRID_HEIGHT; h++)
    {
        let svg = document.createElementNS(
            svgNamespace, 'svg'
        );

        let pixel = document.createElementNS(
            svgNamespace, 'rect'
        );

        pixel.classList.add('interior');
        pixel.classList.add('empty');

        svg.classList.add('pixel');

        svg.appendChild(pixel);

        row.appendChild(svg);

    }
});


document.querySelectorAll('.pixel').forEach(item => {
  item.addEventListener('mousedown', event => {
    let interior = item.firstChild;

    /*
    if(interior.classList.contains('empty'))
    {*/
      interior.style.fill = current_color;
      if (!erase){
      interior.classList.add('filled');
      interior.classList.remove('empty');
      }
      else {
        interior.classList.add('empty');
        interior.classList.remove('filled');
      }
      //console.log(interior);
    /*    }

    else
    {
      interior.style.fill = 'white';
      interior.classList.remove('filled');
      interior.classList.add('empty');

    }
    */
  });

  item.addEventListener('mouseover', event => {
    let interior = item.firstChild;

    if(is_mouse_down /*&& interior.classList.contains('empty')*/)
    {
      interior.style.fill = current_color;
      if (!erase){
      interior.classList.add('filled');
      interior.classList.remove('empty');
      }
      else {
        interior.classList.add('empty');
        interior.classList.remove('filled');
      }
    }
  });
});

document.querySelector('#canvas').addEventListener('mousedown', event => {
  is_mouse_down = true;
});

document.addEventListener('mouseup', event => {
  is_mouse_down = false;
});

document.querySelector('#save-button').addEventListener('click', event => {
  let top = -1;
  let bottom = -1;
  let left = -1;
  let right = -1;

  let canvas = document.querySelectorAll('.row');

  for(let i = 0; i < canvas.length; i++)
  {
    let row = canvas[i].childNodes;
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

/////////////////////////////////////////////////////////////////////
// create file - TODO: The final canvas does not save the image correctly not sure why
// the context data is fine but in the end I get an empty file

  //console.log("Left: " + left);
  //console.log("Right: " + right);
  //console.log("Bottom: " + bottom);
  //console.log("Top: " + top);
  let w = (right - left + 1) * 15;
  let h = (bottom - top + 1) * 15;
  
  //console.log("Width: " + w);
  //console.log("Height: " + h);

  let buff = new Uint8ClampedArray(w * h * 4);

  let curr_w = 0;
  let curr_h = 0;

  for(let pix = 0; pix < buff.length; pix += 4)
  {
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;

    let col_index = left + Math.floor(curr_w / PIXEL_WIDTH);
    let row_index = top + Math.floor(curr_h / PIXEL_HEIGHT);

    let curr_svg = canvas[row_index].childNodes[col_index].firstChild;
    
    //console.log(curr_svg);
    //console.log(curr_w);

    if(curr_svg.classList.contains('filled'))
    {
      //console.log("Filled");
      let rgb = curr_svg.style.fill;

      rgb = rgb.substring(4,rgb.length-1);
      rgb = rgb.replace(" ", "");
      rgb = rgb.replace(" ", "");
      rgb = rgb.split(',');

      r = (+rgb[0]);
      g = (+rgb[1]);
      b = (+rgb[2]);
      a = MAX_ALPHA;
    }

    buff[pix] = r;
    buff[pix + 1] = g;
    buff[pix + 2] = b;
    buff[pix + 3] = a;
    
    curr_w++;

    if(curr_w == w)
    {
      curr_w = 0;
      curr_h++;
    }

    if(curr_h == h)
    {
      break;
    }

  }

  let cnvas = document.createElement('canvas'),
  ctx = cnvas.getContext('2d');

  cnvas.width = w;
  cnvas.height = h;
//  var imgData = ctx.createImageData(w, h);
  console.log(buff);
  let imgData = new ImageData(buff, w, h);
  //console.log(imgData);
  ctx.putImageData(imgData,0,0);
  let dataUri = cnvas.toDataURL();
  console.log(dataUri);

});


////////////////////////////////////////////////////////////////////////////////
//////////////// Toolbox
////////////////////////////////////////////////////////////////////////////////

let color_arr = ['#9900cc', '#0000cc', '#00ccff',
                 '#ff00ff', '#ff3399', '#993333',
                 '#ff3300', '#ff9900', '#ffff00',
                 '#99ff33', '#339933', '#666699',
                 '#ffffff', '#000000', '#660066',];

let colorbox = document.getElementById("colorbox");
for(let idx = 0; idx<color_arr.length; idx++)
{
  let button = document.createElement('button');
  button.classList.add('color');
  button.style.background = color_arr[idx];
  button.style.width = '20px';
  button.style.height = '20px';
  button.style.border = '1px solid ' + color_arr[idx];

  colorbox.appendChild(button);
}

let toolbox = document.getElementById("toolbox");
let oldx = 0;
let oldy = 0;
let newx = 0;
let newy = 0;

document.getElementById("toolboxheader").onmousedown = dragMouse;

function dragElement(evnt) {
 evnt=evnt|| window.event;
 evnt.preventDefault();
  // calculate the new cursor position:
  oldx = newx -evnt.clientX;
  oldy = newy -evnt.clientY;
  newx =evnt.clientX;
  newy =evnt.clientY;
  // set the element's new position:
  toolbox.style.top = (toolbox.offsetTop - oldy) + "px";
  toolbox.style.left = (toolbox.offsetLeft - oldx) + "px";
}

function dragMouse(evnt)
{
 evnt=evnt|| window.event;
 evnt.preventDefault();
  newx =evnt.clientX;
  newy =evnt.clientY;
  document.onmouseup = function(){document.onmouseup = null;
                                    document.onmousemove = null}

  document.onmousemove = dragElement;
}
////////////////////////////////////////////////////////////////////////////////
///// CHANGE  ---- COLOR
function rgb2Hex(rgb)
{
  rgb = rgb.substring(4,rgb.length-1);
  //
  rgb = rgb.replace(" ", "");
  rgb = rgb.replace(" ", "");
  rgb = rgb.split(',');

  r = (+rgb[0]).toString(16);
  g = (+rgb[1]).toString(16);
  b = (+rgb[2]).toString(16);

  if(r.length == 1)
    r = "0" + r;
  if(g.length == 1)
    g = "0" + g;
  if(b.length == 1)
    b = "0" + b;


  //console.log(r, g, b);


  return '#'+r+g+b;
}

let color_buttons = document.querySelectorAll(".color");
for(let i = 0; i<color_buttons.length; i++)
{
  color_buttons[i].addEventListener('click', event => {
  //  console.log(color_buttons[i].style.backgroundColor);
    if (color_arr.includes(rgb2Hex(color_buttons[i].style.backgroundColor)))
    {
      //console.log("I am in");
      current_color = color_buttons[i].style.backgroundColor;
      erase = false;
    }
    else if (color_buttons[i].id == "erase"){
      current_color = empty_color;
      erase = true;
    }
  });
}
