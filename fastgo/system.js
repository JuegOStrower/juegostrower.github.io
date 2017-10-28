$(document).ready(function(){
	$("#makenow").click(function(){
    if ($(this).text() == "Make It!"){
        $(this).text("Edit");
        $("#makelink").text("https://go.juegostrower.tk/" + $("#maketype").val() + $("#makeproj").val());
        $("#makelink").attr("class","w3-text-black");
        $("#maketype").attr("hidden","");
        $("#makelinkbar").attr("hidden","");
        $("#makeproj").attr("class","w3-hide");
      } else {
        $(this).text("Make It!");
        $("#makelink").text("https://scratch.mit.edu/");
        $("#maketype").removeAttr("hidden");
        $("#makelinkbar").removeAttr("hidden");
        $("#makeproj").attr("class","w3-input");
      }
  })

 $("#makechange").click(function(){
 if ($("#makechangetext").attr("class") == "w3-hide"){
      $("#makechangetext").removeAttr("class");
    } else {
     $("#makechangetext").attr("class", "w3-hide");
  }
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
