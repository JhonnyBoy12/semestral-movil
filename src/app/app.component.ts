import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  constructor(private router:Router, private alertContorller:AlertController,
    private toastController: ToastController) {}

    //ALERTA TOAST
  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: `Has cerrado sesion correctamente`,
      duration: 2000,
      position: position,
    });

    await toast.present();
  }

  cerrarsesion(){
    this.presentToast('bottom');
    this.router.navigate(['/iniciar']);
  }
}
