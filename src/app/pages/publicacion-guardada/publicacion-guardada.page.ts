import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { ComponentemenuComponent } from 'src/app/components/componentemenu/componentemenu.component';

@Component({
  selector: 'app-publicacion-guardada',
  templateUrl: './publicacion-guardada.page.html',
  styleUrls: ['./publicacion-guardada.page.scss'],
})
export class PublicacionGuardadaPage implements OnInit {

  constructor(private toastController: ToastController, public popoverController: PopoverController) { }

  ngOnInit() {
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: `Se ha borrado la publicacion de guardados`,
      duration: 2000,
      position: position,
    });

    await toast.present();
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


  quitarGuardado(){
    this.presentToast('bottom');
  }

}
