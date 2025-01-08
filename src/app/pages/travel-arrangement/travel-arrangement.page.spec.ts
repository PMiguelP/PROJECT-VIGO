import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TravelArrangementPage } from './travel-arrangement.page';

describe('TravelArrangementPage', () => {
  let component: TravelArrangementPage;
  let fixture: ComponentFixture<TravelArrangementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelArrangementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
