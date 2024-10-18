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
  async presentToast(position: 'top' | 'middle' | 'bottom', usuario: string = "", nombreUsuario:string) {
    const toast = await this.toastController.create({
      message: "Ha iniciado como " + usuario + " correctamente, ¡Hola! "+ nombreUsuario,
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
  
    // Primero intenta validar al administrador
    const admin = await this.bd.validarAdmin(this.email, this.contra);
  
    if (admin) {
        // Guarda los datos del administrador en el almacenamiento nativo
        await this.storage.setItem('usuario_sesion', {
            id_usuario: admin.id_administrador,  // Usa id_administrador
            nombre_usuario: admin.nombre,
            id_rol: admin.id_rol
        });
  
        // Redirige a la página del administrador
        this.router.navigate(['/home-admin']);
        this.presentToast('bottom', "administrador",admin.nombre);
    } else {
        // Si no es administrador, intenta validar como usuario
        const usuario = await this.bd.validarUsuario(this.email, this.contra);
        if (usuario) {
            // Después de la validación, consulta los datos completos del usuario
            const datosCompletos = await this.bd.consultarUsuarioActivo(usuario.id_usuario);
  
            if (datosCompletos) {
                // Guarda los datos completos del usuario en el almacenamiento nativo
                await this.storage.setItem('usuario_sesion', {
                    id_usuario: datosCompletos.id_usuario,
                    nombre_usuario: datosCompletos.nombre_usuario,
                    id_rol: datosCompletos.id_rol,
                    foto: datosCompletos.foto,
                    telefono: datosCompletos.telefono,  // Cualquier otro dato relevante
                    correo_usuario: datosCompletos.correo_usuario,  // Correo electrónico
                    contrasena_usuario: datosCompletos.contrasena_usuario
                });
  
                // Redirige a la página del usuario
                this.router.navigate(['/home']);
                this.presentToast('bottom', "usuario",datosCompletos.nombre_usuario);
            }
        } else {
            this.presentAlert('Correo electrónico o contraseña inválida.');
        }
    }
  }
}
