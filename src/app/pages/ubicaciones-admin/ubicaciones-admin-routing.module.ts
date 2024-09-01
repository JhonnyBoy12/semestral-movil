import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UbicacionesAdminPage } from './ubicaciones-admin.page';

const routes: Routes = [
  {
    path: '',
    component: UbicacionesAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UbicacionesAdminPageRoutingModule {}
