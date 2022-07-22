import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllHistoryComponent } from './all-history/all-history.component';
import {HistoryRoutingModule} from './history-routing.module';



@NgModule({
  declarations: [
    AllHistoryComponent
  ],
  imports: [
    CommonModule,
    HistoryRoutingModule,
  ]
})
export class HistoryModule { }
