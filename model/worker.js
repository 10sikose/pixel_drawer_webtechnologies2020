
let db;
let objectStore;
let DB_STORE_NAME ="buffers";

let responseData =new Object();

let req = indexedDB.open("mydb", 1);


req.onupgradeneeded = function(e) {
    let db = e.target.result;
    objectStore = db.createObjectStore(DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
   //objectStore.createIndex('title', 'title', { unique: false });
   // self.postMessage("Successfully upgraded db");
};
req.onsuccess = function(e) {
    db = req.result;
};
req.onerror = function(e) {
   // self.postMessage("error");
};



//Recieved Data from Main.js
onmessage = e => {

    console.log(`[Worker dows]: ${e.data.command}`);

    if(e.data.command === "ADD") {
        console.log("ADD ");
        addPixel(e.data.pixel);
    }
    else if(e.data.command === "CLEAR") {
        console.log("CLEAR");
        clearPixels();
    }
    else if(e.data.command === "GET_ACTUAL"){
        read();

    }
    else if(e.data.command === "GET_PREV"){
        readPrev()  ;
    }

    else if(e.data.command === "GET_NEXT"){
        readNext()  ;
    }
};


function clearPixels() {
    let request = db.transaction(["buffers"], "readwrite")
        .objectStore("buffers")
        .clear();
}

function addPixel(data) {

    let insert = new Object();
    insert.pixel = data;
    insert.timestamp = Date.now();
    console.log("INSERTING");
    console.log(insert);

    let request = db
        .transaction(DB_STORE_NAME, "readwrite")
        .objectStore(DB_STORE_NAME)
        .add(insert);

    request.onsuccess = function(event) {
        console.log("Added Pixel Data into DB");
    };

    request.onerror = function(event) {
        console.log("something went wrong here");
    };
}

function readAll() {
    let objectStore = db
        .transaction(DB_STORE_NAME)
        .objectStore("buffers");

    let users = [];

    objectStore.openCursor().onsuccess = function(event) {
        let cursor = event.target.result;

        if (cursor) {
            users.push(cursor.value);

            console.log(cursor.value);

            cursor.continue();
        } else {
        }
    };
}

function readPrev() {
//TODO
}

function readNext() {
//TODO
}

function read() {
    let objectStore = db.transaction("buffers").objectStore("buffers");

    objectStore.openCursor().onsuccess = function(event) {
        let cursor = event.target.result;

        if (cursor) {
            console.log("READING");
            console.log(cursor.value);
            responseData.pixel= cursor.value.pixel;
            responseData.timestamp= cursor.value.timestamp;
            postMessage(responseData);

        }
    };
}

function getMaxNumber () {


        var transaction = db.transaction(DB_STORE_NAME, 'readonly');
        var objectStore = transaction.objectStore(DB_STORE_NAME);
        var index = objectStore.index('timestamp');
        var openCursorRequest = index.openCursor(null, 'prev');
        var maxRevisionObject = null;

        openCursorRequest.onsuccess = function (event) {
            if (event.target.result) {
                maxRevisionObject = event.target.result.value; //the object with max revision
                console.log(maxRevisionObject);

            }
        };
        transaction.oncomplete = function (event) {
            db.close();


        };
    }



function timedCount() {
        setTimeout("timedCount()",3000);
        //postMessage("hey");


}

timedCount();
