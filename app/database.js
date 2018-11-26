let dbVersion = 1;
let mainDB = "sister";
let tempDB = "temp";

let idb = window.indexedDB;
let req = idb.open(mainDB, dbVersion);

req.onupgradeneeded = () => {
  let db = req.result;
  let newMainDB = db.createObjectStore("sister", { keyPath: "id" });
  newMainDB.createIndex("id", "id", { unique: true });
  let newTempDB = db.createObjectStore("temp", { keyPath: "id" });
  newTempDB.createIndex("method", "method", { unique: false });
};

let txDB = name => {
  let db = req.result;
  return db.transaction(name, "readwrite").objectStore(name);
};

let addToTemp = ({ method, data }) => {
  txDB(tempDB).add({ id: Date.now(), method, data });
};

let addData = data => {
  if (!navigator.onLine || !connectToServer(wsURL)) {
    addToTemp({ method: "add", data });
  }
  txDB(mainDB).add(data);
};

let getData = dbName =>
  new Promise((resolve, reject) => {
    let ret = txDB(dbName).getAll();
    ret.onsuccess = event => resolve(event.target.result);
    ret.onerror = () => reject(null);
  });

let cleanTemp = () => {
  txDB("temp").clear();
};
