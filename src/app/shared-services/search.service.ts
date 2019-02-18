import { Injectable, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface searchOptionsInterface {
  lemma: string
  language: string
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private messageSource = new BehaviorSubject<searchOptionsInterface>(null)
  currentSearch = this.messageSource.asObservable();


  constructor() { }

  changeSearch(searchOptionsInterface){
    this.messageSource.next(searchOptionsInterface);
  }
}
