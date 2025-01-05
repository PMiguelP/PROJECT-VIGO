import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ToastController } from '@ionic/angular';
import { EventsPage } from './events.page';

describe('EventsPage', () => {
  let component: EventsPage;
  let fixture: ComponentFixture<EventsPage>;
  let toastCtrl: ToastController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventsPage],
      imports: [IonicModule.forRoot()],
      providers: [ToastController]
    }).compileComponents();

    fixture = TestBed.createComponent(EventsPage);
    component = fixture.componentInstance;
    toastCtrl = TestBed.inject(ToastController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have events data', () => {
    expect(component.eventsData.length).toBeGreaterThan(0);
  });

  it('should open new event modal', () => {
    spyOn(component, 'openNewEventModal');
    component.openNewEventModal();
    expect(component.openNewEventModal).toHaveBeenCalled();
  });

  it('should add new event', () => {
    const newEvent = {
      title: 'New Event',
      description: 'New Event Description',
      location: 'New York',
      date: '2023-12-01',
      itinerary: 'schedule',
      image: 'https://via.placeholder.com/150',
      participants: [
        { name: 'John Doe', avatar: 'https://via.placeholder.com/50' }
      ]
    };
    component.eventsData.push(newEvent);
    expect(component.eventsData).toContain(newEvent);
  });

  it('should copy event link', async () => {
    const event = {
      title: 'Event 1',
      description: 'Description for Event 1',
      location: 'New York',
      date: '2023-12-01',
      itinerary: 'schedule',
      image: 'https://via.placeholder.com/150',
      participants: [
        { name: 'John Doe', avatar: 'https://via.placeholder.com/50' }
      ]
    };
    spyOn(navigator.clipboard, 'writeText');
    spyOn(toastCtrl, 'create').and.returnValue(Promise.resolve({ present: () => Promise.resolve() } as any));
    await component.copyLink(event);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/events/event-1');
    expect(toastCtrl.create).toHaveBeenCalled();
  });

  it('should delete event', async () => {
    const event = {
      title: 'Event 1',
      description: 'Description for Event 1',
      location: 'New York',
      date: '2023-12-01',
      itinerary: 'schedule',
      image: 'https://via.placeholder.com/150',
      participants: [
        { name: 'John Doe', avatar: 'https://via.placeholder.com/50' }
      ]
    };
    component.eventsData.push(event);
    await component.deleteEvent(event);
    expect(component.eventsData).not.toContain(event);
  });

  it('should edit event', async () => {
    const event = {
      title: 'Event 1',
      description: 'Description for Event 1',
      location: 'New York',
      date: '2023-12-01',
      itinerary: 'schedule',
      image: 'https://via.placeholder.com/150',
      participants: [
        { name: 'John Doe', avatar: 'https://via.placeholder.com/50' }
      ]
    };
    spyOn(component, 'editEvent').and.callThrough();
    await component.editEvent(event);
    expect(component.editEvent).toHaveBeenCalledWith(event);
  });

  it('should set itinerary for event', () => {
    const event = {
      title: 'Event 1',
      description: 'Description for Event 1',
      location: 'New York',
      date: '2023-12-01',
      itinerary: 'schedule',
      image: 'https://via.placeholder.com/150',
      participants: [
        { name: 'John Doe', avatar: 'https://via.placeholder.com/50' }
      ]
    };
    spyOn(component, 'setItinerary');
    component.setItinerary(event);
    expect(component.setItinerary).toHaveBeenCalledWith(event);
  });
});