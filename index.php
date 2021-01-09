<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Pixel Drawer</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>

<!-- Toolbox -->
<div id="toolbox">

  <div class="constraint">
    <div id="toolboxheader">Tools</div>
    <div id="colorbox">

    </div>
    <button type="button" class="color" id="erase">ERASER</button>
    <input type="text"  name="uploadImageName" id="image_name" value="">
    <button id="save-button" class="button" onclick="saveCanvasImage();">SAVE</button>
  </div>

</div>
<div id="canvas"></div>
<script src="index.js" async defer></script>
    </body>
</html>
