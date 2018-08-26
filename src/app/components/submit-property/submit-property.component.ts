import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import * as _ from 'lodash';

import { LanguageService } from '../../services/language.service';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';

declare var $:any;
declare var google:any;
declare var toastr:any;

class Image { id:number; name:string; }

@Component({
  selector: 'app-submit-property',
  templateUrl: './submit-property.component.html',
  styleUrls: ['./submit-property.component.css']
})
export class SubmitPropertyComponent implements OnInit,AfterViewInit {

  language:string;
  isLogged = true;

  gMap:any; gMarker:any;
  cityList:any = [];
  selectedCity:any = {};
  areas$:Observable<any[]>;
  private searchTerm = new Subject<string>();
  isAutofill:boolean = false;
  mapLatLng:any;
  submitForm:FormGroup;
  isConnecting:boolean = false;

  isProperty:boolean = false; isTypes:boolean = false; isLand:boolean = false;
  agetypeList:any = [];
  propertytypeList:any = [];
  servicetypeList:any = [];
  qualitytypeList:any = [];
  currencyList:any = [];
  numberPattern:RegExp = /[0-9\+\-\ ]/;
  pricetypeList:any = [];
  measuretypeList:any = [];
  image:Image[] = [];




  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private languageService:LanguageService,
    private userService:UserService,
    private http:HttpClient,
    private fb:FormBuilder,
    private api:ApiService) {

      this.submitForm = this.fb.group({
        locationAd: this.fb.group({
          city: [null, Validators.required],
          street: [null, Validators.required],
          lat: [null, Validators.required],
          lng: [null, Validators.required],
          regionId: [null, Validators.required],
          regionCityId: [null]
        }),

        adId: [null],
        ageType: [null],
        bathrooms: [null],
        bedrooms: [null],
        propertyType: [null, Validators.required],
        serviceType: [null, Validators.required],
        qualityType: [null],
        currency: [null, Validators.required],
        price: [{value: null, disabled: true}, [Validators.required, Validators.pattern(this.numberPattern)]],
        priceType: [null, Validators.required],
        description: [null, Validators.required],
        landSize: [{value: null, disabled: true}, [Validators.required, Validators.pattern(this.numberPattern)]],
        landSizeMeasureType: [null, Validators.required],
        locationId: [null],
        title: [null, Validators.required],
      })
    }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    this.userService['email'] ? this.isLogged = true : this.isLogged = false;
    this.userService.userUpdate$.subscribe( res => this.userService['email'] ? this.isLogged = true : this.isLogged = false )

    this.areas$ = this.searchTerm
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term:string) => this.searchArea(term))
      );
  }

  ngAfterViewInit() {
    this.dropzoneInit();
    this.tips();
    this.fotterPadding();
    this.chosenPlugin();

    this.chosenCities();
    this.chosenAgeType(); this.chosenServiceType(); this.chosenQualityType();
    this.chosenChange();

    this.initMap();
  }



  dropzoneInit() {
    let self = this;
    $(".dropzone").dropzone({
      url: "http://iq-staging.eu-west-1.elasticbeanstalk.com/api/images/upload-image/properties",
      paramName: 'imageFile',
      headers: { 'Authorization' : 'Bearer '+self.userService.userToken },
      acceptedFiles: '.jpg, .png',
      addRemoveLinks: true,
      dictDefaultMessage: "<i class='sl sl-icon-plus'></i> Click here or drop files to upload",
      init: function() {
        $('input.dz-hidden-input').css('left','auto');
        this.on('removedfile', function(file) {
          remove(file);
        });
        this.on('success', function(file, res) {
          success(file, res);
        });
      }
    });

    // Image Success
    function success(file, res) {
      self.image.push({
        id: res.id,
        name: file.name,
      });
    }

    // Image Remove
    function remove(file) {
      let objectId = _.find(self.image, ['name', file.name]).id;
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization':  'Bearer '+self.userService.userToken,
        })
      }
      self.http.delete(self.api.link+'/api/images/'+objectId, httpOptions).subscribe({
        next: res => console.log(res),
        error: err => self.api.API_ERROR(err, this.language)
      })

      let index = _.findIndex(self.image, ['name', file.name]);
      self.image.splice(index, 1);
    }
  }
  tips() {
    $(".tip").each(function() {
      var tipContent = $(this).attr('data-tip-content');
      $(this).append('<div class="tip-content">'+ tipContent + '</div>');
    });
  }
  fotterPadding() {
    $('router-outlet ~ *').children().first().css('background-color', '#fff');
    $('router-outlet ~ *').children().first().css('margin-bottom', $('.sticky-footer').outerHeight( true )+'px');
  }
  chosenPlugin() {
    var config = {
      '.chosen-select'           : {width:"100%"},
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



  chosenCities() {
    let self = this;

    // attach a change event
    $('.api-updated-cities').on('change', (ev, params) => {
      self.selectedCity = _.find(self.cityList, {name: params.selected});
      self.submitForm.controls.locationAd.patchValue({regionId: self.selectedCity.id})
      mapCenter(); self.submitForm.controls.locationAd.patchValue({lat:self.selectedCity.lat, lng:self.selectedCity.lng});
      $('#areaInput').val(null); self.submitForm.controls.locationAd.patchValue({city: null});
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
      self.selectedCity = cities[0];
      self.submitForm.controls.locationAd.patchValue({regionId: self.selectedCity.id});
      mapCenter(); self.submitForm.controls.locationAd.patchValue({lat:self.selectedCity.lat, lng:self.selectedCity.lng});
      setTimeout(() => $('.api-updated-cities').trigger("chosen:updated"), 100);
    }

    // update map center and marker position
    function mapCenter() {
      self.gMap ? self.gMap.setCenter({ lat:self.selectedCity.lat, lng:self.selectedCity.lng }) : false;
      self.gMarker ? self.gMarker.setPosition({ lat:self.selectedCity.lat, lng:self.selectedCity.lng }) : false;
    }
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
    $('.api-updated-agetype').on('change', (ev, params) => self.submitForm.controls.ageType.setValue(params.selected) )
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
      self.submitForm.controls.serviceType.setValue(params.selected);
      self.chosenPropertyType();
    })
  }
  chosenPropertyType() {
    let self = this;
    this.isProperty = true;

    // get property type array
    this.http.get(this.api.link+'/api/public/properties/property-types/ar/'+this.submitForm.controls.serviceType.value).subscribe({
      next: res => putPropertytypeArray(res),
      error: err => this.api.API_ERROR(err, this.language)
    })

    // add property type array to the DOM and update the chosenPlugin()
    function putPropertytypeArray(propertytype) {
      self.propertytypeList = propertytype;
      self.submitForm.controls.propertyType.setValue(null);
      setTimeout(() => $('.api-updated-propertytype').trigger("chosen:updated"), 100);
    }

    // attach a change event
    $('.api-updated-propertytype').on('change', (ev, params) => {
      self.submitForm.controls.propertyType.setValue(params.selected);
      (params.selected == 'LAND' || params.selected == 'FARM') ? require(false) : require(true);
      self.commonEnable();
    })

    // require and not require
    function require(action:boolean) {
      if(action) {
        self.isLand = false;
        self.submitForm.controls.ageType.setValidators(Validators.required); self.submitForm.controls.ageType.updateValueAndValidity();
        self.submitForm.controls.bathrooms.setValidators(Validators.required); self.submitForm.controls.bathrooms.updateValueAndValidity();
        self.submitForm.controls.bedrooms.setValidators(Validators.required); self.submitForm.controls.bedrooms.updateValueAndValidity();
        self.submitForm.controls.qualityType.setValidators(Validators.required); self.submitForm.controls.qualityType.updateValueAndValidity();
      } else {
        self.isLand = true;
        self.submitForm.controls.ageType.clearValidators(); self.submitForm.controls.ageType.updateValueAndValidity();
        self.submitForm.controls.bathrooms.clearValidators(); self.submitForm.controls.bathrooms.updateValueAndValidity();
        self.submitForm.controls.bedrooms.clearValidators(); self.submitForm.controls.bedrooms.updateValueAndValidity();
        self.submitForm.controls.qualityType.clearValidators(); self.submitForm.controls.qualityType.updateValueAndValidity();
      }
    }
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
    $('.api-updated-qualitytype').on('change', (ev, params) => self.submitForm.controls.qualityType.setValue(params.selected) )
  }
  chosenCurrency(currency) {
    let self = this;

    // add currency array to the DOM and update the chosenPlugin()
    this.currencyList = currency;
    self.submitForm.controls.currency.setValue(null);
    setTimeout(() => $('.api-updated-currency').trigger("chosen:updated"), 100);

    // attach a change event
    $('.api-updated-currency').on('change', (ev, params) => self.submitForm.controls.currency.setValue(params.selected) )
  }
  chosenPriceType(priceType) {
    let self = this;

    // add currency array to the DOM and update the chosenPlugin()
    this.pricetypeList = priceType;
    self.submitForm.controls.priceType.setValue(null);
    setTimeout(() => $('.api-updated-priceType').trigger("chosen:updated"), 100);

    // attach a change event
    $('.api-updated-priceType').on('change', (ev, params) => self.submitForm.controls.priceType.setValue(params.selected) )
  }
  chosenMeasureType(measureType) {
    let self = this;

    // add currency array to the DOM and update the chosenPlugin()
    this.measuretypeList = measureType;
    self.submitForm.controls.landSizeMeasureType.setValue(null);
    setTimeout(() => $('.api-updated-measuretype').trigger("chosen:updated"), 100);

    // attach a change event
    $('.api-updated-measuretype').on('change', (ev, params) => self.submitForm.controls.landSizeMeasureType.setValue(params.selected) )
  }
  chosenChange() {
    let self = this;

    $('.chosen-bathrooms').on('change', (ev, params) => self.submitForm.controls.bathrooms.setValue(params.selected) )
    $('.chosen-bedrooms').on('change', (ev, params) => self.submitForm.controls.bedrooms.setValue(params.selected) )
  }
  commonEnable() {
    this.isTypes = true;
    this.submitForm.controls.price.enable();
    this.submitForm.controls.landSize.enable();

    // get Currency
    this.http.get(this.api.link+'/api/public/properties/currency-types/ar/'+this.submitForm.controls.serviceType.value).subscribe({
      next: res => this.chosenCurrency(res),
      error: err => this.api.API_ERROR(err, this.language)
    })

    // get Price type
    this.http.get(this.api.link+'/api/public/properties/price-types/ar/'+this.submitForm.controls.propertyType.value+'/'+this.submitForm.controls.serviceType.value).subscribe({
      next: res => this.chosenPriceType(res),
      error: err => this.api.API_ERROR(err, this.language)
    })

    // get land Size Measure Type
    this.http.get(this.api.link+'/api/public/properties/land-measure-types/ar/'+this.submitForm.controls.propertyType.value).subscribe({
      next: res => this.chosenMeasureType(res),
      error: err => this.api.API_ERROR(err, this.language)
    })
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
  initMap() {
    let self = this;
    let myLatLng = {lng: $( '#propertyMap' ).data('longitude'), lat: $( '#propertyMap' ).data('latitude') };

    this.gMap = new google.maps.Map(document.getElementById('propertyMap'), {
      center: myLatLng,
      zoom: 13,
      scrollwheel: false,
      // zoomControl: false,
      // mapTypeControl: false,
      // scaleControl: false,
      panControl: false,
      navigationControl: false,
      streetViewControl: false,
      styles:  [{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#747474"},{"lightness":"23"}]},{"featureType":"poi.attraction","elementType":"geometry.fill","stylers":[{"color":"#f38eb0"}]},{"featureType":"poi.government","elementType":"geometry.fill","stylers":[{"color":"#ced7db"}]},{"featureType":"poi.medical","elementType":"geometry.fill","stylers":[{"color":"#ffa5a8"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#c7e5c8"}]},{"featureType":"poi.place_of_worship","elementType":"geometry.fill","stylers":[{"color":"#d6cbc7"}]},{"featureType":"poi.school","elementType":"geometry.fill","stylers":[{"color":"#c4c9e8"}]},{"featureType":"poi.sports_complex","elementType":"geometry.fill","stylers":[{"color":"#b1eaf1"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":"100"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"},{"lightness":"100"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffd4a5"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffe9d2"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"weight":"3.00"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"weight":"0.30"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#747474"},{"lightness":"36"}]},{"featureType":"road.local","elementType":"labels.text.stroke","stylers":[{"color":"#e9e5dc"},{"lightness":"30"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":"100"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#d2e7f7"}]}]
    });

    this.gMarker = new google.maps.Marker({
      position: myLatLng,
      icon: this.markerIcon,
      map: this.gMap
    })

    this.gMap.addListener('click', (e) => {
      self.gMarker.setPosition(e.latLng); self.submitForm.controls.locationAd.patchValue({lat:+e.latLng.lat().toFixed(4), lng:+e.latLng.lng().toFixed(4)});
      self.gMap.panTo(e.latLng);
      self.mapLatLng = e.latLng;
    })
  }



  search(term:string): void {
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
    $('#areaInput').val(area.arabicName); this.submitForm.controls.locationAd.patchValue({city: area.arabicName, lat:area.lat, lng:area.lng, regionCityId: area.countryId})
    this.gMap ? this.gMap.setCenter({ lat:area.lat, lng:area.lng }) : false;
    this.gMarker ? this.gMarker.setPosition({ lat:area.lat, lng:area.lng }) : false;
  }
  areaBlur() {
    setTimeout(() => this.isAutofill = false, 200);
  }


  submit(form) {
    this.isConnecting = true;
    let self = this;

    // create ad request
    this.http.post(this.api.link+'/api/ads', { "userId": this.userService['id'] }, this.api.userHeader()).subscribe({
      next: res => resolveAdResponse(res),
      error: err => this.api.API_ERROR(err, this.language)
    })

    // resolve ad response { id, status,... }
    function resolveAdResponse(adResponse) {
      self.submitForm.controls.adId.setValue( adResponse.id )
      adLocation();
    }

    // create ad location
    function adLocation() {
      self.http.post(self.api.link+'/api/locations', JSON.stringify(form.locationAd), self.api.userJsonHeader()).subscribe({
        next: res => resolveLocationResponse(res),
        error: err => self.api.API_ERROR(err, this.language)
      })
    }

    // resolve location response { id, city,... }
    function resolveLocationResponse(locationResponse) {
      self.isConnecting = false;
      self.submitForm.controls.locationId.setValue( locationResponse.id );

      // submit the ad
      switch (self.submitForm.controls.propertyType.value) {
        case "HOUSE":
          self.houseAd();
          break;

        case "UNIT":
          self.unitAd();
          break;

        case "LAND":
          self.landAd();
          break;

        case "FARM":
          self.farmAd();
          break;

        default:
          self.api.API_ERROR('what ad is this !!', this.language);
          break;
      }
    }
  }
  houseAd() {
    this.http.post(this.api.link+'/api/house-properties', {
      adId: this.submitForm.controls.adId.value,
      ageType: this.submitForm.controls.ageType.value,
      bathrooms: this.submitForm.controls.bathrooms.value,
      bedrooms: this.submitForm.controls.bedrooms.value,
      propertyType: this.submitForm.controls.propertyType.value,
      serviceType: this.submitForm.controls.serviceType.value,
      buildingQuality: this.submitForm.controls.qualityType.value,
      currency: this.submitForm.controls.currency.value,
      price: this.submitForm.controls.price.value,
      priceType: this.submitForm.controls.priceType.value,
      description: this.submitForm.controls.description.value,
      landSize: this.submitForm.controls.landSize.value,
      landSizeMeasureType: this.submitForm.controls.landSizeMeasureType.value,
      locationId: this.submitForm.controls.locationId.value,
      title: this.submitForm.controls.title.value,
    }, this.api.userHeader()).subscribe({

      next: res => this.addImage(res),
      error: err => this.api.API_ERROR(err, this.language)
    })
  }
  unitAd() {
    this.http.post(this.api.link+'/api/unit-properties', {
      adId: this.submitForm.controls.adId.value,
      ageType: this.submitForm.controls.ageType.value,
      bathrooms: this.submitForm.controls.bathrooms.value,
      bedrooms: this.submitForm.controls.bedrooms.value,
      buildingQuality: this.submitForm.controls.qualityType.value,
      price: this.submitForm.controls.price.value,
      priceType: this.submitForm.controls.priceType.value,
      currency: this.submitForm.controls.currency.value,
      serviceType: this.submitForm.controls.serviceType.value,
      description: this.submitForm.controls.description.value,
      landSize: this.submitForm.controls.landSize.value,
      landSizeMeasureType: this.submitForm.controls.landSizeMeasureType.value,
      locationId: this.submitForm.controls.locationId.value,
      propertyType: this.submitForm.controls.propertyType.value,
      title: this.submitForm.controls.title.value,
    }, this.api.userHeader()).subscribe({

      next: res => this.addImage(res),
      error: err => this.api.API_ERROR(err, this.language)
    })
  }
  landAd() {
    this.http.post(this.api.link+'/api/land-properties', {
      adId: this.submitForm.controls.adId.value,
      currency: this.submitForm.controls.currency.value,
      description: this.submitForm.controls.description.value,
      landSize: this.submitForm.controls.landSize.value,
      landSizeMeasureType: this.submitForm.controls.landSizeMeasureType.value,
      locationId: this.submitForm.controls.locationId.value,
      price: this.submitForm.controls.price.value,
      priceType: this.submitForm.controls.priceType.value,
      propertyType: this.submitForm.controls.propertyType.value,
      serviceType: this.submitForm.controls.serviceType.value,
      title: this.submitForm.controls.title.value,
    }, this.api.userHeader()).subscribe({

      next: res => this.addImage(res),
      error: err => this.api.API_ERROR(err, this.language)
    })
  }
  farmAd() {
    this.http.post(this.api.link+'/api/farm-properties', {
      adId: this.submitForm.controls.adId.value,
      currency: this.submitForm.controls.currency.value,
      description: this.submitForm.controls.description.value,
      landSize: this.submitForm.controls.landSize.value,
      landSizeMeasureType: this.submitForm.controls.landSizeMeasureType.value,
      locationId: this.submitForm.controls.locationId.value,
      price: this.submitForm.controls.price.value,
      priceType: this.submitForm.controls.priceType.value,
      propertyType: this.submitForm.controls.propertyType.value,
      serviceType: this.submitForm.controls.serviceType.value,
      title: this.submitForm.controls.title.value,
    }, this.api.userHeader()).subscribe({

      next: res => this.addImage(res),
      error: err => this.api.API_ERROR(err, this.language)
    })
  }
  addImage(res) {
    console.log('ad created',res);
    toastr.success('Ad successfull created', 'Success');
    let adId = res.id;
    if(this.image.length == 0) this.router.navigate([this.language, 'properties']);
    for(let i=0; i<this.image.length; i++) {
      this.http.post(this.api.link+'/api/property-images', {
        imageId: this.image[i].id,
        position: i+1,
        propertyId: adId
      }, this.api.userHeader()).subscribe({
        next: res => console.log('image added',res),
        error: err => this.api.API_ERROR(err, this.language)
      })
    }
    this.router.navigate([this.language, 'properties']);
  }

}
