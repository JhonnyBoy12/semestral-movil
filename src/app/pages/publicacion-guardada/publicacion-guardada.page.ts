import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { ComponentemenuComponent } from 'src/app/components/componentemenu/componentemenu.component';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Usuario } from 'src/app/models/usuario';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-publicacion-guardada',
  templateUrl: './publicacion-guardada.page.html',
  styleUrls: ['./publicacion-guardada.page.scss'],
})
export class PublicacionGuardadaPage implements OnInit {

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

  publicacionesGuardadas: any[] = [];


  constructor(private toastController: ToastController, public popoverController: PopoverController,
     private bd: ServicebdService, private storage: NativeStorage) { }

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

    this.cargarPublicacionesGuardadas();
  }

  async cargarPublicacionesGuardadas() {
    if (this.usuario.id_usuario) {
      try {
        this.publicacionesGuardadas = await this.bd.consultarPublicacionesGuardadas(this.usuario.id_usuario);
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
        this.presentToast("Error al cargar publicaciones guardadas",'bottom');
      }
    }
  }

  async presentToast(mensaje:string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: position,
    });

    await toast.present();
  }

  async contactar(ev: any, telefono:string) {
    const popover = await this.popoverController.create({
      component: ComponentemenuComponent,
      componentProps: { telefono },
      event: ev,
      translucent: true,
      backdropDismiss: true // Permite cerrar tocando fuera del Popover
    });
    await popover.present();
  }

  async quitarGuardado(id_publicacion: number) {
    try {
      await this.bd.borrarPublicacionGuardada(this.usuario.id_usuario, id_publicacion);
      // Actualiza la lista de publicaciones guardadas
      await this.cargarPublicacionesGuardadas(); // Recarga las publicaciones guardadas
      this.presentToast("Se ha quitado de guardado la publicación", 'bottom');
    } catch (error) {
      console.error('Error al quitar la publicación guardada:', error);
      this.presentToast("Error al quitar la publicación guardada", 'bottom');
    }
  }
  
}
