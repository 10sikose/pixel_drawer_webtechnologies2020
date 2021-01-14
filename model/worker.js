
let db;
let DB_STORE_NAME ="grids";
const DB_VERSION = 5;

let responseData =new Object();




function openDb() {

    console.log("openDb ...");
    var req = indexedDB.open("mydb", DB_VERSION);

    req.onsuccess = function (evt) {
        // Better use "this" than "req" to get the result to avoid problems with
        // garbage collection.
        // db = req.result;
        db = this.result;
        console.log("openDb DONE");
        clearPixels();

    };
    req.onerror = function (evt) {
        console.error("openDb:", evt.target.errorCode);
    };

    req.onupgradeneeded = function (evt) {
        console.log("openDb.onupgradeneeded");
        var objectStore = evt.currentTarget.result.createObjectStore(
            DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('timestamp', 'timestamp');

    };

}

openDb();



//Recieved Data from Main.js
onmessage = e => {

    console.log(`[Worker does]: ${e.data.command}`);

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
        readPrev(e.data.timestamp) ;
    }

    else if(e.data.command === "GET_NEXT"){
        readNext(e.data.timestamp)  ;
    }
};


function clearPixels() {
    let request = db.transaction([DB_STORE_NAME], "readwrite")
        .objectStore(DB_STORE_NAME)
        .clear();
}


function addPixel(data) {

    const insertData = { pixel: data, timestamp: Date.now() };
    console.log("INSERTING");
    console.log(insertData);

    var transaction = db.transaction([DB_STORE_NAME], "readwrite");

    transaction.oncomplete = function(event) {

        // Do something when all the data is added to the database.

    };

    transaction.onerror = function(event) {
        // Don't forget to handle errors!
    };

    var objectStore = transaction.objectStore(DB_STORE_NAME);

    var request = objectStore.add(insertData);

    request.onsuccess = function(event) {
            console.log("Added Pixel Data into DB");

        };

    request.onerror = function(event) {
        console.log("something went wrong here");
    };

}



function readPrev(timestamp) {

    var objectStore = getObjectStore(DB_STORE_NAME, 'readonly');

    var request = objectStore.index('timestamp').openCursor(/*query*/null, /*direction*/'prev');

    var found = false;

    request.onsuccess = function() {

        var cursor = request.result;
        if (cursor) {
            console.log(cursor);

            if (found == true) {

                responseData.pixel = cursor.value.pixel;
                responseData.timestamp = cursor.value.timestamp;
                postMessage(responseData);

            }

            if (cursor.key == timestamp) {

                console.log("We found a row with value: " + cursor.key);
                found = true;
                cursor.continue();

            } else if(found == false) {

                cursor.continue();
            }

        }

    };

}

function read(timestamp) {

    var objectStore = getObjectStore(DB_STORE_NAME, 'readonly');

    var request = objectStore.index('timestamp').openCursor(/*query*/null, /*direction*/'prev');

    request.onsuccess = function() {
        var cursor = request.result;

            if (cursor) {

                responseData.pixel= cursor.value.pixel;
                responseData.timestamp= cursor.value.timestamp;
                postMessage(responseData);

            }



    };

}


function readNext() {
    objectStore = db.transaction("buffers").objectStore("buffers");
    var index = objectStore.index('timestamp');

    index.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            // cursor.key is a name, like "Bill", and cursor.value is the whole object.
            alert("Name: " + cursor.key + ", SSN: " + cursor.value.ssn + ", email: " + cursor.value.email);
            cursor.continue();
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

function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
}

function timedCount() {
        setTimeout("timedCount()",3000);
        //postMessage("hey");


}

timedCount();
