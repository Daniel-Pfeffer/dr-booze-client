import { TestBed, async, inject } from '@angular/core/testing';

import { RegisteredGuard } from './registered.guard';

describe('RegisteredGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisteredGuard]
    });
  });

  it('should ...', inject([RegisteredGuard], (guard: RegisteredGuard) => {
    expect(guard).toBeTruthy();
  }));
});
