var jszip = null;
var project = null;
var id = 181467202;
var assetsToDownload = [];
var totalAssets = 0;
var completeAssets = 0;
var customid = 0;
var soundid = 0;

$(document).ready(function(){
    $("#downnow").click(function(){
        if(!($(this).attr("class") == "w3-gray w3-center")){
            $("#downproj").attr("disabled","");
            $("#downinput").attr("style", "background-color:rgb(235, 235, 228)");
            $("#downnow").attr("class", "w3-gray w3-center");
            Download($("#downproj").val());
        }
    });
    $("#downdirect").click(function(){
        prompt('Copy and paste this link to auto download the enetered project',"http://www.juegostrower.tk/downloader/#" + $("#downproj").val());
    });
    $("#downproj").bind("input paste", function(){
        $(this).val($(this).val().replace(/\D/g,'').substring(0,10));
    });
    if (!window.location.hash.replace("#", "") === ""){
        $("#downproj").val($("#downproj").val().replace(/\D/g,'').substring(0,10));
        document.getElementById("downnow").click();
    }
});

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
    $("#downproj").removeAttr("disabled");
    $("#downinput").attr("style", "background-color:rgb(255, 255, 255)");
    $("#downnow").attr("class", "w3-gray w3-hover-indigo w3-center w3-button");
}
