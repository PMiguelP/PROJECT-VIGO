import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationPickerPagePage } from './location-picker-page.page';

describe('LocationPickerPagePage', () => {
  let component: LocationPickerPagePage;
  let fixture: ComponentFixture<LocationPickerPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationPickerPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
