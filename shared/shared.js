/*
ALL SHARED CONSTANTS GO HERE
*/

export const CONSTANTS = {
    pixelWidth: 15,
    pixelHeight: 15,
    maxAlpha: 255
}

export const MESSAGES = {
    emptySave: "Cannot save an empty canvas"
}

export const ELEMENTS = {
    gridRoot: document.getElementById('canvas'),
    toolBoxContainer: document.getElementById("toolbox"),
    toolBoxHeader: document.getElementById("toolboxheader"),
    drawButton: document.getElementById('draw'),
    colorBox: document.getElementById('colorbox'),
    eraseButton: document.getElementById('eraser'),
    saveButton: document.getElementById('save-button'),
    prevButton: document.getElementById('prev-button'),
    saveUncropped: document.getElementById('save-entire-canvas'),
    clearButton: document.getElementById('clear-button'),
    downloadButton: document.getElementById('download-button'),
    titleForm: document.getElementById('titleForm'),
    toolBoxIcons: document.querySelectorAll('.toolbox-icon'),
    filter: document.getElementById('filter'),
    popupContainer: document.getElementById('popup-container'),
    popupMessage: document.getElementById('popup-message'),
    popupClose: document.getElementById('popup-close')


};

export const COLORS = {
    lightPurple: '#9900cc',
    blue: '#0000cc',
    cyan: '#00ccff',
    magenta: '#ff00ff',
    pink: '#ff3399',
    brown: '#993333',
    red: '#ff3300',
    orange: '#ff9900',
    yellow: '#ffff00',
    lightGreen: '#99ff33',
    darkGreen: '#339933',
    grey: '#666699',
    white: '#ffffff',
    black: '#000000',
    darkPurple: '#660066',
    empty: '#44475a',
    toolBoxColor: '#282a36'
}
