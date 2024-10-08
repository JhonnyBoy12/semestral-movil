import { Comuna } from './comuna';

describe('Comuna', () => {
  it('should create an instance', () => {
    const comuna = new Comuna(1, 'Santiago');
    expect(comuna).toBeTruthy();
    expect(comuna.id_comuna).toBe(1);
    expect(comuna.nombre_comuna).toBe('Santiago');
  });
});
