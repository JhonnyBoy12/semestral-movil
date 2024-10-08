import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambiarNombrePage } from './cambiar-nombre.page';

const routes: Routes = [
  {
    path: '',
    component: CambiarNombrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambiarNombrePageRoutingModule {}
