import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddVoucherPage } from './add-voucher.page';

describe('AddVoucherPage', () => {
  let component: AddVoucherPage;
  let fixture: ComponentFixture<AddVoucherPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVoucherPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddVoucherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
