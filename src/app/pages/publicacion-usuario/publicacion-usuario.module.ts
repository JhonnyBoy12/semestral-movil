import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicacionUsuarioPageRoutingModule } from './publicacion-usuario-routing.module';

import { PublicacionUsuarioPage } from './publicacion-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicacionUsuarioPageRoutingModule
  ],
  declarations: [PublicacionUsuarioPage]
})
export class PublicacionUsuarioPageModule {}
