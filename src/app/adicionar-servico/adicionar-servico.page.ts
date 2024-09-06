import { Component, OnInit } from '@angular/core';
import { DatebaseService } from '../datebase/datebase.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-adicionar-servico',
  templateUrl: './adicionar-servico.page.html',
  styleUrls: ['./adicionar-servico.page.scss'],
})
export class AdicionarServicoPage implements OnInit {

  constructor(private nav: NavController, private db:DatebaseService) { }
  nome_servico: any
  tempo: any
  profissional: any
  servico_data:any = {};
  remover_nome:any
  ngOnInit() {
  }
  onClick(){
    this.servico_data = {
      nome_servico: this.nome_servico,
      tempo: this.tempo,
    };
    console.log(this.servico_data)
    this.db.saveServicos(this.servico_data)
  }
  remover(){
    this.db.removeServico(this.remover_nome)
  }
  navegar_para_servicos(){
    this.nav.navigateForward('servicos')
  }
}
