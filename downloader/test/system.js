startDownload(prompt("Enter project id:"));

var maxWidth = 0;
var jszip = null;
var project = null;
var id = null;
var soundId = 0;
var costumeId = 0;
var soundsToDownload = [];
var costumesToDownload = [];
var totalAssets = 0;
var completeAssets = 0;

function startDownload(projectId){
	logMessage("Downloading project: "+projectId);
	soundId = 0;
	costumeId = 0;
	totalAssets = 0;
	completeAssets = 0;
	soundsToDownload = [];
  	costumesToDownload = [];
	id = projectId;
	resetProgress();
	jszip = new JSZip();
	jszip.comment = "Created with JuegOStrower's Project Downloader";
	$.get("https://cdn.projects.scratch.mit.edu/internalapi/project/"+projectId+"/get/", function(data){
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
		logMessage(costumesToDownload);
		logMessage(soundsToDownload);
		logMessage(project);
	}).fail(perror);
}

function downloadCostume(){
	if(costumesToDownload.length > 0){
		var current = costumesToDownload.pop();
		logMessage("Loading asset "+current.costumeName+" ("+completeAssets+"/"+totalAssets+")");
		JSZipUtils.getBinaryContent(
			"https://cdn.assets.scratch.mit.edu/internalapi/asset/"+current.baseLayerMD5+"/get/", 
			function(err, data){
				if(err) {error();return;}
				var ext = current.baseLayerMD5.match(/\.[a-zA-Z0-9]+/)[0];
				jszip.file(current.baseLayerID+ext, data, {binary: true});
				completeAssets++;
				setProgress(10+89*(completeAssets/totalAssets));
				downloadCostume();
		});
	} else {
		downloadSound();
	}
}

function downloadSound(){
	if(soundsToDownload.length > 0){
		var current = soundsToDownload.pop();
		logMessage("Loading asset "+current.soundName+" ("+completeAssets+"/"+totalAssets+")");
		JSZipUtils.getBinaryContent(
			"https://cdn.assets.scratch.mit.edu/internalapi/asset/"+current.md5+"/get/", 
			function(err, data){
				if(err) {error();return;}
				var ext = current.md5.match(/\.[a-zA-Z0-9]+/)[0];
				jszip.file(current.soundID+ext, data, {binary: true});
				completeAssets++;
				setProgress(10+89*(completeAssets/totalAssets));
				downloadSound();
		});
	} else {
		logMessage("Loading project title...");
		$.get("https://scratch.mit.edu/api/v1/project/"+id+"/?format=json", function(data){
			logMessage("Generating ZIP...");
			var content = jszip.generate({type:"blob"});
			logMessage("Saving...");
			try {
				saveAs(content, data.title+".sb2");
			} catch(e){
				saveAs(content, "project.sb2");
			}
			logMessage("Complete");
			psuccess();
		}).fail(function(){
			logMessage("Failed to load project title");
			logMessage("Generating ZIP...");
			var content = jszip.generate({type:"blob"});
			logMessage("Saving...");
      saveAs(content, "project.sb2");
			logMessage("Complete");
			psuccess();
		});
	}
}

function processSoundsAndCostumes(node){
	if(node.hasOwnProperty("costumes")){
		for(var i=0;i<node.costumes.length;i++){
			var current = node.costumes[i];
			current.baseLayerID = costumeId;
			costumeId++;
			totalAssets++;
			costumesToDownload.push(current);
		}
	}
	if(node.hasOwnProperty("sounds")){
		for(var i=0;i<node.sounds.length;i++){
			var current = node.sounds[i];
			current.soundID = soundId;
			soundId++;
			totalAssets++;
			soundsToDownload.push(current);
		}
	}
}

function perror(){
	logMessage("Download error");
	reset();
}

function psuccess(){
	reset();
}

function setProgress(perc) {}
function resetProgress() {}
function reset(){}
function logMessage(msg){
	console.log(msg);
}
