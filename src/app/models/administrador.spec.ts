import { Administrador } from './administrador';

describe('Administrador', () => {
  it('should create an instance', () => {
    const admin = new Administrador(1, 1, 'Juan', 'juan@example.com', 'password', '123456789');
    expect(admin).toBeTruthy();
    expect(admin.id_administrador).toBe(1);
    expect(admin.nombre).toBe('Juan');
    expect(admin.correo_electronico).toBe('juan@example.com');
  });
});

