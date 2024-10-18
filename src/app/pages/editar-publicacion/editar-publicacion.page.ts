import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-editar-publicacion',
  templateUrl: './editar-publicacion.page.html',
  styleUrls: ['./editar-publicacion.page.scss'],
})
export class EditarPublicacionPage implements OnInit {

  publicacionEdit: any;

  categorias = [
    { id: 1, nombre: 'Perros' },
    { id: 2, nombre: 'Gatos' },
    { id: 3, nombre: 'Perros y Gatos' },
    { id: 4, nombre: 'Roedores' },
    { id: 5, nombre: 'Otros' }
  ];
  
  

  constructor(private alertController: AlertController, private activedRoute: ActivatedRoute, private router: Router, private toastController: ToastController,
  private bd: ServicebdService, private cdr: ChangeDetectorRef, private storage: NativeStorage
  ) {  
    this.activedRoute.queryParams.subscribe(res=>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.publicacionEdit = this.router.getCurrentNavigation()?.extras?.state?.['edicion'];
      }
    });
  }

  ngOnInit() {

  }

  onCategoriaChange(event: any) {
    this.publicacionEdit.id_categoria = event; // Actualizamos el valor de id_categoria
    this.cdr.detectChanges(); // Forzamos la detección de cambios para que la vista previa se actualice
  }
  
  getNombreCategoria(id: number | null): string {
    if (id === null) {
      return 'Categoría no seleccionada';
    }
    const categoria = this.categorias.find(cat => cat.id === id);
    return categoria ? categoria.nombre : 'Categoría no seleccionada';
  }

  // Método para capturar una imagen
  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // Guarda como base64
        source: CameraSource.Prompt // Permite elegir entre galería y cámara
      });
      
      if (image && image.dataUrl) {
        this.publicacionEdit.foto = image.dataUrl; // Guarda la imagen en el campo `foto`
        this.cdr.detectChanges(); // Forzamos la detección de cambios
      } else {
        this.presentAlert('No se pudo capturar la imagen.');
      }
    } catch (error) {
      this.presentAlert(`Error al tomar la foto: ${error}`);
    }
  }
  

  // Alerta de error
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error al editar publicacion',
      message: message,
      buttons: ['Action'],
    });
    await alert.present();
  }

  // Alerta Toast para éxito
  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: '¡Se ha editado correctamente! Revise su publicación',
      duration: 3000,
      position: position,
    });
    await toast.present();
  }

  async editar(){
    // Método para editar la publicación
    // Validar campos
    if (!this.publicacionEdit.titulo) {
      this.presentAlert('Por favor ingrese un título a la publicación');
      return;
    }

    if (!this.publicacionEdit.foto) {
      this.presentAlert('Por favor ingrese una imagen a la publicación.');
      return;
    }

    if (!this.publicacionEdit.descripcion) {
      this.presentAlert('Por favor ingrese una descripción a la publicación');
      return;
    }

    if (!this.publicacionEdit.id_categoria) { // Validamos que id_categoria no sea null
      this.presentAlert('Por favor seleccione una categoría válida.');
      return;
    }

    const publicacionEditada = {
      id_publicacion: this.publicacionEdit.id_publicacion,
      titulo:this.publicacionEdit.titulo,
      foto:this.publicacionEdit.foto,
      descripcion:this.publicacionEdit.descripcion,
      id_categoria:this.publicacionEdit.id_categoria
    }
    // Asignamos la categoría seleccionada a la publicación
    
    try {
      // Llamamos al servicio para agregar la publicación
      await this.bd.actualizarPublicacion(publicacionEditada);
      this.presentToast('bottom');
      this.router.navigate(['/publicacion-usuario']); // Redirigimos al foro después de publicar
    } catch (error) {
      this.presentAlert('Error al editar la publicación, intente nuevamente.'); // Manejamos el error
    }
  

  }


}
