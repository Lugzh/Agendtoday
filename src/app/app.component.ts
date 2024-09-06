import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showMenu = true;

  constructor(private router: Router, private nav: NavController) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Verifique a URL atual para ocultar o menu, header e footer em '/cadastro' e '/home'
        const currentUrl = event.urlAfterRedirects.split('?')[0]; // Para ignorar parâmetros de query
        this.showMenu = !['/cadastro', '/home'].includes(currentUrl);
      }
    });
  }
  irparaservicos(){
    this.nav.navigateForward("servicos")
  }
  irparaempresa(){
    this.nav.navigateForward("empresa")
  }
  irparadashboard(){
    this.nav.navigateForward("dashboard")
  }
  irparaagenda(){
    this.nav.navigateForward("agenda")
  }
  irparahorarios(){
    this.nav.navigateForward("horarios")
  }
  sair(){
    this.nav.navigateForward("home")
  }
}
