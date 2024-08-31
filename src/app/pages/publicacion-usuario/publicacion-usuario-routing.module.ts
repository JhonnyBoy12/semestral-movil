import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicacionUsuarioPage } from './publicacion-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: PublicacionUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicacionUsuarioPageRoutingModule {}
