var user = "JuegOStrower";
var message = "Hello _NAME_, I have shared a new project!";
var pageCount = 0;
var followList = [];
var page = 1;

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
    			$.get( "https://scratch.mit.edu/users/" + user + "/followers/?page=1", loaded );
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
		xmlHttp.open("GET", 'https://api.scratch.mit.edu/users/' + user + ' /followers?offset=' + followers, false);
		xmlHttp.send(null);
		ans = JSON.parse(xmlHttp.responseText);
		for (var i = 0;i < ans.length;i++){
			list.push(ans[i].username);
		}
		followers += ans.length;
		setProgress(40 + 49*((followers/20)/(pageCount * 3 + 1)));
		console.log("Indexing old followers: page " + Math.round(followers / 20) + "/" + (pageCount * 3 + 1) + " (approx)");
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
