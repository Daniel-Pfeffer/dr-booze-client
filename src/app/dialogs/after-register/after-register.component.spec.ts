import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterRegisterComponent } from './after-register.component';

describe('AfterRegisterComponent', () => {
  let component: AfterRegisterComponent;
  let fixture: ComponentFixture<AfterRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfterRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
