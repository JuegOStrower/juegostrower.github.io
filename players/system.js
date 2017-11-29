$(document).ready(function(){
	$("#makenow").click(function(){
	if ($(this).text() == "Make it!"){
        	$(this).text("Edit");
        	$("#makelink").html("<a href='https://go.juegostrower.tk/" + $("#maketype").val() + $("#makeproj").val() + "'>https://go.juegostrower.tk/" + $("#maketype").val() + $("#makeproj").val() + "</a>");
        	$("#makelink").attr("class","w3-text-black");
        	$("#maketype").attr("hidden","");
        	$("#makelinkbar").attr("hidden","");
        	$("#makeproj").attr("class","w3-hide");
	} else {
        	$(this).text("Make it!");
        	$("#makelink").text("https://scratch.mit.edu/");
        	$("#makelink").removeAttr("class");
        	$("#maketype").removeAttr("hidden");
        	$("#makelinkbar").removeAttr("hidden");
        	$("#makeproj").attr("class","w3-input");
	}
	})
  
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
       case "rem";
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
	$("#makechange").click(function(){
		document.getElementById('makechangetext').style.display='block';
	});

	$("#makeproj").bind("input paste", function(){
		$(this).val($(this).val().replace(/\D/g,'').substring(0,10));
		$("#makenow").attr("class", "w3-gray w3-hover-indigo w3-center w3-button");
	});

	if (!window.location.hash.replace("#", "") == ""){
       		$("#makeproj").val($("#makeproj").val().replace(/\D/g,'').substring(0,10));
		document.getElementById("makenow").click();
	}
})
