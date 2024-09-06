import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdicionarServicoPageRoutingModule } from './adicionar-servico-routing.module';

import { AdicionarServicoPage } from './adicionar-servico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdicionarServicoPageRoutingModule
  ],
  declarations: [AdicionarServicoPage]
})
export class AdicionarServicoPageModule {}
