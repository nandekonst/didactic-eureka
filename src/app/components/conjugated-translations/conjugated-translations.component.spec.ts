import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConjugatedTranslationsComponent } from './conjugated-translations.component';

describe('ConjugatedTranslationsComponent', () => {
  let component: ConjugatedTranslationsComponent;
  let fixture: ComponentFixture<ConjugatedTranslationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConjugatedTranslationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConjugatedTranslationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
