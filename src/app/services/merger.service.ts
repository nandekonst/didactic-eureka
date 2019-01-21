import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from '../services/http.service';
import { Observable } from 'rxjs';
import { SearchLemmas } from '../interfaces/searchlemmas';


import 'rxjs/add/operator/map';
import 'rxjs/operator/delay';
import 'rxjs/operator/mergeMap';
import 'rxjs/operator/switchMap';

const API_URL = 'http://' + environment.API_IP + ":"+ environment.PORT_MERGE + environment.ENDPOINT_MERGE
const ENDPOINT_CONCEPTS = API_URL + environment.CONCEPTS;
const ENDPOINT_TRANSLATES = API_URL + environment.TRANSLATES;
//const ENDPOINT_THES = API_URL + environment.THESAURUS;
const ENDPOINT_SURR = API_URL + environment.SURROUNDINGS;
const TRANSLATE_ARGS = environment.TRANSLATE_ARGS;
//const THESAURUS_ARGS = environment.THESAURUS_ARGS;
const SURROUNDINGS_ARGS = environment.SURROUNDINGS_ARGS;
const REFERENCE_ARGS = environment.REFERENCE_ARGS;
const RECURSE = environment.ALL_RECURSE;
const CASE_INSENSITIVE = environment.CASE_INSENSITIVE;
const DIACRITIC_INSENSITIVE = environment.DIACRITIC_INSENSITIVE;

@Injectable()
export class MergerService  {
  private query: string;
  private SurroundingsURL: string = ENDPOINT_SURR;
  private ConceptsURL: string = ENDPOINT_CONCEPTS;
  private TranslateURL: string = ENDPOINT_TRANSLATES;
  private TranslateArguments: string = TRANSLATE_ARGS;
  private SurroundingsArguments: string = SURROUNDINGS_ARGS;
  private ReferenceArguments: string = REFERENCE_ARGS;
  private Recurse: string = RECURSE;
  private Case_insensitive: string = CASE_INSENSITIVE;
  private Diacritic_insensitive: string = DIACRITIC_INSENSITIVE;


  queryWord: string;
  
  requestOptions: {} = {withAuth: true};
  
  constructor(
    private http:HttpService,
  ) {
  }

  getConcepts(sourceLang: string, query: string): Observable<JSON> {
    //console.log(sourceLang)
    return this.http.get(this.ConceptsURL + sourceLang + "/" + encodeURIComponent(query) + "?" + this.Recurse, this.requestOptions )
  }

  //make a translation
  makeTranslation(sourceLang: string, targetLang: string, lemma: string): Observable<JSON> {
    return this.http.get(this.TranslateURL + sourceLang + "/" + targetLang + "/" + encodeURIComponent(lemma) + "?" + this.TranslateArguments  + "&" + this.Recurse + "&" + this.ReferenceArguments, this.requestOptions)
  }

  //make (1 or multiple) translation
  makeTranslationsGET(sourceLang: string, targetLang: string, lemmas: string[]): Observable<JSON> {
    let joinedLemmas: string = lemmas.join("##")
    return this.http.get(this.TranslateURL + sourceLang + "/" + targetLang + "/" + encodeURIComponent(joinedLemmas) + "?" + this.TranslateArguments + "&" + this.Recurse + "&" + this.ReferenceArguments, this.requestOptions)
  }

  //make (1 or multiple) translation
  public makeTranslationsPOST(sourceLang: string, targetLang: string, lemmas: SearchLemmas, caseSensitive: boolean, diacriticsSensitive: boolean): Observable<Object> {
    var args: string = "";
    if (!caseSensitive) {
      args += "&" + this.Case_insensitive;
    }
    if (!diacriticsSensitive) {
      args += "&" + this.Diacritic_insensitive
    }
    return this.http.post(this.TranslateURL + sourceLang + "/" + targetLang + "?" + this.TranslateArguments + "&" + this.Recurse + "&" + this.ReferenceArguments + args, JSON.stringify(lemmas), this.requestOptions)
  }

  //get surroundings
  public search(sourceLang: string, term: string, caseSensitive: boolean, diacriticsSensitive: boolean): Observable<JSON> {
    //console.log("term " + term);

    var args: string = "";
    if (!caseSensitive) {
      args += "&" + this.Case_insensitive;
    }
    if (!diacriticsSensitive) {
      args += "&" + this.Diacritic_insensitive
    }
    
    return this.http.get(this.SurroundingsURL + sourceLang + "/" + encodeURIComponent(term) + "?" + this.SurroundingsArguments + "&" + this.Recurse + args, this.requestOptions)
  }
}