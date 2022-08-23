import { TestBed } from '@angular/core/testing';

import { CausalesService } from './causales.service';

describe('CausalesService', () => {
  let service: CausalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CausalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
