$('.collapse').on('shown.bs.collapse', function(e){
  console.log(e);
  console.log($(this).parent().find('.downward-arrow'));
  $(this).parent().find('.downward-arrow').addClass('rotate-arrow');
}).on('hidden.bs.collapse', function(){
  console.log('herererere');
  $(this).parent().find('.downward-arrow').removeClass('rotate-arrow');
});
