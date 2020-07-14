import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderOptionsPage } from './order-options.page';

describe('OrderOptionsPage', () => {
  let component: OrderOptionsPage;
  let fixture: ComponentFixture<OrderOptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderOptionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
