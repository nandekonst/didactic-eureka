import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { GrammarService, grammarOptionsInterface} from '../shared-services/grammar.service';
import { environment, dictionaries } from '../../environments/environment'
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map';
import 'rxjs/operator/delay';
import 'rxjs/operator/mergeMap';
import 'rxjs/operator/switchMap';

//config 
const PORTS = environment.PORTS_CONJUGATIONS.split(',');
const NAMES = environment.DB_NAMES.split(',');
const CASE_INSENSITIVE = environment.CASE_INSENSITIVE;
const DIACRITIC_INSENSITIVE = environment.DIACRITIC_INSENSITIVE;

const API_URL: Array<string> = [
    'http://' + environment.API_IP + ":" + PORTS[dictionaries.MAINDB] + environment.ENDPOINT_CONJUGATION + "/" + NAMES[dictionaries.MAINDB],
    'http://' + environment.API_IP + ":" + PORTS[dictionaries.CHEMICDB] + environment.ENDPOINT_CONJUGATION + "/" + NAMES[dictionaries.CHEMICDB] ,
    'http://' + environment.API_IP + ":" + PORTS[dictionaries.COMPUTDB] + environment.ENDPOINT_CONJUGATION + "/" + NAMES[dictionaries.COMPUTDB] ,
    'http://' + environment.API_IP + ":" + PORTS[dictionaries.LEGALDB] + environment.ENDPOINT_CONJUGATION + "/" + NAMES[dictionaries.LEGALDB] ,
    'http://' + environment.API_IP + ":" + PORTS[dictionaries.MEDICDB] + environment.ENDPOINT_CONJUGATION + "/" + NAMES[dictionaries.MEDICDB] ,
    'http://' + environment.API_IP + ":" + PORTS[dictionaries.TECHNIDB] + environment.ENDPOINT_CONJUGATION + "/" + NAMES[dictionaries.TECHNIDB] ,
    'http://' + environment.API_IP + ":" + PORTS[dictionaries.TRADEDB] + environment.ENDPOINT_CONJUGATION + "/" + NAMES[dictionaries.TRADEDB] ,
    'http://' + environment.API_IP + ":" + PORTS[dictionaries.PROVERBDB] + environment.ENDPOINT_CONJUGATION + "/" + NAMES[dictionaries.PROVERBDB] ,  
  ]

@Injectable()
export class ConjugationService {
    private Case_insensitive: string = CASE_INSENSITIVE;
    private Diacritic_insensitive: string = DIACRITIC_INSENSITIVE;

    //private TranslateURL: string = ENDPOINT_CONJUGATION
    public grammarOptions:grammarOptionsInterface

    requestOptions: {} = {withAuth: true};
    
    constructor(private http:HttpService) { }


    getConjugation(options: grammarOptionsInterface): Observable<JSON> {
        //console.log(options)
        let language = options.language;
        let conceptid = options.conceptid;
        let focusnr = options.focus;
        let dictionary = options.dictionary;
        return this.http.get(API_URL[this.dictPos(dictionary)]+ environment.FORMS + language + "/" + conceptid + "/" + focusnr + "?hide_double_alternatives", this.requestOptions );
    }

    private dictPos(dictionaryName: string): number {
        for (let n = 0; n < NAMES.length; n++) {
          if (NAMES[n] == dictionaryName)
            return n;
        }
    
        return -1
    }

    getTranslatedConjugations(dictionary: string, sourceLanguage: string, targetLanguage: string, conceptid: number, focusnr: number, sourceForm: string, caseSensitive: boolean, diacriticsSensitive: boolean): Observable<JSON> {

        var args: string = "";
        if (!caseSensitive) {
          args += "&" + this.Case_insensitive;
        }
        if (!diacriticsSensitive) {
          args += "&" + this.Diacritic_insensitive
        }

        return this.http.get(API_URL[this.dictPos(dictionary)]+ environment.TRANSLATED_FORMS + sourceLanguage + "/" + targetLanguage + "/" + conceptid + "/" + focusnr + "/" + sourceForm + "?hide_double_alternatives"  + args, this.requestOptions );
    }

}