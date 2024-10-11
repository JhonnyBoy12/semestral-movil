import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
})
export class PublicarPage implements OnInit {

  titulo: string = '';
  descripcion: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  id_categoria: number = 0;
  id_usuario: number = 0; // Este valor lo tomaremos del usuario en sesión
  publicacion_adopcion: boolean = false;

  constructor(private router:Router, private alertController:AlertController,
    private toastController: ToastController, private bd:ServicebdService, private storage:NativeStorage) { }

  ngOnInit() {
    // Obtiene el id del usuario desde NativeStorage
    this.storage.getItem('usuario_sesion').then(data => {
      if (data) {
        this.id_usuario = data.id_usuario; // Asigna el ID del usuario
      } else {
        this.presentAlert('No se encontró el usuario en NativeStorage.');
      }
    }).catch(error => {
      this.presentAlert(`Error al obtener el usuario de NativeStorage: ${error}`);
    });
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

  async publicar() {
  // Validar campos
  if (!this.titulo) {
    this.presentAlert('Por favor ingrese un título a la publicación');
    return;
  }

  if (!this.imagePreview) {
    this.presentAlert('Por favor ingrese una imagen a la publicación.');
    return;
  }

  if (!this.descripcion) {
    this.presentAlert('Por favor ingrese una descripción a la publicación');
    return;
  }

  if (this.id_categoria === 0) { // Validar que la categoría no sea 0
    this.presentAlert('Por favor seleccione una categoría válida.');
    return;
  }

  // Preparamos los datos para la publicación
  const publicacion = {
    id_usuario: this.id_usuario,
    titulo: this.titulo,
    foto: this.imagePreview as string,
    descripcion: this.descripcion,
    fecha_publicacion: new Date(), // Agregamos la fecha de publicación
    publicacion_adopcion: this.publicacion_adopcion,
    id_categoria: this.id_categoria,
  };

  try {
    // Llamamos al servicio para agregar la publicación
    await this.bd.agregarPublicacion(publicacion);
    this.presentToast('bottom');
    this.router.navigate(['/foro']); // Redirigimos al foro después de publicar
  } catch (error) {
    this.presentAlert('Error al publicar la publicación, intente nuevamente.'); // Manejamos el error
  }
}

}
