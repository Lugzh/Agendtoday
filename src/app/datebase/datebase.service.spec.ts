import { TestBed } from '@angular/core/testing';

import { DatebaseService } from './datebase.service';

describe('DatebaseService', () => {
  let service: DatebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
