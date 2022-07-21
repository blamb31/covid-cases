import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {CovidService} from 'src/app/shared/services/covid.service';

@Component({
  selector: 'app-all-cases',
  templateUrl: './all-cases.component.html',
  styleUrls: ['./all-cases.component.scss']
})
export class AllCasesComponent implements OnInit {

  public covidCases$!: Observable<any>;

  constructor(private _covidService: CovidService) { }

  ngOnInit(): void {
    this.covidCases$ = this._covidService.getAllCases();
    console.log({covidCases$: this.covidCases$});
  }

}
