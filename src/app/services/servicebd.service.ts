import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Publicacion } from '../models/publicacion';
import { Ubicacion } from '../models/ubicacion';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Comuna } from '../models/comuna';

@Injectable({
  providedIn: 'root'
})
export class ServicebdService {

  public usuarioSesionSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public usuarioSesion$ = this.usuarioSesionSubject.asObservable();

  //CONEXION BASE DE DATOS
  public database!: SQLiteObject;

  //===BASE DE DATOS TABLAS===
  rol:string = "CREATE TABLE IF NOT EXISTS rol(id_rol INTEGER PRIMARY KEY, nombre_rol TEXT NOT NULL);";

  administrador: string = "CREATE TABLE IF NOT EXISTS administrador(id_administrador INTEGER PRIMARY KEY AUTOINCREMENT, id_rol INTEGER NOT NULL, nombre TEXT NOT NULL, correo_electronico TEXT NOT NULL, contrasena TEXT NOT NULL, telefono TEXT NOT NULL, FOREIGN KEY (id_rol) REFERENCES rol (id_rol));";

  usuario: string = "CREATE TABLE IF NOT EXISTS usuarios(id_usuario INTEGER PRIMARY KEY AUTOINCREMENT, nombre_usuario TEXT NOT NULL, correo_usuario TEXT NOT NULL, contrasena_usuario TEXT NOT NULL, id_rol INTEGER NOT NULL, telefono NUMBER NOT NULL, foto TEXT, FOREIGN KEY (id_rol) REFERENCES rol (id_rol));";

  categoria: string = "CREATE TABLE IF NOT EXISTS categorias(id_categoria INTEGER PRIMARY KEY, nombre_categoria TEXT NOT NULL);";

  comuna: string = "CREATE TABLE IF NOT EXISTS comunas(id_comuna INTEGER PRIMARY KEY, nombre_comuna TEXT NOT NULL);";

  establecimiento: string = "CREATE TABLE IF NOT EXISTS establecimientos(id_establecimiento INTEGER PRIMARY KEY, tipo_establecimiento TEXT NOT NULL);";

  especie: string = "CREATE TABLE IF NOT EXISTS especies(id_especie INTEGER PRIMARY KEY, nombre_especie TEXT NOT NULL);";

  servicio: string = "CREATE TABLE IF NOT EXISTS servicios(id_servicio INTEGER PRIMARY KEY, nombre_servicio TEXT NOT NULL);";

  ubicacion: string = "CREATE TABLE IF NOT EXISTS ubicaciones(id_ubicacion INTEGER PRIMARY KEY AUTOINCREMENT, nombre_ubicacion TEXT NOT NULL, direccion TEXT NOT NULL, sububicacion TEXT NOT NULL, descripcion_ubicacion TEXT NOT NULL, horario TEXT NOT NULL, imagen_ubicacion TEXT NOT NULL, telefono_lugar TEXT NOT NULL, id_administrador INTEGER NOT NULL, id_comuna INTEGER NOT NULL, latitud TEXT NOT NULL, longitud TEXT NOT NULL, tipo_marcador TEXT NOT NULL, visibilidad BOOLEAN NOT NULL, id_establecimiento INTEGER, id_especie INTEGER, id_servicio INTEGER, FOREIGN KEY (id_administrador) REFERENCES administrador (id_administrador), FOREIGN KEY (id_comuna) REFERENCES comunas (id_comuna), FOREIGN KEY (id_establecimiento) REFERENCES establecimientos (id_establecimiento), FOREIGN KEY (id_especie) REFERENCES especies (id_especie), FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio));";

  publicacion: string = "CREATE TABLE IF NOT EXISTS publicaciones(id_publicacion INTEGER PRIMARY KEY AUTOINCREMENT, id_usuario INTEGER NOT NULL, titulo TEXT NOT NULL, foto TEXT NOT NULL, descripcion TEXT NOT NULL, fecha_publicacion DATE NOT NULL, fecha_baneo DATE, descripcion_baneo TEXT, publicacion_adopcion BOOLEAN, id_categoria INTEGER NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario), FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria));";

  publicacionGuardada: string = "CREATE TABLE IF NOT EXISTS publicaciones_guardadas(id_guardado INTEGER PRIMARY KEY AUTOINCREMENT, id_usuario INTEGER NOT NULL, id_publicacion INTEGER NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario), FOREIGN KEY (id_publicacion) REFERENCES publicaciones (id_publicacion));";


  ////INSERTS TABLA ROL
  rolAdmin: string = "INSERT or IGNORE INTO rol(id_rol, nombre_rol ) VALUES (1, 'Administrador')";
  rolUsuario: string = "INSERT or IGNORE INTO rol(id_rol, nombre_rol ) VALUES (2, 'Usuario')";

  ////INSERTS TABLA COMUNAS
  comunaSantiago: string = "INSERT OR IGNORE INTO comunas(id_comuna, nombre_comuna) VALUES (1, 'Santiago')";
  comunaProvidencia: string = "INSERT OR IGNORE INTO comunas(id_comuna, nombre_comuna) VALUES (2, 'Providencia')";
  comunaLasCondes: string = "INSERT OR IGNORE INTO comunas(id_comuna, nombre_comuna) VALUES (3, 'Las Condes')";
  comunaVitacura: string = "INSERT OR IGNORE INTO comunas(id_comuna, nombre_comuna) VALUES (4, 'Vitacura')";
  comunaNunoa: string = "INSERT OR IGNORE INTO comunas(id_comuna, nombre_comuna) VALUES (5, 'Ñuñoa')";
  comunaMacul: string = "INSERT OR IGNORE INTO comunas(id_comuna, nombre_comuna) VALUES (6, 'Macul')";
  comunaLaFlorida: string = "INSERT OR IGNORE INTO comunas(id_comuna, nombre_comuna) VALUES (7, 'La Florida')";
  comunaPudahuel: string = "INSERT OR IGNORE INTO comunas(id_comuna, nombre_comuna) VALUES (8, 'Pudahuel')";
  comunaMaipu: string = "INSERT OR IGNORE INTO comunas(id_comuna, nombre_comuna) VALUES (9, 'Maipú')";
  comunaQuilicura: string = "INSERT OR IGNORE INTO comunas(id_comuna, nombre_comuna) VALUES (10, 'Quilicura')";
  comunaEstacionCentral: string = "INSERT OR IGNORE INTO comunas(id_comuna, nombre_comuna) VALUES (11, 'Estación Central')";
  comunaIndependencia: string = "INSERT OR IGNORE INTO comunas(id_comuna, nombre_comuna) VALUES (12, 'Independencia')";


  ////INSERTS TABLA ESTABLECIMIENTOS
  establecimientoVeterinaria: string = "INSERT OR IGNORE INTO establecimientos(id_establecimiento, tipo_establecimiento) VALUES (1, 'Veterinaria')";
  establecimientoRescate: string = "INSERT OR IGNORE INTO establecimientos(id_establecimiento, tipo_establecimiento) VALUES (2, 'Centro de rescate')";
  establecimientoEstilista: string = "INSERT OR IGNORE INTO establecimientos(id_establecimiento, tipo_establecimiento) VALUES (3, 'Estilista')";
  establecimientoTiendaComida: string = "INSERT OR IGNORE INTO establecimientos(id_establecimiento, tipo_establecimiento) VALUES (4, 'Tienda de comida')";
  establecimientoGuarderia: string = "INSERT OR IGNORE INTO establecimientos(id_establecimiento, tipo_establecimiento) VALUES (5, 'Guardería/Hotel para mascotas')";
  establecimientoAdiestramiento: string = "INSERT OR IGNORE INTO establecimientos(id_establecimiento, tipo_establecimiento) VALUES (6, 'Adiestramiento')";
  establecimientoFarmacia: string = "INSERT OR IGNORE INTO establecimientos(id_establecimiento, tipo_establecimiento) VALUES (7, 'Farmacia para animales')";
  establecimientoServiciosAdopcion: string = "INSERT OR IGNORE INTO establecimientos(id_establecimiento, tipo_establecimiento) VALUES (8, 'Servicios de adopción')";


  //// INSERTS TABLA CATEGORIAS
  categoriaPerros: string = "INSERT OR IGNORE INTO categorias(id_categoria, nombre_categoria) VALUES (1, 'Perros')";
  categoriaGatos: string = "INSERT OR IGNORE INTO categorias(id_categoria, nombre_categoria) VALUES (2, 'Gatos')";
  categoriaPerrosYGatos: string = "INSERT OR IGNORE INTO categorias(id_categoria, nombre_categoria) VALUES (3, 'Perros y Gatos')";
  categoriaRoedores: string = "INSERT OR IGNORE INTO categorias(id_categoria, nombre_categoria) VALUES (4, 'Roedores')";
  categoriaOtros: string = "INSERT OR IGNORE INTO categorias(id_categoria, nombre_categoria) VALUES (5, 'Otros')";


  //// INSERTS TABLA ESPECIES
  especiePerros: string = "INSERT OR IGNORE INTO especies(id_especie, nombre_especie) VALUES (1, 'Perros')";
  especieGatos: string = "INSERT OR IGNORE INTO especies(id_especie, nombre_especie) VALUES (2, 'Gatos')";
  especiePerrosGatos: string = "INSERT OR IGNORE INTO especies(id_especie, nombre_especie) VALUES (3, 'Perros y Gatos')";
  especieAves: string = "INSERT OR IGNORE INTO especies(id_especie, nombre_especie) VALUES (4, 'Aves')";
  especiePeces: string = "INSERT OR IGNORE INTO especies(id_especie, nombre_especie) VALUES (5, 'Peces')";
  especieReptiles: string = "INSERT OR IGNORE INTO especies(id_especie, nombre_especie) VALUES (6, 'Reptiles')";

  //// INSERTS TABLA SERVICIOS
  servicioConsultaMedica: string = "INSERT OR IGNORE INTO servicios(id_servicio, nombre_servicio) VALUES (1, 'Consulta médica')";
  servicioCirugia: string = "INSERT OR IGNORE INTO servicios(id_servicio, nombre_servicio) VALUES (2, 'Cirugía')";
  servicioVacunacion: string = "INSERT OR IGNORE INTO servicios(id_servicio, nombre_servicio) VALUES (3, 'Vacunación')";
  servicioBanoPeluqueria: string = "INSERT OR IGNORE INTO servicios(id_servicio, nombre_servicio) VALUES (4, 'Baño y peluquería')";
  servicioAdopcion: string = "INSERT OR IGNORE INTO servicios(id_servicio, nombre_servicio) VALUES (5, 'Adopción')";
  servicioVentaProductos: string = "INSERT OR IGNORE INTO servicios(id_servicio, nombre_servicio) VALUES (6, 'Venta de productos')";
  servicioCuidadoDental: string = "INSERT OR IGNORE INTO servicios(id_servicio, nombre_servicio) VALUES (7, 'Cuidado dental')";
  servicioGuarderia: string = "INSERT OR IGNORE INTO servicios(id_servicio, nombre_servicio) VALUES (8, 'Guardería o cuidado temporal')";
  servicioDomicilio: string = "INSERT OR IGNORE INTO servicios(id_servicio, nombre_servicio) VALUES (9, 'Servicio a domicilio')";


  //// INSERTS TABLA UBICACIONES
  ubicacionVetPlanet: string = "INSERT OR IGNORE INTO ubicaciones(id_ubicacion,nombre_ubicacion, direccion, sububicacion, descripcion_ubicacion, horario, imagen_ubicacion, telefono_lugar, id_administrador, id_comuna, latitud, longitud, tipo_marcador, visibilidad, id_establecimiento, id_especie, id_servicio) VALUES (1,'VetPlanet', 'Diego Silva Henriquez 1286', 'Conchalí, Región Metropolitana', 'Contamos con un equipo médico comprometido, cercano y de confianza para cuidar la salud de tu mascota', 'Lunes a Viernes 10a.m -7p.m/ Sábado 10a.m -6p.m / Domingo 12p.m -6p.m', 'imagen prueba', '(2) 2625 2797',1, 1, '-33.384036816873135', '-70.66325872901794', 'prueba marcador', 1, 1, 1, 1)";
  
  //SUPER ADMIN
  superAdmin: string = "INSERT OR IGNORE INTO administrador (id_rol, nombre, correo_electronico, contrasena, telefono) VALUES (1, 'SuperAdmin', 'admin@gmail.com', 'Admin.12345', '1234567890')";
  ////////////////////////////

  ////===OBSERVABLES Y GUARDADOS TABLA "USUARIOS"///////////////
  
  //variable de guardado SELECT
  listadoUsuarios = new BehaviorSubject<Usuario[]>([]);
  nativeStorage: any;

  //Observable
  fetchUsuarios(): Observable<Usuario[]>{
    return this.listadoUsuarios.asObservable();
  }


  ////===OBSERVABLES Y GUARDADOS TABLA "USUARIOS del admin"///////////////
  
  //variable de guardado SELECT
  listadoUsuariosAdmin = new BehaviorSubject<Usuario[]>([]);

  //Observable
  fetchUsuariosAdmin(): Observable<Usuario[]>{
    return this.listadoUsuariosAdmin.asObservable();
  }
  ////////////////////////////////////////////////////////////


  ////===OBSERVABLES Y GUARDADOS TABLA "PUBLICACIONES"///////////////
  
  //variable de guardado SELECT * FROM
  listadoPublicaciones = new BehaviorSubject<Publicacion[]>([]);

  //Observable
  fetchPublicaciones(): Observable<Publicacion[]>{
    return this.listadoPublicaciones.asObservable();
  }

  // Variable para guardar las publicaciones del usuario
  listadoPublicacionesUsuario = new BehaviorSubject([]);

  // Observable
  fetchPublicacionesUsuario(): Observable<any[]> {
    return this.listadoPublicacionesUsuario.asObservable();
  }

  //Varuable para guardar las publicaciones del usuario
  listadoPublicacionesGuardadas = new BehaviorSubject<any[]>([]); 

  // Observable
  fetchPublicacionesGuardadas(): Observable<any[]> {
    return this.listadoPublicacionesGuardadas.asObservable();
  }
  ////////////////////////////////////////////////////////////
  

  ////===OBSERVABLES Y GUARDADOS TABLA "UBICACIONES"///////////////
  
  //variable de guardado SELECT
  listadoUbicaciones = new BehaviorSubject<Ubicacion[]>([]);

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


  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController, private storage: NativeStorage) {
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
      
      // Insert para el administrador SuperAdmin
      await this.database.executeSql(this.superAdmin, []);

      // INSERT PARA LA TABLA DE UBICACIONES
      await this.database.executeSql(this.ubicacionVetPlanet, []);

  
    }catch(e){

      this.presentAlert("Creación de Tabla", "Error creando las Tablas: " + JSON.stringify(e));
    }
  }

  /////CONSULTA COMPLETA USUARIO + INSERCCION ListadoUsuarios
  consultarUsuarioActivo(id_usuario: number): Promise<Usuario | null> {
    const query = 'SELECT id_usuario, nombre_usuario, correo_usuario, telefono, foto, contrasena_usuario, id_rol FROM usuarios WHERE id_usuario = ?';

    return this.database.executeSql(query, [id_usuario])
      .then(res => {
        if (res.rows.length > 0) {
          const usuarioActivo: Usuario = {
            id_usuario: res.rows.item(0).id_usuario,
            nombre_usuario: res.rows.item(0).nombre_usuario,
            correo_usuario: res.rows.item(0).correo_usuario,  // Correo electrónico
            telefono: res.rows.item(0).telefono,  // Teléfono
            foto: res.rows.item(0).foto,  // Foto del perfil
            id_rol: res.rows.item(0).id_rol,
            contrasena_usuario: res.rows.item(0).contrasena_usuario  // Contraseña
          };

          // Emitir el usuario activo en el observable
          this.listadoUsuarios.next([usuarioActivo]);

          // Retornar los datos del usuario activo
          return usuarioActivo;
        } else {
          console.warn('No se encontró el usuario activo con ID:', id_usuario);
          this.listadoUsuarios.next([]);
          return null;  // No se encontró el usuario
        }
      })
      .catch(e => {
        console.error('Error al consultar usuario activo:', e);
        this.presentAlert("Consultar Usuario Activo", "Error: " + JSON.stringify(e));
        return null;
      });
  }

  

  /////////////////////////////

  async iniciarSesion(usuario: any) {
    await this.storage.setItem('usuario_sesion', usuario);

    this.listadoUsuarios.next([usuario]); // Actualiza el observable con el nuevo usuario
    this.usuarioSesionSubject.next(usuario); // Asegura que los datos se actualicen en la sesión
  }

  /////CONSULTA COMPLETA PUBLICACIONES + INSERCCION ListadoPublicaciones
  consultarPublicaciones(): Promise<any[]> {
    const query = `
      SELECT p.id_publicacion, p.titulo, p.foto, p.descripcion, p.fecha_publicacion, 
             u.nombre_usuario, u.telefono, u.foto AS foto_perfil, 
             c.nombre_categoria AS categoria
      FROM publicaciones p 
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      JOIN categorias c ON p.id_categoria = c.id_categoria
      ORDER BY p.id_publicacion DESC
    `;
    
    return this.database.executeSql(query, []).then(res => {
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            id_publicacion: res.rows.item(i).id_publicacion,
            titulo: res.rows.item(i).titulo,
            foto: res.rows.item(i).foto,
            descripcion: res.rows.item(i).descripcion,
            nombre_usuario: res.rows.item(i).nombre_usuario,
            foto_perfil: res.rows.item(i).foto_perfil,
            telefono: res.rows.item(i).telefono,
            categoria: res.rows.item(i).categoria  
          });
        }
      }
      this.listadoPublicaciones.next(items);
      return items;
    }).catch(e => {
      this.presentAlert("Consultar PUBLICACIONES vista foro", "Error: " + JSON.stringify(e));
      throw e;  // Lanza el error para que pueda ser capturado en `cargarPublicaciones()`
    });
  }

  consultarPublicacionesGuardadas(id_usuario: number): Promise<any[]> {
    const query = `
      SELECT pg.id_guardado, p.id_publicacion, p.titulo, p.foto, p.descripcion, 
             u.nombre_usuario, u.telefono, u.foto AS foto_perfil, 
             c.nombre_categoria AS categoria
      FROM publicaciones_guardadas pg
      JOIN publicaciones p ON pg.id_publicacion = p.id_publicacion
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE pg.id_usuario = ?
      ORDER BY pg.id_guardado DESC
    `;

    return this.database.executeSql(query, [id_usuario]).then(res => {
        let items: any[] = [];
        if (res.rows.length > 0) {
            for (let i = 0; i < res.rows.length; i++) {
                items.push({
                    id_guardado: res.rows.item(i).id_guardado,
                    id_publicacion: res.rows.item(i).id_publicacion,
                    titulo: res.rows.item(i).titulo,
                    foto: res.rows.item(i).foto,
                    descripcion: res.rows.item(i).descripcion,
                    nombre_usuario: res.rows.item(i).nombre_usuario,
                    foto_perfil: res.rows.item(i).foto_perfil,
                    telefono: res.rows.item(i).telefono,
                    categoria: res.rows.item(i).categoria
                });
            }
        }
        return items;
    }).catch(e => {
        this.presentAlert("Consultar PUBLICACIONES GUARDADAS", "Error: " + JSON.stringify(e));
        throw e;  // Lanza el error para que pueda ser capturado donde se llama
    });
  }
  
  
  /////////////////////////////

  /////CONSULTA COMPLETA UBICACIONES + INSERCCION ListadoUbicaciones
  
  /////////////////////////////



  ////CONSULTA UBICACIONES
  consultarUbicaciones(): Promise<any[]> {
    const query =  `SELECT 
      u.id_ubicacion,
      u.nombre_ubicacion,
      u.direccion,
      u.sububicacion,
      u.descripcion_ubicacion,
      u.horario,
      u.imagen_ubicacion,
      u.telefono_lugar,
      c.nombre_comuna as comuna,
      e.tipo_establecimiento as establecimiento,
      es.nombre_especie as especie,
      s.nombre_servicio as servicio
    FROM 
      ubicaciones u
    JOIN 
      comunas c ON u.id_comuna = c.id_comuna
    LEFT JOIN 
      establecimientos e ON u.id_establecimiento = e.id_establecimiento
    LEFT JOIN 
      especies es ON u.id_especie = es.id_especie
    LEFT JOIN 
      servicios s ON u.id_servicio = s.id_servicio;
    `;

    return this.database.executeSql(query, []).then(res => {
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            id_ubicacion: res.rows.item(i).id_ubicacion,
            nombre_ubicacion: res.rows.item(i).nombre_ubicacion,
            direccion: res.rows.item(i).direccion,
            sububicacion: res.rows.item(i).sububicacion,
            descripcion_ubicacion: res.rows.item(i).descripcion_ubicacion,
            horario: res.rows.item(i).horario,
            telefono_lugar: res.rows.item(i).telefono_lugar,
            imagen_ubicacion: res.rows.item(i).imagen_ubicacion,
            comuna: res.rows.item(i).comuna,
            establecimiento: res.rows.item(i).establecimiento,
            especie: res.rows.item(i).especie,
            servicio: res.rows.item(i).servicio
          });
        }
      }
      return items;
    }).catch(e => {
      this.presentAlert("Consultar UBICACIONES", "Error: " + JSON.stringify(e));
      throw e;
    });
  }

  ///// DML USUARIO
  ////
  ingresarUsuario(nombreUsuario: string, email: string, contra: string, id_rol: number, telefono: string) {
    const query = `INSERT INTO usuarios (nombre_usuario, correo_usuario, contrasena_usuario, id_rol, telefono) VALUES (?, ?, ?, ?, ?)`;
    return this.database.executeSql(query, [nombreUsuario, email, contra, id_rol, telefono])
        .then(() => console.log('Usuario registrado correctamente'))
        .catch(e => console.error('Error al registrar el usuario', e));
  }

  //ACTUALIZAR FOTO USUARIO
  actualizarFotoUsuario(id_usuario: number, foto: string) {
    const query = `UPDATE usuarios SET foto = ? WHERE id_usuario = ?`;
    return this.database.executeSql(query, [foto, id_usuario])
      .then(() => console.log('Foto actualizada correctamente'))
      .catch(e => console.error('Error al actualizar la foto', e));
  }

  actualizarContrasenaUsuario(id_usuario: number, contrasenaActual: string, nuevaContrasena: string): Promise<void> {
    // Primero, validamos que la contraseña actual sea correcta
    const queryValidar = `SELECT * FROM usuarios WHERE id_usuario = ? AND contrasena_usuario = ?`;
  
    return this.database.executeSql(queryValidar, [id_usuario, contrasenaActual]).then(result => {
      if (result.rows.length > 0) {
        // La contraseña actual es correcta, procedemos a actualizar
        const queryActualizar = `UPDATE usuarios SET contrasena_usuario = ? WHERE id_usuario = ?`;
        return this.database.executeSql(queryActualizar, [nuevaContrasena, id_usuario])
          .then(() => {
            console.log('Contraseña actualizada correctamente');
          })
          .catch(e => {
            console.error('Error al actualizar la contraseña', e);
            throw e;
          });
      } else {
        throw new Error('Contraseña actual incorrecta');
      }
    }).catch(e => {
      console.error('Error al validar la contraseña actual', e);
      throw e;
    });
  }

  borrarUsuario(id_usuario: number): Promise<void> {
    return this.database.executeSql(
      `DELETE FROM usuarios WHERE id_usuario = ?`, 
      [id_usuario]
    )
    .then(() => {
      // Actualizar la lista de usuarios después de eliminar el usuario
      this.fetchUsuariosAdmin().subscribe(usuarios => {
        const updatedUsuarios = usuarios.filter(u => u.id_usuario !== id_usuario);
        this.listadoUsuariosAdmin.next(updatedUsuarios);  // Actualizas el listado
      });
    })
    .catch(e => {
      console.error('Error al borrar el usuario', e);
      return Promise.reject('Error al borrar el usuario');
    });
  }
  //////////////////////////
  //////////////////////////
  

  //METODOS INICIAR SESION
  // Método para validar el usuario e iniciar sesión
  async validarUsuario(email: string, contra: string) {
    const query = `SELECT id_usuario, nombre_usuario, id_rol, foto, telefono, correo_usuario
                   FROM usuarios 
                   WHERE correo_usuario = ? AND contrasena_usuario = ?`;
    
    const result = await this.database.executeSql(query, [email, contra]);
    
    if (result.rows.length > 0) {
        const usuario = result.rows.item(0);
        
        // Guarda los datos completos del usuario en el almacenamiento nativo
        await this.storage.setItem('usuario_sesion', {
          id_usuario: usuario.id_usuario,
          nombre_usuario: usuario.nombre_usuario,
          id_rol: usuario.id_rol,
          foto: usuario.foto,  // Incluye la foto
          telefono: usuario.telefono,  // Otros datos si son necesarios
          email: usuario.correo_usuario,
          contrasena_usuario: usuario.contrasena_usuario
        });

        return usuario;
    } else {
        return null; // Usuario no encontrado
    }
}


  // Método para validar el administrador e iniciar sesión
  async validarAdmin(email: string, contra: string) {
    const query = `SELECT id_administrador, nombre, id_rol FROM administrador WHERE correo_electronico = ? AND contrasena = ?`;
    
    const result = await this.database.executeSql(query, [email, contra]);
    
    if (result.rows.length > 0) {
        const admin = result.rows.item(0);
        
        // Guarda los datos del administrador en el almacenamiento nativo
        await this.storage.setItem('usuario_sesion', {
            id_usuario: admin.id_administrador,  // Usa id_administrador aquí
            nombre_usuario: admin.nombre,
            id_rol: admin.id_rol
        });

        return admin;
    } else {
        return null; // Administrador no encontrado
    }
  }
  /////////////////////////////////////////

  ////  DML  DE PUBLICACION  //////////
  ////  
  agregarPublicacion(publicacion: { id_usuario: number; titulo: string; foto: string; descripcion: string; fecha_publicacion: Date; publicacion_adopcion: boolean; id_categoria: number; }): Promise<void> {

      const { id_usuario, titulo, foto, descripcion, publicacion_adopcion, id_categoria } = publicacion;
      
      return this.database.executeSql(
        'INSERT INTO publicaciones (id_usuario, titulo, foto, descripcion, fecha_publicacion, publicacion_adopcion, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id_usuario, titulo, foto, descripcion, new Date(), publicacion_adopcion, id_categoria]
      )
      .then(() => {
        this.presentAlert('Realizado', 'Publicación hecha correctamente');
      })
      .catch(e => {
        this.presentAlert('Error al añadir la publicación', `Error: ${JSON.stringify(e)}`);
        return Promise.reject('Error al añadir la publicación'); // Propagar el error
      });
    }

  guardarPublicacion(id_usuario: number, id_publicacion: number): Promise<void> {
      const query = `
        INSERT INTO publicaciones_guardadas (id_usuario, id_publicacion) 
        VALUES (?, ?)
      `;
  
      return this.database.executeSql(query, [id_usuario, id_publicacion]).then(() => {
          console.log('Publicación guardada correctamente');
      }).catch(e => {
          this.presentAlert("Guardar PUBLICACION", "Error: " + JSON.stringify(e));
          throw e;  // Lanza el error si es necesario manejarlo
      });
  }
  
  actualizarPublicacion(publicacion: { id_publicacion: number;  titulo: string; foto: string; descripcion: string; id_categoria: number; }): Promise<void> {
  
      const { id_publicacion, titulo, foto, descripcion, id_categoria } = publicacion;
    
      return this.database.executeSql(
        `UPDATE publicaciones 
         SET titulo = ?, foto = ?, descripcion = ?, id_categoria = ? 
         WHERE id_publicacion = ?`,
        [titulo, foto, descripcion, id_categoria, id_publicacion]
      )
      .then(() => {
        // Aquí puedes actualizar el BehaviorSubject que mantiene el listado de publicaciones.
        this.fetchPublicaciones().subscribe(publicaciones => {
          const updatedPublicaciones = publicaciones.map(p => {
            if (p.id_publicacion === id_publicacion) {
              return { ...p, titulo, foto, descripcion, id_categoria };
            }
            return p;
          });
          this.listadoPublicaciones.next(updatedPublicaciones);  // Actualizamos el listado
        });
        this.presentAlert('Editado', 'Publicación editada correctamente');
      })
      .catch(e => {
        this.presentAlert('Error al editar la publicación', `Error: ${JSON.stringify(e)}`);
        return Promise.reject('Error al editar la publicación');
      });
    }
    
  borrarPublicacion(id_publicacion: number): Promise<void> {
      return this.database.executeSql(
        `DELETE FROM publicaciones WHERE id_publicacion = ?`, 
        [id_publicacion]
      )
      .then(() => {
        // Aquí puedes actualizar el BehaviorSubject si lo estás utilizando para manejar la lista de publicaciones
        this.fetchPublicaciones().subscribe(publicaciones => {
          const updatedPublicaciones = publicaciones.filter(p => p.id_publicacion !== id_publicacion);
          this.listadoPublicaciones.next(updatedPublicaciones);  // Actualizas el listado
        });
      })
      .catch(e => {
        console.error('Error al borrar la publicación', e);
        return Promise.reject('Error al borrar la publicación');
      });
  }

  borrarPublicacionGuardada(id_usuario: number, id_publicacion: number): Promise<void> {
    const query = `
      DELETE FROM publicaciones_guardadas 
      WHERE id_usuario = ? AND id_publicacion = ?
    `;
  
    return this.database.executeSql(query, [id_usuario, id_publicacion])
      .then(() => {
        console.log('Publicación guardada eliminada correctamente');
      })
      .catch(e => {
        console.error('Error al eliminar la publicación guardada', e);
        throw e; // Lanza el error si es necesario manejarlo
      });
  }
  
  ///////////////////////
  ///////////////////////

  //// DML UBICACIONES
  ////

  borrarUbicacion(id_ubicacion: number): Promise<void> {
    return this.database.executeSql(
      `DELETE FROM ubicaciones WHERE id_ubicacion = ?`, 
      [id_ubicacion]
    )
    .then(() => {
      // Actualiza el BehaviorSubject después de eliminar la ubicación
      this.fetchUbicaciones().subscribe(ubicaciones => {
        const updatedUbicaciones = ubicaciones.filter(u => u.id_ubicacion !== id_ubicacion);
        this.listadoUbicaciones.next(updatedUbicaciones);  // Actualizas el listado
      });
    })
    .catch(e => {
      console.error('Error al borrar la ubicación', e);
      return Promise.reject('Error al borrar la ubicación');
    });
  }
  //////////////////////
  //////////////////////

  consultarPublicacionesPorUsuario(id_usuario: number): Promise<any[]> {
      const query = `
        SELECT p.id_publicacion, p.titulo, p.foto, p.descripcion, 
               u.nombre_usuario, u.telefono, u.foto AS foto_perfil, 
               c.nombre_categoria AS categoria,
               p.id_categoria,
               p.publicacion_adopcion
        FROM publicaciones p 
        JOIN usuarios u ON p.id_usuario = u.id_usuario
        JOIN categorias c ON p.id_categoria = c.id_categoria
        WHERE p.id_usuario = ?
        ORDER BY p.id_publicacion DESC
      `;
      
      return this.database.executeSql(query, [id_usuario]).then(res => {
        let items: any[] = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            items.push({
              id_publicacion: res.rows.item(i).id_publicacion,
              titulo: res.rows.item(i).titulo,
              foto: res.rows.item(i).foto,
              descripcion: res.rows.item(i).descripcion,
              nombre_usuario: res.rows.item(i).nombre_usuario,    
              telefono: res.rows.item(i).telefono,
              foto_perfil: res.rows.item(i).foto_perfil,
              categoria: res.rows.item(i).categoria,
              id_categoria: res.rows.item(i).id_categoria,
              publicacion_adopcion: res.rows.item(i).publicacion_adopcion
            });
          }
        }
        return items;
      }).catch(e => {
        this.presentAlert("Consultar PUBLICACIONES propias", "Error: " + JSON.stringify(e));
        throw e;
      });
    }




    consultarUsuariosAdmin(): Promise<any[]> {
      const query = `
        SELECT * FROM usuarios
      `;
      
      return this.database.executeSql(query, []).then(res => {
        let items: any[] = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            items.push({
            nombre_usuario: res.rows.item(i).nombre_usuario,
            correo_usuario: res.rows.item(i).correo_usuario,
            telefono: res.rows.item(i).telefono,
            foto: res.rows.item(i).foto,
            id_usuario: res.rows.item(i).id_usuario,
            contrasena_usuario: res.rows.item(i).contrasena_usuario,
            id_rol: res.rows.item(i).id_rol
            });
          }
        }
        return items;
      }).catch(e => {
        this.presentAlert("Consultar Usuarios", "Error: " + JSON.stringify(e));
        throw e;
      });
  }
    
    



  async obtenerUsuarioSesion(): Promise<any> {
      try {
        const usuarioSesion = await this.storage.getItem('usuario_sesion');
        return usuarioSesion;
      } catch (error) {
        console.error('Error al obtener la sesión del usuario', error);
        return null;
      }
  }

  

  

  
  
    
    
    
    
    
}


  

