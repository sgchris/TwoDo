import { TestBed, inject } from '@angular/core/testing';

import { TwodoAuthService } from './twodo-auth.service';

describe('TwodoAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TwodoAuthService]
    });
  });

  it('should be created', inject([TwodoAuthService], (service: TwodoAuthService) => {
    expect(service).toBeTruthy();
  }));
});
