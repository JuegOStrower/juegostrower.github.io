function connnow() {
if (document.getElementById("connnow").innerText == "Get it!"){
var xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", 'https://api.scratch.mit.edu/users/' + document.getElementById('connuser').value, false);
xmlHttp.send(null);
document.getElementById("connnow").innerText = "Edit";
document.getElementById("connlink").innerText = JSON.parse(xmlHttp.responseText).history.lastReadMessages;
document.getElementById("connuser").setAttribute("class","w3-hide");
} else {
document.getElementById("connnow").innerText = "Get it!";
document.getElementById("connlink").innerText = "https://scratch.mit.edu/users/";
document.getElementById("connuser").setAttribute("class","w3-input");
}
}
