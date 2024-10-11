import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
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

  constructor(
    private bd: ServicebdService, 
    private router: Router, 
    private storage: NativeStorage
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    this.storage.getItem('usuario_sesion').then(data => {
      if (data) {
        this.usuario.id_usuario = data.id_usuario;
        this.usuario.nombre_usuario = data.nombre_usuario || '';
        this.usuario.foto = data.foto || this.foto; // Imagen por defecto si no hay foto
  
        // Obtener detalles completos del usuario desde la BD
        this.bd.fetchUsuarios().subscribe(
          usuarios => {
            const userLogueado = usuarios.find(us => us.id_usuario === this.usuario.id_usuario);
            if (userLogueado) {
              this.usuario = userLogueado; // Actualiza el usuario si se encuentra en la lista
            } else {
              // Si no se encuentra, llama a la función para consultar usuario activo
              this.bd.consultarUsuarioActivo(this.usuario.id_usuario);
            }
          },
          error => {
            console.error('Error al recuperar lista de usuarios', error);
          }
        );
      }
    }).catch(error => {
      console.error('Error al recuperar datos de usuario', error);
    });
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
        allowEditing: true,
        resultType: CameraResultType.Uri
      });
      this.foto = image.webPath || '';
  
      // Actualiza la foto en la base de datos
      if (this.usuario.id_usuario) {
        this.bd.actualizarFotoUsuario(this.usuario.id_usuario, this.foto).then(() => {
          console.log('Foto de perfil actualizada');
        }).catch(error => {
          console.error('Error al actualizar la foto en la base de datos', error);
        });
      }
    } catch (error) {
      console.error('Error al tomar la foto', error);
    }
  }
}
