export class SearchLemmas  {
    lemmas: string[];
    form_texts: string[];

    constructor() {
        this.lemmas = [];
        this.form_texts = [];
    }

    clear(){
        this.lemmas = [];
        this.form_texts = [];
    }
}