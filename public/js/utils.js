/* global jQuery */
/******************* MODIFIED JS CODE USING JQUERY ************************/
(function($) {
  $(function() {
    // Look for and add handlers to all checkboxes
    var cb = $('.stdForm .checkbox input');
    cb.on('change', function(ev) {
      // Set the state of the parent tag to represent the checked state.
      var cb = $(ev.currentTarget);
      cb.parent().toggleClass('checked', cb.prop('checked'));
    });
    // And set up the initial state for a checked box.
    cb.each(function() {
      $(this).parent().toggleClass('checked', $(this).prop('checked'));
    });
  });
})(jQuery);
