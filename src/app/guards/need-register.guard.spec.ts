import { TestBed, async, inject } from '@angular/core/testing';

import { NeedRegisterGuard } from './need-register.guard';

describe('NeedRegisterGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NeedRegisterGuard]
    });
  });

  it('should ...', inject([NeedRegisterGuard], (guard: NeedRegisterGuard) => {
    expect(guard).toBeTruthy();
  }));
});
