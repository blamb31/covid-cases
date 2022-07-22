import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllHistoryComponent} from './history/all-history/all-history.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path:'cases',
    loadChildren: () => import('./cases/cases.module').then(m => m.CasesModule)
  },
  {
    path:'history',
    loadChildren: () => import('./history/history.module').then(m => m.HistoryModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
