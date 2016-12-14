/* global jQuery */
/******************* MODIFIED JS CODE USING JQUERY ************************/
(function($) {
  $(function() {
    // Look for and add handlers to all checkboxes
    var cb = $('.stdForm .checkbox input');
    $(document).on('change', '.checkbox input', function(ev) {
      // Set the state of the parent tag to represent the checked state.
      var cb = $(ev.currentTarget);
      cb.parent().toggleClass('checked', cb.prop('checked'));
    });
    // Add a 'active' class to the parent of a checkbox whenever it has focus
    $(document).on('focus blur', '.checkbox input,#popular-tags input', function(ev) {
      var cb = $(ev.currentTarget);
      cb.parent().toggleClass('active', cb.is(':focus'));
    });
    // And set up the initial state for a checked box.
    cb.each(function() {
      $(this).parent().toggleClass('checked', $(this).prop('checked'));
    });
  });
})(jQuery);
