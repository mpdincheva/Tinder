app.controller("headerController", function () {
    $("#top-site-button").on("click", function () {
        $('html, body').animate({
            scrollTop: $("#myCarousel").eq(0).offset().top - 50
        }, 1000);
    });

    $('#top-login-button').on('click', function (ev) {
        // ev.preventDeafult();
        $('html, body').animate({
            scrollTop: $("#login-form").offset().top - 50
        }, 1000);
    })

    $('#top-register-button').on('click', function (ev) {
        // ev.preventDeafult();
        $('html, body').animate({
            scrollTop: $("#register-form").offset().top - 50
        }, 1000);
    })
});