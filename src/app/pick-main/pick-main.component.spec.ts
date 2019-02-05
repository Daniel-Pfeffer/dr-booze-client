import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickMainComponent } from './pick-main.component';

describe('PickMainComponent', () => {
  let component: PickMainComponent;
  let fixture: ComponentFixture<PickMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
