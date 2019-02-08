import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmPanelComponent } from './tm-panel.component';

describe('TmPanelComponent', () => {
  let component: TmPanelComponent;
  let fixture: ComponentFixture<TmPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
