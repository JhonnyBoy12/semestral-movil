import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ServicebdService } from '../services/servicebd.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  /// crear variables menu

  nombreMenu: string = "";
  emailMenu: string = "";
  telefonoMenu: string = "";
  fotoMenu: string = 'assets/icon/perfil.jpg';  

  constructor(private router:Router,private activedroute: ActivatedRoute, private storage: NativeStorage, private bd: ServicebdService) {}

  ngOnInit() {
    this.actualizarMenu();
  }

  ionViewWillEnter() {
    this.actualizarMenu();  // Asegura que se actualicen los datos al entrar a la página
  }

  actualizarMenu() {
    // Recuperar la sesión del usuario
    this.storage.getItem('usuario_sesion')
      .then(data => {
        if (data) {
          this.nombreMenu = data.nombre_usuario;
          this.emailMenu = data.correo_usuario;
          this.telefonoMenu = data.telefono;
          this.fotoMenu = data.foto || 'assets/icon/perfil.jpg'; // Imagen por defecto
        }
      })
      .catch(error => {
        console.error('Error al recuperar los datos del menú:', error);
      });

    // Suscribirse al observable de usuario activo
    this.bd.fetchUsuarios().subscribe(usuarios => {
      if (usuarios.length > 0) {
        const usuario = usuarios[0];
        this.nombreMenu = usuario.nombre_usuario;
        this.emailMenu = usuario.correo_usuario;
        this.telefonoMenu = usuario.telefono;
        this.fotoMenu = usuario.foto || this.fotoMenu;  // Mantener foto por defecto si no hay foto
      }
    });
  }
  

}


