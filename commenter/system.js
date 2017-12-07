var user = "JuegOStrower";
var message = "Hello -USER-, I have shared a new project!";
var pageCount = 0;
var postedCount = 0;
var followList = [];
var page = 1;
var token = "sjnxxxxx3VrSkk6BLxxxxxYGMb2xxxxx";
var count = 0;

$(document).ready(function(){
	$("#commnow").click(function(){
		if(!($(this).attr("class") == "w3-gray w3-center")){
			if($("#commtoken").val().length < 32){
				throw "Please put a valid CSRF";
			}
			$("#commuser").attr("disabled","");
			$("#commtext").attr("disabled","");
			$("#commtoken").attr("disabled","");
			$("#comminputtext").attr("style", "background-color:rgb(235, 235, 228)");
			$("#comminputuser").attr("style", "background-color:rgb(235, 235, 228)");
			$("#comminputoken").attr("style", "background-color:rgb(235, 235, 228)");
			$("#comminputip").attr("style", "background-color:rgb(235, 235, 228)");
			$("#commnow").attr("class", "w3-gray w3-center");
			user = $("#commuser").val();
			message = $("#commtext").val();
			token = $("#commtoken").val();
			console.log('Posting comment "' + message +'" to ' + user);
			pageCount = 0;
			page = 1;
			followList = [];
			document.getElementById("percBar").style.width = '0%';
			document.getElementById("commnow").innerHTML = "Loading...";
			$.get("https://scratch.mit.edu/users/" + user + "/followers/?page=" + page, loaded).fail(function () {document.getElementById("commnow").innerHTML = "That user doesn't exists"; throw "That user doesn't exists";ready();});
		}
	});
	$("#tokenHelp").click(function(){
		document.getElementById('tokenDialog').style.display='block';
	});
	$("#commuser").bind("input paste", function(){
		$(this).val($(this).val().substring(0,19));
	});
	$("#commtoken").bind("input paste", function(){
		if ($(this).val().length < 32){
			$(this).attr("class","w3-input w3-text-red")
		} else {
			$(this).attr("class","w3-input")
		}
		$(this).val($(this).val().substring(0,32));
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
	for (var i = 0; i < count; i++){
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
		xhttp.open("POST", "https://scratch.mit.edu/site-api/comments/user/" + followList[i] + "/add/", true);
		xhttp.setRequestHeader("X-CSRFToken", token);
		xhttp.send(JSON.stringify({"content":message.replace(/-USER-/g, followList[i]),"parent_id":"","commentee_id":""}));
		console.log("Posting comment to " + followList[i] + ", user " + (i + 1) + "/" + count);
	}
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
    $("#commtoken").removeAttr("disabled");
    $("#comminputtext").attr("style", "background-color:rgb(255, 255, 255)");
    $("#comminputuser").attr("style", "background-color:rgb(255, 255, 255)");
    $("#comminputtoken").attr("style", "background-color:rgb(255, 255, 255)");
    $("#comminputtip").attr("style", "background-color:rgb(255, 255, 255)");
    $("#commnow").attr("class", "w3-gray w3-hover-indigo w3-center w3-button");
}
