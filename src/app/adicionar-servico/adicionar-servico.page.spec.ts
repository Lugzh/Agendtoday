import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdicionarServicoPage } from './adicionar-servico.page';

describe('AdicionarServicoPage', () => {
  let component: AdicionarServicoPage;
  let fixture: ComponentFixture<AdicionarServicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdicionarServicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
