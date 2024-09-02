import { Component, OnInit } from '@angular/core';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { ComponentemenuComponent } from 'src/app/components/componentemenu/componentemenu.component';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.page.html',
  styleUrls: ['./foro.page.scss'],
})
export class ForoPage implements OnInit {

  constructor(private toastController: ToastController, private alertController: AlertController,
  public popoverController: PopoverController) { }

  ngOnInit() {
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

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: `Se ha guardado correctamente la publicacion`,
      duration: 1200,
      position: position,
    });

    await toast.present();
  }


  guardar(){
    this.presentToast('bottom');
  }

}

