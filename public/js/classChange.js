$('.collapse').on('shown.bs.collapse', function(e){
  $(this).parent().find('.downward-arrow').addClass('rotate-arrow');
}).on('hidden.bs.collapse', function(){
  $(this).parent().find('.downward-arrow').removeClass('rotate-arrow');
});
