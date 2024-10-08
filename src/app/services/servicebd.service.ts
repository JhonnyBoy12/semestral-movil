import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicebdService {

  //CONEXION BASE DE DATOS
  public database!: SQLiteObject;

  //===BASE DE DATOS TABLAS===
  rol:string = "CREATE TABLE IF NOT EXISTS rol(id_rol INTEGER PRIMARY KEY AUTOINCREMENT, nombre_rol TEXT NOT NULL);";

  administrador: string = "CREATE TABLE IF NOT EXISTS administrador(id_administrador INTEGER PRIMARY KEY AUTOINCREMENT, id_rol INTEGER NOT NULL, nombre TEXT NOT NULL, correo_electronico TEXT NOT NULL, contrasena TEXT NOT NULL, telefono TEXT NOT NULL, FOREIGN KEY (id_rol) REFERENCES rol (id_rol));";

  usuario: string = "CREATE TABLE IF NOT EXISTS usuarios(id_usuario INTEGER PRIMARY KEY AUTOINCREMENT, nombre_usuario TEXT NOT NULL, correo_usuario TEXT NOT NULL, contrasena_usuario TEXT NOT NULL, id_rol INTEGER NOT NULL, telefono TEXT NOT NULL, foto TEXT, FOREIGN KEY (id_rol) REFERENCES rol (id_rol));";

  categoria: string = "CREATE TABLE IF NOT EXISTS categorias(id_categoria INTEGER PRIMARY KEY AUTOINCREMENT, nombre_categoria TEXT NOT NULL);";

  comuna: string = "CREATE TABLE IF NOT EXISTS comunas(id_comuna INTEGER PRIMARY KEY AUTOINCREMENT, nombre_comuna TEXT NOT NULL);";

  establecimiento: string = "CREATE TABLE IF NOT EXISTS establecimientos(id_establecimiento INTEGER PRIMARY KEY AUTOINCREMENT, tipo_establecimiento TEXT NOT NULL);";

  especie: string = "CREATE TABLE IF NOT EXISTS especies(id_especie INTEGER PRIMARY KEY AUTOINCREMENT, nombre_especie TEXT NOT NULL);";

  servicio: string = "CREATE TABLE IF NOT EXISTS servicios(id_servicio INTEGER PRIMARY KEY AUTOINCREMENT, nombre_servicio TEXT NOT NULL);";

  ubicacion: string = "CREATE TABLE IF NOT EXISTS ubicaciones(id_ubicacion INTEGER PRIMARY KEY AUTOINCREMENT, nombre_ubicacion TEXT NOT NULL, direccion TEXT NOT NULL, sububicacion TEXT NOT NULL, descripcion_ubicacion TEXT NOT NULL, horario TEXT NOT NULL, imagen_ubicacion TEXT NOT NULL, telefono_lugar TEXT NOT NULL, id_administrador INTEGER NOT NULL, id_comuna INTEGER NOT NULL, latitud REAL NOT NULL, longitud REAL NOT NULL, tipo_marcador TEXT NOT NULL, visibilidad BOOLEAN NOT NULL, id_establecimiento INTEGER, id_especie INTEGER, id_servicio INTEGER, FOREIGN KEY (id_administrador) REFERENCES administrador (id_administrador), FOREIGN KEY (id_comuna) REFERENCES comunas (id_comuna), FOREIGN KEY (id_establecimiento) REFERENCES establecimientos (id_establecimiento), FOREIGN KEY (id_especie) REFERENCES especies (id_especie), FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio));";

  publicacion: string = "CREATE TABLE IF NOT EXISTS publicaciones(id_publicacion INTEGER PRIMARY KEY AUTOINCREMENT, id_usuario INTEGER NOT NULL, titulo TEXT NOT NULL, foto TEXT NOT NULL, descripcion TEXT NOT NULL, fecha_publicacion DATE NOT NULL, fecha_baneo DATE, descripcion_baneo TEXT, publicacion_adopcion BOOLEAN, id_categoria INTEGER NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario), FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria));";

  publicacionGuardada: string = "CREATE TABLE IF NOT EXISTS publicaciones_guardadas(id_guardado INTEGER PRIMARY KEY AUTOINCREMENT, id_usuario INTEGER NOT NULL, id_publicacion INTEGER NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario), FOREIGN KEY (id_publicacion) REFERENCES publicaciones (id_publicacion));";
  ////////////////////////////

  //VARIABLE DE MANIPULACION DE BASE DE DATOS
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);


  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) {
    this.crearBD();
   }

   async presentAlert(titulo:string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }

   crearBD(){
    //VERIFICACION DE PLATAFORMA
    this.platform.ready().then(()=>{
      //PROCEDIMIENTO CREACION BD
      this.sqlite.create({
        name: 'petCareMap.db',
        location:'default'
      }).then((db: SQLiteObject)=>{
        //CAPTURA Y CONEXION BASE DE DATOS
        this.database = db;
        //CREACION ORDEN TABLAS
        this.crearTablas();

        //FUNCIONES POR DEFECTO AL CREAR CONECTAR


        //MODIFICACION OBSERVABLE DEL STATUS DE BASE DE DATOS
        this.isDBReady.next(true);
      }).catch(e=>{
        this.presentAlert("Creación de BD", "Error creando la BD: " + JSON.stringify(e));
      })
    })
   }

   async crearTablas(){
    try{
      //ORDEN DE EJECUCION POR TABLA
      await this.database.executeSql(this.rol,[]);
      await this.database.executeSql(this.administrador, []);
      await this.database.executeSql(this.usuario, []);
      await this.database.executeSql(this.categoria, []);
      await this.database.executeSql(this.comuna, []);
      await this.database.executeSql(this.establecimiento, []);
      await this.database.executeSql(this.especie, []);
      await this.database.executeSql(this.servicio, []);
      await this.database.executeSql(this.ubicacion, []);
      await this.database.executeSql(this.publicacion, []);
      await this.database.executeSql(this.publicacionGuardada, []);

      //GENERACION DE INSERTS EN TABLAS REQUERIDAS
      

    }catch(e){
      this.presentAlert("Creación de Tabla", "Error creando las Tablas: " + JSON.stringify(e));
    }
  }




}
