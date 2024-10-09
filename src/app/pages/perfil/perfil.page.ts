import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
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
  foto: any;


  usuario: Usuario = {
    id_usuario: 0,
    nombre_usuario: '',
    correo_usuario: '',
    contrasena_usuario: '',
    id_rol: 0,
    telefono: '',
    foto: ''
  };

  constructor(private bd: ServicebdService, private router: Router, private storage: NativeStorage) {}

  ngOnInit() {
    this.storage.getItem('usuario')
    .then(data => {
      if (data) {
        this.usuario.id_usuario = data.id_usuario;
        this.usuario.nombre_usuario = data.nombre_usuario;
      }
    }, error => {
      console.error('Error al recuperar datos de usuario', error);
    });

    this.bd.fetchUsuarios().subscribe(usuarios => {
      if (usuarios.length > 0) {
        // Suponiendo que solo hay un usuario activo que deseas mostrar
        const userLogueado = usuarios.find(us => us.id_usuario === this.usuario.id_usuario);
        if (userLogueado) {
          this.usuario = userLogueado;
        }
      }
    });
  }

  cambiarNombre() {
    this.router.navigate(['/cambiar-nombre']);
  }

  cambiarContra() {
    this.router.navigate(['/cambiar-contra']);
  }
  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
  
    this.foto = image.webPath;
  };
  
}