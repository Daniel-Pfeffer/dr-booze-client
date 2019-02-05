import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickerDetailComponent } from './picker-detail.component';

describe('PickerDetailComponent', () => {
  let component: PickerDetailComponent;
  let fixture: ComponentFixture<PickerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
