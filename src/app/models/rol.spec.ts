import { Rol } from './rol';

describe('Rol', () => {
  it('should create an instance', () => {
    const rol = new Rol(1, 'Administrador');
    expect(rol).toBeTruthy();
    expect(rol.id_rol).toBe(1);
    expect(rol.nombre_rol).toBe('Administrador');
  });
});
