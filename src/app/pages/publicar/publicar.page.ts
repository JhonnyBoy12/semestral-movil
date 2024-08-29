import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
})
export class PublicarPage implements OnInit {

  titulo: string = '';
  descripcion: string = '';
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private router:Router, private alertController:AlertController,
    private toastController: ToastController) { }

  ngOnInit() {
  }

  eleccionImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  //ALERTA RECUADRO
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error al publicar',
      message: message,
      buttons: ['Action'],
    });

    await alert.present();
  }
  //ALERTA TOAST
  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: '¡Se ah publicado correctamente! Revise en foro su publicacion',
      duration: 3000,
      position: position,
    });

    await toast.present();
  }

  publicar(){
    if (!this.titulo) {
      this.presentAlert('Por favor ingrese un Titulo a la publicacion');
      return;
    }

    if (!this.imagePreview) {
      this.presentAlert('Por favor ingrese una imagen a la publicacion.');
      return;
    }
    
    if (!this.descripcion) {
      this.presentAlert('Por favor ingrese una descripcion a la publicacion');
      return;
    }

    let context: NavigationExtras = {
      state:{
        titulo:this.titulo,
        descripcion:this.descripcion,
        imagen:this.imagePreview,
      
      }
    }

    this.presentToast('bottom');
    this.router.navigate(['/foro'],context);

  }

}
