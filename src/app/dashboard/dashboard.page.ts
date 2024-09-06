import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(private nav: NavController) { }

  ngOnInit() {
  }

  irparaservicos(){
    this.nav.navigateForward("servicos")
    
  }
  irparaempresa(){
    this.nav.navigateForward("empresa")
    
  }
  irparaagenda(){
    this.nav.navigateForward("agenda")
    
  }
  irparahorarios(){
    this.nav.navigateForward("horarios")
    
  }
}
