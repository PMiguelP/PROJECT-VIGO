import { Component, OnInit } from '@angular/core';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  status: string;
}

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {
  selectedSegment = 'todo';
  tasks: Task[] = [
    { id: 1, title: 'Buy surfboard', completed: false, status: 'Traquilo' },
    { id: 2, title: 'Check weather forecast', completed: false, status: 'Grave' },
    { id: 3, title: 'Pack sunscreen', completed: true, status: 'Importante' },
    { id: 4, title: 'Prepare BBQ equipment', completed: true, status: 'Facil' },
  ];

  constructor() { }

  ngOnInit() { }

  moveTask(task: Task) {
    task.completed = !task.completed;
  }

  get filteredTasks() {
    return this.tasks.filter(task =>
      this.selectedSegment === 'todo' ? !task.completed : task.completed
    );
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }
}
