const GRID_WIDTH = 45;
const GRID_HEIGHT = 70;
const EMPTY_FILL = 'rgb(255, 255, 255)';

let current_color = 'red';
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

        svg.classList.add('pixel');

        svg.appendChild(pixel);

        row.appendChild(svg);

    }
});


document.querySelectorAll('.pixel').forEach(item => {
  item.addEventListener('mousedown', event => {
    let interior = item.firstChild;

    let compstyle = window.getComputedStyle(interior);

    if(compstyle.getPropertyValue('fill') == EMPTY_FILL)
    {
      interior.style.fill = current_color;
    }
    else
    {
      interior.style.fill = 'white';
    }
  });

  item.addEventListener('mouseover', event => {
    let interior = item.firstChild;

    let compstyle = window.getComputedStyle(interior);

    if(is_mouse_down && compstyle.getPropertyValue('fill') == EMPTY_FILL)
    {
      interior.style.fill = current_color;
    }
  });
});

document.querySelector('#canvas').addEventListener('mousedown', event => {
  is_mouse_down = true;
});

document.addEventListener('mouseup', event => {
  is_mouse_down = false;
});




////////////////////////////////////////////////////////////////////////////////
//////////////// Toolbox
////////////////////////////////////////////////////////////////////////////////

let toolbox = document.getElementById("toolbox");
var oldx = 0;
var oldy = 0;
var newx = 0;
var newy = 0;

if(document.getElementById("toolboxheader"))
{
  document.getElementById("toolboxheader").onmousedown = function()
  {
    
  }
}
else
{

}
