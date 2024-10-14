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
    this.consultarUsuariosAdmin();
  }


  consultarUsuariosAdmin(){
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
