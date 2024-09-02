import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-publicaciones-admin',
  templateUrl: './publicaciones-admin.page.html',
  styleUrls: ['./publicaciones-admin.page.scss'],
})
export class PublicacionesAdminPage implements OnInit {
  
    


  constructor(private alertController: AlertController, private toastController: ToastController) { }

  ngOnInit() {
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
            this.mostrarToast('Se ha borrado la ubicación correctamente.', 'success');
            
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
