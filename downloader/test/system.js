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
	$("#log").text("");
	logMessage("Downloading project: "+projectId);
	soundId = 0;
	costumeId = 0;
	totalAssets = 0;
	completeAssets = 0;
	soundsToDownload = [];
  costumesToDownload = [];
	id = projectId;
	jszip = new JSZip();
	jszip.comment = "Created with JuegOStrower's Project Downloader";
	$.get("https://cdn.projects.scratch.mit.edu/internalapi/project/"+projectId+"/get/", function(data){
		logMessage("Loaded JSON");
		project = data;
		if(project.hasOwnProperty("children")){
			for(child in project.children){
				processSoundsAndCostumes(project.children[child]);
			}
		}
		logMessage("Found "+totalAssets+" assets");
    console.log(costumesToDownload);
    console.log(soundsToDownload);
		jszip.file("project.json", JSON.stringify(project));
	});
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

function logMessage(msg){
	$("#log").text(msg+"\n"+$("#log").text());
}
