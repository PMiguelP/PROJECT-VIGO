import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventParticipantsPage } from './event-participants.page';

describe('EventParticipantsPage', () => {
  let component: EventParticipantsPage;
  let fixture: ComponentFixture<EventParticipantsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EventParticipantsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
