/* global jQuery */
(function($) {
  $('.collapse').on('shown.bs.collapse', function() {
    $(this).parent().find('.arrow-box').addClass('expand');
  }).on('hidden.bs.collapse', function(){
    $(this).parent().find('.arrow-box').removeClass('expand');
  });
})(jQuery);
