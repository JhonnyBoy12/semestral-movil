import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarNombrePage } from './cambiar-nombre.page';

describe('CambiarNombrePage', () => {
  let component: CambiarNombrePage;
  let fixture: ComponentFixture<CambiarNombrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarNombrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
