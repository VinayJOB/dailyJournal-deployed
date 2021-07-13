
$(".alert").effect( "bounce", { times: 3 }, "slow" );

$(document).ready(function(){
  $(".hiddenButton").trigger('click',function(){
    setTimeout(function(){
      $("#todolist").attr("href","/");
      }, 6000);
    });
}); 

