function connnow() {
  if (document.getElementById("connnow").innerText == "Get it!"){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'https://api.scratch.mit.edu/users/' + document.getElementById('connuser').value, false);
    xmlHttp.send(null);
    document.getElementById("connnow").innerText = "Edit";
    document.getElementById("connlink").innerText = new Date(JSON.parse(xmlHttp.responseText).history.lastReadMessages).toLocaleString();
    document.getElementById("connuser").setAttribute("class","w3-hide");
  } else {
    document.getElementById("connnow").innerText = "Get it!";
    document.getElementById("connlink").innerText = "https://scratch.mit.edu/users/";
    document.getElementById("connuser").setAttribute("class","w3-input");
  }
}

function conndirect() {
	prompt("Copy and paste this link to auto get the last connected time of this user","http://www.juegostrower.tk/lastconnected/#" + document.getElementById("connuser").value);
}

if (!window.location.hash.replace("#", "") == ""){
	document.getElementById("connuser").value = window.location.hash.replace("#", "").substring(0,24);
	document.getElementById("connnow").click();
}
