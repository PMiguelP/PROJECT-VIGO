import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-tabs',
  templateUrl: './footer-tabs.component.html',
  styleUrls: ['./footer-tabs.component.scss'],
})
export class FooterTabsComponent implements OnInit {
  constructor(private router: Router) {}

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  ngOnInit() {}
}
