import { TestBed } from '@angular/core/testing';

import { ComplementService } from './complement.service';

describe('ComplementService', () => {
  let service: ComplementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
