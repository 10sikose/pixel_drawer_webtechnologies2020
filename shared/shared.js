/*
ALL SHARED CONSTANTS
a.k.a Shared Layer
*/

export const CONSTANTS = {
    pixelWidth: 15,
    pixelHeight: 15,
    maxAlpha: 255
}

export const MESSAGES = {
    emptySave: "<p>Cannot save an empty canvas</p>",
    drawHelp: "<p>Click " + "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"bi bi-pencil icon\" viewBox=\"0 0 16 16\"><path d=\"M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z\"/></svg>"
    + " to turn on drawing mode.</p>",
    colorHelp: "<p>Click the color picker to select a color.</p>",
    prevHelp: "<p>Click " + '<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-arrow-counterclockwise icon" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></svg>'
        + " to undo most recently drawn pixels.</p>",
    eraseHelp: "<p>Click " + '<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-eraser icon" viewBox="0 0 16 16"><path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/></svg>'
        + " to turn on eraser.</p>",
    saveHelp: "<p>Click " + '<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-save icon" viewBox="0 0 16 16"><path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/></svg>'
        + " to save your drawing to the gallery.</p>",
    downloadHelp: "<p>Click " + '<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-cloud-download icon" viewBox="0 0 16 16"><path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/><path d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"/></svg>'
        + " to download drawing.</p>",
    clearHelp: "<p>Click " + '<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-x-circle icon" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>'
        + " to clear canvas.</p>"

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
    helpButton: document.getElementById('help-button'),
    downloadButton: document.getElementById('download-button'),
    titleForm: document.getElementById('titleForm'),
    toolBoxIcons: document.querySelectorAll('.toolbox-icon'),
    filter: document.getElementById('filter'),
    popupContainer: document.getElementById('popup-container'),
    popupMessage: document.getElementById('popup-message'),
    popupClose: document.getElementById('popup-close'),

    thumbnailContainer: document.getElementById('thumbnail-container')

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
