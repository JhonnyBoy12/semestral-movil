import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-publicaciones-admin',
  templateUrl: './publicaciones-admin.page.html',
  styleUrls: ['./publicaciones-admin.page.scss'],
})
export class PublicacionesAdminPage implements OnInit {
  publicaciones: any []= []
    


  constructor(private alertController: AlertController, private toastController: ToastController, private bd:ServicebdService) { }

  ngOnInit() {
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
