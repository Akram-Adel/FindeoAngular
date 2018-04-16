import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LanguageService {

  private languageValue = new Subject<string>();
  language$:Observable<string> = this.languageValue.asObservable();

  changeLanguage(lng) {
    this.languageValue.next( lng );

    if(lng == 'ar') {
      document.querySelector('body').classList.add('rtl-config');
    } else {
      document.querySelector('body').classList.remove('rtl-config');
    }
  }

}
