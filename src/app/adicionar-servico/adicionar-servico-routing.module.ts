import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdicionarServicoPage } from './adicionar-servico.page';

const routes: Routes = [
  {
    path: '',
    component: AdicionarServicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdicionarServicoPageRoutingModule {}
