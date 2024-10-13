import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { firstValueFrom } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  imagePerfil: string = 'assets/icon/perfil.jpg'; // Imagen por defecto
  usuario: Usuario = {
    id_usuario: 0,
    nombre_usuario: '',
    correo_usuario: '',
    contrasena_usuario: '',
    id_rol: 0,
    telefono: '',
    foto: ''
  };

  constructor(
    private bd: ServicebdService, 
    private router: Router, 
    private storage: NativeStorage,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Usar el BehaviorSubject para obtener datos actualizados del usuario
    this.bd.usuarioSesion$.subscribe(usuario => {
      if (usuario) {
        this.usuario = usuario;
        this.imagePerfil = usuario.foto || 'assets/icon/perfil.jpg'; // Actualiza la imagen
      }
    });
    
    this.cargarDatosUsuario();
  }

  async cargarDatosUsuario() {
    try {
      const data = await this.storage.getItem('usuario_sesion');
      if (data) {
        this.usuario.id_usuario = data.id_usuario;
        this.usuario.nombre_usuario = data.nombre_usuario || '';
        this.usuario.correo_usuario = data.correo_usuario || '';
        this.usuario.telefono = data.telefono || '';
        this.usuario.contrasena_usuario = data.contrasena_usuario || '';
  
        // Obtener detalles completos del usuario desde la BD
        const usuarios = await firstValueFrom(this.bd.fetchUsuarios()); // Convertimos a Promise
        const userLogueado = usuarios.find(us => us.id_usuario === this.usuario.id_usuario);
  
        if (userLogueado) {
          this.usuario = userLogueado; // Actualiza el usuario si se encuentra en la lista
          // Si el usuario no tiene foto en la base de datos, asignamos la foto por defecto
          this.imagePerfil = userLogueado.foto ? userLogueado.foto : 'assets/icon/perfil.jpg';
        } else {
          this.bd.consultarUsuarioActivo(this.usuario.id_usuario);
        }
      }
    } catch (error) {
      this.presentAlert('Error al recuperar datos de usuario');
    }
  }

  // Alerta de error
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error al publicar',
      message: message,
      buttons: ['Action'],
    });
    await alert.present();
  }
  

  cambiarNombre() {
    this.router.navigate(['/cambiar-nombre']);
  }

  cambiarContra() {
    this.router.navigate(['/cambiar-contra']);
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // Guarda la imagen en formato base64
      });
  
      if (image && image.dataUrl) {
        this.imagePerfil = image.dataUrl; // Actualiza la vista con la nueva imagen
        
        // Actualizar la foto en la base de datos
        await this.bd.actualizarFotoUsuario(this.usuario.id_usuario, image.dataUrl);
        
        // Almacenar la nueva foto en la sesión
        const usuarioActualizado = { ...this.usuario, foto: image.dataUrl };
        await this.storage.setItem('usuario_sesion', usuarioActualizado);
        
        // Emitir el cambio de sesión al BehaviorSubject para propagarlo a la app
        this.bd.usuarioSesionSubject.next(usuarioActualizado);
      } else {
        this.presentAlert('No se pudo capturar la imagen.');
      }
    } catch (error) {
      this.presentAlert(`Error al tomar la foto: ${error}`);
    }
  }
}
