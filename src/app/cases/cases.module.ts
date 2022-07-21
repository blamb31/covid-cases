import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCasesComponent } from './all-cases/all-cases.component';
import {CasesRoutingModule} from './cases-routing.module';



@NgModule({
  declarations: [
    AllCasesComponent
  ],
  imports: [
    CommonModule,
    CasesRoutingModule
  ],
})
export class CasesModule { }
