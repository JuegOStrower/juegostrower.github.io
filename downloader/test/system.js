var maxWidth = 0;
var jszip = null;
var project = null;
var id = null;
var assetsToDownload = [];
var totalAssets = 0;
var completeAssets = 0;

function Download(id){
	logMessage("Downloading project: "+id);
	totalAssets = 0;
	completeAssets = 0;
	assetsToDownload = [];
	jszip = new JSZip();
	jszip.comment = "Downloaded with JuegOStrower's Project Downloader";
	$.get("https://cdn.projects.scratch.mit.edu/internalapi/project/"+id+"/get/", function(data){
		logMessage("Loaded JSON");
		project = JSON.parse(data);
		findAssets(project);
		if(project.hasOwnProperty("children")){
			for(child in project.children){
				findAssets(project.children[child]);
			}
		}
		totalAssets = assetsToDownload.length;
		logMessage("Found "+totalAssets+" assets");
		jszip.file("project.json", JSON.stringify(project));
		while (assetsToDownload.length > 0){
			downloadAsset(assetsToDownload.pop());
		}
	}).fail(function(){
		logMessage("Download error");
	});
}

function findAssets(node){
	if(node.hasOwnProperty("costumes")){
		for(var i=0;i<node.costumes.length;i++){
			node.costumes[i].baseLayerID = i;
			assetsToDownload.push([node.costumes[i].costumeName,node.costumes[i].baseLayerID,node.costumes[i].baseLayerMD5]);
		}
	}
	if(node.hasOwnProperty("sounds")){
		for(var i=0;i<node.sounds.length;i++){
			node.sounds[i].soundID = i;
			assetsToDownload.push([node.sounds[i].soundName,node.sounds[i].soundID,node.sounds[i].md5]);
		}
	}
}

function downloadAsset(assetData){
	logMessage("Loading asset "+assetData[0]+" ("+completeAssets+"/"+totalAssets+")");
	JSZipUtils.getBinaryContent(
		"https://cdn.assets.scratch.mit.edu/internalapi/asset/"+assetData[2]+"/get/", 
		function(err, data){
			if(err) {return;}
			jszip.file(assetData[1]+"."+assetData[2].split(".")[assetData[2].split(".").length-1], data, {binary: true});
			completeAssets++;
	});
}

function logMessage(msg){
	console.log(msg);
}

$(document).ready(function(){
Download(prompt("Enter project id:"));
})
