import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-iniciar',
  templateUrl: './iniciar.page.html',
  styleUrls: ['./iniciar.page.scss'],
})
export class IniciarPage implements OnInit {

  adminEmail:string="admin@gmail.com";
  adminContra:string="admin";

  nombre: string="";
  email:string="";
  telefono:string="";
  contra:string="";

  emailInicio:string="";
  contraInicio:string="";

  constructor(private router:Router, private alertController: AlertController,private activedroute: ActivatedRoute,
    private toastController: ToastController) { 
    //realizar la captura de informacion que viene por mi "CONTEXT"
    this,activedroute.queryParams.subscribe(param =>{
      //VALIDAMOS SI VIENE O NO LA INFORMACION
      if(this.router.getCurrentNavigation()?.extras.state){
        //capturamos la informacion
        this.nombre = this.router.getCurrentNavigation()?.extras?.state?.['usuario'];
        this.email = this.router.getCurrentNavigation()?.extras?.state?.['mail'];
        this.telefono = this.router.getCurrentNavigation()?.extras?.state?.['tel'];
        this.contra = this.router.getCurrentNavigation()?.extras?.state?.['cont'];
        
      }
    });



  }

  ngOnInit() {
  }

  validarEmail(email: string): boolean {
    const validarEm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validarEm.test(String(email).toLowerCase());
  }
  //ALERTA RECUADRO
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error al iniciar sesion',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
  //ALERTA TOAST
  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: `Ha iniciado como administrador correctamente, ¡Hola!`,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  iniciar(){
    if (!this.emailInicio) {
      this.presentAlert('Por favor ingrese su correo electrónico.');
      return;
    }

    if (!this.contraInicio) {
      this.presentAlert('Por favor ingrese su contraseña.');
      return;
    }

    if (!this.validarEmail(this.emailInicio)) {
      this.presentAlert('Por favor ingrese un correo electrónico válido.');
      return;
    }

    if (this.adminEmail == this.emailInicio || this.adminContra == this.contraInicio){
      this.router.navigate(['/home-admin']);
      this.presentToast('bottom');
      return;
    }

    if (this.email !== this.emailInicio || this.contra !== this.contraInicio) {
      this.presentAlert('Correo electrónico o contraseña incorrectos.');
      return;
    }


    ///variables de contexto
    let context: NavigationExtras = {
      state:{
        usuarioMen:this.nombre,
        mailMen:this.email,
        telMen:this.telefono,
        contMen:this.contra,
        mailinicioMen:this.emailInicio,
        contrainicioMen:this.contraInicio
      }

    }

    this.presentToast('bottom');
    this.router.navigate(['/home'],context);
  }
  
  
}
