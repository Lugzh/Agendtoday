import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DatebaseService } from '../datebase/datebase.service';
import { Servico } from './servicos.module';
@Component({
  selector: 'app-servicos',
  templateUrl: './servicos.page.html',
  styleUrls: ['./servicos.page.scss'],
})
export class ServicosPage implements OnInit {

  constructor(private nav: NavController, private db: DatebaseService) { }
  servicos:any

  ngOnInit() {
    this.loadservico()
  }

  irparaadicionar_servico() {
    this.nav.navigateForward("adicionar-servico");
  }

  async loadservico() {
    try {
      const data = await this.db.getServicosByCnpj(); // Usar o método correto para buscar serviços
      if (data && data.servicos) {
        this.servicos = data.servicos; // Atribuir o array de serviços diretamente
        console.log('Serviços carregados com sucesso!', this.servicos);
      } else {
        console.log('Nenhum serviço encontrado.');
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    }
  }
}
