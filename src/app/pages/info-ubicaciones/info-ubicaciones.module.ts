import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoUbicacionesPageRoutingModule } from './info-ubicaciones-routing.module';

import { InfoUbicacionesPage } from './info-ubicaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoUbicacionesPageRoutingModule
  ],
  declarations: [InfoUbicacionesPage]
})
export class InfoUbicacionesPageModule {}
