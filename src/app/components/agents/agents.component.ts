import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';

import * as _ from 'lodash';

declare let $:any;

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit, AfterViewInit {

  language:string;
  isConnecting:boolean = false;
  cityList:any;
  selectedCity:any;
  agents:any = [];

  Math:any;
  resultsNum:number = 0;
  numOfPages:number = 0;
  currentPage:number = 1; startSlice:number = 0; endSlice:number = 6;

  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService,
    private api:ApiService,
    private http:HttpClient) { }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    this.Math = Math
    this.http.get(this.api.link+'/api/public/agents').subscribe(res => this.gotAgents(res))
  }

  ngAfterViewInit() {
    this.fotterPadding();
    this.chosenPlugin();
    this.chosenCities();
  }



  fotterPadding() {
    $('router-outlet ~ *').children().first().css('background-color', '#fff');
    $('router-outlet ~ *').children().first().css('margin-bottom', $('.sticky-footer').outerHeight( true )+'px');
  }
  chosenPlugin() {
    var config = {
      '.chosen-select'           : {disable_search_threshold: 10, width:"200px"},
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
      self.changedCity(self.selectedCity.id);
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
      self.changedCity(self.selectedCity.id);
      setTimeout(() => $('.api-updated-cities').trigger("chosen:updated"), 100);
    }
  }


  gotAgents(agents) {
    this.isConnecting = false;
    this.resultsNum = agents.length;
    this.numOfPages = this.resultsNum / 6;
    this.agents = [];

    for(let i=0; i<agents.length; i++) {
      let a = agents[i];
      this.agents.push({
        id: a.id,
        image: (a.logo.s3Path) ? a.logo.s3Path : "assets/images/agent-01.jpg",
        name: a.name,
        title: a.description,
        phone: a.phone,
        email: a.email
      })
    }
  }

  search(input) {
    this.isConnecting = true;
    this.http.get(this.api.link+'/api/public/agents?name.contains='+input).subscribe(res => this.gotAgents(res));
  }

  changedCity(city) {
    console.log(city);
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

}
