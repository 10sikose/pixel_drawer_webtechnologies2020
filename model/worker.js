const DB_STORE ="grids";
const DB_VERSION = 5;
const DB_NAME ="grids";


class DataBaseModel {

    constructor() {
        this._db = null;
        this._responseData = new Object();
        this._openDB();
        this._setupListener();
    }

    //Open the DB
    _openDB() {
        //Open the DB
        var request = indexedDB.open(DB_NAME, DB_VERSION);

        //If opening the DB was successful
        request.onsuccess = event => {

            this._db = request.result;
            this._clearPixels();

        };
        //if an error occurred
        request.onerror = event => {
            console.error("Error on opening the DB:", event.target.errorCode);
        };

        //Called if the DB need an upgrade
        request.onupgradeneeded = event => {

            //new Objectstore is created
            let objectStore = event.currentTarget.result.createObjectStore(
                DB_STORE, { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('timestamp', 'timestamp');

        };
    }

    //Listener that handles message objects from the controller
    _setupListener() {

        onmessage = e => {

            console.log(`[Worker does]: ${e.data.command}`);

            //Adds the transmitted pixelMap to the DB
            if(e.data.command === "ADD") {
                this._addPixel(e.data);
            }
            //Clears the DB
            else if(e.data.command === "CLEAR") {
                this._clearPixels();
            }
            //Reads the last added Pixelmap from the DB
            else if(e.data.command === "GET_ACTUAL"){
                this._read();
            }
            //Reads the previous added Pixelmap from the DB
            else if(e.data.command === "GET_PREV"){
                this._readPrev(e.data) ;
            }
        };
    }

    //Clears the DB
    _clearPixels() {
        let request = this._db.transaction([DB_STORE], "readwrite")
            .objectStore(DB_STORE)
            .clear();

    }

    //Add pixelMap to the DB
    _addPixel(gridStep) {

        //Generate the insert Object which contains the pixelMap and the actual timestamp and the timestamp of the previous added pixelMap
        const INSERT_DATA = { pixelMap: gridStep.pixelMap,
            timestamp: gridStep.timestamp,
            prev_timestamp: gridStep.prev_timestamp };

        //Generate and fulfill the transaction
        let transaction = this._db.transaction([DB_STORE], "readwrite");
        let objectStore = transaction.objectStore(DB_STORE);
        let request = objectStore.add(INSERT_DATA);


        //if transaction was successful
        request.onsuccess = event => {
            console.log("Added Pixel Data into DB");
        };
        //if transaction was not successful
        request.onerror = event => {
            console.log("ERROR");
        };
    }

    //Reads the pixelMap that was added befor an given timestamp
    _readPrev(actualGridStep) {

        //Open objectStore
        let objectStore = this._getStore(DB_STORE, 'readonly');
        //Creates an index on timestamp and sets up the cursor that the latest pixelMap is on top of the DB
        let request = objectStore.index('timestamp').openCursor(null,'prev');
        let found = false;


        request.onsuccess = event => {

            let cursor = request.result;

            if (cursor) {
                //Looks for the entry in the DB where the timerstamp matches with the prev_timestamp of the given pixelMap
                if (cursor.value.timestamp == actualGridStep.prev_timestamp) {
                    //Merge the response Object
                    this._responseData.pixelMap = cursor.value.pixelMap;
                    this._responseData.timestamp = cursor.value.timestamp;
                    this._responseData.prev_timestamp =cursor.value.prev_timestamp;
                    //send the response Object to the controller
                    postMessage(this._responseData);

                    //If not found we move the cursor to next entry
                } else if(found == false) {

                    cursor.continue();
                }
            }
        };
    }

    //Reads the last added pixelMap

    _read() {

        //Open objectStore
        let objectStore = this._getStore(DB_STORE, 'readonly');
        //Creates an index on timestamp and sets up the cursor that the latest pixelMap is on top of the DB
        let request = objectStore.index('timestamp').openCursor(null,'prev');

        request.onsuccess = event => {

            let cursor = request.result;
            if (cursor) {
                //Merge the response Object
                this._responseData.pixelMap= cursor.value.pixelMap;
                this._responseData.timestamp= cursor.value.timestamp;
                this._responseData.prev_timestamp= cursor.value.prev_timestamp;
                //send the response Object to the controller

                postMessage(this._responseData);
            }
        };
    }

    //return objectStore
    _getStore(name, mode) {
        let transaction = this._db.transaction(name, mode);
        return transaction.objectStore(name);
    }
}

//create DBObject
let dB = new DataBaseModel();
