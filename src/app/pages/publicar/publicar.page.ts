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

  imagePerfil: string ="";

  titulo: string = '';
  descripcion: string = '';
  imagePreview: string | ArrayBuffer | null = null;
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
  usuario: Usuario = {
    id_usuario: 0,
    nombre_usuario: '',
    correo_usuario: '',
    contrasena_usuario: '',
    id_rol: 0,
    telefono: '',
    foto: ''
  };

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private bd: ServicebdService,
    private storage: NativeStorage
  ) {}

  ngOnInit() {

    // Usar el BehaviorSubject para obtener datos actualizados del usuario
    this.bd.usuarioSesion$.subscribe(usuario => {
      if (usuario) {
        this.usuario = usuario;
        this.imagePerfil = usuario.foto || 'assets/icon/perfil.jpg'; // Actualiza la imagen
      }
    });
    
    // Obtiene el id del usuario desde NativeStorage
    this.storage.getItem('usuario_sesion')
      .then(data => {
        if (data) {
          // Asignar nombre y foto del usuario
          this.usuario = data;
          this.imagePerfil = data.foto || 'assets/icon/perfil.jpg'; // Imagen por defecto
  
        } else {
          // Si no hay sesión, redirigir a la página de inicio de sesión
          this.router.navigate(['/iniciar']);
        }
      })
      .catch(error => {
        console.error('Error al recuperar datos de sesión:', error);
        this.router.navigate(['/iniciar']);
      });

      // Suscribirse a los cambios de sesión del usuario
    this.bd.fetchUsuarios().subscribe(usuarios => {
      if (usuarios.length > 0) {
        const usuario = usuarios[0]; // Suponiendo que solo hay un usuario activo
        this.usuario = usuario;
        this.imagePerfil = usuario.foto || 'assets/icon/perfil.jpg'; // Usar la foto del usuario, o la por defecto
      } else {
        this.imagePerfil = 'assets/icon/perfil.jpg'; // Imagen por defecto
      }
    });
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
      id_usuario: this.usuario.id_usuario,
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

