import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductOptionsPage } from './product-options.page';

describe('ProductOptionsPage', () => {
  let component: ProductOptionsPage;
  let fixture: ComponentFixture<ProductOptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductOptionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
