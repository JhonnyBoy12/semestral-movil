import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambiarNombrePageRoutingModule } from './cambiar-nombre-routing.module';

import { CambiarNombrePage } from './cambiar-nombre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambiarNombrePageRoutingModule
  ],
  declarations: [CambiarNombrePage]
})
export class CambiarNombrePageModule {}
