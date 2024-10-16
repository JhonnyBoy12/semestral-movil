import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.page.html',
  styleUrls: ['./usuarios-admin.page.scss'],
})
export class UsuariosAdminPage implements OnInit {
  usuarios: any;

  constructor(private alertController: AlertController, private toastController: ToastController, private bd:ServicebdService) { }

  ngOnInit() {
    this.consultarUsuariosAdmin();
  }

  consultarUsuariosAdmin(){
    this.bd.dbState().subscribe(data=>{
      if(data){
        this.bd.consultarUsuariosAdmin().then(res=>{
          this.usuarios = res;
        }).catch(error =>{
          console.error('Error al cargar las Usuarios', error)
        });
      }
    })

  }



  async confirmarBorrado() {
    const alert = await this.alertController.create({
      header: 'Confirmar Borrado',
      message: 'Usted borrará al usuario. ¿Desea borrarla?',
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
            this.mostrarToast('Se ha borrado al usuario correctamente.', 'success');
            
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
