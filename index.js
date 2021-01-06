const GRID_WIDTH = 45;
const GRID_HEIGHT = 70;
//const EMPTY_FILL = 'rgb(255, 255, 255)';

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
        pixel.classList.add('empty');

        svg.classList.add('pixel');

        svg.appendChild(pixel);

        row.appendChild(svg);

    }
});


document.querySelectorAll('.pixel').forEach(item => {
  item.addEventListener('mousedown', event => {
    let interior = item.firstChild;
    
    if(interior.classList.contains('empty'))
    {
      interior.style.fill = current_color;
      interior.classList.add('filled');
      interior.classList.remove('empty');
    }
    else
    {
      interior.style.fill = 'white';
      interior.classList.remove('filled');
      interior.classList.add('empty');
    }   
  });

  item.addEventListener('mouseover', event => {
    let interior = item.firstChild;
    
    if(is_mouse_down && interior.classList.contains('empty'))
    {
      interior.style.fill = current_color;
      interior.classList.add('filled');
      interior.classList.remove('empty');
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

  console.log("Top: " + top);
  console.log("Leftmost: " + left);
  console.log("Bottom: " + bottom);
  console.log("Rightmost: " + right);
});
