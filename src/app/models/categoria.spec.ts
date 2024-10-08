import { Categoria } from './categoria';

describe('Categoria', () => {
  it('should create an instance', () => {
    const categoria = new Categoria(1, 'Perros');
    expect(categoria).toBeTruthy();
    expect(categoria.id_categoria).toBe(1);
    expect(categoria.nombre_categoria).toBe('Perros');
  });
});
