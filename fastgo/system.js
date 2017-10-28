$(document).ready(function(){
	$("#makenow").click(function(){
    if ($(this).text() == "Make It!"){
        $(this).text("Edit");
        $("#makelink").val("https://go.juegostrower.tk/" + $("#maketype").val() + $("#makeproj").val());
        $("#maketype").attr("hidden","");
        $("#makelinkbar").attr("hidden","");
        $("#makeproj").attr("hidden","");
      } else {
        $(this).text("Make It!");
        $("#makelink").val("https://scratch.mit.edu/");
        $("#maketype").removeAttr("hidden");
        $("#makelinkbar").removeAttr("hidden");
        $("#makeproj").removeAttr("hidden");
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
