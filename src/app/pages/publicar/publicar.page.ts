import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { firstValueFrom } from 'rxjs';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
})
export class PublicarPage implements OnInit {
  
  titulo: string = '';
  descripcion: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  id_usuario: number = 0; // Este valor lo tomaremos del usuario en sesión
  publicacion_adopcion: boolean = false;

  // Definimos las categorías
  categorias = [
    { id: 1, nombre: 'Perros' },
    { id: 2, nombre: 'Gatos' },
    { id: 3, nombre: 'Perros y Gatos' },
    { id: 4, nombre: 'Roedores' },
    { id: 5, nombre: 'Otros' }
  ];

  id_categoria: number | null = null; // Inicializamos como null

  // Definir la propiedad usuarios
  usuario: Usuario | null = null;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private bd: ServicebdService,
    private storage: NativeStorage
  ) {}

  ngOnInit() {
    // Obtiene el id del usuario desde NativeStorage
    this.storage.getItem('usuario_sesion').then(data => {
      if (data) {
        this.id_usuario = data.id_usuario; // Asigna el ID del usuario
        this.cargarDatosUsuario();
      } else {
        this.presentAlert('No se encontró el usuario en NativeStorage.');
      }
    }).catch(error => {
      this.presentAlert(`Error al obtener el usuario de NativeStorage: ${error}`);
    });
  }

  async cargarDatosUsuario() {
    try {
      const usuarios = await firstValueFrom(this.bd.fetchUsuarios());
      this.usuario = usuarios.find(us => us.id_usuario === this.id_usuario) || null; // Encuentra el usuario activo
      if (!this.usuario) {
        this.presentAlert('No se encontró el usuario activo.');
      }
    } catch (error) {
      console.error('Error al recuperar la información del usuario', error);
      this.presentAlert('Error al cargar la información del usuario, intente nuevamente.');
    }
  }

  // Método para obtener el nombre de la categoría
  getNombreCategoria(id: number | null): string {
    if (id === null) {
      return 'Categoría no seleccionada'; // Maneja el caso de null aquí
    }
    const categoria = this.categorias.find(cat => cat.id === id);
    return categoria ? categoria.nombre : 'Categoría no seleccionada';
  }

  // Alerta de error
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error al publicar',
      message: message,
      buttons: ['Action'],
    });
    await alert.present();
  }

  // Alerta Toast para éxito
  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: '¡Se ha publicado correctamente! Revise en el foro su publicación',
      duration: 3000,
      position: position,
    });
    await toast.present();
  }

  // Método para capturar una imagen
  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // Guarda como base64
      });
      
      if (image && image.dataUrl) {
        this.imagePreview = image.dataUrl; // Guarda la imagen en base64
      } else {
        this.presentAlert('No se pudo capturar la imagen.');
      }
    } catch (error) {
      this.presentAlert(`Error al tomar la foto: ${error}`);
    }
  }
  
  // Método para publicar la publicación
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

    if (!this.id_categoria) { // Validamos que id_categoria no sea null
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

