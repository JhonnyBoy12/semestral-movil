import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-publicacion-usuario',
  templateUrl: './publicacion-usuario.page.html',
  styleUrls: ['./publicacion-usuario.page.scss'],
})
export class PublicacionUsuarioPage implements OnInit {

  foto: string = 'assets/icon/perfil.jpg'; // Imagen por defecto
  usuario: Usuario = {
    id_usuario: 0,
    nombre_usuario: '',
    correo_usuario: '',
    contrasena_usuario: '',
    id_rol: 0,
    telefono: '',
    foto: ''
  };
  public publicaciones: any[] = [];
   usuarioId: any;
  

  constructor(private alertController: AlertController,
     private toastController: ToastController, 
     private bd: ServicebdService,
     private storage: NativeStorage ) { }
  ngOnInit() {
    this.obtenerId();
    this.cargarPublicaciones();
  }
  
  async obtenerId(){
    const usuario:Usuario = await this.storage.getItem('usuario_sesion'); // Obtén el usuario desde el almacenamiento
  if (usuario) {
    this.usuarioId = usuario.id_usuario; // Asigna el ID del usuario
    console.log('ID del usuario:', this.usuarioId);
    this.cargarPublicaciones();
  } else {
    console.warn('No se encontró la sesión del usuario.');
  }
}
  

  async cargarPublicaciones() {
    this.publicaciones = await this.bd.consultarPublicacionesPorUsuario(this.usuarioId);
  }

  async confirmarBorrado() {
    const alert = await this.alertController.create({
      header: 'Confirmar Borrado',
      message: 'Usted borrará la publicación. ¿Desea borrarla?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.mostrarToast('No se ha realizado ningún cambio.', 'danger');
          }
        }, {
          text: 'Borrar',
          handler: () => {
            this.mostrarToast('Se ha borrado la publicación correctamente.', 'success');
            
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

}
