import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import * as _ from 'lodash';

import { LanguageService } from '../../services/language.service';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';

declare let $:any;
declare var google:any;
declare let toastr:any;

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit {

  language:string;

  isConnecting:boolean = false;
  profileInfo = {
    firstName: null,
    lastName: null,
    email: null,
    imageUrl: "https://s3-eu-west-1.amazonaws.com/aliraqhomes/assets/Blank-profile.png",
    phone: '',
    about: null,
    isAgent: false,
    agentName: null,
    agentImageUrl: "https://s3-eu-west-1.amazonaws.com/aliraqhomes/assets/Blank-profile.png",
  }
  cityList:any = [];
  selectedCity:any = {}; selectedName:string;
  areas$:Observable<any[]>;
  private searchTerm = new Subject<string>();
  isAutofill:boolean = false;
  area:string;
  street:string;
  lat:number;
  lng:number;
  regionId:number;
  regionCityId:number = null;
  gMap:any; gMarker:any;
  mapLatLng:any;



  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService,
    private userService:UserService,
    private router:Router,
    private http:HttpClient,
    private api:ApiService) { }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    if(!this.userService.userToken) this.router.navigate([this.language, 'login']);
    this.synchProfileInfo();
    this.userService.userUpdate$.subscribe(res => { this.synchProfileInfo() });

    this.areas$ = this.searchTerm
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term:string) => this.searchArea(term))
      );
  }

  ngAfterViewInit() {
    this.fotterPadding();
    this.eventListeners();
    this.chosenPlugin();
    this.chosenCities();
    this.initMap();
  }



  fotterPadding() {
    $('router-outlet ~ *').children().first().css('background-color', '#fff');
    $('router-outlet ~ *').children().first().css('margin-bottom', $('.sticky-footer').outerHeight( true )+'px');
  }
  eventListeners() {
    /*----------------------------------------------------*/
    /*	Toggle
    /*----------------------------------------------------*/
    $(".toggle-container").hide();

    $('.trigger, .trigger.opened').on('click', function(a){
      $(this).toggleClass('active');
      a.preventDefault();
    });

    $(".trigger").on('click', function(){
      $(this).next(".toggle-container").slideToggle(300);
    });

    $(".trigger.opened").addClass("active").next(".toggle-container").show();
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
  synchProfileInfo() {
    this.profileInfo.firstName = this.userService['firstName'];
    this.profileInfo.lastName = this.userService['lastName'];
    this.profileInfo.email = this.userService['email'];
    this.profileInfo.phone = this.userService['phone'];
    this.profileInfo.imageUrl = this.userService['imageUrl'];
    this.profileInfo.isAgent = this.userService['isAgent'];
    this.profileInfo.about = this.userService['description'];

    if(this.profileInfo.isAgent) this.synchAgentInfo()
  }
  synchAgentInfo() {
    setTimeout(() => {
      this.profileInfo.agentName = this.userService['agentName'];
      this.profileInfo.agentImageUrl = this.userService['agentImageUrl'];

      this.chosenPlugin();
      this.chosenCities();
      this.area = this.userService['agentLocation']['city'];
      this.street = this.userService['agentLocation']['street'];
      setTimeout(() => {
        this.selectedCity = _.find(this.cityList, ['id', this.userService['agentLocation']['regionId']]);
        this.selectedName = this.selectedCity.arabicName;
        setTimeout(() => $('.api-updated-cities').trigger("chosen:updated"), 100);
      }, 500);
    }, 50);
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
      self.gMarker.setPosition(e.latLng); this.lat = +e.latLng.lat().toFixed(4); this.lng = +e.latLng.lng().toFixed(4);
      self.gMap.panTo(e.latLng);
      self.mapLatLng = e.latLng;
    })
  }


  saveProfile() {
    let self = this;
    this.isConnecting = true;

    // agent changes
    let info = this.profileInfo;
    if(info.firstName == null
      || info.firstName == ''
      || info.agentName == null
      || info.agentName == ''
      || info.about == null
      || info.about == ''
      || info.phone == null
      || info.phone == ''
      || !this.area
      || this.area == ''
      || !this.street
      || this.street == '') { toastr.error('Please fill all the agent data', 'Error!'); return; };

    // location id request
    this.http.post(this.api.link+'/api/locations', {
      city: this.area,
      street: this.street,
      lat: this.lat,
      lng: this.lng,
      regionId: this.regionId,
      regionCityId: this.regionCityId
    }, this.api.userHeader()).subscribe({
      next: res => postAgent(res),
      error: err => this.api.API_ERROR(err, this.language)
    })

    // agent request
    function postAgent(location) {
      let locationId = location.id;
      self.http.put(self.api.link+'/api/agents', {
        id: self.userService['agentId'],
        name: self.profileInfo.agentName,
        description: self.profileInfo.about,
        phone: self.profileInfo.phone,
        email: self.profileInfo.email,
        logoId: self.userService['agentImageUrl'],
        userId: self.userService['id'],
        locationId: locationId
      }, self.api.userHeader()).subscribe({
        next: res => saveSuccess(),
        error: err => self.api.API_ERROR(err, self.language)
      })
    }

    // success save changes
    function saveSuccess() {
      self.isConnecting = false;
      toastr.success('Changes successfull saved', 'Success');
      $('html, body').animate({ scrollTop: 0 }, 500);
      self.http.get(self.api.link+'/api/account', self.api.userHeader()) .subscribe( res => {
        self.userService.createUser(res);
        self.api.getUserProfile();
        self.api.getAgentProfile();
      });
    }
  }

  photoChange(photoFiles) {
    let self = this;
    this.isConnecting = true;

    let url = this.api.link+'/api/images/upload-image/users',
    photo = photoFiles[0];

    const formData = new FormData();
      formData.append('imageFile', photo);
    this.http.post(url, formData, this.api.userHeader()).subscribe({
      next: res => updatePhoto(res),
      error: err => { this.isConnecting = false; this.api.API_ERROR(err, this.language); }
    });

    // update user photo
    function updatePhoto(res) {
      self.http.put(self.api.link+'/api/agents', {
        id: self.userService['agentId'],
        name: self.profileInfo.agentName,
        description: self.profileInfo.about,
        phone: self.profileInfo.phone,
        email: self.profileInfo.email,
        logoId: res.id,
        userId: self.userService['id'],
        // locationId: locationId
      }, self.api.userHeader()).subscribe({
        next: res => saveSuccess(),
        error: err => { self.isConnecting = false; self.api.API_ERROR(err, self.language); }
      });
    }

    // success save changes
    function saveSuccess() {
      $('html, body').animate({ scrollTop: 0 }, 500);
      self.http.get(self.api.link+'/api/account', self.api.userHeader()) .subscribe( res => {
        self.userService.createUser(res);
        self.api.getUserProfile();
        self.api.getAgentProfile();

        self.saveProfile(); // <-- to update agent photo
      });
    }
  }


  chosenCities() {
    let self = this;

    // attach a change event
    $('.api-updated-cities').on('change', (ev, params) => {
      self.selectedCity = _.find(self.cityList, {arabicName: params.selected});
      mapCenter(); self.lat = self.selectedCity.lat; self.lng = self.selectedCity.lng;
      self.regionId = self.selectedCity.id;
      self.regionCityId = null; self.area = '';
    });

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
      mapCenter(); self.lat = self.selectedCity.lat; self.lng = self.selectedCity.lng;
      self.regionId = self.selectedCity.id;
      setTimeout(() => $('.api-updated-cities').trigger("chosen:updated"), 100);
    }

    // update map center and marker position
    function mapCenter() {
      self.gMap ? self.gMap.setCenter({ lat:self.selectedCity.lat, lng:self.selectedCity.lng }) : false;
      self.gMarker ? self.gMarker.setPosition({ lat:self.selectedCity.lat, lng:self.selectedCity.lng }) : false;
    }
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
    this.area = area.arabicName;
    this.lat = area.lat;
    this.lng = area.lng;
    this.regionCityId = area.id;

    this.gMap ? this.gMap.setCenter({ lat:area.lat, lng:area.lng }) : false;
    this.gMarker ? this.gMarker.setPosition({ lat:area.lat, lng:area.lng }) : false;
  }
  areaBlur() {
    setTimeout(() => this.isAutofill = false, 200);
  }

  becomeAgent() {
    let this$ = this;

    let info = this.profileInfo;
    if(info.firstName == null
      || info.firstName == ''
      || info.agentName == null
      || info.agentName == ''
      || info.about == null
      || info.about == ''
      || info.phone == null
      || info.phone == ''
      || !this.area
      || this.area == ''
      || !this.street
      || this.street == '') { toastr.error('قم بملئ بيانات الحساب و بيانات المكتب العقاري اولا', 'Error!'); return; };

    this.isConnecting = true;

    // location id request
    this.http.post(this.api.link+'/api/locations', {
      city: this.area,
      street: this.street,
      lat: this.lat,
      lng: this.lng,
      regionId: this.regionId,
      regionCityId: this.regionCityId
    }, this.api.userHeader()).subscribe({
      next: res => postAgent(res),
      error: err => this.api.API_ERROR(err, this.language)
    })

    // agent request
    function postAgent(location) {
      let locationId = location.id;
      this$.http.post(this$.api.link+'/api/agents', {
        name: this$.profileInfo.agentName,
        description: this$.profileInfo.about,
        phone: this$.profileInfo.phone,
        email: this$.profileInfo.email,
        logoId: this$.userService['imageId'],
        userId: this$.userService['id'],
        locationId: locationId
      }, this$.api.userHeader()).subscribe({
        next: res => saveSuccess(),
        error: err => this$.api.API_ERROR(err, this$.language)
      })
    }

    // success save changes
    function saveSuccess() {
      this$.isConnecting = false;
      toastr.success('You are now an agent', 'Success');
      $('html, body').animate({ scrollTop: 0 }, 500);
      this$.http.get(this$.api.link+'/api/account', this$.api.userHeader()) .subscribe( res => {
        this$.userService.createUser(res);
        this$.api.getUserProfile();
        this$.api.getAgentProfile();
      });
    }
  }

}
