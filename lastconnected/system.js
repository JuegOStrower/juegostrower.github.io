function connnow() {
  if (document.getElementById("connnow").innerText == "Get it!"){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", 'https://api.scratch.mit.edu/users/' + document.getElementById('connuser').value);
	xmlHttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		document.getElementById("connlink").innerText = "The " + document.getElementById('connuser').value + "'s last connected time is: " + new Date(JSON.parse(xmlHttp.responseText).history.lastReadMessages).toLocaleString();
    	} else if (this.readyState == 4 && (this.status == 404 || this.status == 403)){
    		document.getElementById("connlink").innerText = "The user " + document.getElementById('connuser').value + " doesn't exists.";
		}
	};
    xmlHttp.send(null);
    document.getElementById("connuser").setAttribute("class","w3-hide");
    document.getElementById("connnow").innerText = "Edit";

  } else {
    document.getElementById("connnow").innerText = "Get it!";
    document.getElementById("connlink").innerText = "https://scratch.mit.edu/users/";
    document.getElementById("connuser").setAttribute("class","w3-input");
  }
}

function conndirect() {
	prompt("Copy and paste this link to auto get the last connected time of this user","http://www.juegostrower.tk/lastconnected/#" + document.getElementById("connuser").value);
}

document.addEventListener('DOMContentLoaded', init, false);
function init(){
	if (!window.location.hash.replace("#", "") == ""){
		document.getElementById("connuser").value = window.location.hash.replace("#", "").substring(0,24);
		document.getElementById("connnow").click();
	}
}
