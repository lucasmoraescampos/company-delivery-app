import { TestBed } from '@angular/core/testing';

import { MenuSessionService } from './menu-session.service';

describe('MenuSessionService', () => {
  let service: MenuSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
