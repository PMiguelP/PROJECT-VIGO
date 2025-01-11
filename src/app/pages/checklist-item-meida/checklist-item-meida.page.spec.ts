import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChecklistItemMeidaPage } from './checklist-item-meida.page';

describe('ChecklistItemMeidaPage', () => {
  let component: ChecklistItemMeidaPage;
  let fixture: ComponentFixture<ChecklistItemMeidaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistItemMeidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
