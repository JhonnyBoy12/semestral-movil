import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { ServicebdService } from './services/servicebd.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  nombreUsuario: string = '';
  fotoUsuario: string = 'assets/icon/perfil.jpg';

  constructor(
    private router: Router, 
    private alertController: AlertController,
    private toastController: ToastController, 
    private storage: NativeStorage, 
    private bd: ServicebdService
  ) {}

  ngOnInit() {
    // Recuperar los datos de sesión desde NativeStorage
    this.storage.getItem('usuario_sesion')
      .then(data => {
        if (data) {
          // Asignar nombre y foto del usuario
          this.nombreUsuario = data.nombre_usuario;
          this.fotoUsuario = data.foto || 'assets/icon/perfil.jpg'; // Imagen por defecto
  
          // Comprobar el rol para redirigir a la página correspondiente
          if (data.id_rol === 1) {
            this.router.navigate(['/home-admin']); // Redirigir al administrador
          } else {
            this.router.navigate(['/home']); // Redirigir al usuario
          }
        } else {
          // Si no hay sesión, redirigir a la página de inicio de sesión
          this.router.navigate(['/iniciar']);
        }
      })
      .catch(error => {
        console.error('Error al recuperar datos de sesión:', error);
        this.router.navigate(['/iniciar']);
      });
  
    // Suscribirse a los cambios de sesión del usuario
    this.bd.fetchUsuarios().subscribe(usuarios => {
      if (usuarios.length > 0) {
        const usuario = usuarios[0]; // Suponiendo que solo hay un usuario activo
        this.nombreUsuario = usuario.nombre_usuario;
        this.fotoUsuario = usuario.foto || 'assets/icon/perfil.jpg'; // Usar la foto del usuario, o la por defecto
      } else {
        this.nombreUsuario = ''; // Cuando no hay usuario activo
        this.fotoUsuario = 'assets/icon/perfil.jpg'; // Imagen por defecto
      }
    });
  }

  // ALERTA TOAST
  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: `Has cerrado sesión correctamente`,
      duration: 2000,
      position: position,
    });
    await toast.present();
  }

  // Cerrar Sesión
  async cerrarSesion() {
    try {
      await this.storage.remove('usuario_sesion');
      this.bd.listadoUsuarios.next([]); // Limpiar el observable
      
      // Restablecer los valores locales de nombre y foto del usuario
      this.nombreUsuario = '';
      this.fotoUsuario = 'assets/icon/perfil.jpg';
  
      this.presentToast('bottom');
      this.router.navigate(['/iniciar']); // Redirigir a iniciar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      this.presentToast('bottom'); // Muestra un toast de error si es necesario
    }
  }
}
