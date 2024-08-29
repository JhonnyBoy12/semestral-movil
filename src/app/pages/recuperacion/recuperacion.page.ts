import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.page.html',
  styleUrls: ['./recuperacion.page.scss'],
})
export class RecuperacionPage implements OnInit {

  emailRecuperacion:string="";

  constructor( private router:Router, private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnInit() {
  }

  // Función para validar email
  validarEmail(email: string): boolean {
    const validarEm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validarEm.test(String(email).toLowerCase());
  }

  //ALERTA RECUADRO
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error al recuperar contraseña',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
  //ALERTA TOAST
  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Se ah mandado la solicitud correctamente espere el correo',
      duration: 2500,
      position: position,
    });

    await toast.present();
  }

  recuperar(){
    if (!this.emailRecuperacion) {
      this.presentAlert('Por favor ingrese un correo electrónico.');
      return;
    }
    if (!this.validarEmail(this.emailRecuperacion)) {
      this.presentAlert('Por favor ingrese un correo electrónico válido.');
      return;
    }

    this.presentToast('bottom');
    this.router.navigate(['/iniciar']);
  }
}
