import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-cambiar-contra',
  templateUrl: './cambiar-contra.page.html',
  styleUrls: ['./cambiar-contra.page.scss'],
})
export class CambiarContraPage implements OnInit {

  antiguaContra: string ='';
  nuevaContra: string= '';

  constructor(private bd:ServicebdService, private alertController: AlertController) { }

  ngOnInit() {
    
  }


  async cambiarContrasena() {
    // Validación básica
    if (!this.nuevaContra || !this.antiguaContra) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, ingresa ambas contraseñas.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  
    try {
      // Obtener la sesión del usuario
      const usuarioSesion = await this.bd.obtenerUsuarioSesion();
  
      if (usuarioSesion) {
        // Llama al service para actualizar la contraseña
        await this.bd.actualizarContrasenaUsuario(usuarioSesion.id_usuario, this.antiguaContra, this.nuevaContra);
        
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Contraseña actualizada correctamente.',
          buttons: ['OK']
        });
        await alert.present();
      } else {
        // Manejar el caso en que no haya sesión activa
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se encontró la sesión de usuario.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo actualizar la contraseña. Por favor, verifica la contraseña actual.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}

