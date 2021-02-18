import GridView from './view/gridView.js';
import Controller from './controller/controller.js';
import ToolBoxView from './view/toolboxView.js';
import SaveModel from './model/saveModel.js';
import MessageView from './view/messageView.js';
import ThumbnailView from './view/thumbnailView.js';

// Create new Controller object
let gridController = new Controller(new GridView(), new ToolBoxView(), new ThumbnailView(), new MessageView(), new SaveModel());
