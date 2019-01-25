import { TestBed } from '@angular/core/testing';

import { ScreenlanguageService } from './screenlanguage.service';

describe('ScreenlanguageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScreenlanguageService = TestBed.get(ScreenlanguageService);
    expect(service).toBeTruthy();
  });
});
