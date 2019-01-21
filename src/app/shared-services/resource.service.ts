import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { HttpService } from '../services/http.service';
import { KeyValue } from '../interfaces/keyvalue';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface ResourceMapInterface {
    resources: Map<string, string>;
    wordTypeResources: Map<number, string>;
}

const API_URL = 'http://' + environment.API_IP + ":" + environment.PORT_RESOURCE + environment.ENDPOINT_RESOURCE 
const ATTRIBUTE = environment.ATTRIBUTE;
const ATTRIBUTES = environment.ATTRIBUTES;
const RESOURCE_ARGS = environment.RESOURCE_ARGS;
const ATTRIBUTE_ARGS = environment.ATTRIBUTE_ARGS;
const ATTRIBUTES_ARGS = environment.ATTRIBUTES_ARGS;
const RESOURCE_URL = API_URL + environment.RESOURCE + RESOURCE_ARGS;
const WORDTYPE_URL = API_URL + environment.WORDTYPE + RESOURCE_ARGS;
const ATTRIBUTE_URL = API_URL + ATTRIBUTE + ATTRIBUTE_ARGS;
const ATTRIBUTES_URL = API_URL + ATTRIBUTES + ATTRIBUTES_ARGS;

@Injectable()

export class ResourceService {
 private messageSource = new BehaviorSubject<ResourceMapInterface>(null);
 currentResourceMaps = this.messageSource.asObservable();

 requestOptions: {} = {withAuth: true};
 attributeResources: Map<string, string>;

 constructor(private http:HttpService) {
  this.clearCaches()
 }

 clearCaches() {
    this.attributeResources = new Map<string, string>();
    var maps: ResourceMapInterface = {resources: new Map<string, string>(), wordTypeResources: new Map<number, string>()};
    this.changeResourceMaps(maps);
  }

  changeResourceMaps(resourceMapInterface){
    //console.log("update resource map " + this.mapToString(resourceMapInterface.resources) + "###" + this.mapToString(resourceMapInterface.wordTypeResources) )
    this.messageSource.next(resourceMapInterface);
  }
  private getAttributes(attributes: string[], language: string): Observable<JSON> {

    return this.http.get(ATTRIBUTES_URL + language + "/" + attributes.join(","), this.requestOptions)
  }

  private getAttribute(attribute: string, language: string): Observable<JSON> {
    
   return this.http.get(ATTRIBUTE_URL + language + "/" + attribute, this.requestOptions )

  }
  
  private getResource(resource: string, language: string): Observable<JSON> {
    
    return this.http.get(RESOURCE_URL + language + "/" + resource, this.requestOptions )
 
  }

  private getWordtype(resource: number, language: string): Observable<JSON> {
    return this.http.get(WORDTYPE_URL + language + "/" + resource.toString(), this.requestOptions )
  }
  
  attributes(attributeData: string[], language: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      //console.log("RESOLVING" + JSON.stringify(attributeData));  
      let i = 0;
      let loading = 0;
      let resourcesResult = new Array<string>(attributeData.length);
 
      attributeData.forEach(attribute => {
        resourcesResult[i] = null;

        var cachedResource = this.attributeResources.get(attribute)        
        if(cachedResource != undefined) {
          resourcesResult[i] = cachedResource;
          loading++;
          if(loading == attributeData.length) {
            //console.log("RESOLVE1 " + JSON.stringify(resourcesResult));     
            resolve(resourcesResult);
            return
          }
        } else {
          let ob = this.getAttribute(attribute, language);
          ((obj, origAttribute, j) => {
            obj.subscribe(data => {
              loading++;
              resourcesResult[j] = data['data']['translation'];
              this.attributeResources.set(origAttribute, resourcesResult[j])
              if(loading == attributeData.length) {
                //console.log("RESOLVE2 " + JSON.stringify(resourcesResult));        
                resolve(resourcesResult);
                return
              }
            }, err => {
              console.log(err)
              reject(err)
            });
          })(ob, attribute, i);
        }
        i++;
      });
    });
  }


   
  resource(tag: string, language:string) {
    //console.log("resolving: " + tag)
    var cachedResource = this.messageSource.getValue().resources.get(tag);
    if(cachedResource != undefined) {
      return
    }

    let ob = this.getResource(tag, language);
    ((obj, origTag) => {
      var refreshedSubscription = obj.subscribe(
        data => {
          //console.log("DATA" + JSON.stringify(data));
          var value = data['data']['translation'];

          var cache = this.messageSource.getValue();
          cache.resources.set(tag, value);
          //console.log("RESOLVE3 " + this.mapToString(cache.resources));
          this.changeResourceMaps(cache);

          return
        },
        error => {
          console.log(error)
        }
      )
    })(ob, tag);
  }
  
  resourceWordType(tag: number, language: string): Promise<KeyValue> {
     // console.log("resolvingWT: " + tag.toString())
      var cachedResource = this.messageSource.getValue().wordTypeResources.get(tag)
			if(cachedResource != undefined) {
				return
			}

      let ob = this.getWordtype(tag, language);
      ((obj, origTag) => {
        var refreshedSubscription = obj.subscribe(
          data => {
            //console.log("DATA" + JSON.stringify(data));
            var value = data['data']['translation'];

            var cache = this.messageSource.getValue();
            cache.wordTypeResources.set(origTag, value);
            //console.log("RESOLVE4 " + this.mapToString(cache.wordTypeResources));
            this.changeResourceMaps(cache)

            return
          },
          error => {
            console.log(error)
          }
        )
      })(ob, tag);
  }
   

  mapToString(map: Map<any, string>): string {
    var s: string = "MAP:["
    var first: boolean = true;
    map.forEach((value: string, key: any) => {
      if (!first) {
        s += "|"
      }
      first = false;

      s += key + ":'" + value + "'";
    });
    s += "]"
    return s
  }

}