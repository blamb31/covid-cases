import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AllCasesComponent} from './all-cases/all-cases.component';


const routes: Routes = [{ path: 'all', component: AllCasesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CasesRoutingModule {}