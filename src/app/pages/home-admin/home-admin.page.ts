import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {

  constructor(
    private router: Router,
    private toastController: ToastController, 
    private storage: NativeStorage, 
    private bd: ServicebdService
  ) {}
 
  ngOnInit() {
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

  async cerrarSesion() {
    try {
      await this.storage.remove('usuario_sesion');
      this.bd.usuarioSesionSubject.next(null);
      this.bd.listadoUsuarios.next([]); // Limpiar el observable
  
      this.presentToast('bottom');
      this.router.navigate(['/iniciar']); // Redirigir a iniciar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      this.presentToast('bottom'); // Muestra un toast de error si es necesario
    }
  }

}
