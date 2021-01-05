let svgNamespace = "http://www.w3.org/2000/svg";

let canvas = document.getElementById('canvas');

const GRID_WIDTH = 45;
const GRID_HEIGHT = 70;
const EMPTY_FILL = 'rgb(255, 255, 255)';

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
  item.addEventListener('click', event => {
    let interior = item.firstChild;

    let compstyle = window.getComputedStyle(interior);
    
    if(compstyle.getPropertyValue('fill') == EMPTY_FILL)
    {
      interior.style.fill = 'red';
    }
    else
    {
      interior.style.fill = 'white';
    }   
  });
});
