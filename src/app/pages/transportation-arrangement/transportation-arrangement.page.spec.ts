import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransportationArrangementPage } from './transportation-arrangement.page';

describe('TransportationArrangementPage', () => {
  let component: TransportationArrangementPage;
  let fixture: ComponentFixture<TransportationArrangementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportationArrangementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
