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

 $("#makechange").click(function(){
	document.getElementById('makechangetext').style.display='block';
});
  
	$("#makeproj").bind("input paste", function(){
		$(this).val($(this).val().replace(/\D/g,'').substring(0,10));
		if(isNaN(Number($(this).val()))){
			$(this).css("color", "red");
			$("#makenow").attr("class", "w3-gray w3-center");
		} else {
			$(this).css("color", "black");
			$("#makenow").attr("class", "w3-gray w3-hover-indigo w3-center w3-button");
		}
	});
})
