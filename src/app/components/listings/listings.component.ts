import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';
import { CompareService } from '../../services/compare.service';

declare var google:any;
declare var InfoBox:any;
declare var MarkerClusterer:any;
declare var $:any;

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit,AfterViewInit,OnDestroy {

  language:string;
  apiLocations:any = [];
  Math:any;
  resultsNum:number = 0;
  numOfPages:number = 0;
  listingResults:any = [];

  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService,
    private apiService:ApiService,
    private compareService:CompareService) { this.Math = Math; }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    $('app-footer').css('display','none');

    //Get all listing locations on the map given the URL area
    this.getLocations();

    //Get listing results
    this.listingResults = this.apiService.api.foundResults;
  }

  ngAfterViewInit() {
    this.searchOptions();
    this.owlCarousel();
    this.layoutSwitcher();
    this.chosenPlugin();
    this.magnificPopup();
    this.eventListeners();

    this.styleAdjust();

    this.initMap(this.apiLocations);
  }

  ngOnDestroy() {
    $('app-footer').css('display','block');
  }



  searchOptions() {
    $('.more-search-options-trigger').on('click', function(e){
        e.preventDefault();
      $('.more-search-options, .more-search-options-trigger').toggleClass('active');
      $('.more-search-options.relative').animate({height: 'toggle', opacity: 'toggle'}, 300);
    });
  }
  owlCarousel() {
    $('.listing-carousel').owlCarousel({
      autoPlay: false,
      navigation: true,
      slideSpeed: 800,
      items : 1,
      itemsDesktop : [1239,1],
      itemsTablet : [991,1],
      itemsMobile : [767,1]
    });

    $('.owl-next, .owl-prev').on("click", function (e) {
      e.preventDefault();
    });
  }
  layoutSwitcher() {
    var listingsContainer = $('.listings-container');

		// switcher buttons / anchors
		if ( $(listingsContainer).is(".list-layout") ) {
			owlReload();
			$('.layout-switcher a.grid, .layout-switcher a.grid-three').removeClass("active");
			$('.layout-switcher a.list').addClass("active");
		}

		if ( $(listingsContainer).is(".grid-layout") ) {
			owlReload();
			$('.layout-switcher a.grid').addClass("active");
			$('.layout-switcher a.grid-three, .layout-switcher a.list').removeClass("active");
			gridClear(2);
		}

		if ( $(listingsContainer).is(".grid-layout-three") ) {
			owlReload();
			$('.layout-switcher a.grid, .layout-switcher a.list').removeClass("active");
			$('.layout-switcher a.grid-three').addClass("active");
			gridClear(3);
		}


		// grid cleaning
		function gridClear(gridColumns) {
			$(listingsContainer).find(".clearfix").remove();
			$(".listings-container > .listing-item:nth-child("+gridColumns+"n)").after("<div class='clearfix'></div>");
		}


		// objects that need to resized
		var resizeObjects =  $('.listings-container .listing-img-container img, .listings-container .listing-img-container');

		// if list layout is active
		function listLayout() {
			if ( $('.layout-switcher a').is(".list.active") ) {

				$(listingsContainer).each(function(){
					$(this).removeClass("grid-layout grid-layout-three");
					$(this).addClass("list-layout");
				});

				$('.listing-item').each(function(){
					var listingContent = $(this).find('.listing-content').height();
          $(this).find(resizeObjects).css('height', ''+listingContent+'');
        });

      }
		} listLayout();

		$(window).on('load resize', function() {
			listLayout();
		});


		// if grid layout is active
		$('.layout-switcher a.grid').on('click', function(e) { gridClear(2); });

		function gridLayout() {
			if ( $('.layout-switcher a').is(".grid.active") ) {

				$(listingsContainer).each(function(){
					$(this).removeClass("list-layout grid-layout-three");
					$(this).addClass("grid-layout");
				});

				$('.listing-item').each(function(){
          $(this).find(resizeObjects).css('height', 'auto');
				});

			}
		} gridLayout();


		// if grid layout is active
		$('.layout-switcher a.grid-three').on('click', function(e) { gridClear(3); });

		function gridThreeLayout() {
			if ( $('.layout-switcher a').is(".grid-three.active") ) {

				$(listingsContainer).each(function(){
					$(this).removeClass("list-layout grid-layout");
					$(this).addClass("grid-layout-three");
				});

				$('.listing-item').each(function(){
					$(this).find(resizeObjects).css('height', 'auto');
				});

			}
		} gridThreeLayout();


		// Mobile fixes
		$(window).on('resize', function() {
			$(resizeObjects).css('height', '0');
			listLayout();
			gridLayout();
			gridThreeLayout();
    });

    function helperLoadResize() {
      var winWidth = $(window).width();

			if(winWidth < 992) {
				owlReload();

				// reset to two columns grid
				gridClear(2);
			}

			if(winWidth > 992) {
				if ( $(listingsContainer).is(".grid-layout-three") ) {
					gridClear(3);
				}
				if ( $(listingsContainer).is(".grid-layout") ) {
					gridClear(2);
				}
			}

			if(winWidth < 768) {
				if ( $(listingsContainer).is(".list-layout") ) {
					$('.listing-item').each(function(){
						$(this).find(resizeObjects).css('height', 'auto');
					});
				}
			}

			// if(winWidth < 1366) {
			// 	if ( $(".fs-listings").is(".list-layout") ) {
			// 		$('.listing-item').each(function(){
			// 			$(this).find(resizeObjects).css('height', 'auto');
			// 		});
			// 	}
			// }
    } helperLoadResize();

		$(window).on('resize', function() {
			helperLoadResize();
		});


		// owlCarousel reload
		function owlReload() {
			$('.listing-carousel').each(function(){
				$(this).data('owlCarousel').reload();
			});
		}


	    // switcher buttons
		$('.layout-switcher a').on('click', function(e) {
      e.preventDefault();

      var switcherButton = $(this);
      switcherButton.addClass("active").siblings().removeClass('active');

		    // reset images height
			$(resizeObjects).css('height', '0');

		    // carousel reload
			owlReload();

		    // if grid layout is active
			gridLayout();

		    // if three columns grid layout is active
			gridThreeLayout();

			// if list layout is active
			listLayout();

    });
  }
  chosenPlugin() {
    var config = {
      '.chosen-select'           : {disable_search_threshold: 10, width:"100%"},
      '.chosen-select-deselect'  : {allow_single_deselect:true, width:"100%"},
      '.chosen-select-no-single' : {disable_search_threshold:100, width:"100%"},
      '.chosen-select-no-single.no-search' : {disable_search_threshold:10, width:"100%"},
      '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
      '.chosen-select-width'     : {width:"95%"}
    };

    for (var selector in config) {
      if (config.hasOwnProperty(selector)) {
        $(selector).chosen(config[selector]);
      }
    }

    /*  Custom Input With Select
    /*----------------------------------------------------*/
    $('.select-input').each(function(){
      var thisContainer = $(this);
      var $this = $(this).children('select'), numberOfOptions = $this.children('option').length;

      $this.addClass('select-hidden');
      $this.wrap('<div class="select"></div>');
      $this.after('<div class="select-styled"></div>');
      var $styledSelect = $this.next('div.select-styled');
      $styledSelect.text($this.children('option').eq(0).text());

      var $list = $('<ul />', {
        'class': 'select-options'
      }).insertAfter($styledSelect);

      for (var i = 0; i < numberOfOptions; i++) {
        $('<li />', {
          text: $this.children('option').eq(i).text(),
          rel: $this.children('option').eq(i).val()
        }).appendTo($list);
      }

      var $listItems = $list.children('li');

      $list.wrapInner('<div class="select-list-container"></div>');


      $(this).children('input').on('click', function(e){
        $('.select-options').hide();
        e.stopPropagation();
        $styledSelect.toggleClass('active').next('ul.select-options').toggle();
      });

      $(this).children('input').keypress(function() {
        $styledSelect.removeClass('active');
        $list.hide();
      });


      $listItems.on('click', function(e){
        e.stopPropagation();
        // $styledSelect.text($(this).text()).removeClass('active');
        $(thisContainer).children('input').val( $(this).text() ).removeClass('active');
        $this.val($(this).attr('rel'));
        $list.hide();
        //console.log($this.val());
      });

      $(document).on('click', function(e){
        $styledSelect.removeClass('active');
        $list.hide();
      });


      // Unit character
      var fieldUnit = $(this).children('input').attr('data-unit');
      $(this).children('input').before('<i class="data-unit">'+ fieldUnit + '</i>');
    });
  }
  magnificPopup() {
    $('body').magnificPopup({
      type: 'image',
      delegate: 'a.mfp-gallery',

      fixedContentPos: true,
      fixedBgPos: true,

      overflowY: 'auto',

      closeBtnInside: false,
      preloader: true,

      removalDelay: 0,
      mainClass: 'mfp-fade',

      gallery:{enabled:true}
    });

    $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
      disableOn: 700,
      type: 'iframe',
      mainClass: 'mfp-fade',
      removalDelay: 160,
      preloader: false,

      fixedContentPos: false
    });
  }
  eventListeners() {
    /*----------------------------------------------------*/
    /*  Tooltips
    /*----------------------------------------------------*/
    $(".compare-button.with-tip, .like-icon.with-tip, .widget-button.with-tip").each(function() {
      $(this).on('click', function(e){
          e.preventDefault();
      });
      var tipContent = $(this).attr('data-tip-content');
      $(this).append('<div class="tip-content">'+ tipContent + '</div>');
    });

    // Demo Purpose Trigger
    $('.compare-button, .compare-widget-button').on('click', function(){
      $('.compare-slide-menu').addClass('active');
    });

    $(".remove-from-compare").on('click', function(e){
        e.preventDefault();
    });

    /*----------------------------------------------------*/
    /*  Like Icon Trigger
    /*----------------------------------------------------*/
    $('.like-icon, .widget-button').on('click', function(e){
    	e.preventDefault();
      $(this).toggleClass('liked');
      $(this).children('.like-icon').toggleClass('liked');
    });
  }

  styleAdjust() {
    var topbarHeight = $("#top-bar").height();
    var headerHeight = $("#header").innerHeight() + topbarHeight;
    $(".fs-container").css('height', '' + ( $(window).height() - headerHeight ) +'px');

    $(window).on('load resize', function() {
      var topbarHeight = $("#top-bar").height();
      var headerHeight = $("#header").innerHeight() + topbarHeight;
      $(".fs-container").css('height', '' + ( $(window).height() - headerHeight ) +'px');
    });
  }

  markerIcon = {
    path: 'M19.9,0c-0.2,0-1.6,0-1.8,0C8.8,0.6,1.4,8.2,1.4,17.8c0,1.4,0.2,3.1,0.5,4.2c-0.1-0.1,0.5,1.9,0.8,2.6c0.4,1,0.7,2.1,1.2,3 c2,3.6,6.2,9.7,14.6,18.5c0.2,0.2,0.4,0.5,0.6,0.7c0,0,0,0,0,0c0,0,0,0,0,0c0.2-0.2,0.4-0.5,0.6-0.7c8.4-8.7,12.5-14.8,14.6-18.5 c0.5-0.9,0.9-2,1.3-3c0.3-0.7,0.9-2.6,0.8-2.5c0.3-1.1,0.5-2.7,0.5-4.1C36.7,8.4,29.3,0.6,19.9,0z M2.2,22.9 C2.2,22.9,2.2,22.9,2.2,22.9C2.2,22.9,2.2,22.9,2.2,22.9C2.2,22.9,3,25.2,2.2,22.9z M19.1,26.8c-5.2,0-9.4-4.2-9.4-9.4 s4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4S24.3,26.8,19.1,26.8z M36,22.9C35.2,25.2,36,22.9,36,22.9C36,22.9,36,22.9,36,22.9 C36,22.9,36,22.9,36,22.9z M13.8,17.3a5.3,5.3 0 1,0 10.6,0a5.3,5.3 0 1,0 -10.6,0',
    strokeOpacity: 0,
    strokeWeight: 1,
    fillColor: '#274abb',
    fillOpacity: 1,
    rotation: 0,
    scale: 1,
    anchor: new google.maps.Point(19,50)
  }



  locationData(locationURL,locationPrice,locationPriceDetails,locationImg,locationTitle,locationAddress) {
    return('<a href="'+ this.route.snapshot.paramMap.get('lng')+'/single-property/'+locationURL +'" class="listing-img-container"><div class="infoBox-close"><i class="fa fa-times"></i></div><div class="listing-img-content"><span class="listing-price">'+ locationPrice +'<i>' + locationPriceDetails +'</i></span></div><img src="'+locationImg+'" alt=""></a><div class="listing-content"><div class="listing-title"><h4><a href="#">'+locationTitle+'</a></h4><p>'+locationAddress+'</p></div></div>')
  }
  getLocations() {
    // Get requested area
    let area = this.route.snapshot.paramMap.get('area');

    // Get Default API response
    if( area == 'default' ) {
      this.apiService.api.defaultListings.forEach( (item, index) => {

        this.apiLocations.push(
          [
            this.locationData(item.LocationURL, item.LocationPrice, item.LocationPriceDetails, item.LocationIMG, item.LocationTitle, item.LocationAddress),
            item.LocationLatitude,
            item.LocationLongitude,
            index,
            this.markerIcon
          ]
        );

      });
    } else {
      this.apiService.api.limitedListings.forEach( (item, index) => {

        this.apiLocations.push(
          [
            this.locationData(item.LocationURL, item.LocationPrice, item.LocationPriceDetails, item.LocationIMG, item.LocationTitle, item.LocationAddress),
            item.LocationLatitude,
            item.LocationLongitude,
            index,
            this.markerIcon
          ]
        );

      });
    }

    this.resultsNum = this.apiLocations.length;
    this.numOfPages = this.resultsNum / 6;
  }
  initMap(locations) {
    var locations = locations;

    var mapZoomAttr = $('#map').attr('data-map-zoom');
    var mapScrollAttr = $('#map').attr('data-map-scroll');

    if (typeof mapZoomAttr !== typeof undefined && mapZoomAttr !== false) {
        var zoomLevel = parseInt(mapZoomAttr);
    } else {
        var zoomLevel = 5;
    }

    if (typeof mapScrollAttr !== typeof undefined && mapScrollAttr !== false) {
      var scrollEnabled:any = parseInt(mapScrollAttr);
    } else {
      var scrollEnabled:any = false;
    }

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: zoomLevel,
      scrollwheel: scrollEnabled,
      center: new google.maps.LatLng(38, -96),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      panControl: false,
      navigationControl: false,
      streetViewControl: false,
      gestureHandling: 'cooperative',

      // Google Map Style
      styles: [{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#747474"},{"lightness":"23"}]},{"featureType":"poi.attraction","elementType":"geometry.fill","stylers":[{"color":"#f38eb0"}]},{"featureType":"poi.government","elementType":"geometry.fill","stylers":[{"color":"#ced7db"}]},{"featureType":"poi.medical","elementType":"geometry.fill","stylers":[{"color":"#ffa5a8"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#c7e5c8"}]},{"featureType":"poi.place_of_worship","elementType":"geometry.fill","stylers":[{"color":"#d6cbc7"}]},{"featureType":"poi.school","elementType":"geometry.fill","stylers":[{"color":"#c4c9e8"}]},{"featureType":"poi.sports_complex","elementType":"geometry.fill","stylers":[{"color":"#b1eaf1"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":"100"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"},{"lightness":"100"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffd4a5"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffe9d2"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"weight":"3.00"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"weight":"0.30"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#747474"},{"lightness":"36"}]},{"featureType":"road.local","elementType":"labels.text.stroke","stylers":[{"color":"#e9e5dc"},{"lightness":"30"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":"100"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#d2e7f7"}]}]

    });


    var boxText:any = document.createElement("div");
    boxText.className = 'map-box'

    var currentInfobox;

    var boxOptions = {
      content: boxText,
      disableAutoPan: true,
      alignBottom : true,
      maxWidth: 0,
      pixelOffset: new google.maps.Size(-60, -55),
      zIndex: null,
      boxStyle: {
        width: "260px"
      },
      closeBoxMargin: "0",
      closeBoxURL: "",
      infoBoxClearance: new google.maps.Size(1, 1),
      isHidden: false,
      pane: "floatPane",
      enableEventPropagation: false,
    };


    var markerCluster, marker, i;
    var allMarkers = [];

    var clusterStyles = [
    {
      textColor: 'white',
      url: '',
      height: 50,
      width: 50
    }
    ];



      // Custom zoom buttons
      var zoomControlDiv:any = document.createElement('div');
      var zoomControl = new ZoomControl(zoomControlDiv, map);

      function ZoomControl(controlDiv, map) {

        zoomControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(zoomControlDiv);
        // Creating divs & styles for custom zoom control
        controlDiv.style.padding = '5px';

        // Set CSS for the control wrapper
        var controlWrapper = document.createElement('div');
        controlDiv.appendChild(controlWrapper);

        // Set CSS for the zoomIn
        var zoomInButton = document.createElement('div');
        zoomInButton.className = "custom-zoom-in";
        controlWrapper.appendChild(zoomInButton);

        // Set CSS for the zoomOut
        var zoomOutButton = document.createElement('div');
        zoomOutButton.className = "custom-zoom-out";
        controlWrapper.appendChild(zoomOutButton);

        // Setup the click event listener - zoomIn
        google.maps.event.addDomListener(zoomInButton, 'click', function() {
          map.setZoom(map.getZoom() + 1);
        });

        // Setup the click event listener - zoomOut
        google.maps.event.addDomListener(zoomOutButton, 'click', function() {
          map.setZoom(map.getZoom() - 1);
        });

    }


    for (i = 0; i < locations.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),

        icon: locations[i][4],
        id : i
      });
      allMarkers.push(marker);

      var ib = new InfoBox();

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          ib.setOptions(boxOptions);
          boxText.innerHTML = locations[i][0];
          ib.open(map, marker);
          currentInfobox = marker.id;
          var latLng = new google.maps.LatLng(locations[i][1], locations[i][2]);
          map.panTo(latLng);
          map.panBy(0,-180);


          google.maps.event.addListener(ib,'domready',function(){
            $('.infoBox-close').click(function(e) {
          e.preventDefault();
                ib.close();
            });
          });

        }
      })(marker, i));

    } //eof for

    var options = {
        imagePath: 'assets/images/',
        styles : clusterStyles,
        minClusterSize : 2

    };

    markerCluster = new MarkerClusterer(map, allMarkers, options);

    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });


    // Scroll enabling button
    var scrollEnabling = $('#scrollEnabling');

    $(scrollEnabling).click(function(e){
        e.preventDefault();
        $(this).toggleClass("enabled");

        if ( $(this).is(".enabled") ) {
          map.setOptions({'scrollwheel': true});
        } else {
          map.setOptions({'scrollwheel': false});
        }
    })


    // Geo location button
    $("#geoLocation").click(function(e){
        e.preventDefault();
        geolocate();
    });

    function geolocate() {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(pos);
                map.setZoom(12);
            });
        }
    }


    // Next / Prev buttons
      $('#nextpoint').click(function(e){
          e.preventDefault();

          map.setZoom(15);

          var index = currentInfobox;
          if (index+1 < allMarkers.length ) {
              google.maps.event.trigger(allMarkers[index+1],'click');

          } else {
              google.maps.event.trigger(allMarkers[0],'click');
          }
      });


    $('#prevpoint').click(function(e){
      e.preventDefault();

      map.setZoom(15);

      if ( typeof(currentInfobox) == "undefined" ) {
          google.maps.event.trigger(allMarkers[allMarkers.length-1],'click');
      } else {
        var index = currentInfobox;
        if(index-1 < 0) {
            //if index is less than zero than open last marker from array
          google.maps.event.trigger(allMarkers[allMarkers.length-1],'click');
        } else {
            google.maps.event.trigger(allMarkers[index-1],'click');
        }
      }
    });
  }



  search() {
    this.apiLocations = [];

    this.apiService.api.searchListins.forEach( (item, index) => {

      this.apiLocations.push(
        [
          this.locationData(item.LocationURL, item.LocationPrice, item.LocationPriceDetails, item.LocationIMG, item.LocationTitle, item.LocationAddress),
          item.LocationLatitude,
          item.LocationLongitude,
          index,
          this.markerIcon
        ]
      );

    });

    this.resultsNum = this.apiLocations.length;
    this.numOfPages = this.resultsNum / 6;
    this.initMap(this.apiLocations);
  }

  addProperty(listing) {
    let property = {
      link: '/'+this.route.snapshot.paramMap.get('lng')+'/single-property/'+listing.id,
      state: listing.state,
      name: listing.title,
      price: listing.price,
      image: listing.images[0],
      area: listing.area,
      rooms: listing.rooms,
      bedrooms: listing.beds,
      bathrooms: listing.bathrooms,
      airConditioning: true,
      swimmingPool: true,
      laundryRoom: true,
      windoCovering: true,
      gym: true,
      internet: true,
      alarm: true,
      age: '---',
      heating: '---',
      parking: '---',
      sewer: '---'
    }

    this.compareService.addProperty(property);
  }


}