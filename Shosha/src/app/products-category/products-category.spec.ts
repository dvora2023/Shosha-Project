import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsCategory } from './products-category';

describe('ProductsCategory', () => {
  let component: ProductsCategory;
  let fixture: ComponentFixture<ProductsCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
