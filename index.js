let svgNamespace = "http://www.w3.org/2000/svg";

let canvas = document.getElementById("canvas");

const GRID_WIDTH = 100;
const GRID_HEIGHT = 100;

for(let w = 0; w < GRID_WIDTH; w++)
{
    let row = document.createElement("div");
    row.classList.add("row")
    canvas.appendChild(row);
}

document.querySelectorAll(".row").forEach(row => {

    for(let h = 0; h < GRID_HEIGHT; h++)
    {
        let svg = document.createElementNS(
            svgNamespace, "svg"
        );

        svg.style.width = 15;
        svg.style.height = 15;

        let pixel = document.createElementNS(
            svgNamespace, "rect"
        );

        pixel.setAttribute('width',15);
        pixel.setAttribute('height',15);
        pixel.setAttribute('fill', 'none');
        pixel.setAttribute('stroke', '#646464');
        pixel.setAttribute('overflow', 'visible');
        svg.classList.add('pixel');

        svg.appendChild(pixel);

        row.appendChild(svg);

    }
});


document.querySelectorAll('.pixel').forEach(item => {
  item.addEventListener('click', event => {
    let interior = item.firstChild;
    
    if(interior.getAttribute('fill') == 'none')
    {
      interior.setAttribute('fill', 'red');    
    }
    else
    {
      interior.setAttribute('fill', 'none');
    }   
  });
});
