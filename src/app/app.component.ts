import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  constructor(private router:Router, private alertContorller:AlertController,
    private toastController: ToastController) {}

  cerrarsesion(){

    this.router.navigate(['/iniciar']);
  }
}
