import {Component, OnInit} from '@angular/core';
import {Observable, of, switchMap, tap} from 'rxjs';
import {CacheResultsService} from 'src/app/shared/services/cache-results.service';
import {CovidService} from 'src/app/shared/services/covid.service';

@Component({
  selector: 'app-all-cases',
  templateUrl: './all-cases.component.html',
  styleUrls: [ './all-cases.component.scss' ]
})
export class AllCasesComponent implements OnInit {

  public covidCases$!: Observable<any>;

  constructor(private _covidService: CovidService, private _cacheService: CacheResultsService) { }

  ngOnInit(): void {
    let usedCache = false;
    this.covidCases$ = this._cacheService.checkAllCases().pipe(
      switchMap((cache: any) => {
        if (cache) {
          usedCache = true;
          console.log({usedCache})
          return of(cache)
        } else {
          return this._covidService.getAllCases()
        }
      }),
      tap((data: any) => {
        console.log({data})
        if (!usedCache) {
          console.log("Setting Cache")
          localStorage.setItem('allCases', JSON.stringify({date: new Date(), data}))
        }
      })
    )
  }
}
