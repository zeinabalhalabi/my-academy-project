import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCards } from './product-cards';

describe('ProductCards', () => {
  let component: ProductCards;
  let fixture: ComponentFixture<ProductCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCards],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
