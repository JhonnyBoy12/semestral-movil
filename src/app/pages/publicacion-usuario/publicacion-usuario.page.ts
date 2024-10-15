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

  foto: string = ''; // Imagen por defecto
  usuario: Usuario = {
    id_usuario: 0,
    nombre_usuario: '',
    correo_usuario: '',
    contrasena_usuario: '',
    id_rol: 0,
    telefono: '',
    foto: ''
  };

  publicaciones: any[] = [];

  constructor(private alertController: AlertController,
     private toastController: ToastController, 
     private bd: ServicebdService,
     private storage: NativeStorage ) { }

  ngOnInit() {
    
    // Suscribirse a los cambios de la sesión del usuario
    this.bd.usuarioSesion$.subscribe(usuario => {
      if (usuario) {
        this.usuario = usuario;
        this.foto = usuario.foto || 'assets/icon/perfil.jpg'; // Actualizar la foto con la sesión
      }
    });

    this.storage.getItem('usuario_sesion')
      .then(data => {
        if (data) {
          // Asignar nombre y foto del usuario
          this.usuario = data;
          this.foto = data.foto || 'assets/icon/perfil.jpg'; // Imagen por defecto
  
        }
      })
      .catch(error => {
        console.error('Error al recuperar datos de sesión:', error);
      });
    
    // Suscribirse a los cambios de sesión del usuario
    this.bd.fetchUsuarios().subscribe(usuarios => {
      if (usuarios.length > 0) {
        const usuario = usuarios[0]; // Suponiendo que solo hay un usuario activo
        this.usuario = usuario;
        this.foto = usuario.foto || 'assets/icon/perfil.jpg'; // Usar la foto del usuario, o la por defecto
      } else {
        this.foto = 'assets/icon/perfil.jpg'; // Imagen por defecto
      }
    });

    this.cargarPublicaciones();
  }
  
  async cargarPublicaciones() {
    if (this.usuario.id_usuario) {
      try {
        this.publicaciones = await this.bd.consultarPublicacionesPorUsuario(this.usuario.id_usuario);
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
        this.mostrarToast('Error al cargar las publicaciones.', 'danger');
      }
    }
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
