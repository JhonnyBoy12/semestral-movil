import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  nombreUsuario:string = "";

  constructor(private router:Router, private alertContorller:AlertController,
    private toastController: ToastController, private storage: NativeStorage) {
      // Función para verificar si hay un usuario guardado
    this.storage.getItem('usuario').then(
      data => {
        // Si hay datos del usuario, redirigir a home
        if (data) {
          this.nombreUsuario = data.nombre_usuario; // Cargar el nombre de usuario
          this.router.navigate(['/home']);
        } else {
          // Si no hay datos, redirigir a iniciar
          this.router.navigate(['/iniciar']);
        }
      },
      error => {
        // Manejo de errores al recuperar el usuario
        console.log('No hay usuario en el almacenamiento nativo.');
        this.router.navigate(['/iniciar']);
      }
    );
    
  }

    //ALERTA TOAST
  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: `Has cerrado sesión correctamente`,
      duration: 2000,
      position: position,
    });

    await toast.present();
  }

  cerrarsesion(){
    //Al cerrar sesion limpia LOCAL
    localStorage.clear();

    this.presentToast('bottom');
    this.router.navigate(['/iniciar']);
  }
}
