import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-ubicaciones-admin',
  templateUrl: './ubicaciones-admin.page.html',
  styleUrls: ['./ubicaciones-admin.page.scss'],
})
export class UbicacionesAdminPage implements OnInit {
  ubicaciones: any;

 

  constructor(private router: Router, private alertController: AlertController, private toastController: ToastController, private bd:ServicebdService) { }
 
  ngOnInit() {
    this.consultarUbicaciones();
  }


  consultarUbicaciones(){
    this.bd.dbState().subscribe(data =>{
      if(data){
        this.bd.consultarUbicaciones().then(res =>{
          this.ubicaciones = res;
        }).catch(error =>{
          console.error('Error al cargar las Ubicaciones', error)
        });
      }
    });
  }

  async mostrarAlerta(id_ubicacion: number){
    const alert = await this.alertController.create({
      header: 'Confirmar Borrado',
      message: 'Usted borrará la ubicacion. ¿Desea borrarla?',
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
            this.borrarUbicacion(id_ubicacion);
          }
        }
      ]
    });
    
    await alert.present();

  }

  async borrarUbicacion(id_ubicacion: number) {
    this.bd.borrarUbicacion(id_ubicacion).then(() => {
      this.mostrarToast('Se ha borrado correctamente la ubicacion.', 'danger');
      this.consultarUbicaciones(); 
      
    }).catch(error => {
      this.mostrarToast('Error al borrar la publicación.', 'danger');
      console.error('Error al borrar la publicación', error);
    });
  }


  async confirmarBorrado(id_ubicacion:number) {
    this.mostrarAlerta(id_ubicacion)
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
