import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExtractPage } from './extract.page';

describe('ExtractPage', () => {
  let component: ExtractPage;
  let fixture: ComponentFixture<ExtractPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExtractPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
