import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-footer-tabs',
  templateUrl: './footer-tabs.component.html',
  styleUrls: ['./footer-tabs.component.scss'],
})
export class FooterTabsComponent implements OnInit {
  selectedTab: string = 'home'; // Aba padrão

  constructor(private router: Router) {}

  ngOnInit() {
    // Detecta mudanças de rota para atualizar a aba selecionada
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects.split('/')[1]; // Pega a rota atual
        this.selectedTab = currentRoute || 'home'; // Atualiza a aba selecionada
      }
    });
  }

  // Método para navegar para uma aba
  selectTab(tabName: string) {
    this.router.navigate([`/${tabName}`]);
  }
}
