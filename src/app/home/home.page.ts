import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  /// crear variables menu

  nombreMenu: string="";
  emailMenu:string="";
  telefonoMenu:string="";
  contraMenu:string="";

  emailinicioMenu:string="";
  contrainicioMenu:string="";

  constructor(private router:Router,private activedroute: ActivatedRoute) {
      this.activedroute.queryParams.subscribe(param =>{
        //VALIDAMOS SI VIENE O NO LA INFORMACION
        if(this.router.getCurrentNavigation()?.extras.state){
          //capturamos la informacion
          this.nombreMenu = this.router.getCurrentNavigation()?.extras?.state?.['usuarioMen'];
          this.emailMenu = this.router.getCurrentNavigation()?.extras?.state?.['mailMen'];
          this.telefonoMenu = this.router.getCurrentNavigation()?.extras?.state?.['telMen'];
          this.contraMenu = this.router.getCurrentNavigation()?.extras?.state?.['contMen'];
          this.emailinicioMenu = this.router.getCurrentNavigation()?.extras?.state?.['mailinicioMen'];
          this.contrainicioMenu = this.router.getCurrentNavigation()?.extras?.state?.['contrainicioMen'];
          
        }
      });
     }

  irPublicar(){
    this.router.navigate(['/publicar']);
  }

}


