const GRID_WIDTH = 45;
const GRID_HEIGHT = 70;
//const EMPTY_FILL = 'rgb(255, 255, 255)';

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
  var w = right - left + 1;
  var h = bottom - top + 1;

  buff = new Uint8ClampedArray(w * h * 4);
  for(let ix=left; ix<=right; ix++)
    for(let iy=top; iy<=bottom; iy++)
    {
      r = 0;
      g = 0;
      b = 0;
      //console.log(document.querySelectorAll('.row')[iy].childNodes[ix].firstChild);
      if(document.querySelectorAll('.row')[iy].childNodes[ix].firstChild.classList.contains('filled'))
      {
      rgb = document.querySelectorAll('.row')[iy].childNodes[ix].firstChild.style.fill;
      //console.log(rgb);
      rgb = rgb.substring(4,rgb.length-1);
      //
      rgb = rgb.replace(" ", "");
      rgb = rgb.replace(" ", "");
      rgb = rgb.split(',');


      r = (+rgb[0]);
      g = (+rgb[1]);
      b = (+rgb[2]);

      }
     console.log('('+ix + ':' + ((iy-top)*w+(ix-left))*4 +  ')'+ ": "+iy+" ::: "+ r+ " - "+g+" - "+b);

      buff[((iy-top)*w+(ix-left))*4]     = r;
      buff[((iy-top)*w+(ix-left))*4 + 1] = g;
      buff[((iy-top)*w+(ix-left))*4+ 2] = b;
      buff[((iy-top)*w+(ix-left))*4 + 3] = 1.0;



    }
    var cnvas = document.createElement('canvas'),
    ctx = cnvas.getContext('2d');

    cnvas.width = w;
    cnvas.height = h;
  //  var imgData = ctx.createImageData(w, h);
  console.log(buff);
    var imgData = new ImageData(buff, w, h);
    console.log(imgData);
    ctx.putImageData(imgData,0,0);
    console.log(ctx.getImageData(0,0,w,h));
    var dataUri = cnvas.toDataURL();
    ctx2 = cnvas.getContext('2d');
    console.log(ctx2.getImageData(0,0,w,h));

    console.log(dataUri);

  console.log("Top: " + top);
  console.log("Leftmost: " + left);
  console.log("Bottom: " + bottom);
  console.log("Rightmost: " + right);


});

////////////////////////////////////////////////////////////////////////////////
//////////////// Toolbox
////////////////////////////////////////////////////////////////////////////////

var color_arr = ['#9900cc', '#0000cc', '#00ccff',
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
var oldx = 0;
var oldy = 0;
var newx = 0;
var newy = 0;

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
    }
    else if (color_buttons[i].id == "erase"){
      current_color = empty_color;
      erase = true;
    }
  });
}
