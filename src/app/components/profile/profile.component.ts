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
declare let toastr:any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit,AfterViewInit {

  language:string;

  isConnecting:boolean = false;
  profileInfo = {
    firstName: null,
    lastName: null,
    email: null,
    imageUrl: "assets/images/agent-03.jpg",
    phone: '',
    about: null,
    isAgent: false
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
      this.chosenPlugin();
      this.chosenCities();
      this.area = this.userService['agentLocation']['city'];
      this.street = this.userService['agentLocation']['street'];
      setTimeout(() => {
        this.selectedCity = _.find(this.cityList, ['id', this.userService['agentLocation']['regionId']]);
        this.selectedName = this.selectedCity.name;
        setTimeout(() => $('.api-updated-cities').trigger("chosen:updated"), 100);
      }, 500);
    }, 50);
  }


  saveProfile() {
    let self = this;
    this.isConnecting = true;

    // account changes
    this.http.post(this.api.link+'/api/account', {
      firstName: this.profileInfo['firstName'],
      lastName: this.profileInfo['lastName'],
      email: this.profileInfo['email'],
      login: this.profileInfo['email'],
      langKey: this.language
    }, this.api.userHeader()).subscribe({
      next: res => profileChange(),
      error: err => { this.isConnecting = false; this.api.API_ERROR(err, this.language); }
    });

    // profile changes
    function profileChange() {
      self.http.put(self.api.link+'/api/profiles', {
        id: self.userService['profileId'],
        phone: self.profileInfo['phone'],
        avatarId: self.userService['imageId'],
        userId: self.userService['id']
      }, self.api.userHeader()).subscribe({
        next: res => (self.profileInfo.isAgent) ? agentChange() : saveSuccess(),
        error: err => { self.isConnecting = false; self.api.API_ERROR(err, self.language); }
      })
    }

    // agent changes
    function agentChange() {
      let info = self.profileInfo;
      if(info.firstName == null
        || info.firstName == ''
        || info.about == null
        || info.about == ''
        || info.phone == null
        || info.phone == ''
        || !self.area
        || self.area == ''
        || !self.street
        || self.street == '') { toastr.error('Please fill all the agent data', 'Error!'); return; };

      // location id request
      self.http.post(self.api.link+'/api/locations', {
        city: self.area,
        street: self.street,
        lat: self.lat,
        lng: self.lng,
        regionId: self.regionId,
        regionCityId: self.regionCityId
      }, self.api.userHeader()).subscribe({
        next: res => postAgent(res),
        error: err => self.api.API_ERROR(err, self.language)
      })

      // agent request
      function postAgent(location) {
        let locationId = location.id;
        self.http.put(self.api.link+'/api/agents', {
          id: self.userService['agentId'],
          name: self.profileInfo.firstName,
          description: self.profileInfo.about,
          phone: self.profileInfo.phone,
          email: self.profileInfo.email,
          logoId: self.userService['imageId'],
          userId: self.userService['id'],
          locationId: locationId
        }, self.api.userHeader()).subscribe({
          next: res => saveSuccess(),
          error: err => self.api.API_ERROR(err, self.language)
        })
      }
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

    let url = 'http://iq-staging.eu-west-1.elasticbeanstalk.com/api/images/upload-image/users',
    photo = photoFiles[0];

    const formData = new FormData();
      formData.append('imageFile', photo);
    this.http.post(url, formData, this.api.userHeader()).subscribe({
      next: res => updatePhoto(res),
      error: err => { this.isConnecting = false; this.api.API_ERROR(err, this.language); }
    });

    // update user photo
    function updatePhoto(res) {
      self.http.put(self.api.link+'/api/profiles', {
        id: self.userService['profileId'],
        phone: self.profileInfo['phone'],
        avatarId: res.id,
        userId: self.userService['id']
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
      self.selectedCity = _.find(self.cityList, {name: params.selected});
      self.lat = self.selectedCity.lat;
      self.lng = self.selectedCity.lng;
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
      self.lat = self.selectedCity.lat;
      self.lng = self.selectedCity.lng;
      self.regionId = self.selectedCity.id;
      setTimeout(() => $('.api-updated-cities').trigger("chosen:updated"), 100);
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
  }
  areaBlur() {
    setTimeout(() => this.isAutofill = false, 200);
  }

  becomeAgent() {
    let this$ = this;

    let info = this.profileInfo;
    if(info.firstName == null
      || info.firstName == ''
      || info.about == null
      || info.about == ''
      || info.phone == null
      || info.phone == ''
      || !this.area
      || this.area == ''
      || !this.street
      || this.street == '') { toastr.error('Please fill all the above data to become an agent', 'Error!'); return; };

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
        name: this$.profileInfo.firstName,
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
