import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicacionGuardadaPageRoutingModule } from './publicacion-guardada-routing.module';

import { PublicacionGuardadaPage } from './publicacion-guardada.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicacionGuardadaPageRoutingModule
  ],
  declarations: [PublicacionGuardadaPage]
})
export class PublicacionGuardadaPageModule {}
