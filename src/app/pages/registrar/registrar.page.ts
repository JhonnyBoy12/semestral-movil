import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  nombreUsuario:string="";
  email:string="";
  telefono:string="";
  contra:string="";

  usuarios: any =[

  ]

  constructor(private router:Router, private alertController:AlertController,
    private toastController: ToastController) {

     }

  ngOnInit() {
  }

  // Función para validar email
  validarEmail(email: string): boolean {
    const validarEm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validarEm.test(String(email).toLowerCase());
  }

  // Función para validar teléfono (ejemplo simple)
  validarTelefono(telefono: string): boolean {
    const validarTe = /^[0-9]{10}$/;
    return validarTe.test(String(telefono));
  }
  //ALERTA RECUADRO
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error al registrarse',
      message: message,
      buttons: ['Action'],
    });

    await alert.present();
  }
  //ALERTA TOAST
  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: '¡Se ah registrado correctamente!',
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  registrar(){
    if (!this.nombreUsuario) {
      this.presentAlert('Por favor ingrese un nombre de usuario.');
      return;
    }

    if (!this.email) {
      this.presentAlert('Por favor ingrese un correo electrónico.');
      return;
    }

    if (!this.validarEmail(this.email)) {
      this.presentAlert('Por favor ingrese un correo electrónico válido.');
      return;
    }

    if (!this.telefono) {
      this.presentAlert('Por favor ingrese un número de teléfono.');
      return;
    }

    if (!this.validarTelefono(this.telefono)) {
      this.presentAlert('Por favor ingrese un número de teléfono válido.');
      return;
    }

    if (!this.contra) {
      this.presentAlert('Por favor ingrese una contraseña.');
      return;
    }

    let context: NavigationExtras = {
      state:{
        usuario:this.nombreUsuario,
        mail:this.email,
        tel:this.telefono,
        cont:this.contra
      }

    }
    
    this.presentToast('bottom');
    this.router.navigate(['/iniciar'],context)

  }
  


}
