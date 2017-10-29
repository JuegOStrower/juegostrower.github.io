function connnow() {
if (document.getElementById("connow").innerText == "Get it!"){
var xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", 'https://api.scratch.mit.edu/users/' + document.getElementById('connuser').value, false);
xmlHttp.send(null);
document.getElementById("connuser").value = JSON.parse(xmlHttp.responseText).history.lastReadMessages;
document.getElementById("connuser").addAttribute("hiddden","");
document.getElementById("connow").innerText = "Edit";
} else {
document.getElementById("connuser").removeAttribute("hiddden");
document.getElementById("connow").innerText = "Get it!";
document.getElementById("connuser").value = "JuegOStrower";
}
