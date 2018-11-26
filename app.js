//service

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service.js")
      .then(() => console.log("Service Registered"))
      .catch(err => console.error("Error : ", err));
  });
}

//connection

let connectToServer = url => {
  try {
    let con = new WebSocket(url);
    return con;
  } catch (err) {
    return null;
  }
};

//database

let dbName = "sister";
let dbVersion = 1;

let idb = window.indexedDB;
let req = idb.open(dbName, dbVersion);

var mainStore;
var tempStore;

req.onupgradeneeded = event => {
  let db = req.result;
  mainStore = db.createObjectStore("sister", {
    keyPath: "id",
    autoIncrement: true
  });

  tempStore = db.createObjectStore("temp", {
    keyPath: "id",
    autoIncrement: true
  });
};

let addData = data => {
  let db = req.result;
  if (!navigator.onLine) {
    db.transaction("temp", "readwrite")
      .objectStore("temp")
      .add(data);
  }
  db.transaction("sister", "readwrite")
    .objectStore("sister")
    .add(data);
};

let getData = id =>
  new Promise((resolve, reject) => {
    let db = req.result;
    let tx = db.transaction("sister", "readwrite").objectStore("sister");
    let ret;
    if (id) {
      ret = tx.get({ id });
    } else {
      ret = tx.getAll();
    }
    ret.onsuccess = event => {
      resolve(event.target.result);
    };
  });

let removeData = id => {};

//main

(() => {
  connectToServer("ws://localhost:4444");
})();
