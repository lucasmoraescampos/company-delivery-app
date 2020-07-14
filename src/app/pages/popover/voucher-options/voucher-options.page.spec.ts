import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VoucherOptionsPage } from './voucher-options.page';

describe('VoucherOptionsPage', () => {
  let component: VoucherOptionsPage;
  let fixture: ComponentFixture<VoucherOptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherOptionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VoucherOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
