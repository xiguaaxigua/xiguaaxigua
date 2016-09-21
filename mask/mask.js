(function($) {

    $.mask = function(params) {

        if ($('#maskOverlay').length) {
            // A confirm is already shown on the page:
            return false;
        }

        var buttonHTML = '';
        $.each(params.buttons, function(name, obj) {

            // Generating the markup for the buttons:

            buttonHTML += '<a href="#" class="button ' + obj['class'] + '">' + name + '<span></span></a>';

            if (!obj.action) {
                obj.action = function() {};
            }
        });

        var markup = [
            '<div id="maskOverlay">',
            '<div id="maskBox">',
            '<h1>', params.title, '</h1>',
            '<p>', params.message, '</p>',
            '<div id="maskButtons">',
            buttonHTML,
            '</div></div></div>'
        ].join('');

        $(markup).hide().appendTo('body').fadeIn();

        var buttons = $('#maskBox .button'),
            i = 0;

        $.each(params.buttons, function(name, obj) {
            buttons.eq(i++).click(function() {

                // Calling the action attribute when a
                // click occurs, and hiding the confirm.

                obj.action();
                $.mask.hide();
                return false;
            });
        });
    }

    $.mask.hide = function() {
        $('#maskOverlay').fadeOut(function() {
            $(this).remove();
        });
    }

})(jQuery);
