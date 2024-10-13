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

  publicaciones: any[] = [];
  usuarioId: number | null = null;
  

  constructor(private alertController: AlertController,
     private toastController: ToastController, 
     private bd: ServicebdService,
     private storage: NativeStorage ) { }

  ngOnInit() {
    
    this.cargarPublicaciones();

    // Suscribirse a los cambios de la sesión del usuario
    this.bd.usuarioSesion$.subscribe(usuario => {
      if (usuario) {
        this.usuario = usuario;
        this.foto = usuario.foto || 'assets/icon/perfil.jpg'; // Actualizar la foto con la sesión
      }
    });

    this.cargarDatosUsuario();
  }
  
  async cargarDatosUsuario() {
    try {
      const usuario = await this.storage.getItem('usuario_sesion');
      if (usuario && usuario.id_usuario) {
        this.usuarioId = usuario.id_usuario;
        this.usuario = usuario;
        this.foto = usuario.foto || this.foto; // Usar la foto del usuario si está disponible
        this.cargarPublicaciones(); // Solo carga publicaciones si se tiene el id
      } else {
        console.warn('No se encontró la sesión del usuario.');
      }
    } catch (error) {
      console.error('Error al obtener el usuario de la sesión:', error);
    }
  }

  async cargarPublicaciones() {
    if (this.usuarioId) {
      try {
        this.publicaciones = await this.bd.consultarPublicacionesPorUsuario(this.usuarioId);
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
