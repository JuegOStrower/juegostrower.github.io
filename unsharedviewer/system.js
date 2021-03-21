$(document).ready(function(){
	$("#playnow").click(function(){
    		document.getElementById("player").innerHTML = document.getElementById("player").innerHTML.replace(/JPROJECTID/g,$("#playproj").val());
	  	$("#playinput").attr("class","w3-hide");
	  	$("#player").attr("class","");
	})
	$("#playdirect").click(function(){
     		prompt('Copy and paste this link to auto download the enetered project',"https://juegostrower.github.io/unsharedviewer/#" + $("#playproj").val());
	})
	$("#playproj").bind("input paste", function(){
		$(this).val($(this).val().replace(/\D/g,'').substring(0,10));
	})
	if (!window.location.hash.replace("#", "") == ""){
    		$("#playproj").val(window.location.hash.replace(/\D/g,'').substring(0,10));
		document.getElementById("playnow").click();
	}
})
