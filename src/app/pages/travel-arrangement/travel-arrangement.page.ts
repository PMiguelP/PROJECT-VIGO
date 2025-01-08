import { Component, OnInit } from '@angular/core';

interface Activity {
  time: string;
  title: string;
  icon: string;
}

interface Day {
  value: number;
  label: string;
  date: string;
  activities: Activity[];
}

@Component({
  selector: 'app-travel-arrangement',
  templateUrl: './travel-arrangement.page.html',
  styleUrls: ['./travel-arrangement.page.scss'],
})
export class TravelArrangementPage implements OnInit {
  selectedDay = 1;

  // Propriedade para armazenar as atividades do dia selecionado
  activities: Activity[] = [];

  // Definindo os dias e suas atividades
  days: Day[] = [
    {
      value: 1,
      label: 'Day 1',
      date: 'July 14',
      activities: [
        { time: '5:30', title: 'Wake up', icon: 'sunny-outline' },
        { time: '7:30', title: 'City tour', icon: 'car-outline' },
        { time: '8:30', title: 'Sailing project', icon: 'boat-outline' },
        { time: '9:30', title: 'Skydiving', icon: 'airplane-outline' }
      ]
    },
    {
      value: 2,
      label: 'Day 2',
      date: 'July 15',
      activities: [
        { time: '6:00', title: 'Morning Run', icon: 'fitness-outline' },
        { time: '8:00', title: 'Museum Visit', icon: 'school-outline' },
        { time: '10:00', title: 'Lunch at Beach', icon: 'restaurant-outline' },
        { time: '12:00', title: 'Sunbathing', icon: 'sunny-outline' }
      ]
    },
    {
      value: 3,
      label: 'Day 3',
      date: 'July 16',
      activities: [
        { time: '7:00', title: 'Breakfast by the Pool', icon: 'sunny-outline' },
        { time: '9:00', title: 'Safari Adventure', icon: 'paw-outline' },
        { time: '11:00', title: 'Cultural Experience', icon: 'happy-outline' },
        { time: '14:00', title: 'Boat Tour', icon: 'boat-outline' }
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
    this.updateActivities(); // Atualiza as atividades com base no dia selecionado
  }

  // Função para obter atividades para o dia selecionado
  getActivitiesForSelectedDay(): Activity[] {
    const selected = this.days.find(day => day.value === this.selectedDay);
    return selected ? selected.activities : [];
  }

  // Função para selecionar o dia
  selectDay(dayValue: number) {
    this.selectedDay = dayValue;
    this.updateActivities(); // Atualiza as atividades ao selecionar o dia
  }

  // Função para atualizar as atividades ao selecionar um dia
  updateActivities() {
    this.activities = this.getActivitiesForSelectedDay();
  }

  addActivity() {
    // Implementar lógica para adicionar uma atividade
    console.log('Adding activity...');
  }

  nextStep() {
    // Implementar lógica para avançar para o próximo passo
    console.log('Proceeding to next step...');
  }
}
