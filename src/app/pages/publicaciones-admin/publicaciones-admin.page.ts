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

  async mostrarAlerta(id_publicacion: number){
    const alert = await this.alertController.create({
      header: 'Confirmar Borrado',
      message: 'Usted borrará la publicacion. ¿Desea borrarla?',
      cssClass: 'custom-alert', // Agregar clase personalizada
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button', // Clase personalizada
          handler: () => {
            this.mostrarToast('No se ha realizado ningún cambio.', 'default');
          }
        }, {
          text: 'Borrar',
          cssClass: 'confirm-button', // Clase personalizada
          handler: async () => {
            this.borrarPublicacion(id_publicacion);
          }
        }
      ]
    });
    
    await alert.present();

  }

  async borrarPublicacion(id_publicacion: number) {
    this.bd.borrarPublicacion(id_publicacion).then(() => {
      this.mostrarToast('Se ha borrado correctamente la publicacion.', 'danger');
      this.cargarPublicaciones(); 
      
    }).catch(error => {
      this.mostrarToast('Error al borrar la publicación.', 'danger');
      console.error('Error al borrar la publicación', error);
    });
  }
  

  async confirmarBorrado(id_publicacion:number) {
    this.mostrarAlerta(id_publicacion);
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
