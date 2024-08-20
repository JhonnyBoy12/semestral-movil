import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoUbicacionesPage } from './info-ubicaciones.page';

const routes: Routes = [
  {
    path: '',
    component: InfoUbicacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoUbicacionesPageRoutingModule {}
