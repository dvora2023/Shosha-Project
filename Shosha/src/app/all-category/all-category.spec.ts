import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCategory } from './all-category';

describe('AllCategory', () => {
  let component: AllCategory;
  let fixture: ComponentFixture<AllCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
