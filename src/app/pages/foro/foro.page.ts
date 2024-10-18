import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { ComponentemenuComponent } from 'src/app/components/componentemenu/componentemenu.component';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.page.html',
  styleUrls: ['./foro.page.scss'],
})
export class ForoPage implements OnInit {

  id_usuario?: number;

  publicaciones: any[]=[];

  constructor(private toastController: ToastController, private alertController: AlertController,
  public popoverController: PopoverController, private bd:ServicebdService, private storage: NativeStorage) { }

  ngOnInit() {
    // Suscribirse al observable usuarioSesion$ para detectar cambios en la sesión
    this.bd.usuarioSesion$.subscribe(usuario => {
      if (usuario) {
        this.id_usuario = usuario.id_usuario;
        
      } 
    });

    // Recuperar los datos de sesión desde NativeStorage
    this.storage.getItem('usuario_sesion')
      .then(data => {
        if (data) {
          // Asignar nombre y foto del usuario
          this.id_usuario = data.id_usuario;
        
  
        } else {
          console.error('Error al recuperar datos de sesión:');
        }
      })
      .catch(error => {
        console.error('Error al recuperar datos de sesión:', error);
        
      });

    // Suscribirse a los cambios de sesión del usuario
    this.bd.fetchUsuarios().subscribe(usuarios => {
      if (usuarios.length > 0) {
        const usuario = usuarios[0]; // Suponiendo que solo hay un usuario activo
        this.id_usuario = usuario.id_usuario;
      } 
    });

    this.cargarPublicaciones();
  }

  cargarPublicaciones() {
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.consultarPublicaciones().then(res => {
          this.publicaciones = res; 
        }).catch(error => {
          console.error("Error al cargar las publicaciones:", error);
        });
      }
    });
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

  async presentToast(position: 'top' | 'middle' | 'bottom', message:string) {
    const toast = await this.toastController.create({
      message: `Se ha guardado correctamente la publicacion`,
      duration: 1200,
      position: position,
    });

    await toast.present();
  }


  async guardar(id_publicacion: number) {
    if (!this.id_usuario) {
      console.error('Usuario no encontrado. No se puede guardar la publicación.');
      return;
    }
  
    try {
      // Proceder a guardar la publicación sin validar si ya está guardada
      await this.bd.guardarPublicacion(this.id_usuario, id_publicacion);
  
      // Actualizar las publicaciones guardadas
      await this.actualizarPublicacionesGuardadas();
  
      // Mostrar mensaje de éxito
      this.presentToast('bottom', 'Publicación guardada correctamente. Ve a tus guardados si quieres quitarlo.');
    } catch (error) {
      console.error("Error al guardar la publicación:", error);
      this.presentToast('bottom', 'Error al guardar la publicación.');
    }
  }
  

  async actualizarPublicacionesGuardadas() {
    try {
      // Verifica si el id_usuario está definido
      if (!this.id_usuario) {
        this.presentToast('bottom', 'Error al guardar la publicación id usuario.');
        return;
      }
  
      // Consultar las publicaciones guardadas para actualizarlas
      const publicacionesGuardadas = await this.bd.consultarPublicacionesGuardadas(this.id_usuario!);
  
      // Emitir el nuevo estado de publicaciones guardadas
      this.bd.listadoPublicacionesGuardadas.next(publicacionesGuardadas);
    } catch (error) {
      console.error("Error al actualizar las publicaciones guardadas:", error);
    }
  }
  
}

