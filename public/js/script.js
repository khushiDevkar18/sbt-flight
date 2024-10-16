$(document).ready(function () {
	$(".tj-loader").delay(5000).slideUp(1600);
	$(".loader-outer").delay(5000).slideUp(1600);

	const url = 'https://devapi.taxivaxi.com/selfBooking/v1/airportCodes';
	const apiKey = 'VW5pdmVyc2FsIEFQSS91QVBJODY0NTk4MDEwOS1hZjc0OTRmYTpOLWsyOVp9bXk1';

	// const requestBody = {
	// 	traceId: 'ac191f0b9c0546659065f29389eae552',
	// 	authorizedBy: 'TAXIVAXI'
	// };

	// const headers = {
	// 	'X-Authorization': apiKey,
	// 	'Content-Type': 'application/json'
	// };

	// fetch(url, {
	// 	method: 'POST',
	// 	headers: headers,
	// 	body: JSON.stringify(requestBody)
	// })
	// 	.then(response => response.json())
	// 	.then(airportcodes => {
	// 		//console.log(airportcodes);
	// 		myFunction(airportcodes);
	// 	})
	// 	.catch(error => {
	// 		console.error(error);
	// 	});

	// function myFunction(response) {
	// 	$('#searchfrom').keyup(function () {
	// 		var searchQuery = $(this).val();
	// 		var searchResults = $('#searchFromResults');
	// 		searchResults.empty();

	// 		if (searchQuery.length > 0 && response && response.data && Array.isArray(response.data.airportDetails) && response.data.airportDetails.length > 0) {
	// 			var matchingAirports = response.data.airportDetails.filter(function (airport) {
	// 				var airportName = airport.Name.toLowerCase();
	// 				return airportName.includes(searchQuery.toLowerCase());
	// 			});

	// 			if (matchingAirports.length > 0) {
	// 				matchingAirports.forEach(function (airport) {
	// 					var option = '<li style="cursor: pointer;font-family:Montserrat;color:#4c4c4c;font-size:10px;padding-top: 5px;padding-bottom: 5px;padding-right: 5px;" value="' + airport.Code + '">' + airport.Name + ' (' + airport.Code + ')</li>';
	// 					searchResults.append(option);
	// 				});
	// 				searchResults.show();
	// 			}
	// 		} else {
	// 			searchResults.append('<li style="cursor: pointer;font-family:Montserrat;color:#4c4c4c;font-size:10px;padding-top: 5px;padding-bottom: 5px;padding-right: 5px;"></li>');
	// 		}
	// 	});

	// 	$('#searchFromResults').on('click', 'li', function () {
	// 		var selectedValue = $(this).val();
	// 		var selectedText = $(this).text();
	// 		$('#searchfrom').val(selectedText);
	// 		$('#searchFromResults').hide();
	// 	});

	// 	$('#searchto').keyup(function () {
	// 		var searchQuery = $(this).val();
	// 		var searchResults = $('#searchToResults');
	// 		searchResults.empty();

	// 		if (searchQuery.length > 0 && response && response.data && Array.isArray(response.data.airportDetails) && response.data.airportDetails.length > 0) {
	// 			var matchingAirports = response.data.airportDetails.filter(function (airport) {
	// 				var airportName = airport.Name.toLowerCase();
	// 				return airportName.includes(searchQuery.toLowerCase());
	// 			});

	// 			if (matchingAirports.length > 0) {
	// 				matchingAirports.forEach(function (airport) {
	// 					var option = '<li style="cursor: pointer;font-family:Montserrat;color:#4c4c4c;font-size:10px;padding-top: 5px;padding-bottom: 5px;padding-right: 5px;" value="' + airport.Code + '">' + airport.Name + ' (' + airport.Code + ')</li>';
	// 					searchResults.append(option);
	// 				});
	// 				searchResults.show();
	// 			}
	// 		} else {
	// 			searchResults.append('<li style="cursor: pointer;font-family:Montserrat;color:#4c4c4c;font-size:10px;padding-top: 5px;padding-bottom: 5px;padding-right: 5px;"></li>');
	// 		}
	// 	});

	// 	$('#searchToResults').on('click', 'li', function () {
	// 		var selectedValue = $(this).val();
	// 		var selectedText = $(this).text();
	// 		$('#searchto').val(selectedText);
	// 		$('#searchToResults').hide();
	// 	});
	// }



	"use strict";
	init_validation();
	var $slideHover = function () {
		$('.offer-slider-i').on({
			mouseenter: function () {
				$(this).find('.offer-slider-overlay').fadeIn(170);
				$(this).find('.offer-slider-btn').animate({ top: "50%" }, 170);
			},
			mouseleave: function () {
				$(this).find('.offer-slider-overlay').fadeOut(170);
				$(this).find('.offer-slider-btn').css('top', '-200px');
			}
		}, $(this));
	}


	var header_a = $('.header-a');
	var header_b = $('.header-b');
	var header_logo = $('.header-logo');
	var header_right = $('.header-right');


	var $headerDown = function () {
		// header_a.slideUp(120);
		// header_b.css('height', '59px');
		// header_b.addClass('fixed');
		// header_logo.css('margin-top', '5px')
		// header_right.css('margin-top', '20px');
		header_logo.find('img').attr('src', 'img/taxivaxi/logo/cotrav_logo.svg');

	}
	var $headerUp = function () {
		// header_a.slideDown(150);
		// header_b.removeClass('fixed');
		// header_b.css('height', '53px');
		// header_logo.css('margin-top', '5px');
		// header_right.css('margin-top', '20px');
		header_logo.find('img').attr('src', 'img/taxivaxi/logo/cotrav_logo.svg');
	}

	$(window).scroll(function () {
		var $scrollTop = $(window).scrollTop();
		if ($scrollTop > 140) {
			$headerDown();
		} else {
			$headerUp();
		}
	});

	$('.mobile-menu a.has-child').on('click', function () {
		if ($(this).is('.open')) {
			$(this).removeClass('open');
			$(this).closest('li').find('ul').slideUp();
		} else {
			$('.mobile-menu li ul').slideUp();
			$('.mobile-menu li a').removeClass('open');
			$(this).addClass('open');
			$(this).closest('li').find('ul').slideDown();
		}


		return false;
	});

	$('.menu-btn').on('click', function () {
		var mobile_menu = $('.mobile-menu');
		if ($(this).is('.open')) {
			$(this).removeClass('open')
			mobile_menu.slideUp();
		} else {
			$(this).addClass('open')
			mobile_menu.slideDown();
		}
		return false;

	});


	$('.header-nav ul li').on({
		mouseenter: function () {
			$(this).find('ul').show();
		},
		mouseleave: function () {
			$(this).find('ul').hide();
		}
	});

	$('.header-lang').on({
		mouseenter: function () {
			$('.langs-drop').fadeIn();
		},
		mouseleave: function () {
			$('.langs-drop').hide();
		}
	});

	$('.header-viewed').on({
		mouseenter: function () {
			$('.viewed-drop').fadeIn();
		},
		mouseleave: function () {
			$('.viewed-drop').hide();
		}
	});

	$('.header-curency').on({
		mouseenter: function () {
			$('.curency-drop').fadeIn();
		},
		mouseleave: function () {
			$('.curency-drop').hide();
		}
	});

	// $('.flight-line .flight-line-b b').on('click', function () {
	// 	if ($(this).is('.open')) {
	// 		$(this).removeClass('open');
	// 		$(this).closest('.flight-line').find('.flight-details').slideUp();
	// 	} else {
	// 		$(this).addClass('open');
	// 		$(this).closest('.flight-line').find('.flight-details').slideDown();
	// 	}
	// });
	$('.alt-flight .flight-line-b b').on('click', function () {
		if ($(this).is('.open')) {
			$(this).removeClass('open');
			$(this).closest('.alt-flight').find('.alt-details').slideUp();
		} else {
			$(this).addClass('open');
			$(this).closest('.alt-flight').find('.alt-details').slideDown();
		}
	});
	$('.hdr-srch-btn').on('click', function () {
		$('.hdr-srch-overlay').fadeIn().find('input:text').focus();
		return false;
	});
	$('.srch-close').on('click', function () {
		$('.hdr-srch-overlay').fadeOut();
		return false;
	});

	$('.openpassengermodal').on('click', function () {
		if ($(this).is('.open')) {
			$(this).closest('.search-tab-content').find('.search-asvanced').hide();
			$(this).text('Advanced Search options').removeClass('open');
		} else {

			$(this).closest('.search-tab-content').find('.search-asvanced').fadeIn();
			$(this).text('close search options').addClass('open');

		}
	});

	$('.search-tab').on('click', function () {
		var $index = $(this).index();
		$('.search-tab-content').hide().eq($index).fadeIn();
		$('.search-tab').removeClass('active').eq($index).addClass('active');
		return false;
	});

	$('.header-account a').on('click', function () {
		$('.overlay').fadeIn(function () {
			$('.autorize-popup').animate({ top: '50%' }, 300).find('input:text').eq('0').focus();
		});
		return false;
	});

	$('.overlay').on('click', function () {
		$('.autorize-popup').animate({ top: '-300px' }, 300, function () {
			$('.overlay').fadeOut();
		});
	});

	$('.autorize-tab-content').eq('0').css('display', 'block');
	$('.autorize-tabs a').on('click', function () {
		if ($(this).is('.autorize-close')) {
			$('.autorize-popup').animate({ top: '-300px' }, 300, function () {
				$('.overlay').fadeOut();
			});
		} else {
			var $index = $(this).index();
			$('.autorize-tabs a').removeClass('current').eq($index).addClass('current');
			$('.autorize-tab-content').hide().eq($index).fadeIn().find('input:text').eq('0').focus();
		}
		return false;
	});

	$('map area').on({
		mouseenter: function () {
			var $id = $(this).attr('id');
			$('.regions-holder .' + $id).css('background-position', 'left -177px');
			$('.regions-nav a.' + $id).addClass('chosen');
		},
		mouseleave: function () {
			var $id = $(this).attr('id');
			$('.regions-holder .' + $id).css('background-position', 'left 0px');
			$('.regions-nav a.' + $id).removeClass('chosen');
		}
	}, $(this));


	$('.regions-nav a').on({
		mouseenter: function () {
			var $id = $(this).attr('class');
			$('.regions-holder .' + $id).css('background-position', 'left -177px');
		},
		mouseleave: function () {
			var $id = $(this).attr('class');
			$('.regions-holder .' + $id).css('background-position', 'left 0px');
		}
	}, $(this));

	$('.gallery-i a').on('click', function () {
		var $href = $(this).attr('href');
		$('.gallery-i').removeClass('active');
		$(this).closest('.gallery-i').addClass('active');
		$('.tab-gallery-big img').attr('src', $href);
		return false;
	});
	$('.content-tabs-head a').on('click', function () {
		var $index = $(this).closest('li').index();
		$('.content-tabs-head a').removeClass('active');
		$('.content-tabs-head li').eq($index).find('a').addClass('active');
		$('.content-tabs-i').hide().eq($index).fadeIn();
		return false;
	});
	$('.faq-item-a').on('click', function () {
		var $parent = $(this).closest('.faq-item');
		if ($parent.is('.open')) {
			$parent.find('.faq-item-p').hide();
			$('.faq-item').removeClass('open');
		} else {
			$('.faq-item').removeClass('open');
			$('.faq-item-p').hide();
			$parent.addClass('open').find('.faq-item-p').fadeIn();
		}
	});

	$('.h-tab-i a').on('click', function () {
		var $index = $(this).closest('.h-tab-i').index();
		$('.h-tab-i').removeClass('active');
		$('.h-tab-i').eq($index).addClass('active');

		if ($(this).is('.initMap')) {
			$('.tab-map').css('opacity', '0');
			$('#preloader').show();
			$('.tab-item').hide().eq($index).fadeIn(function () {
				var mylat = '52.569334';
				var mylong = '13.380216';
				var mapOptions = {
					zoom: 13,
					disableDefaultUI: true,
					zoomControl: true,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.LARGE,
						position: google.maps.ControlPosition.LEFT_CENTER
					},
					center: new google.maps.LatLng(mylat, mylong), // New York 
				};
				var mapElement = document.getElementById('map');
				var map = new google.maps.Map(mapElement, mapOptions);
				google.maps.event.addDomListener(window, 'resize', init);
				google.maps.event.addListenerOnce(map, 'idle', function () {
					var place = new google.maps.LatLng(52.569334, 13.380216);
					var image = new google.maps.MarkerImage('img/map.png',
						new google.maps.Size(19, 29),
						new google.maps.Point(0, 0),
						new google.maps.Point(0, 32));
					var marker = new google.maps.Marker({
						map: map,
						icon: image,
						draggable: false,
						animation: google.maps.Animation.DROP,
						position: place
					});

					$('.tab-map').css('opacity', '1');
					$('#preloader').hide();
					$('.map-contacts').each(function (index) {
						$(this).delay(141 * index).fadeIn();
					});

				});
				google.maps.event.trigger(map, 'resize');
			});
		} else {
			$('.tab-item').hide().eq($index).fadeIn();
		}
		return false;
	});

	$('.tabs-nav a').on('click', function () {
		var $parent = $(this).closest('.tabs-block')
		var $index = $(this).closest('li').index();
		$parent.find('.tabs-nav li a').removeClass('active');
		$parent.find('.tabs-nav li').eq($index).find('a').addClass('active');
		$parent.find('.tabs-content-i').hide().eq($index).fadeIn();
		return false;
	});

	$('.accordeon-a').on('click', function () {
		var $parent = $(this).closest('.accordeon-item');
		$('.accordeon-item').removeClass('open');
		$('.accordeon-b').hide();
		$parent.addClass('open').find('.accordeon-b').fadeIn();
	});

	$('.toggle-trigger').on('click', function () {
		var $parent = $(this).closest('.toggle-i');
		if ($parent.is('.open')) {
			$parent.removeClass('open').find('.toggle-txt').hide();
		} else {
			$parent.addClass('open').find('.toggle-txt').fadeIn();
		}
		return false;
	});

	$('.shareholder span').on('click', function () {
		if ($(this).is('.open')) {
			$('.share-popup').hide();
			$(this).removeClass('open');
		} else {
			$('.share-popup').fadeIn();
			$(this).addClass('open');
		}

		return false;
	});

	$('.payment-tabs a').on('click', function () {
		var $index = $(this).index();
		$('.payment-tab').hide().eq($index).fadeIn();
		$('.payment-tabs a').removeClass('active').eq($index).addClass('active');
		return false;
	});

	$('.solutions-i').on({
		mouseenter: function () {
			$(this).find('.solutions-over').css('background', 'rgba(0,0,0,0.7)');
			$(this).find('.solutions-over-c').hide();
			$(this).find('.solutions-over-d').fadeIn(500);
		},
		mouseleave: function () {
			$(this).find('.solutions-over').css('background', 'rgba(0,0,0,0.5)');
			$(this).find('.solutions-over-d').hide();
			$(this).find('.solutions-over-c').fadeIn(700);
		}
	}, $(this));



	$('.date-inpt').datepicker();
	$('.custom-select').customSelect();
	$(".owl-slider").owlCarousel({
		items: 4,
		autoPlay: 3000,
		itemsDesktop: [1120, 4], //5 items between 1000px and 901px
		itemsDesktopSmall: [900, 2], // betweem 900px and 601px
		itemsTablet: [620, 2], //2 items between 600 and 479
		itemsMobile: [479, 1], //1 item between 479 and 0
		stopOnHover: true
	});

	$('#testimonials-slider').bxSlider({
		infiniteLoop: true,
		speed: 600,
		minSlides: 1,
		maxSlides: 1,
		moveSlides: 1,
		auto: false,
		slideMargin: 0
	});

	$slideHover();

	$(window).on('resize', function () {
		var $width = $(document).width();
		if ($width > 900) {
			$('.mobile-menu').hide();
			$('.menu-btn').removeClass('open');
		}
	});

});


function init_validation(target) {
	"use strict";
	function validate(target) {
		var valid = true;
		$(target).find('.req').each(function () {
			if ($(this).val() == '') {
				valid = false;
				$(this).parent().addClass('errored');
			}
			else {
				$(this).parent().removeClass('errored');
			}
		});
		return valid;
	}

	$('form.w_validation').on('submit', function (e) {
		var valid = validate(this);
		if (!valid) e.preventDefault();
	});

	if (target) { return validate(target); }
}

//price sort done
var rooms = $('.flight-item');
var roomList = $('#catalog');

$('#price-sort').change(function () {
	if ($(this).val() == 1) {
		sortAsc();
	}
	else if ($(this).val() == 2) {
		sortDesc();
	}
});

function sortAsc() {
	roomList.empty();
	rooms.sort(function (a, b) {
		return $(a).data('price') - $(b).data('price')
	});
	roomList.append(rooms);
}
function sortDesc() {
	roomList.empty();
	rooms.sort(function (a, b) {
		return $(b).data('price') - $(a).data('price')
	});
	roomList.append(rooms);
}

//departure sort done
var departure = $('.flight-item');
var departureList = $('#catalog');

$('#departure-sort').change(function () {
	if ($(this).val() == 1) {
		sortAsc();
	}
	else if ($(this).val() == 2) {
		sortDesc();
	}
});

function sortAsc() {
	departureList.empty();
	departure.sort(function (a, b) {
		return $(a).data('departure') - $(b).data('departure')
	});
	departureList.append(departure);
}
function sortDesc() {
	departureList.empty();
	departure.sort(function (a, b) {
		return $(b).data('departure') - $(a).data('departure')
	});
	departureList.append(departure);
}

//duration sort done
var duration = $('.flight-item');
var durationList = $('#catalog');

$('#duration-sort').change(function () {
	if ($(this).val() == 1) {
		sortAsc();
	}
	else if ($(this).val() == 2) {
		sortDesc();
	}
});

function sortAsc() {
	durationList.empty();
	duration.sort(function (a, b) {
		return $(a).data('duration') - $(b).data('duration')
	});
	durationList.append(duration);
}
function sortDesc() {
	durationList.empty();
	duration.sort(function (a, b) {
		return $(b).data('duration') - $(a).data('duration')
	});
	durationList.append(duration);
}
//filtersss
var byFlightt = [], frombyStops = [], tobyStops = [], frombyClasses = [], tobyClasses = [], byStops = [], byClasses = [];

$("input[name=airline]").on("change", function () {

	if (this.checked) {
		byFlightt.push("[data-category~='" + $(this).val() + "']");
	} else {
		removeA(byFlightt, "[data-category~='" + $(this).val() + "']");
	}
	applyFilters();
	//   alert(byFlightt);
});
$("input[name=nonstop]").on("change", function () {
	if (this.checked) {
		byStops.push("[data-Category1~='" + $(this).val() + "']");
	} else {
		removeA(byStops, "[data-Category1~='" + $(this).val() + "']");
	}
	applyFilters();
});
$("input[name=fromstop]").on("change", function () {
	if (this.checked) {
		frombyStops.push("[datas-category~='" + $(this).val() + "']");
	} else {
		removeA(frombyStops, "[datas-category~='" + $(this).val() + "']");
	}
	applyFilters();
});
$("input[name=tostop]").on("change", function () {
	if (this.checked) {
		tobyStops.push("[data-categorys~='" + $(this).val() + "']");
	} else {
		removeA(tobyStops, "[data-categorys~='" + $(this).val() + "']");
	}
	applyFilters();
});
$("input[name=cabinclass]").on("change", function () {
	if (this.checked) {
		byClasses.push("[data-category~='" + $(this).val() + "']");
	} else {
		removeA(byClasses, "[data-category~='" + $(this).val() + "']");
	}
	applyFilters();
});
$("input[name=fromclass]").on("change", function () {
	if (this.checked) {
		frombyClasses.push("[data-category~='" + $(this).val() + "']");
	} else {
		removeA(frombyClasses, "[data-category~='" + $(this).val() + "']");
	}
	applyFilters();
});
$("input[name=toclass]").on("change", function () {
	if (this.checked) {
		tobyClasses.push("[data-category2~='" + $(this).val() + "']");
	} else {
		removeA(tobyClasses, "[data-category2~='" + $(this).val() + "']");
	}
	applyFilters();
});

function removeA(arr) {
	var what;
	var a = arguments;
	var L = a.length;
	var ax;
	while (L > 1 && arr.length) {
		what = a[--L];
		while ((ax = arr.indexOf(what)) !== -1) {
			arr.splice(ax, 1);
		}
	}
	return arr;
}

function applyFilters() {
	var selector = "";
	if (byFlightt.length) {
		selector += byFlightt.join(",");
	}
	if (byStops.length) {
		if (selector.length) {
			selector += ",";
		}
		selector += byStops.join(",");
	}
	if (frombyStops.length) {
		if (selector.length) {
			selector += ",";
		}
		selector += frombyStops.join(",");
	}
	if (tobyStops.length) {
		if (selector.length) {
			selector += ",";
		}
		selector += tobyStops.join(",");
	}
	if (byClasses.length) {
		if (selector.length) {
			selector += ",";
		}
		selector += byClasses.join(",");
	}
	if (frombyClasses.length) {
		if (selector.length) {
			selector += ",";
		}
		selector += frombyClasses.join(",");
	}
	if (tobyClasses.length) {
		if (selector.length) {
			selector += ",";
		}
		selector += tobyClasses.join(",");
	}

	if (selector.length) {
		$("#catalog .flight-item").hide();
		$(selector).show();
	} else {
		$("#catalog .flight-item").show();
	}


}

// Cloning Form
//   var id_count = 1;
//   $('.add').on('click', function() {
// 	var source = $('.booking-form:first'), clone = source.clone();

// 	clone.find(':input').val('');
// 	clone.find('[name="gender[]"]').prop('selectedIndex', 0);
//     clone.find(':input').attr('id', function(i, val) {
// 	return val + id_count;

//     });

// 	clone.appendTo('.booking-form-append');
//     id_count++;
//   });

// // Removing Form Field
// $('body').on('click', '.remove', function() {
//     var closest = $(this).closest('.booking-form').remove();
//   });


function removeA(arr) {
	var what, a = arguments, L = a.length, ax;
	while (L > 1 && arr.length) {
		what = a[--L];
		while ((ax = arr.indexOf(what)) !== -1) {
			arr.splice(ax, 1);
		}
	}
	return arr;
}










