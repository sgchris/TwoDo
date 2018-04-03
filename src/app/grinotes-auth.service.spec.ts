import { TestBed, inject } from '@angular/core/testing';

import { GrinotesAuthService } from './grinotes-auth.service';

describe('GrinotesAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrinotesAuthService]
    });
  });

  it('should be created', inject([GrinotesAuthService], (service: GrinotesAuthService) => {
    expect(service).toBeTruthy();
  }));
});
