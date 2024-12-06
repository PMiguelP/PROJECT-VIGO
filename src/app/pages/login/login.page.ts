import { Component, OnInit, OnDestroy } from '@angular/core'; // Importar OnDestroy
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  isDesktop: boolean = false;

  constructor(private router: Router) {}

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  checkScreenSize() {
    this.isDesktop = window.innerWidth >= 768;
  }

  ngOnInit() {
    this.checkScreenSize();

    window.addEventListener('resize', () => this.checkScreenSize());
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => this.checkScreenSize());
  }
}
