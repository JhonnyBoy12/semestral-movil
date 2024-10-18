import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  nombreUsuario:string="";
  email:string="";
  telefono: string="";
  contra:string="";
  confirmarContra:string=""; // Nueva variable para confirmar la contraseña
  id_rol: number=2;

  

  constructor(private router:Router, private alertController:AlertController,
    private toastController: ToastController, private bd: ServicebdService) { }

  ngOnInit() {}

  // Función para validar email
  validarEmail(email: string): boolean {
    const validarEm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validarEm.test(String(email).toLowerCase());
  }

  validarSoloNumeros(event: any) {
    const pattern = /^[0-9]*$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Función para validar contraseña
  validarContrasena(contra: string): boolean {
    const validarCon = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return validarCon.test(contra);
  }

  // ALERTA RECUADRO
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error al registrarse',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // ALERTA TOAST
  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: '¡Se ha registrado correctamente!',
      duration: 1500,
      position: position,
    });
    await toast.present();
  }

  registrar() {
    // Validación de nombre de usuario
    if (!this.nombreUsuario) {
      this.presentAlert('Por favor ingrese un nombre de usuario.');
      return;
    }

    // Validación de longitud del nombre de usuario
    if (this.nombreUsuario.length < 6) {
      this.presentAlert('El nombre de usuario debe tener al menos 6 caracteres.');
      return;
    }

    if (this.nombreUsuario.length > 14) {
      this.presentAlert('El nombre de usuario no debe exceder los 14 caracteres.');
      return;
    }
    
    // Validación de correo
    if (!this.email) {
      this.presentAlert('Por favor ingrese un correo electrónico.');
      return;
    }

    if (!this.validarEmail(this.email)) {
      this.presentAlert('Por favor ingrese un correo electrónico válido.');
      return;
    }

    // Validación de teléfono
    if (!this.telefono) {
      this.presentAlert('Por favor ingrese un número de teléfono.');
      return;
    }

    if (this.telefono.length !== 8) {
      this.presentAlert('Por favor ingrese un número de teléfono válido de 8 dígitos.');
      return;
    }
    // Validación de contraseña
    if (!this.contra) {
      this.presentAlert('Por favor ingrese una contraseña.');
      return;
    }

    if (!this.validarContrasena(this.contra)) {
      this.presentAlert('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un símbolo.');
      return;
    }

    // Comparación de contraseñas
    if (this.contra !== this.confirmarContra) {
      this.presentAlert('Las contraseñas no coinciden.');
      return;
    }
    // Convertir el teléfono a número antes de llamar a la BD
    

    this.bd.ingresarUsuario(this.nombreUsuario, this.email, this.contra, this.id_rol, this.telefono)
    .then(() => {
      this.presentToast('bottom');
      this.router.navigate(['/iniciar']);
    })
    .catch((error) => {
      this.presentAlert('Error al registrarse: ' + error.message);
    });
  }
}
