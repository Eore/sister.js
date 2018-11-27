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
    setTimeout(() => {
      getData(tempDB).then(tempData => {
        tempData
          .filter(({ method }) => method === "add")
          .forEach(({ data }) => con.send(JSON.stringify(data)));
        cleanTemp();
      });
    }, 1000);

    //html bind

    let inputData = () => {
      let id = document.getElementById("id").value;
      let nama = document.getElementById("nama").value;
      let pilihan = document.getElementById("pilihan").value;
      let data = { id, nama, pilihan, createAt: Date.now() };
      let dataStr = JSON.stringify(data);
      console.log("inputing data :", data);
      addData(data);
      con.send(dataStr);
    };

    let showData = () => {
      let showDataTable = document.getElementById("show-data");
      showDataTable.innerHTML = "";
      getData(mainDB).then(data => {
        data
          .sort((a, b) => (a.createAt > b.createAt ? -1 : 1))
          .forEach(el => {
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

    window.onload = () => {
      showData();
    };

    let inputButton = document.getElementById("input");
    inputButton.onclick = () => {
      inputData();
      showData();
    };
  };
  con.onmessage = message => {
    console.log("incoming data :", message.data);
    addData(JSON.parse(message.data));
  };
};

//checking ws connection

setInterval(() => {
  if (!serverOnline(con)) {
    console.log("reconnecting...");
    start();
  }
}, 1000);

start();
