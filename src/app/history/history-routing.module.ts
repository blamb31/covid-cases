import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AllHistoryComponent} from './all-history/all-history.component';


const routes: Routes = [{ path: 'all', component: AllHistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryRoutingModule {}