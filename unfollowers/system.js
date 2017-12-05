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
			$.get("https://scratch.mit.edu/users/" + user + "/followers/?page=" + page, loaded).fail(function () {console.log("Download error");ready();});
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
	setProgress(40*(nowfollowers % 20/pageCount));
	var $dom = $(data);
	if (pageCount = 0){
		pageCount = $dom.getElementsByClassName("page-current").length;
	}
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
		setProgress(40 + 49*(followers % 20/pageCount));
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
	//PRINT DATA IN THE CONSOLE
	var unfollowers = followers - nowfollowers;
	console.log(unfollowers + " users unfollowed you.");
	console.log ("Those are: " + diff);
}


function Download(id){
    console.log("Downloading project: "+id);
    totalAssets = 0;
    completeAssets = 0;
    assetsToDownload = [];
    document.getElementById("percBar").style.width = '0%';
    jszip = new JSZip();
    jszip.comment = "Downloaded with JuegOStrower's Project Downloader";
    $.get("https://cdn.projects.scratch.mit.edu/internalapi/project/"+id+"/get/", function(data){
        setProgress(10);
        console.log("Loaded JSON");
        project = JSON.parse(data);
        findAssets(project);
        for(var i in project.children){
            findAssets(project.children[i]);
        }
        totalAssets = assetsToDownload.length;
        console.log("Found "+totalAssets+" assets");
        jszip.file("project.json", JSON.stringify(project));
        while (assetsToDownload.length > 0){
            downloadAsset(assetsToDownload.pop());
        }
        exportSb2();
    }).fail(function(){
        console.log("Download error");
        ready();
    });
}

function findAssets(node){
    for(var i=0;i<node.costumes.length;i++){
        node.costumes[i].baseLayerID = customid;
        customid++;
        assetsToDownload.push([node.costumes[i].costumeName,node.costumes[i].baseLayerID,node.costumes[i].baseLayerMD5]);
    }
    if(node.hasOwnProperty("sounds")){
        for(i=0;i<node.sounds.length;i++){
            node.sounds[i].soundID = soundid;
            soundid++;
            assetsToDownload.push([node.sounds[i].soundName,node.sounds[i].soundID,node.sounds[i].md5]);
        }
    }
}

function downloadAsset(assetData){
    JSZipUtils.getBinaryContent(
        "https://cdn.assets.scratch.mit.edu/internalapi/asset/"+assetData[2]+"/get/",
        function(err, data){
            if(err) {return;}
            jszip.file(assetData[1]+"."+assetData[2].split(".")[assetData[2].split(".").length-1], data, {binary: true});
            completeAssets++;
            setProgress(10+89*(completeAssets/totalAssets));
            console.log("Loading asset "+assetData[0]+" ("+completeAssets+"/"+totalAssets+")");
        });
}

function exportSb2(){
    console.log("Loading project title...");
    $.get("https://scratch.mit.edu/api/v1/project/"+id+"/?format=json", function(data){
        console.log("Successfully loaded project title");
        console.log("Generating SB2...");
        try {
            saveAs(jszip.generate({type:"blob"}), data.title+".sb2");
        } catch(e){
            saveAs(jszip.generate({type:"blob"}), "project.sb2");
        }
    }).fail(function(){
        console.log("Failed to load project title");
        console.log("Generating SB2...");
        saveAs(jszip.generate({type:"blob"}), "project.sb2");
    });
    console.log("Complete");
    setProgress(100);
    ready();
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
