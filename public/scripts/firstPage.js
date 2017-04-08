$('#top-login-button').on('click', function (ev) {
    // ev.preventDeafult();
    $('html, body').animate({
        scrollTop: $("#login-form").offset().top
    }, 1000);
})

$('#top-register-button').on('click', function (ev) {
    // ev.preventDeafult();
    $('html, body').animate({
        scrollTop: $("#register-form").offset().top - 20
    }, 1000);
})
console.log("hi");