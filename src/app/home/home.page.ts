import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ServicebdService } from '../services/servicebd.service';
import { Usuario } from 'src/app/models/usuario';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  /// crear variables actualizadas
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
  constructor(private router:Router,private activedroute: ActivatedRoute, private storage: NativeStorage, private bd: ServicebdService) {}

  ngOnInit() {
    // Usar el BehaviorSubject para obtener datos actualizados del usuario
    this.bd.usuarioSesion$.subscribe(usuario => {
      if (usuario) {
        this.usuario = usuario;
      }
    });

    this.actualizar();
    
  }

  
  async actualizar() {
    try {
      const data = await this.storage.getItem('usuario_sesion');
      if (data) {
        this.usuario.id_usuario = data.id_usuario;
        this.usuario.nombre_usuario = data.nombre_usuario;
        this.usuario.correo_usuario = data.correo_usuario ;
        this.usuario.telefono = data.telefono;
        this.usuario.id_rol = data.id_rol;
        this.usuario.foto = data.foto || 'assets/icon/perfil.jpg';
        this.usuario.contrasena_usuario = data.contrasena_usuario;
  
        // Obtener detalles completos del usuario desde la BD
        const usuarios = await firstValueFrom(this.bd.fetchUsuarios()); // Convertimos a Promise
        const userLogueado = usuarios.find(us => us.id_usuario === this.usuario.id_usuario);
  
        if (userLogueado) {
          this.usuario = userLogueado; // Actualiza el usuario si se encuentra en la lista
          // Si el usuario no tiene foto en la base de datos, asignamos la foto por defecto
          this.foto = userLogueado.foto ? userLogueado.foto : 'assets/icon/perfil.jpg';
        } else {
          this.bd.consultarUsuarioActivo(this.usuario.id_usuario);
        }
      }
    } catch (error) {
      console.error('Error al recuperar datos de usuario');
    }
  }
  

}


