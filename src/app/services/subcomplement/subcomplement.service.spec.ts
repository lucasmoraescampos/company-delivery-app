import { TestBed } from '@angular/core/testing';

import { SubcomplementService } from './subcomplement.service';

describe('SubcomplementService', () => {
  let service: SubcomplementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubcomplementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
