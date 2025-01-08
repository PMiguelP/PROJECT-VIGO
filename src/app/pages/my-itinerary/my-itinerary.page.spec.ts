import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyItineraryPage } from './my-itinerary.page';

describe('MyItineraryPage', () => {
  let component: MyItineraryPage;
  let fixture: ComponentFixture<MyItineraryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyItineraryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
