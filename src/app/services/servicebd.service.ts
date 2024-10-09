import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Publicacion } from '../models/publicacion';
import { Ubicacion } from '../models/ubicacion';

@Injectable({
  providedIn: 'root'
})
export class ServicebdService {

  //CONEXION BASE DE DATOS
  public database!: SQLiteObject;

  //===BASE DE DATOS TABLAS===
  rol:string = "CREATE TABLE IF NOT EXISTS rol(id_rol INTEGER PRIMARY KEY AUTOINCREMENT, nombre_rol TEXT NOT NULL);";

  administrador: string = "CREATE TABLE IF NOT EXISTS administrador(id_administrador INTEGER PRIMARY KEY AUTOINCREMENT, id_rol INTEGER NOT NULL, nombre TEXT NOT NULL, correo_electronico TEXT NOT NULL, contrasena TEXT NOT NULL, telefono TEXT NOT NULL, FOREIGN KEY (id_rol) REFERENCES rol (id_rol));";

  usuario: string = "CREATE TABLE IF NOT EXISTS usuarios(id_usuario INTEGER PRIMARY KEY AUTOINCREMENT, nombre_usuario TEXT NOT NULL, correo_usuario TEXT NOT NULL, contrasena_usuario TEXT NOT NULL, id_rol INTEGER NOT NULL, telefono NUMBER NOT NULL, foto TEXT, FOREIGN KEY (id_rol) REFERENCES rol (id_rol));";

  categoria: string = "CREATE TABLE IF NOT EXISTS categorias(id_categoria INTEGER PRIMARY KEY AUTOINCREMENT, nombre_categoria TEXT NOT NULL);";

  comuna: string = "CREATE TABLE IF NOT EXISTS comunas(id_comuna INTEGER PRIMARY KEY AUTOINCREMENT, nombre_comuna TEXT NOT NULL);";

  establecimiento: string = "CREATE TABLE IF NOT EXISTS establecimientos(id_establecimiento INTEGER PRIMARY KEY AUTOINCREMENT, tipo_establecimiento TEXT NOT NULL);";

  especie: string = "CREATE TABLE IF NOT EXISTS especies(id_especie INTEGER PRIMARY KEY AUTOINCREMENT, nombre_especie TEXT NOT NULL);";

  servicio: string = "CREATE TABLE IF NOT EXISTS servicios(id_servicio INTEGER PRIMARY KEY AUTOINCREMENT, nombre_servicio TEXT NOT NULL);";

  ubicacion: string = "CREATE TABLE IF NOT EXISTS ubicaciones(id_ubicacion INTEGER PRIMARY KEY AUTOINCREMENT, nombre_ubicacion TEXT NOT NULL, direccion TEXT NOT NULL, sububicacion TEXT NOT NULL, descripcion_ubicacion TEXT NOT NULL, horario TEXT NOT NULL, imagen_ubicacion TEXT NOT NULL, telefono_lugar TEXT NOT NULL, id_administrador INTEGER NOT NULL, id_comuna INTEGER NOT NULL, latitud REAL NOT NULL, longitud REAL NOT NULL, tipo_marcador TEXT NOT NULL, visibilidad BOOLEAN NOT NULL, id_establecimiento INTEGER, id_especie INTEGER, id_servicio INTEGER, FOREIGN KEY (id_administrador) REFERENCES administrador (id_administrador), FOREIGN KEY (id_comuna) REFERENCES comunas (id_comuna), FOREIGN KEY (id_establecimiento) REFERENCES establecimientos (id_establecimiento), FOREIGN KEY (id_especie) REFERENCES especies (id_especie), FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio));";

  publicacion: string = "CREATE TABLE IF NOT EXISTS publicaciones(id_publicacion INTEGER PRIMARY KEY AUTOINCREMENT, id_usuario INTEGER NOT NULL, titulo TEXT NOT NULL, foto TEXT NOT NULL, descripcion TEXT NOT NULL, fecha_publicacion DATE NOT NULL, fecha_baneo DATE, descripcion_baneo TEXT, publicacion_adopcion BOOLEAN, id_categoria INTEGER NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario), FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria));";

  publicacionGuardada: string = "CREATE TABLE IF NOT EXISTS publicaciones_guardadas(id_guardado INTEGER PRIMARY KEY AUTOINCREMENT, id_usuario INTEGER NOT NULL, id_publicacion INTEGER NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario), FOREIGN KEY (id_publicacion) REFERENCES publicaciones (id_publicacion));";


  ////INSERTS TABLA ROL
  rolAdmin: string = "INSERT or IGNORE INTO usuarios(id_rol, nombre_rol ) VALUES (1, 'Administrador')";
  rolUsuario: string = "INSERT or IGNORE INTO usuarios(id_rol, nombre_rol ) VALUES (2, 'Usuario')";

  ////INSERTS TABLA COMUNAS
  comunaSantiago: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Santiago')";
  comunaProvidencia: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Providencia')";
  comunaLasCondes: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Las Condes')";
  comunaVitacura: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Vitacura')";
  comunaNunoa: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Ñuñoa')";
  comunaMacul: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Macul')";
  comunaLaFlorida: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('La Florida')";
  comunaPudahuel: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Pudahuel')";
  comunaMaipu: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Maipú')";
  comunaQuilicura: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Quilicura')";
  comunaEstacionCentral: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Estación Central')";
  comunaIndependencia: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Independencia')";

  ////INSERTS TABLA ESTABLECIMIENTOS
  establecimientoVeterinaria: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Veterinaria')";
  establecimientoRescate: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Centro de rescate')";
  establecimientoEstilista: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Estilista')";
  establecimientoTiendaComida: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Tienda de comida')";
  establecimientoGuarderia: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Guardería/Hotel para mascotas')";
  establecimientoAdiestramiento: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Adiestramiento')";
  establecimientoFarmacia: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Farmacia para animales')";
  establecimientoServiciosAdopcion: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Servicios de adopción')";

  ////INSERTS TABLA CATEGORIAS
  categoriaPerros: string = "INSERT OR IGNORE INTO categorias(nombre_categoria) VALUES ('Perros')";
  categoriaGatos: string = "INSERT OR IGNORE INTO categorias(nombre_categoria) VALUES ('Gatos')";
  categoriaPerrosYGatos: string = "INSERT OR IGNORE INTO categorias(nombre_categoria) VALUES ('Perros y Gatos')";
  categoriaRoedores: string = "INSERT OR IGNORE INTO categorias(nombre_categoria) VALUES ('Roedores')";
  categoriaOtros: string = "INSERT OR IGNORE INTO categorias(nombre_categoria) VALUES ('Otros')";

  ////INSERTS TABLA ESPECIES
  especiePerros: string = "INSERT OR IGNORE INTO especies(nombre_especie) VALUES ('Perros')";
  especieGatos: string = "INSERT OR IGNORE INTO especies(nombre_especie) VALUES ('Gatos')";
  especiePerrosGatos: string = "INSERT OR IGNORE INTO especies(nombre_especie) VALUES ('Perros y Gatos')";
  especieAves: string = "INSERT OR IGNORE INTO especies(nombre_especie) VALUES ('Aves')";
  especiePeces: string = "INSERT OR IGNORE INTO especies(nombre_especie) VALUES ('Peces')";
  especieReptiles: string = "INSERT OR IGNORE INTO especies(nombre_especie) VALUES ('Reptiles')";
  //// INSERTS TABLA SERVICIOS

  servicioConsultaMedica: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Consulta médica')";
  servicioCirugia: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Cirugía')";
  servicioVacunacion: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Vacunación')";
  servicioBanoPeluqueria: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Baño y peluquería')";
  servicioAdopcion: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Adopción')";
  servicioVentaProductos: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Venta de productos')";
  servicioCuidadoDental: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Cuidado dental')";
  servicioGuarderia: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Guardería o cuidado temporal')";
  servicioDomicilio: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Servicio a domicilio')";

  ////////////////////////////

  ////===OBSERVABLES Y GUARDADOS TABLA "USUARIOS"///////////////
  
  //variable de guardado SELECT
  listadoUsuarios = new BehaviorSubject([]);

  //Observable
  fetchUsuarios(): Observable<Usuario[]>{
    return this.listadoUsuarios.asObservable();
  }
  ////////////////////////////////////////////////////////////


  ////===OBSERVABLES Y GUARDADOS TABLA "PUBLICACIONES"///////////////
  
  //variable de guardado SELECT
  listadoPublicaciones = new BehaviorSubject([]);

  //Observable
  fetchPublicaciones(): Observable<Publicacion[]>{
    return this.listadoPublicaciones.asObservable();
  }
  ////////////////////////////////////////////////////////////
  

  ////===OBSERVABLES Y GUARDADOS TABLA "UBICACIONES"///////////////
  
  //variable de guardado SELECT
  listadoUbicaciones = new BehaviorSubject([]);

  //Observable
  fetchUbicaciones(): Observable<Ubicacion[]>{
    return this.listadoUbicaciones.asObservable();
  }
  ////////////////////////////////////////////////////////////
  
  dbState(){
    return this.isDBReady.asObservable();
  }

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


  ////funcion creacion de la bd
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
        this.consultarUsuarios();

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

      ///---GENERACION DE INSERTS EN TABLAS REQUERIDAS---///

      // Insert para la tabla de roles
      await this.database.executeSql(this.rolAdmin, []);
      await this.database.executeSql(this.rolUsuario, []);

      // Insert para la tabla de categori­as de publicaciones
      await this.database.executeSql(this.categoriaPerros, []);
      await this.database.executeSql(this.categoriaGatos, []);
      await this.database.executeSql(this.categoriaPerrosYGatos, []);
      await this.database.executeSql(this.categoriaRoedores, []);
      await this.database.executeSql(this.categoriaOtros, []);

      // Insert para la tabla de comunas
      await this.database.executeSql(this.comunaSantiago, []);
      await this.database.executeSql(this.comunaProvidencia, []);
      await this.database.executeSql(this.comunaLasCondes, []);
      await this.database.executeSql(this.comunaVitacura, []);
      await this.database.executeSql(this.comunaNunoa, []);
      await this.database.executeSql(this.comunaMacul, []);
      await this.database.executeSql(this.comunaLaFlorida, []);
      await this.database.executeSql(this.comunaPudahuel, []);
      await this.database.executeSql(this.comunaMaipu, []);
      await this.database.executeSql(this.comunaQuilicura, []);
      await this.database.executeSql(this.comunaEstacionCentral, []);
      await this.database.executeSql(this.comunaIndependencia, []);

      // Insert para la tabla de establecimientos
      await this.database.executeSql(this.establecimientoVeterinaria, []);
      await this.database.executeSql(this.establecimientoRescate, []);
      await this.database.executeSql(this.establecimientoEstilista, []);
      await this.database.executeSql(this.establecimientoTiendaComida, []);
      await this.database.executeSql(this.establecimientoGuarderia, []);
      await this.database.executeSql(this.establecimientoAdiestramiento, []);
      await this.database.executeSql(this.establecimientoFarmacia, []);
      await this.database.executeSql(this.establecimientoServiciosAdopcion, []);

      // Insert para la tabla de especies
      await this.database.executeSql(this.especiePerros, []);
      await this.database.executeSql(this.especieGatos, []);
      await this.database.executeSql(this.especiePerrosGatos, []);
      await this.database.executeSql(this.especieAves, []);
      await this.database.executeSql(this.especiePeces, []);
      await this.database.executeSql(this.especieReptiles, []);

      // Insert para la tabla de servicios
      await this.database.executeSql(this.servicioConsultaMedica, []);
      await this.database.executeSql(this.servicioCirugia, []);
      await this.database.executeSql(this.servicioVacunacion, []);
      await this.database.executeSql(this.servicioBanoPeluqueria, []);
      await this.database.executeSql(this.servicioAdopcion, []);
      await this.database.executeSql(this.servicioVentaProductos, []);
      await this.database.executeSql(this.servicioCuidadoDental, []);
      await this.database.executeSql(this.servicioGuarderia, []);
      await this.database.executeSql(this.servicioDomicilio, []);
        
    }catch(e){
      this.presentAlert("Creación de Tabla", "Error creando las Tablas: " + JSON.stringify(e));
    }
  }

  /////CONSULTA COMPLETA USUARIO + INSERCCION ListadoUsuarios
    consultarUsuarios(){
      return this.database.executeSql('SELECT * FROM usuarios',[]).then(res=>{
        //variable para almacenar el resultado de la consulta
        let items: Usuario[] = [];
        //verificar si tenemos registros en la consulta
        if(res.rows.length > 0){
          //recorro el resultado
          for(var i = 0; i < res.rows.length; i++){
            //agregar el registro a mi variable
            items.push({
              id_usuario: res.rows.item(i).id_usuario,
              nombre_usuario: res.rows.item(i).nombre_usuario,
              correo_usuario: res.rows.item(i).correo_usuario,
              contrasena_usuario: res.rows.item(i).contrasena_usuario,
              id_rol: res.rows.item(i).id_rol,
              telefono: res.rows.item(i).telefono
            })
          }
        }
        this.listadoUsuarios.next(items as any);
      })
    }
  /////////////////////////////

  /////CONSULTA COMPLETA USUARIO + INSERCCION ListadoPublicaciones
  consultarPublicaciones(){
    return this.database.executeSql('SELECT * FROM publicaciones',[]).then(res=>{
      //variable para almacenar el resultado de la consulta
      let items: Publicacion[] = [];
      //verificar si tenemos registros en la consulta
      if(res.rows.length > 0){
        //recorro el resultado
        for(var i = 0; i < res.rows.length; i++){
          //agregar el registro a mi variable
          items.push({
            id_publicacion: res.rows.item(i).id_publicacion,
            id_usuario: res.rows.item(i).id_usuario,
            titulo: res.rows.item(i).titulo,
            foto: res.rows.item(i).foto,
            descripcion: res.rows.item(i).descripcion,
            fecha_publicacion: res.rows.item(i).fecha_publicacion,
            fecha_baneo: res.rows.item(i).fecha_baneo,
            publicacion_adopcion: false,
            id_categoria: res.rows.item(i).id_categoria
          })
        }
      }
      this.listadoPublicaciones.next(items as any);
    })
  }
  /////////////////////////////

  /////CONSULTA COMPLETA USUARIO + INSERCCION ListadoPublicaciones
  consultarUbicaciones(){
    return this.database.executeSql('SELECT * FROM publicaciones',[]).then(res=>{
      //variable para almacenar el resultado de la consulta
      let items: Ubicacion[] = [];
      //verificar si tenemos registros en la consulta
      if(res.rows.length > 0){
        //recorro el resultado
        for(var i = 0; i < res.rows.length; i++){
          //agregar el registro a mi variable
          items.push({
            id_ubicacion: res.rows.item(i).id_publicacion,
            nombre_ubicacion: res.rows.item(i).nombre_ubicacion,
            direccion: res.rows.item(i).direccion,
            sububicacion: res.rows.item(i).sububicacion,
            descripcion_ubicacion: res.rows.item(i).descripcion_ubicacion,
            horario: res.rows.item(i).horario,
            imagen_ubicacion: res.rows.item(i).imagen_ubicacion,
            telefono_lugar: res.rows.item(i).telefono_lugar,
            id_administrador: res.rows.item(i).id_administrador,
            id_comuna: res.rows.item(i).id_comuna,
            latitud: res.rows.item(i).latitud,
            longitud: res.rows.item(i).longitud,
            tipo_marcador: res.rows.item(i).marcador,
            visibilidad: true
          })
        }
      }
      this.listadoUbicaciones.next(items as any);
    })
  }
  /////////////////////////////

  //INGRESO DE USUARIO (REGISTRAR USUARIO)
    ingresarUsuario(nombreUsuario:String, email: String, contra:String, id_rol:number, telefono: String){
      return this.database.executeSql('INSERT INTO usuarios(nombre_usuario,correo_usuario,contrasena_usuario,id_rol,telefono) VALUES (?,?,?,?,?)',[nombreUsuario,email,contra,id_rol,telefono]).then(res=>{
        this.presentAlert("Ingresar", "Usuario Registrado");
        this.consultarUsuarios();
      }).catch(e=>{
        this.presentAlert("Insertar", "Error: " + JSON.stringify(e));
      })
    }

  //FUNCIONES MOFIFICACION USUARIO BD
  modificarContraUsuario(id_usuario:number, contrasena_usuario:string){
      return this.database.executeSql('UPDATE usuarios SET contrasena_usuario = ? WHERE id_usuario = ?',[id_usuario,contrasena_usuario]).then(res=>{
        this.presentAlert("Modificar", "Contraseña Modificada");
        this.consultarUsuarios();
      }).catch(e=>{
        this.presentAlert("Modificar", "Error: " + JSON.stringify(e));
      }) 
  }
  modificarNombreUsuario(id_usuario:number, nombre_usuario:string){
    return this.database.executeSql('UPDATE usuarios SET nombre_usuario = ? WHERE id_usuario = ?',[id_usuario,nombre_usuario]).then(res=>{
      this.presentAlert("Modificar", "Nombre de Usuario Modificado");
      this.consultarUsuarios();
    }).catch(e=>{
      this.presentAlert("Modificar", "Error: " + JSON.stringify(e));
    }) 
  }

  //METODO INICIAR SESION
  validarUsuario(email:string, contrasena:string):Promise<Usuario | null>{
    return this.database.executeSql('SELECT FROM usuarios where correo_usuario = ? AND contrasena_usuario = ?', [email,contrasena]).then(res =>{
      if(res.rows.lenght > 0){
        return{
          id_usuario: res.rows.item(0).id_usuario,
          nombre_usuario: res.rows.item(0).nombre_usuario,
          correo_usuario: res.rows.item(0).correo_usuario,
          contrasena_usuario: res.rows.item(0).contrasena_usuario,
          id_rol: res.rows.item(0).id_rol,
          telefono: res.rows.item(0).telefono,
        }as Usuario;
      }
      return null;
    }).catch(e =>{
      this.presentAlert("Error al validar datos de usuario", "ERROR" + JSON.stringify(e))
      return null;
    })
 
  }


  // Añade esta función en tu servicio
  agregarPublicacion(publicacion: {id_usuario: number; titulo: string;foto: string; descripcion: string;fecha_publicacion: Date;
    publicacion_adopcion: boolean;id_categoria: number;
  }): Promise<void> {
    
    const { id_usuario, titulo, foto, descripcion, fecha_publicacion, publicacion_adopcion, id_categoria } = publicacion;

    return this.database.executeSql(
      'INSERT INTO publicaciones (id_usuario, titulo, foto, descripcion, fecha_publicacion, publicacion_adopcion, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [id_usuario, titulo, foto, descripcion, fecha_publicacion, publicacion_adopcion, id_categoria]
    ).then(() => {
      this.presentAlert('Realizado','Publicacion hecha correctamente');
    }).catch(e => {
      this.presentAlert('Error al añadir la publicación', "Error"+JSON.stringify(e));
    });
  }

}

  
