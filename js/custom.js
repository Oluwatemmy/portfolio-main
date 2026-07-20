(function($) {

	"use strict";

	$(window).on("load", function() {

		/* ----------------------------------------------------------- */
		/*  PAGE PRELOADER
        /* ----------------------------------------------------------- */
		
		var preloader = $('#preloader');
		setTimeout(function() {
			preloader.addClass('preloaded');
		}, 800);

	});

	$(document).ready(function() {

		/* ----------------------------------------------------------- */
		/*  MOBILE MENU
		/* ----------------------------------------------------------- */

		$('#mobile-nav li').on('click', function () {
			$('#mobile-nav li').removeClass('active');
			$(this).addClass('active');
			$('#desktop-nav li').removeClass('active');
			var index = $(this).index() + 1;
			$('#desktop-nav li:nth-child(' + index + ')').addClass('active');
		});
		
		$('#trigger-mobile').on('click', function () {
			$(this).toggleClass('show-menu');
			$('#mobile-nav').toggleClass('hide-list');
		});

		/* ----------------------------------------------------------- */
		/*  DESKTPOP MENU
        /* ----------------------------------------------------------- */

		$('#desktop-nav li').on('click', function () {
			$('#desktop-nav li').removeClass('active');
			$(this).addClass('active');
			$('#mobile-nav li').removeClass('active');
			var index = $(this).index() + 1;
			$('#mobile-nav li:nth-child(' + index + ')').addClass('active');
		});

		/* ----------------------------------------------------------- */
		/*  AJAX CONTACT FORM (Netlify Forms)
        /* ----------------------------------------------------------- */

		$("#contactform").on("submit", function(e) {
			e.preventDefault();
			var $out = $(this).find(".output_message");
			$out.removeClass("success error").css("color", "").text("Sending...");
			var form = this;
			fetch("/", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams(new FormData(form)).toString()
			}).then(function(response) {
				if (response.ok) {
					$out.css("color", "#3fb950").text("Message sent successfully!");
					form.reset();
				} else {
					$out.css("color", "#f85149").text("Failed to send. Please email me directly.");
				}
			}).catch(function() {
				$out.css("color", "#f85149").text("Failed to send. Please email me directly.");
			});
		});

	});

})(jQuery);
