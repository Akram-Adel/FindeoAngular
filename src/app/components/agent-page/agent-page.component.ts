import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';
import { SearchService } from '../../services/search.service';

declare var $:any;

@Component({
  selector: 'app-agent-page',
  templateUrl: './agent-page.component.html',
  styleUrls: ['./agent-page.component.css']
})
export class AgentPageComponent implements OnInit,OnDestroy {

  language:string;
  subscription:any;
  agent:any = {};
  resultsNum:number = 0;
  numOfPages:number = 0;
  currentPage:number = 1; startSlice:number = 0; endSlice:number = 6;
  Math:any;

  searchForm:FormGroup;
  servicetypeList:any;
  propertytypeList:any; isProperty:boolean = false; isLand:boolean = false;



  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService,
    private api:ApiService,
    private http:HttpClient,
    private searchService:SearchService,
    private fb:FormBuilder,
    private router:Router) {

      this.searchForm = this.fb.group({
        serviceType: [null, Validators.required],
        propertyType: [null, Validators.required],
        bathrooms: [null], bedrooms: [null]
      })
    }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    this.Math = Math;
    let id = this.route.snapshot.paramMap.get('id');
    this.http.get(this.api.link+'/api/public/agents/'+id).subscribe(res => {this.searchService.newAgent(res); this.searchService.getAgentProperties()})
    this.subscription = this.searchService.searchImages$.subscribe(res => this.gotAgent())
  }

  MY_ngAfterViewInit() {
    this.rangeSlider();
    this.chosenPlugin();
    this.searchOptions();
    this.owlCarousel();
    this.layoutSwitcher();
    this.fotterPadding();

    this.chosenServiceType(); this.chosenChange();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



  rangeSlider() {
    // Area Range
    $("#area-range").each(function() {
      var dataMin = $(this).attr('data-min');
      var dataMax = $(this).attr('data-max');
      var dataUnit = $(this).attr('data-unit');

      $(this).append( "<input type='text' class='first-slider-value'disabled/><input type='text' class='second-slider-value' disabled/>" );

      $(this).slider({
        range: true,
        min: dataMin,
        max: dataMax,
        step: 10,
        values: [ dataMin, dataMax ],

        slide: function( event, ui ) {
          event = event;
          $(this).children( ".first-slider-value" ).val( ui.values[ 0 ]  + " " + dataUnit );
          $(this).children( ".second-slider-value" ).val( ui.values[ 1 ] + " " +  dataUnit );
        }
      });

      $(this).children( ".first-slider-value" ).val( $( this ).slider( "values", 0 ) + " " + dataUnit );
      $(this).children( ".second-slider-value" ).val( $( this ).slider( "values", 1 ) + " " + dataUnit );
    });

    // Price Range
    $("#price-range").each(function() {
      var dataMin = $(this).attr('data-min');
      var dataMax = $(this).attr('data-max');
      var dataUnit = $(this).attr('data-unit');

      $(this).append( "<input type='text' class='first-slider-value' disabled/><input type='text' class='second-slider-value' disabled/>" );

      $(this).slider({
        range: true,
        min: dataMin,
        max: dataMax,
        values: [ dataMin, dataMax ],

        slide: function( event, ui ) {
          event = event;
          $(this).children( ".first-slider-value" ).val( dataUnit  + ui.values[ 0 ].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
          $(this).children( ".second-slider-value" ).val( dataUnit +  ui.values[ 1 ].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
        }
      });

      $(this).children( ".first-slider-value" ).val( dataUnit + $( this ).slider( "values", 0 ).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
      $(this).children( ".second-slider-value" ).val( dataUnit  +  $( this ).slider( "values", 1 ).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
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

			if(winWidth < 1366) {
				if ( $(".fs-listings").is(".list-layout") ) {
					$('.listing-item').each(function(){
						$(this).find(resizeObjects).css('height', 'auto');
					});
				}
			}
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
  fotterPadding() {
    $('router-outlet ~ *').children().first().css('background-color', '#fff');
    $('router-outlet ~ *').children().first().css('margin-bottom', $('.sticky-footer').outerHeight( true )+'px');
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
      setTimeout(() => $('.api-updated-propertytype').trigger("chosen:updated"), 100);
    }

    // attach a change event
    $('.api-updated-propertytype').on('change', (ev, params) => {
      self.searchForm.controls.propertyType.setValue(params.selected);
      (params.selected == 'LAND' || params.selected == 'FARM') ? self.isLand = true : self.isLand = false;
    })
  }
  chosenChange() {
    let self = this;

    $('.chosen-bathrooms').on('change', (ev, params) => self.searchForm.controls.bathrooms.setValue(params.selected) )
    $('.chosen-bedrooms').on('change', (ev, params) => self.searchForm.controls.bedrooms.setValue(params.selected) )
  }


  gotAgent() {
    let ar = this.searchService.agentResult;
    this.agent = {
      id: ar.id,
      image: (ar.logo.s3Path) ? ar.logo.s3Path : "assets/images/agent-01.jpg",
      name: ar.name,
      about: ar.description,
      phone: ar.phone,
      email: ar.email,
      listings: []
    }
    // sale listings
    for(let i=0; i<ar.saleListing.length; i++) {
      let l = ar.saleListing[i]
      this.agent.listings.push({
        id: l.id,
        featured: false,
        state: (l.serviceType == 'SALE') ? 'For Sale' : 'For Rent',
        price: l.price,
        priceDetail: l.currency,
        image: (l.images[0].image.s3Path) ? l.images[0].image.s3Path : "assets/images/listing-01.jpg",
        name: l.title,
        mapUrl: null,
        adress: l.location.city +' '+ l.location.street,
        area: l.landSize +' '+l.landSizeMeasureType,
        bedrooms: l.bedrooms,
        bathrooms: l.bathrooms
      })
    }
    // rent listings
    for(let i=0; i<ar.rentalListing.length; i++) {
      let l = ar.rentalListing[i]
      this.agent.listings.push({
        id: l.id,
        featured: false,
        state: (l.serviceType == 'SALE') ? 'For Sale' : 'For Rent',
        price: l.price,
        priceDetail: l.currency,
        image: (l.images[0].image.s3Path) ? l.images[0].image.s3Path : "assets/images/listing-01.jpg",
        name: l.title,
        mapUrl: null,
        adress: l.location.city +' '+ l.location.street,
        area: l.landSize +' '+l.landSizeMeasureType,
        bedrooms: l.bedrooms,
        bathrooms: l.bathrooms
      })
    }

    this.resultsNum = this.agent.listings.length;
    this.numOfPages = this.resultsNum / 6;

    setTimeout(() => {
      this.MY_ngAfterViewInit();
      $('.overlay').fadeOut();
    }, 100);
  }

  prevPage() {
    if(this.currentPage == 1) return;
    this.currentPage -= 1;
    this.startSlice -= 6;
    this.endSlice -= 6;
    $('.fs-inner-container:nth-child(2)>div').animate({
      scrollTop: 100
    }, 500)
  }
  nextPage() {
    if(this.numOfPages == 0) return;
    if(this.currentPage == Math.ceil(this.numOfPages)) return;
    this.currentPage += 1;
    this.startSlice += 6;
    this.endSlice += 6;
    $('.fs-inner-container:nth-child(2)>div').animate({
      scrollTop: 100
    }, 500)
  }


  search() {
    let paramsStr = `serviceType.in=${this.searchForm.controls.serviceType.value}&propertyType.in=${this.searchForm.controls.propertyType.value}&size=1000`;
    if(this.searchForm.controls.bedrooms.value  !== null) paramsStr += `&bedrooms.greaterOrEqualThan=${this.searchForm.controls.bedrooms.value}`;
    if(this.searchForm.controls.bathrooms.value !== null) paramsStr += `&bathrooms.greaterOrEqualThan=${this.searchForm.controls.bathrooms.value}`;
    paramsStr += `&price.greaterOrEqualThan=${$("#price-range").children( ".first-slider-value" ).val().replace(',','')}`;
    paramsStr +=   `&price.lessOrEqualThan=${$("#price-range").children( ".second-slider-value" ).val().replace(',','')}`;

    const httpOptions = {
      params: new HttpParams({ fromString: paramsStr })
    }
    this.http.get(this.api.link+'/api/public/properties', httpOptions).subscribe({
      next: res => { this.searchService.newSearch(res); this.router.navigate([this.language+'/listings/default'])},
      error: err => this.api.API_ERROR(err, this.language)
    });
  }

}
