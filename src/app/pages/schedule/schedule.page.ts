import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SchedulePage implements OnInit {
  currentMonthIndex = new Date().getMonth(); // Começa no mês atual
  currentYear = new Date().getFullYear(); // Ano atual
  currentMonth = '';
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  calendarDays: (number | null)[] = [];
  selectedDates: number[] = [];

  ngOnInit() {
    this.updateCurrentMonth();
    this.generateCalendarDays();
  }

  // Atualiza o nome do mês atual
  updateCurrentMonth() {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.currentMonth = `${monthNames[this.currentMonthIndex]} ${this.currentYear}`;
  }

  generateCalendarDays() {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonthIndex, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonthIndex + 1, 0).getDate();
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      this.calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push(i);
    }
  }

  previousMonth() {
    if (this.currentMonthIndex === 0) {
      this.currentMonthIndex = 11;
      this.currentYear--;
    } else {
      this.currentMonthIndex--;
    }
    this.updateCurrentMonth();
    this.generateCalendarDays();
  }

  nextMonth() {
    if (this.currentMonthIndex === 11) {
      this.currentMonthIndex = 0;
      this.currentYear++;
    } else {
      this.currentMonthIndex++;
    }
    this.updateCurrentMonth();
    this.generateCalendarDays();
  }

  isSelected(day: number | null): boolean {
    return day !== null && this.selectedDates.includes(day);
  }

  isInRange(day: number | null): boolean {
    if (day === null || this.selectedDates.length < 2) return false;

    const [start, end] = this.selectedDates.sort((a, b) => a - b); // Ordena as datas
    return day > start && day < end; // Verifica se o dia está no intervalo
  }

  selectDate(day: number | null) {
    if (day === null) return;

    if (this.selectedDates.includes(day)) {
      this.selectedDates = this.selectedDates.filter(d => d !== day);
    } else {
      if (this.selectedDates.length >= 2) {
        this.selectedDates = [day]; // Reinicia ao selecionar um terceiro dia
      } else {
        this.selectedDates.push(day);
      }
    }
  }

}
