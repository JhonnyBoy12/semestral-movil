import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-iniciar',
  templateUrl: './iniciar.page.html',
  styleUrls: ['./iniciar.page.scss'],
})
export class IniciarPage implements OnInit {
  email: string = "";
  contra: string = "";

  constructor(
    private router: Router, 
    private alertController: AlertController,
    private activedroute: ActivatedRoute,
    private toastController: ToastController, 
    private bd: ServicebdService, 
    private storage: NativeStorage
  ) {}

  ngOnInit() {}

  validarEmail(email: string): boolean {
    const validarEm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validarEm.test(String(email).toLowerCase());
  }

  // ALERTA RECUADRO
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error al iniciar sesión',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // ALERTA TOAST
  async presentToast(position: 'top' | 'middle' | 'bottom', usuario: string = "") {
    const toast = await this.toastController.create({
      message: "Ha iniciado como " + usuario + " correctamente, ¡Hola!",
      duration: 1500,
      position: position,
    });
    await toast.present(); // Agregar esta línea
  }

  async iniciar() {
    if (!this.email) {
      this.presentAlert('Por favor ingrese su correo electrónico.');
      return;
    }

    if (!this.contra) {
      this.presentAlert('Por favor ingrese su contraseña.');
      return;
    }

    if (!this.validarEmail(this.email)) {
      this.presentAlert('Por favor ingrese un correo electrónico válido.');
      return;
    }

    const usuario = await this.bd.validarUsuario(this.email, this.contra);

    if (usuario) {
      // Guardar los datos del usuario en NativeStorage
      this.storage.setItem('usuario', {
        id_usuario: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        id_rol: usuario.id_rol
      }).then(
        () => {
          // Si encuentra el usuario, accede a la interfaz
          if (usuario.id_rol === 1) { // es el id del admin de la base de datos
            this.router.navigate(['/home-admin']);
            this.presentToast('bottom', "administrador");
          } else {
            this.router.navigate(['/home']); // rol usuario
            this.presentToast('bottom', "usuario");
          }
        },
        error => this.presentAlert('Error al guardar el usuario en el almacenamiento nativo.')
      );
    } else {
      this.presentAlert('Correo electrónico o contraseña inválida.');
    }
  }
}
