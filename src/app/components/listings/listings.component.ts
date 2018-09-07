import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';
import { CompareService } from '../../services/compare.service';
import { SearchService } from '../../services/search.service';
import { UserService } from '../../services/user.service';

import * as _ from 'lodash';

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
  Math:any;

  private searchTerm = new Subject<string>();
  areas$:Observable<any[]>;
  isAutofill:boolean = false;

  isConnecting: boolean = false;
  searchForm:FormGroup;
  servicetypeList:any = [];
  propertytypeList:any = []; isProperty:boolean = false; isLand:boolean = true;
  agetypeList:any = [];
  qualitytypeList:any = [];
  cityList:any = [];
  selectedCity:any = {};

  resultsNum:number = 0;
  numOfPages:number = 0;
  currentPage:number = 1; startSlice:number = 0; endSlice:number = 6;
  subscribtion:any;
  listingResults:any = [];
  apiLocations:any = []; apiDisplayLocations:any = [];

  serviceType:string; propertyType:string; cityId:string; regionId:string;

  saveSearchForm:FormGroup;



  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService,
    private api:ApiService,
    private compareService:CompareService,
    private searchService:SearchService,
    private http:HttpClient,
    private fb:FormBuilder,
    private userService:UserService,
    private router:Router) {

      this.Math = Math;
      this.searchForm = this.fb.group({
        serviceType: [null, Validators.required],
        propertyType: [null, Validators.required],
        city: [null], regionCityId: [null],
        1: [null], 2: [null], 3: [null], //<-- min/max price && min area
        bathrooms: [null], bedrooms: [null],
        ageType: [null], qualityType: [null]
      });
      this.saveSearchForm = this.fb.group({
        name: [null],
        notification: [true]
      })
    }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    this.areas$ = this.searchTerm
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term:string) => this.searchArea(term))
      );

    $('app-footer').css('display','none');

    //Get all listings if search was made
    if(this.searchService.searchResult.length > 0) this.searchService.getSearchImages();
    this.subscribtion = this.searchService.searchImages$.subscribe(res => this.getAds());

    // forSale & forRent links
    this.route.paramMap.map(paraMap => paraMap.get('serviceType')).subscribe(serviceType => this.saleRent(serviceType));
  }

  ngAfterViewInit() {
    this.searchOptions();
    this.layoutSwitcher();
    this.chosenPlugin();
    this.magnificPopup();
    this.styleAdjust();

    this.chosenServiceType(); this.chosenChange(); this.chosenCities();
    // this.chosenAgeType(); this.chosenQualityType();

    this.initMap(this.apiLocations);


    this.serviceType = localStorage.getItem('serviceType');
    this.propertyType = localStorage.getItem('propertyType');
    this.cityId = localStorage.getItem('cityId');
    this.regionId = localStorage.getItem('regionId');
  }

  ngOnDestroy() {
    $('app-footer').css('display','block');
    // this.searchService.searchResult = [];
    this.subscribtion.unsubscribe();
  }



  searchOptions() {
    $('.more-search-options-trigger').on('click', function(e){
        e.preventDefault();
      $('.more-search-options, .more-search-options-trigger').toggleClass('active');
      $('.more-search-options.relative').animate({height: 'toggle', opacity: 'toggle'}, 300);
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
    let self = this;
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
        // console.log($this.val());

        // update search form
        let i = 0;
        $('.select-input').each(function(){
          i ++;
          if($(this).children('input').val()) self.searchForm.controls[i].setValue( $(this).children('input').val() );
          if(!self.searchForm.controls[i]) return;
        })
      });

      $(document).on('click', function(e){
        $styledSelect.removeClass('active');
        $list.hide();
      });


      // Unit character NOT NEEDED
      // var fieldUnit = $(this).children('input').attr('data-unit');
      // $(this).children('input').before('<i class="data-unit">'+ fieldUnit + '</i>');
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

  chosenServiceType() {
    let self = this;

    // get service type array
    this.http.get(this.api.link+'/api/public/properties/service-types/ar').subscribe({
      next: res => putservicetypeArray(res),
      error: err => this.api.API_ERROR(err, this.language)
    })

    // add property type array to the DOM and update the chosenPlugin()
    function putservicetypeArray(servicetype) {
      self.servicetypeList = servicetype;

      setTimeout(() => {
        if(self.serviceType != 'null') {
          self.searchForm.controls.serviceType.setValue(self.serviceType);
          $('.api-updated-servicetype').val(self.serviceType);
          self.chosenPropertyType();
        }
      }, 50);

      setTimeout(() => $('.api-updated-servicetype').trigger("chosen:updated"), 100);
    }

    // attach a change event
    $('.api-updated-servicetype').on('change', (ev, params) => {
      self.searchForm.controls.serviceType.setValue(params.selected);
      self.chosenPropertyType();
    })
  }
  chosenPropertyType() {
    let self = this;
    this.isProperty = true;

    // get property type array
    this.http.get(this.api.link+'/api/public/properties/property-types/ar/'+this.searchForm.controls.serviceType.value).subscribe({
      next: res => putPropertytypeArray(res),
      error: err => this.api.API_ERROR(err, this.language)
    })

    // add property type array to the DOM and update the chosenPlugin()
    function putPropertytypeArray(propertytype) {
      self.propertytypeList = propertytype;
      self.searchForm.controls.propertyType.setValue(null);

      setTimeout(() => {
        if(self.propertyType != 'null') {
          self.searchForm.controls.propertyType.setValue(self.propertyType);
          $('.api-updated-propertytype').val(self.propertyType);
        }
      }, 50);

      setTimeout(() => $('.api-updated-propertytype').trigger("chosen:updated"), 100);
    }

    // attach a change event
    $('.api-updated-propertytype').on('change', (ev, params) => {
      self.searchForm.controls.propertyType.setValue(params.selected);
      (params.selected == 'LAND' || params.selected == 'FARM') ? self.isLand = true : self.isLand = false;
    })
  }
  chosenAgeType() {
    let self = this;

    // get age type array
    this.http.get(this.api.link+'/api/public/properties/age-types/ar').subscribe({
      next: res => putAgetypeArray(res),
      error: err => this.api.API_ERROR(err, this.language)
    })

    // add age type array to the DOM and update the chosenPlugin()
    function putAgetypeArray(agetype) {
      self.agetypeList = agetype;
      setTimeout(() => $('.api-updated-agetype').trigger("chosen:updated"), 100);
    }

    // attach a change event
    $('.api-updated-agetype').on('change', (ev, params) => self.searchForm.controls.ageType.setValue(params.selected) )
  }
  chosenQualityType() {
    let self = this;

    // get service type array
    this.http.get(this.api.link+'/api/public/properties/building-qualities/ar').subscribe({
      next: res => putqualitytypeArray(res),
      error: err => this.api.API_ERROR(err, this.language)
    })

    // add property type array to the DOM and update the chosenPlugin()
    function putqualitytypeArray(qualitytype) {
      self.qualitytypeList = qualitytype;
      setTimeout(() => $('.api-updated-qualitytype').trigger("chosen:updated"), 100);
    }

    // attach a change event
    $('.api-updated-qualitytype').on('change', (ev, params) => self.searchForm.controls.qualityType.setValue(params.selected) )
  }
  chosenChange() {
    let self = this;

    $('.chosen-bathrooms').on('change', (ev, params) => self.searchForm.controls.bathrooms.setValue(params.selected) )
    $('.chosen-bedrooms').on('change', (ev, params) => self.searchForm.controls.bedrooms.setValue(params.selected) )

    $('.chosen-sort').on('change', (ev, params) => {
      let searchQuery = this.searchService.searchQuery.params.toString();

      switch (params.selected) {
        case 'Featured':
        case 'العقارات المميزة':
          searchQuery += '&sort=featured,desc&sort=ad.startDate,desc';
          break;

        case 'Most recent':
        case 'الاحدث':
          searchQuery += '&sort=ad.startDate,desc';
          break;

        case 'Oldest':
        case 'الاقدم':
          searchQuery += '&sort=ad.startDate,asc';
          break;

        case 'Cheaper':
        case 'الارخص':
          searchQuery += '&sort=price,asc';
          break;

        case 'Most expensive':
        case 'الاغلي':
          searchQuery += '&sort=price,desc';
          break;

        default:
          break;
      }

      const httpOptions = {
        params: new HttpParams({ fromString: searchQuery })
      }
      this.http.get(this.api.link+'/api/public/properties', httpOptions).subscribe(res => {
        this.searchService.newSearch(res);
        this.searchService.getSearchImages();
      })
    })
  }

  chosenCities() {
    let self = this;

    // attach a change event
    $('.api-updated-cities').on('change', (ev, params) => {
      if(params.selected == 'null') {
        self.selectedCity = {}; self.searchForm.controls.city.setValue(null);
        $('#areaInput').val(null); self.searchForm.controls.regionCityId.setValue(null);

      } else {
        self.selectedCity = _.find(self.cityList, {name: params.selected});
        self.searchForm.controls.city.setValue(self.selectedCity.id);
        $('#areaInput').val(null); self.searchForm.controls.regionCityId.setValue(null);
      }
    })

    // get city array
    const httpOptions = {
      params: new HttpParams()
        .set( 'parentId.specified', 'false' )
    }
    this.http.get(this.api.link+'/api/public/regions', httpOptions).subscribe({
      next: res => putCityArray(res),
      error: err => this.api.API_ERROR(err, this.language)
    })

    // add city array to the DOM and update the chosenPlugin()
    function putCityArray(cities) {
      self.cityList = cities;

      setTimeout(() => {
        if(self.cityId != 'null') {
          self.searchForm.controls.regionCityId.setValue(self.cityId);
          self.selectedCity = _.find(self.cityList, {id: +self.cityId});
          $('.api-updated-cities').val(self.selectedCity.name)
        }
      }, 50);

      setTimeout(() => $('.api-updated-cities').trigger("chosen:updated"), 100);
    }
  }
  searchInput(term:string):void {
    this.searchTerm.next(term);
  }
  searchArea(term): Observable<any[]> {
    if(!term.trim() || term.trim().length < 4) {
      return of([]);
    }
    this.isAutofill = true;
    return this.http.get<any[]>(this.api.link+'/api/public/regions/search/'+this.selectedCity.id+'/'+term)
  }
  autofill(area) {
    $('#areaInput').val(area.arabicName); this.searchForm.controls.regionCityId.setValue(area.countryId)
  }
  areaBlur() {
    setTimeout(() => this.isAutofill = false, 200);
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
      center: new google.maps.LatLng(33, 44),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      // mapTypeControl: false,
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
  getAds() {
    setTimeout(() => this.layoutSwitcher(), 500);
    this.isConnecting = false;

    this.resultsNum = this.searchService.searchResult.length;
    this.numOfPages = this.resultsNum / 6;
    this.listingResults = []; this.apiLocations = [];

    console.log( this.searchService.searchResult[0] ) // <-- TESTING
    // update listing results
    for(let i=0; i<this.searchService.searchResult.length; i++) {
      let result = this.searchService.searchResult[i];
      this.listingResults.push({
        id: result.id,
        featured: (result.featured) ? true : false,
        status: (result.ad.status == 'SOLD') ? true : false,
        state: (result.serviceType == 'SALE') ? 'For Sale' : 'For Rent',
        price: result.price,
        priceDetail: result.currency,
        image: (result.images) ? ((result.images[0]) ? result.images[0].image.s3Path : this.searchService.dummyImg) : this.searchService.dummyImg,
        title: result.title,
        adress: result.location.city +' '+ result.location.street,
        area: result.landSize +' '+result.landSizeMeasureType,
        beds: result.bedrooms,
        bathrooms: result.bathrooms,
        user: result.ad.user.firstName,
        date:  Math.ceil((Math.abs(new Date().getTime()) - Math.abs(new Date(result.ad.startDate).getTime())) / (1000 * 3600 * 24)),

        location: result.location,

        bookmark: false,
        bookmarkId: null,

        userId: result.ad.user.id,
        agentId: null,
      })
    }

    // update map location
    for(let i=0; i<this.searchService.searchResult.length; i++) {
      let result = this.searchService.searchResult[i];
      let img = (result.images) ? ((result.images[0]) ? result.images[0].image.s3Path : this.searchService.dummyImg) : this.searchService.dummyImg;
      this.apiLocations.push([
        this.locationData( result.id, result.price, result.currency, img, result.title, result.location.city +' '+ result.location.street ),
        result.location.lat,
        result.location.lng,
        i,
        this.markerIcon
      ])
    }
    this.apiDisplayLocations = this.apiLocations.slice(0, 6);
    this.initMap(this.apiDisplayLocations);

    // see bookmarks
    if(this.userService['id']) {
      for(let i=0; i<this.listingResults.length; i++) {
        let result = this.listingResults[i];
        this.http.get<any>(this.api.link+'/api/bookmarks?propertyId.equals='+result.id, this.api.userHeader()).subscribe({
          next: res => {
            if(res.length != 0) {
              this.listingResults[i].bookmark = true;
              this.listingResults[i].bookmarkId = res[0].id;
            }
          },
          error: err => this.api.API_ERROR(err, this.language)
        })
      }
    }

    // see agent
    this.listingResults.forEach(re => {
      this.http.get<any>(this.api.link+'/api/public/agents?userId.equals='+re.userId).subscribe(res => {
        if(res.length != 0) re.agentId = `/${this.language}/agent-page/${res[0].id}`;
        if(res.length != 0) re.user = res[0].name;
      })
    });

    setTimeout(() => this.eventListeners(), 500);
  }

  saleRent(serviceType) {
    this.listingResults = []; this.apiLocations = [];

    let httpOptions;
    if(serviceType == 'forSale') {
      $('.chosen-sort').val(null).trigger("chosen:updated");
      httpOptions = {
        observe: 'response',
        params: new HttpParams()
          .set( 'serviceType.in',  'SALE' )
          .set( 'size', '10')
      }
      localStorage.setItem('cityId', null); localStorage.setItem('propertyType', null); localStorage.setItem('serviceType', null);

    } else if(serviceType == 'forRent') {
      $('.chosen-sort').val(null).trigger("chosen:updated");
      httpOptions = {
        observe: 'response',
        params: new HttpParams()
          .set( 'serviceType.in',  'RENTAL' )
          .set( 'size', '10')
      }
      localStorage.setItem('cityId', null); localStorage.setItem('propertyType', null); localStorage.setItem('serviceType', null);

    } else {
      if( this.searchService.searchQuery) localStorage.setItem('searchQuery', this.searchService.searchQuery.params.toString())
      if(!this.searchService.searchQuery) {
        if(!localStorage.getItem('searchQuery')) return;
        let searchQuery = localStorage.getItem('searchQuery');
        httpOptions = {
          observe: 'response',
          params: new HttpParams({ fromString: searchQuery })
        }
      }
    }

    if(!httpOptions) return;
    this.http.get<any>(this.api.link+'/api/public/properties', httpOptions).subscribe(
      res => {
        let size = res['headers'].get('X-Total-Count');

        if(serviceType == 'forSale') {
          localStorage.setItem('searchQuery', 'serviceType.in=SALE&size='+size);
          httpOptions = {
            params: new HttpParams()
              .set( 'serviceType.in',  'SALE' )
              .set( 'size', size )
          }
          this.http.get(this.api.link+'/api/public/properties', httpOptions).subscribe(res => { this.searchService.newSearch(res); this.searchService.getSearchImages(); this.searchService.searchQuery = httpOptions })

        } else if(serviceType == 'forRent') {
          localStorage.setItem('searchQuery', 'serviceType.in=RENTAL&size='+size);
          httpOptions = {
            params: new HttpParams()
              .set( 'serviceType.in',  'RENTAL' )
              .set( 'size', size )
          }
          this.http.get(this.api.link+'/api/public/properties', httpOptions).subscribe(res => { this.searchService.newSearch(res); this.searchService.getSearchImages(); this.searchService.searchQuery = httpOptions })

        } else {
          httpOptions = {
            params: new HttpParams({ fromString: localStorage.getItem('searchQuery') })
          }
          this.http.get(this.api.link+'/api/public/properties', httpOptions).subscribe(res => { this.searchService.newSearch(res); this.searchService.getSearchImages(); this.searchService.searchQuery = httpOptions })
        }
      }
    )
  }



  search(form) {
    this.isConnecting = true;

    let paramsStr = `serviceType.in=${form.serviceType}&propertyType.in=${form.propertyType}&size=1000`;
      if(form.city)         paramsStr += `&cityId.equals=${form.city}`;
      if(form.regionCityId) paramsStr += `&regionId.equals=${form.regionCityId}`;
      if(form['1'])         paramsStr += `&price.greaterThan=${form['1']}`;
      if(form['2'])         paramsStr += `&price.lessThan=${form['2']}`;
      if(form['3'])         paramsStr += `&landSize.greaterOrEqualThan=${form['3']}`;
      if(form.bedrooms)     paramsStr += `&bedrooms.greaterOrEqualThan=${form.bedrooms}`;
      if(form.bathrooms)    paramsStr += `&bathrooms.greaterOrEqualThan=${form.bathrooms}`;

    const httpOptions = {
      params: new HttpParams({ fromString: paramsStr })
    }
    this.http.get(this.api.link+'/api/public/properties', httpOptions).subscribe(res => {
      this.searchService.newSearch(res);
      this.searchService.getSearchImages();
      this.searchService.searchQuery = httpOptions
    })
  }
  saveSearch(form?) {
    if(!form) {
      if(!this.userService['email']) { this.router.navigate([this.language+'/login']); return; }
      $('.save-search-modal').modal();

      $('.jquery-modal').css('z-index', '9999')
      $('a[href="#close-modal"]').text('')

    } else {
      this.isConnecting = true;
      this.http.post<any>(this.api.link+'/api/searches', {
        name: form.name,
        query: localStorage.getItem('searchQuery'),
        userId: this.userService['id']
      }, this.api.userHeader()).subscribe({
        next: res => {
          if(form.notification) this.http.post(this.api.link+'/api/notifications', {
            frequency: "WEEKLY",
            searchId: res.id
          }, this.api.userHeader()).subscribe(res => { $.modal.close(); this.isConnecting = false; })
        },
        error: err => this.api.API_ERROR(err, this.language)
      });
    }
  }

  prevPage() {
    if(this.currentPage == 1) return;
    this.currentPage -= 1;
    this.startSlice -= 6;
    this.endSlice -= 6;
    this.apiDisplayLocations = this.apiLocations.slice(this.startSlice, this.endSlice)
    this.initMap(this.apiDisplayLocations);
    $('.fs-inner-container:nth-child(2)>div').animate({
      scrollTop: 100
    }, 500)
    setTimeout(() => this.layoutSwitcher(), 500);
  }
  nextPage() {
    if(this.numOfPages == 0) return;
    if(this.currentPage == Math.ceil(this.numOfPages)) return;
    this.currentPage += 1;
    this.startSlice += 6;
    this.endSlice += 6;
    this.apiDisplayLocations = this.apiLocations.slice(this.startSlice, this.endSlice)
    this.initMap(this.apiDisplayLocations);
    $('.fs-inner-container:nth-child(2)>div').animate({
      scrollTop: 100
    }, 500)
    setTimeout(() => this.layoutSwitcher(), 500);
  }

  bookmark(listing) {
    if(listing.bookmark) {
      this.http.delete(this.api.link+'/api/bookmarks/'+listing.bookmarkId, this.api.userHeader()).subscribe({
        next: res => {
          let index = _.findIndex(this.listingResults, ['id', listing.id]);
          this.listingResults[index].bookmark = false;
          this.listingResults[index].bookmarkId = null;
        },
        error: err => this.api.API_ERROR(err, this.language)
      })

    } else {
      this.http.post<any>(this.api.link+'/api/bookmarks',{
        propertyId: listing.id,
        userId: this.userService['id']
      }, this.api.userHeader()).subscribe({
        next: res => {
          let index = _.findIndex(this.listingResults, ['id', listing.id]);
          this.listingResults[index].bookmark = true;
          this.listingResults[index].bookmarkId = res.id;
        },
        error: err => this.api.API_ERROR(err, this.language)
      })
    }
  }


}