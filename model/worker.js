const DB_STORE_NAME ="grids";
const DB_VERSION = 5;

class DataBaseModel {
    constructor() {
        this._db = null;
        this._responseData = new Object();
        this._openDB();
        this._setupMessageListener();
    }

    _openDB() {
        console.log("openDb ...");
        var req = indexedDB.open("mydb", DB_VERSION);
    
        req.onsuccess = event => {
            // Better use "this" than "req" to get the result to avoid problems with
            // garbage collection.
            // db = req.result;
            console.log("Result");
            console.log(req.result);
            this._db = req.result;
            console.log("openDb DONE");
            this._clearPixels();
    
        };
        req.onerror = event => {
            console.error("openDb:", event.target.errorCode);
        };
    
        req.onupgradeneeded = event => {
            console.log("openDb.onupgradeneeded");
            let objectStore = event.currentTarget.result.createObjectStore(
                DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('timestamp', 'timestamp');
    
        };
    }

    _setupMessageListener() {
        
        //Recieved Data from Main.js
        onmessage = e => {

            console.log(`[Worker does]: ${e.data.command}`);
        
            if(e.data.command === "ADD") {
                console.log("ADD");
                this._addPixel(e.data);
            }
            else if(e.data.command === "CLEAR") {
                console.log("CLEAR");
                this._clearPixels();
            }
            else if(e.data.command === "GET_ACTUAL"){
                this._read();
        
            }
            else if(e.data.command === "GET_PREV"){
                this._readPrev(e.data) ;
            }
        
            else if(e.data.command === "GET_NEXT"){
                this._readNext(e.data.timestamp)  ;
            }
        };
    }

    _clearPixels() {
        let request = this._db.transaction([DB_STORE_NAME], "readwrite")
        .objectStore(DB_STORE_NAME)
        .clear();                    

    }

    _addPixel(gridStep) {
        const INSERT_DATA = { pixelMap: gridStep.pixelMap,
                            timestamp: gridStep.timestamp,
                            prev_timestamp: gridStep.prev_timestamp };

        console.log("INSERTING");
        console.log(INSERT_DATA);

        console.log(this._db);
    
        let transaction = this._db.transaction([DB_STORE_NAME], "readwrite");
    
        transaction.oncomplete = event => {
    
            // Do something when all the data is added to the database.
    
        };
    
        transaction.onerror = event => {
            // Don't forget to handle errors!
        };
    
        let objectStore = transaction.objectStore(DB_STORE_NAME);
    
        let request = objectStore.add(INSERT_DATA);
    
        request.onsuccess = event => {
                console.log("Added Pixel Data into DB");
    
            };
    
        request.onerror = event => {
            console.log("something went wrong here");
        };        
    }

    _readPrev(actualGridStep) {
        let objectStore = this._getObjectStore(DB_STORE_NAME, 'readonly');

        let request = objectStore.index('timestamp').openCursor(/*query*/null, /*direction*/'prev');
    
        let found = false;
    
        request.onsuccess = event => {
    
            let cursor = request.result;
            if (cursor) {
                console.log(cursor);
    
                console.log("[Worker]: ");
                console.log(cursor.value.timestamp);
                console.log(actualGridStep.prev_timestamp);
    
                if (cursor.value.timestamp == actualGridStep.prev_timestamp) {
    
                    console.log("We found a row with value: " + cursor.key);
                    this._responseData.pixelMap = cursor.value.pixelMap;
                    this._responseData.timestamp = cursor.value.timestamp;
                    this._responseData.prev_timestamp =cursor.value.prev_timestamp;
    
                    //addPixel(responseData);
                    postMessage(this._responseData);
    
    
                } else if(found == false) {
    
                    cursor.continue();
                }
    
            }
    
        };        
    }

    _read() {

        let objectStore = this._getObjectStore(DB_STORE_NAME, 'readonly');

        let request = objectStore.index('timestamp').openCursor(/*query*/null, /*direction*/'prev');
    
        request.onsuccess = event => {
            let cursor = request.result;
    
            if (cursor) {
    
                this._responseData.pixelMap= cursor.value.pixelMap;
                this._responseData.timestamp= cursor.value.timestamp;
                this._responseData.prev_timestamp= cursor.value.prev_timestamp;
                postMessage(this._responseData);
    
            }

        };        
    }

    _readNext() {

        let objectStore = this._db.transaction("buffers").objectStore("buffers");
        let index = objectStore.index('timestamp');

        index.openCursor().onsuccess = event => {
            let cursor = event.target.result;
            if (cursor) {
                // cursor.key is a name, like "Bill", and cursor.value is the whole object.
                alert("Name: " + cursor.key + ", SSN: " + cursor.value.ssn + ", email: " + cursor.value.email);
                cursor.continue();
            }
        };    
    }

    _getMaxNumber() {
        let transaction = this._db.transaction(DB_STORE_NAME, 'readonly');
        let objectStore = transaction.objectStore(DB_STORE_NAME);
        let index = objectStore.index('timestamp');
        let openCursorRequest = index.openCursor(null, 'prev');
        let maxRevisionObject = null;

        openCursorRequest.onsuccess = event => {
            if (event.target.result) {
                maxRevisionObject = event.target.result.value; //the object with max revision
                console.log(maxRevisionObject);

            }
        };

        transaction.oncomplete = event => {
            this._db.close();
        };        
    }

    _getObjectStore(store_name, mode) {
        let tx = this._db.transaction(store_name, mode);
        return tx.objectStore(store_name);        
    }
}

let database = new DataBaseModel();