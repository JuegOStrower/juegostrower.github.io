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
			user = $("#unfuser").val();
			console.log("Loading unfollowers: "+user);
			ans = [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0]
			nowfollowers = 0;
			page = 1;
			nowlist = [];
			list = [];
			diff = [];
			followers = 0;
			pageCount = 0;
			unfollowers = 0;
			document.getElementById("percBar").style.width = '0%';
			document.getElementById("usertitle").innerHTML = "Loading...";
			document.getElementById("userlist").innerHTML = "You will see who unfollowed this user here...";
			$.get("https://scratch.mit.edu/users/" + user + "/followers/?page=" + page, loaded).fail(function () {document.getElementById("usertitle").innerHTML = "That user doesn't exists";console.log("That user doesn't exists");ready();});
        }
    });
    $("#unfdirect").click(function(){
        prompt('Copy and paste this link to auto download the enetered project',"https://juegostrower.github.io/unfollowers/#" + $("#unfuser").val());
    });
    $("#unfuser").bind("input paste", function(){
	$("#unfuser").val($("#unfuser").val().match(/([^\/]*)\/*$/)[1].replace(/ /g, '').replace(/\//g, '').replace(/%20%/g, '').substring(0,30));
    });
    if (!window.location.hash.replace("#", "") == ""){
        $("#unfuser").val(window.location.hash.replace("#", "").substring(0,30).match(/([^\/]*)\/*$/)[1].replace(/ /g, '').replace(/%20%/g, ''));
        document.getElementById("unfnow").click();
    }
});

function loaded(data) {
	var $dom = $(data);
	if (pageCount == 0){
		pageCount = ($dom.find('span.page-current').children() || []).length + 1;
	}
	var $users = $dom.find('span.title').children();
	for (var i = 0; i < $users.length; i++) {
		nowlist.push($users[i].text.trim());
	}
	nowfollowers += $users.length;
	setProgress(40*(page/pageCount));
	console.log("Indexing current followers: page " + page + "/" + pageCount);
	page++;
	$.get("https://scratch.mit.edu/users/" + user + "/followers/?page=" + page, loaded).fail(continueCode);
}

function continueCode() {
	while (ans.length > 19) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", 'https://cors.maxi.workers.dev/?https://api.scratch.mit.edu/users/' + user + '/followers?offset=' + followers, false);
		try {
			xmlHttp.send(null);
		} catch(err){
			console.error(err)
			ans = [false];
			ready();
			console.log("Error! API unavailable");
			document.getElementById("usertitle").innerHTML = "Error! API unavailable";
			console.log("Please try again later. If this keeps happening, please report this error in my profile (@JuegOStrower).");
			document.getElementById("userlist").innerHTML = "Please try again later. If this keeps happening, please report this error in my profile (@JuegOStrower).";			
		}
		if(xmlHttp.status!=200){
			ans = [false];
			ready();
			console.log("Error! API unavailable");
			document.getElementById("usertitle").innerHTML = "Error! API unavailable";
			console.log("Please try again later. If this keeps happening, please report this error in my profile (@JuegOStrower).");
			document.getElementById("userlist").innerHTML = "Please try again later. If this keeps happening, please report this error in my profile (@JuegOStrower).";
		} else {
			ans = JSON.parse(xmlHttp.responseText);
			for (var i = 0;i < ans.length;i++){
				list.push(ans[i].username);
			}
			followers += ans.length;
			setProgress(40 + 49*((followers/20)/(pageCount * 3 + 1)));
			console.log("Indexing old followers: page " + Math.round(followers / 20) + "/" + (pageCount * 3 + 1) + " (approx)");
		}
	}
	if(ans[0]!=false){
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
