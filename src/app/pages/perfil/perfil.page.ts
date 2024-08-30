import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  ///variables para el perfil
  nombrePerfil: string="";
  emailPerfil:string="";
  telefonoPerfil:string="";
  contraPerfil:string="";



  constructor(private router:Router, private activedroute: ActivatedRoute) { 
    this,activedroute.queryParams.subscribe(param =>{
      //VALIDAMOS SI VIENE O NO LA INFORMACION
      if(this.router.getCurrentNavigation()?.extras.state){
        //capturamos la informacion
        this.nombrePerfil = this.router.getCurrentNavigation()?.extras?.state?.['usuarioMen'];
        this.emailPerfil = this.router.getCurrentNavigation()?.extras?.state?.['mailMen'];
        this.telefonoPerfil = this.router.getCurrentNavigation()?.extras?.state?.['telMen'];
        this.contraPerfil = this.router.getCurrentNavigation()?.extras?.state?.['contMen'];
  
      }
    });
  }

  ngOnInit() {
  }

}
