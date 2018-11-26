let connectToServer = url => {
  try {
    let con = new WebSocket(url);
    return con;
  } catch (err) {
    return null;
  }
};

let serverOnline = con => {
  switch (con.readyState) {
    case 1:
      return true;
      break;

    case 3:
      return false;
      break;
  }
};
