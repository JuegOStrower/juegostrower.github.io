var user = "JuegOStrower";
var message = "Hello -USER-, I have shared a new project!";
var pageCount = 0;
var postedCount = 0;
var followList = [];
var page = 1;
var token = "token";
var count = 0;

$(document).ready(function(){
	$("#commnow").click(function(){
		if(!($(this).attr("class") == "w3-gray w3-center")){
			$("#commuser").attr("disabled","");
			$("#commtext").attr("disabled","");
			$("#comminputtext").attr("style", "background-color:rgb(235, 235, 228)");
			$("#comminputuser").attr("style", "background-color:rgb(235, 235, 228)");
			$("#commnow").attr("class", "w3-gray w3-center");
			user = $("#commuser").val();
			message = $("#commtext").val();
			console.log('Posting comment "' + message +'" to ' + user);
			pageCount = 0;
			page = 1;
			followList = [];
			document.getElementById("percBar").style.width = '0%';
			document.getElementById("commnow").innerHTML = "Loading...";
			$.get("https://scratch.mit.edu/session/",function (data){try {token = data.user.token;} catch (e){document.getElementById("commnow").innerHTML = "Please log in to Scratch first"; throw "Please log in to Scratch first";ready();}});
			$.get("https://scratch.mit.edu/users/" + user + "/followers/?page=" + page, loaded).fail(function () {document.getElementById("commnow").innerHTML = "That user doesn't exists"; throw "That user doesn't exists";ready();});
		}
	});
	$("#commuser").bind("input paste", function(){
		$(this).val($(this).val().substring(0,19));
	});
});

function loaded(data) {
	var $dom = $(data);
	if (pageCount == 0){
		pageCount = ($dom.find('span.page-current').children() || []).length + 1;
	}
	var $users = $dom.find('span.title').children();
	for (var i = 0; i < $users.length; i++) {
		followList.push($users[i].text.trim());
	}
	setProgress(40*(page/pageCount));
	console.log("Indexing current followers: page " + page + "/" + pageCount);
	page++;
	$.get("https://scratch.mit.edu/users/" + user + "/followers/?page=" + page, loaded).fail(continueCode);
}

function continueCode() {
	count = followList.length;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log("Comment posted to " + followList[i] + ", user " + (i + 1) + "/" + count);
			setProgress(40 + 59*((i+1)/count));
			postedCount++;
			if (postedCount = count){
				ready();
				console.log("Complete, you've posted " + count + " comments");
				document.getElementById("commnow").innerHTML = "Complete, you've posted " + count + " comments";
			}
		} else {
			document.getElementById("commnow").innerHTML = "There was an error posting the comments.";
			throw "There was an error posting the comments.";
		}
	};
	xhttp.setRequestHeader("X-CSRFToken", "IEi6SVeAu8MCHAqpgT5d7Q8HtRJwFYiU")
	xhttp.open("POST", "https://scratch.mit.edu/site-api/comments/user/" + followList[i] + "/add/", true);
	xhttp.send(JSON.stringify({"content":message.replace(/-USER-/g, followList[i]),"parent_id":"","commentee_id":""}));
	console.log("Posting comment to " + followList[i] + ", user " + (i + 1) + "/" + count);
}

function setProgress(perc) {
    var width = document.getElementById('percBar').style.width.replace("%","");
    var id = setInterval(interval, 10);
    function interval() {
        if (width >= perc) {
            clearInterval(id);
        } else {
            width++;
            document.getElementById("percBar").style.width = width + '%';
        }
    }
}

function ready(){
    setProgress(100);
    $("#commuser").removeAttr("disabled");
    $("#commtext").removeAttr("disabled");
    $("#comminputtext").attr("style", "background-color:rgb(255, 255, 255)");
    $("#comminputuser").attr("style", "background-color:rgb(255, 255, 255)");
    $("#commnow").attr("class", "w3-gray w3-hover-indigo w3-center w3-button");
}
