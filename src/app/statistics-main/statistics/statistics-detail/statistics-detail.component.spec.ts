import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsDetailComponent } from './statistics-detail.component';

describe('StatisticsDetailComponent', () => {
  let component: StatisticsDetailComponent;
  let fixture: ComponentFixture<StatisticsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
