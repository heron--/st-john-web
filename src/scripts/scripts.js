(function() {
    "use strict";

    var appState = {
        mobileMenu: "closed"
    };

    $(document).ready(function() {

        $(".main-nav__hamburger").on("click", function(e) {

            if(appState.mobileMenu === 'closed') {

                appState.mobileMenu = 'open';
                $('.mobile-nav').addClass('mobile-nav--open');
                $('.main-nav__hamburger').addClass('main-nav__hamburger--menu-open');

            } else {

                appState.mobileMenu = 'closed';
                $('.mobile-nav').removeClass('mobile-nav--open');
                $('.main-nav__hamburger').removeClass('main-nav__hamburger--menu-open');

            }

        });

        $(".mobile-nav__inner").on("click", function(e) {
            e.stopPropagation()
        });

        $(".mobile-nav").on("click", function(e) {

            appState.mobileMenu = "closed";
            $(".mobile-nav").removeClass("mobile-nav--open");

        })
    })
})();
