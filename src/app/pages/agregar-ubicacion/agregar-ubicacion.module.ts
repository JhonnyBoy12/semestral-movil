import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarUbicacionPageRoutingModule } from './agregar-ubicacion-routing.module';

import { AgregarUbicacionPage } from './agregar-ubicacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarUbicacionPageRoutingModule
  ],
  declarations: [AgregarUbicacionPage]
})
export class AgregarUbicacionPageModule {}
