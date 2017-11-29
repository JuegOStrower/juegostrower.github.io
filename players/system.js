$(document).ready(function(){
  function play(type){
    switch(type){
      case "gui":
        window.location = "https://llk.github.io/scratch-gui/#" + document.getElementById("downproj").value;
        break;
      case "guidev":
        window.location = "https://llk.github.io/scratch-gui/develop/#" + document.getElementById("downproj").value;
        break;
       case "vm":
        window.location = "https://llk.github.io/scratch-vm/#" + document.getElementById("downproj").value;
        break;
       case "phos":
        window.location = "https://phosphorus.github.io/#" + document.getElementById("downproj").value;
        break;
	    case "rem":
        window.location = "https://www.juegostrower.tk/unsharedviewer/#" + document.getElementById("downproj").value;
        break;
       case "down":
        window.location = "https://www.juegostrower.tk/downloader/#" + document.getElementById("downproj").value;
        break;
       default:
        alert("There was an error reading the function data");
        break;
    }
  }
  if (!window.location.hash.replace("#", "") == ""){
  	$("#makeproj").val($("#makeproj").val().replace(/\D/g,'').substring(0,10));
  }
})
