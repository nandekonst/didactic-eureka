import { Injectable, Input } from '@angular/core';

//insures that every component consuming the service receives the most
//up to date data
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface grammarOptionsInterface {
    language: string
    conceptid: number
    focus: number
    dictionary: string
}


@Injectable()
export class GrammarService {

    private messageSource = new BehaviorSubject<grammarOptionsInterface>(null)
    
    //variable set to an observable that can be used by the components, which can subscribe to it.
    currentGrammar = this.messageSource.asObservable();

    constructor() {}

    /*//calls next on  the behaviorsubject to change its current value
    changeMessage(message: string){
        this.messageSource.next(message)
        console.log(message)
    }*/


    changeGrammar(grammarOptionsInterface){
       // console.log("update grammaroptions " + JSON.stringify(grammarOptionsInterface) )
        this.messageSource.next(grammarOptionsInterface);
    }


}