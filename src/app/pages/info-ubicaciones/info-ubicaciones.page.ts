import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ComponentemenuComponent } from 'src/app/components/componentemenu/componentemenu.component';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-info-ubicaciones',
  templateUrl: './info-ubicaciones.page.html',
  styleUrls: ['./info-ubicaciones.page.scss'],
})
export class InfoUbicacionesPage implements OnInit {

  detalleUbi: any;


  constructor(private router: Router, public popoverController: PopoverController, private bd:ServicebdService, private activedRoute: ActivatedRoute) { 
    this.activedRoute.queryParams.subscribe(res=>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.detalleUbi = this.router.getCurrentNavigation()?.extras?.state?.['detalleUbicacion'];
      }
    })
  }

  ngOnInit() {

    
  }


  



  

  async contactar(ev: any) {
    const popover = await this.popoverController.create({
      component: ComponentemenuComponent,
      event: ev,
      translucent: true,
      backdropDismiss: true // Permite cerrar tocando fuera del Popover
    });
    await popover.present();
  }

}
