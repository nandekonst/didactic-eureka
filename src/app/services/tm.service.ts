import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Observable } from 'rxjs';

const API_URL = "http://api.euroglot.nl:2341/tmproxy/euroglot/tm";


@Injectable({
  providedIn: 'root'
})
export class TmService {
  requestOptions: {} = {withAuth: true};


  constructor(private http: HttpService) { }

  makeTranslation(sourcelang: string, targetlang: string, searchString: string): Observable<JSON>{

    return this.http.get(API_URL + "/" + sourcelang + "/" + targetlang + "/" + searchString, this.requestOptions);

  }

  
}
