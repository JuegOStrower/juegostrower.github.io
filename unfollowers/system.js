var ans = [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0]
var nowfollowers = 0;
var page = 1;
var pageCount = 0;
var nowlist = [];
var list = [];
var diff = [];
var followers = 0;
var user = "JuegOStrower";

$(document).ready(function(){
    $("#unfnow").click(function(){
        if(!($(this).attr("class") == "w3-gray w3-center")){
            $("#unfuser").attr("disabled","");
            $("#unfinput").attr("style", "background-color:rgb(235, 235, 228)");
            $("#unfnow").attr("class", "w3-gray w3-center");
			var user = $("#unfuser").val();
			console.log("Loading unfollowers: "+user);
			ans = [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0]
			nowfollowers = 0;
			page = 1;
			nowlist = [];
			list = [];
			diff = [];
			followers = 0;
			document.getElementById("percBar").style.width = '0%';
			document.getElementById("usertitle").innerHTML = "Loading...";
			document.getElementById("userlist").innerHTML = "You will see who unfollowed this user here...";
			$.get("https://scratch.mit.edu/users/" + user + "/followers/?page=" + page, loaded).fail(function () {document.getElementById("usertitle").innerHTML = "That user doesn't exists";console.log("That user doesn't exists");ready();});
        }
    });
    $("#unfdirect").click(function(){
        prompt('Copy and paste this link to auto download the enetered project',"http://www.juegostrower.tk/unfollowers/#" + $("#unfuser").val());
    });
    $("#unfuser").bind("input paste", function(){
        $(this).val($(this).val().substring(0,19));
    });
    if (!window.location.hash.replace("#", "") == ""){
        $("#unfuser").val($("#unfuser").val().substring(0,19));
        document.getElementById("unfnow").click();
    }
});

function loaded(data) {
	var $dom = $(data);
	if (pageCount == 0){
		//pageCount = $dom.getElementsByClassName("page-current").length;
	}
	//setProgress(40*(nowfollowers % 20/pageCount));
	console.log("Indexing current followers: page " + nowfollowers % 20 + "/" + pageCount);
	var $users = $dom.find('span.title').children();
	for (var i = 0; i < $users.length; i++) {
		nowlist.push($users[i].text.trim());
	}
	nowfollowers += $users.length;
	page++;
	$.get("https://scratch.mit.edu/users/" + user + "/followers/?page=" + page, loaded).fail(continueCode);
}

function continueCode() {
	while (Number(ans.length) > 19) {
		//setProgress(40 + 49*(followers % 20/pageCount));
		console.log("Indexing old followers: page " + followers % 20 + "/" + pageCount + " (approx)");
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", 'https://api.scratch.mit.edu/users/' + user + ' /followers?offset=' + followers, false);
		xmlHttp.send(null);
		ans = JSON.parse(xmlHttp.responseText);
		for (var i = 0;i < ans.length;i++){
			list.push(ans[i].username);
		}
		followers = Number(followers) + Number(ans.length);
	}
	console.log("Checking difrences between current and old");
	for (var i = 0; i < list.length; i++) {
		if (!(nowlist.includes(list[i]))){
			diff.push(list[i]);
		}
	}
	console.log("Complete");
	ready();
	unfollowers = followers - nowfollowers;
	document.getElementById("usertitle").innerHTML = unfollowers + " Users Unfollowed " + user + ".";
	console.log(unfollowers + " Users Unfollowed " + user + ".");
	document.getElementById("userlist").innerHTML = "Those are: " + diff.toString().replace(/,/g,", ");
	console.log ("Those are: " + diff.toString().replace(/,/g,", "));
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
    $("#unfuser").removeAttr("disabled");
    $("#unfinput").attr("style", "background-color:rgb(255, 255, 255)");
    $("#unfnow").attr("class", "w3-gray w3-hover-indigo w3-center w3-button");
}
