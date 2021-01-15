import GridView from './view/gridView.js';
import Controller from './controller/controller.js';
import ToolBoxView from './view/toolboxView.js';
import SaveModel from './model/saveModel.js';
import MessageView from './view/messageView.js';
import ThumbnailView from './view/thumbnailView.js';

let gridController = new Controller(new GridView(), new ToolBoxView(), new MessageView(), new SaveModel());


/*
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
*/
