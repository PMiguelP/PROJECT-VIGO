import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Importe o AuthService
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToSignUp() {
    console.log('a ir para a pagina de signup');
    this.router.navigate(['/sign-up']);
  }

  ngOnInit() {
    // Subscribing ao observable que indica se o usuário está autenticado
    this.authService.authenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated; // Atualiza o estado de autenticação
    });
  }
}
