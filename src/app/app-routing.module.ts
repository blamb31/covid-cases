import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllCasesComponent} from './cases/all-cases/all-cases.component';

const routes: Routes = [
  {
    path: '',
    component: AllCasesComponent,
  },
  {
    path:'cases',
    loadChildren: () => import('./cases/cases.module').then(m => m.CasesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
