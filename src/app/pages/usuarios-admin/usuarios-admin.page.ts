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

  async mostrarAlerta(id_usuario: number){
    const alert = await this.alertController.create({
      header: 'Confirmar Borrado',
      message: 'Usted borrará el usuario. ¿Desea borrar el usuario?',
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
          handler: () => {
            this.borrarUsuario(id_usuario);
          }
        }
      ]
    });
    
    await alert.present();

  }

  async borrarUsuario(id_usuario: number) {
    this.bd.borrarUsuario(id_usuario).then(() => {
      this.mostrarToast('Se ha borrado correctamene la publicacion.', 'danger');
      this.consultarUsuariosAdmin(); 
      
    }).catch(error => {
      this.mostrarToast('Error al borrar la publicación.', 'danger');
      console.error('Error al borrar la publicación', error);
    });
  }

  async confirmarBorrado(id_usuario: number) {
    this.mostrarAlerta(id_usuario)
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
