var jszip = null;
var project = null;
var id = null;
var assetsToDownload = [];
var totalAssets = 0;
var completeAssets = 0;
var customid = 0;
var soundid = 0;
var ext = null;

$(document).ready(function () {
    $("#downnow").click(function () {
        if (!($(this).attr("class") == "w3-gray w3-center")) {
            $("#downproj").attr("disabled", "");
            $("#downinput").attr("style", "background-color:rgb(235, 235, 228)");
            $("#downnow").attr("class", "w3-gray w3-center");
            Download($("#downproj").val());
        }
    });
    $("#downdirect").click(function () {
        prompt('Copy and paste this link to auto download the enetered project', "https://juegostrower.github.io/downloader/#" + $("#downproj").val());
    });
    $("#downproj").bind("input paste", function () {
        $(this).val($(this).val().replace(/\D/g, '').substring(0, 10));
    });
    if (!window.location.hash.replace("#", "") == "") {
        $("#downproj").val($("#downproj").val().replace(/\D/g, '').substring(0, 10));
        document.getElementById("downnow").click();
    }
});

function Download(projid) {
    id = projid;
    console.log("Downloading project: " + id);
    totalAssets = 0;
    completeAssets = 0;
    assetsToDownload = [];
    document.getElementById("percBar").style.width = '0%';
    jszip = new JSZip();
    jszip.comment = "Downloaded with JuegOStrower's Project Downloader";
    $.get("https://cors-anywhere.herokuapp.com/https://projects.scratch.mit.edu/" + id, function (data) {
        setProgress(10);
        console.log("Loaded JSON");
        project = JSON.parse(data);
        if (project.info) {
            ext = "sb2";
            findAssets(project);
            for (var i in project.children) {
                findAssets(project.children[i]);
            }
        } else {
            ext = "sb3";
            for (var i in project.targets) {
                findAssets(project.targets[i]);
            }
        }
        totalAssets = assetsToDownload.length;
        console.log("Found " + totalAssets + " assets");
        jszip.file("project.json", JSON.stringify(project));
        while (assetsToDownload.length > 0) {
            downloadAsset(assetsToDownload.pop());
        }
        // exportFile(); is called from the last asset
    }).fail(function () {
        console.log("Download error");
        ready();
    });
}

function findAssets(node) {
    if (node.hasOwnProperty("costumes")) {
        for (var i = 0; i < node.costumes.length; i++) {
            if(ext == "sb2"){
                node.costumes[i].baseLayerID = customid;
                customid++;
                assetsToDownload.push([node.costumes[i].costumeName, node.costumes[i].baseLayerID, node.costumes[i].baseLayerMD5]);
            } else {
                assetsToDownload.push([node.costumes[i].name, node.costumes[i].assetId, node.costumes[i].md5ext]);
            }
        }
    }
    if (node.hasOwnProperty("sounds")) {
        for (i = 0; i < node.sounds.length; i++) {
            if(ext == "sb2"){
                node.sounds[i].soundID = soundid;
                soundid++;
                assetsToDownload.push([node.sounds[i].soundName, node.sounds[i].soundID, node.sounds[i].md5]);
            } else {
                assetsToDownload.push([node.sounds[i].name, node.sounds[i].assetId, node.sounds[i].md5ext]);
            }
        }
    }
}

function downloadAsset(assetData) {
    JSZipUtils.getBinaryContent(
        "https://cors-anywhere.herokuapp.com/https://assets.scratch.mit.edu/internalapi/asset/" + assetData[2] + "/get/",
        function (err, data) {
            if (err) {
                return;
            }
            jszip.file(assetData[1] + "." + assetData[2].split(".")[assetData[2].split(".").length - 1], data, {
                binary: true
            });
            completeAssets++;
            setProgress(10 + 89 * (completeAssets / totalAssets));
            console.log("Loading asset " + assetData[0] + " (" + completeAssets + "/" + totalAssets + ")");
            if(completeAssets == totalAssets) exportFile();
        });
}

function exportFile() {
    console.log("Loading project title...");
    $.get("https://cors-anywhere.herokuapp.com/https://api.scratch.mit.edu/projects/" + id, function (data) {
        console.log("Successfully loaded project title");
        console.log("Generating file...");
        try {
            saveAs(jszip.generate({type: "blob"}), data.title + "."+ext);
        } catch (e) {
            saveAs(jszip.generate({type: "blob"}), "project."+ext);
        }
        console.log("Complete");
        ready();
    }).fail(function () {
        console.log("Failed to load project title");
        console.log("Generating file...");
        saveAs(jszip.generate({type: "blob"}), "project."+ext);
        console.log("Complete");
        ready();
    });
}

function setProgress(perc) {
    var width = document.getElementById('percBar').style.width.replace("%", "");
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

function ready() {
    setProgress(100);
    $("#downproj").removeAttr("disabled");
    $("#downinput").attr("style", "background-color:rgb(255, 255, 255)");
    $("#downnow").attr("class", "w3-gray w3-hover-indigo w3-center w3-button");
}
