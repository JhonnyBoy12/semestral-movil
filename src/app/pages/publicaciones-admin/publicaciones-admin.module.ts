import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicacionesAdminPageRoutingModule } from './publicaciones-admin-routing.module';

import { PublicacionesAdminPage } from './publicaciones-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicacionesAdminPageRoutingModule
  ],
  declarations: [PublicacionesAdminPage]
})
export class PublicacionesAdminPageModule {}
