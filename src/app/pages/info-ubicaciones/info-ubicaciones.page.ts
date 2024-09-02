import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ComponentemenuComponent } from 'src/app/components/componentemenu/componentemenu.component';

@Component({
  selector: 'app-info-ubicaciones',
  templateUrl: './info-ubicaciones.page.html',
  styleUrls: ['./info-ubicaciones.page.scss'],
})
export class InfoUbicacionesPage implements OnInit {

  constructor(private router: Router, public popoverController: PopoverController ) { }

  ngOnInit() {
  }

  mensajeProvisorio(){
    this.router.navigate(['/info-ubicaciones']);
  }

  async contactar(ev: any) {
    const popover = await this.popoverController.create({
      component: ComponentemenuComponent,
      event: ev,
      translucent: true,
      backdropDismiss: true // Permite cerrar tocando fuera del Popover
    });
    await popover.present();
  }

}
