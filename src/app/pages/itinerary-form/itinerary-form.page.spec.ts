import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItineraryFormPage } from './itinerary-form.page';

describe('ItineraryFormPage', () => {
  let component: ItineraryFormPage;
  let fixture: ComponentFixture<ItineraryFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
