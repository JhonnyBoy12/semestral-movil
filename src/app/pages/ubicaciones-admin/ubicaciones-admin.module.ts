import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UbicacionesAdminPageRoutingModule } from './ubicaciones-admin-routing.module';

import { UbicacionesAdminPage } from './ubicaciones-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UbicacionesAdminPageRoutingModule
  ],
  declarations: [UbicacionesAdminPage]
})
export class UbicacionesAdminPageModule {}
