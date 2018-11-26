//global var

let wsURL = "ws://localhost:4444";

//service

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service.js")
      .then(() => console.log("Service Registered"))
      .catch(err => console.error("Error : ", err));
  });
}

//main

var con;

let start = () => {
  con = connectToServer(wsURL);
  con.onopen = () => {
    console.log("connection open");
  };
  con.onmessage = message => {
    addData();
    console.log("lalala", message.data);
  };
};

setInterval(() => {
  if (!serverOnline(con)) {
    console.log("reconnecting...");
    start();
  }
}, 1000);

start();

//html bind

let showData = () => {
  let showDataTable = document.getElementById("show-data");
  getData(mainDB).then(data => {
    data.forEach(el => {
      showDataTable.innerHTML += `
        <tr>
          <td>${el.id}</td>
          <td>${el.nama}</td>
          <td>${el.pilihan}</td>
        </tr>
      `;
    });
  });
};
