var jszip = null;
var project = null;
var id = 181467202;
var assetsToDownload = [];
var totalAssets = 0;
var completeAssets = 0;

$(document).ready(function(){
	$("#downproj").bind("input paste", function(){
		resetProgress();
		$(this).val($(this).val().replace(/\D/g,'').substring(0,10));
		if(isNaN(Number($(this).val()))){
			$(this).css("color", "red");
			$(this).attr("class", "w3-gray w3-center");
		} else {
			$(this).css("color", "black");
			$(this).attr("class", "w3-gray w3-hover-indigo w3-center w3-button");
		}
	});
	if (!window.location.hash.replace("#", "") == ""){
		resetProgress();
		$("#downnow").val($("#downnow").val().replace(/\D/g,'').substring(0,10));
		if(isNaN(Number($("#downnow").val()))){
			$(this).css("color", "red");
			$("#downnow").attr("class", "w3-gray w3-center");
		} else {
			$(this).css("color", "black");
			$("#downnow").attr("class", "w3-gray w3-hover-indigo w3-center w3-button");
			document.getElementById("downnow").click();
		}
	}
	$("#downnow").click(function(){
		if(!($(this).attr("class") == "w3-gray w3-center")){
			$("#progress").removeClass("error success");
			id = $("#downproj").val();
			if(isNaN(Number(id))){
				$("#downproj").css("color", "red");
			} else {
				$("#downproj").css("color", "black");
				$("#downproj").attr("disabled","");
				$("#downinput").attr("style", "background-color:rgb(235, 235, 228)");
				$("#downnow").attr("class", "w3-gray w3-center");
				startDownload(id);
			}
		}
	});
	$("#downdirect").click(function(){
		prompt('Copy and paste this link to auto download the enetered project',"http://www.juegostrower.tk/downloader/#" + $("#downproj").val());
	});
});

function startDownload(id){
	logMessage("Downloading project: "+id);
	totalAssets = 0;
	completeAssets = 0;
	assetsToDownload = [];
	resetProgress();
	jszip = new JSZip();
	jszip.comment = "Downloaded with JuegOStrower's Project Downloader";
	$.get("https://cdn.projects.scratch.mit.edu/internalapi/project/"+id+"/get/", function(data){
		setProgress(10);
		logMessage("Loaded JSON");
		project = JSON.parse(data);
		processSoundsAndCostumes(project);
		if(project.hasOwnProperty("children")){
			for(child in project.children){
				processSoundsAndCostumes(project.children[child]);
			}
		}
		logMessage("Found "+totalAssets+" assets");
		jszip.file("project.json", JSON.stringify(project));
		while (assetsToDownload.length > 0){
			downloadAsset(assetsToDownload.pop());
		}
		exportSb2();
	}).fail(function(){
		logMessage("Download error");
		setProgress(100);
		reset();
	});
}

function processSoundsAndCostumes(node){
	if(node.hasOwnProperty("costumes")){
		for(var i=0;i<node.costumes.length;i++){
			node.costumes[i].baseLayerID = i;
			i++;
			totalAssets++;
			logMessage("node.costumes[0].costumeName");
			logMessage(node.costumes[0].costumeName);
			logMessage("node.costumes[0]");
			logMessage(node.costumes[0]);
			logMessage("node");
			logMessage(node);
			assetsToDownload.push([node.costumes[0].costumeName,node.costumes[i].baseLayerID,node.costumes[i].baseLayerMD5);
		}
	}
	if(node.hasOwnProperty("sounds")){
		for(var i=0;i<node.sounds.length;i++){
			node.sounds[i].soundID = i;
			i++;
			totalAssets++;
			assetsToDownload.push([node.sounds[i].soundName,node.sounds[i].soundID,node.sounds[i].md5]);
		}
	}
}

function downloadAsset(assetData){
	logMessage("Loading asset "+assetData[0]+" ("+completeAssets+"/"+totalAssets+")");
	JSZipUtils.getBinaryContent(
		"https://cdn.assets.scratch.mit.edu/internalapi/asset/"+assetData+"/get/", 
		function(err, data){
			if(err) {return;}
			jszip.file(assetData[1]+assetData[2].md5.match(/\.[a-zA-Z0-9]+/)[0], data, {binary: true});
			completeAssets++;
			setProgress(10+89*(completeAssets/totalAssets));
	});
}

function exportSb2(){
	logMessage("Loading project title...");
	$.get("https://scratch.mit.edu/api/v1/project/"+id+"/?format=json", function(data){
		logMessage("Successfully loaded project title");
		logMessage("Generating SB2...");
		try {
			saveAs(jszip.generate({type:"blob"}), data.title+".sb2");
		} catch(e){
			saveAs(jszip.generate({type:"blob"}), "project.sb2");
		}
	}).fail(function(){
		logMessage("Failed to load project title");
		logMessage("Generating SB2...");
		saveAs(jszip.generate({type:"blob"}), "project.sb2");
	});
	logMessage("Complete");
	setProgress(100);
	reset();
}

function setProgress(perc) {
  var width = document.getElementById('percBar').style.width.replace("%","");
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= perc) {
      clearInterval(id);
    } else {
      width++; 
      document.getElementById("percBar").style.width = width + '%'; 
    }
  }
}
function resetProgress() {
	document.getElementById("percBar").style.width = '0%'; 
}

function reset(){
	$("#downproj").removeAttr("disabled");
	$("#downinput").attr("style", "background-color:rgb(255, 255, 255)");
	$("#downnow").attr("class", "w3-gray w3-hover-indigo w3-center w3-button");
}

function logMessage(msg){
	console.log(msg);
}
