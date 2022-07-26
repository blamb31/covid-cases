import {Component, OnInit} from '@angular/core';
import {Observable, of, switchMap, tap, map} from 'rxjs';
import {CacheResultsService} from 'src/app/shared/services/cache-results.service';
import {CovidService} from 'src/app/shared/services/covid.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {
  public covidCases$!: Observable<any>;
  public selectedCountryInfo$!: Observable<any>;
  public covidHistory$!: Observable<any>;
  public selectedCountry: {[ name: string ]: any} = {};

  constructor(private _covidService: CovidService, private _cacheService: CacheResultsService) { }

  setCountryInfo(country: {[ name: string ]: any}) {
    console.log({code: country[ 'iso_n3' ]})
    this.selectedCountryInfo$ = this.covidCases$.pipe(
      map((countries: any) => {
        for (let c in countries) {
          console.log({1: countries[ c ], a: countries[ c ][ 'All' ].iso, b: Number(country[ 'iso_n3' ])})
          if (countries[ c ][ "All" ].iso === Number(country[ 'iso_n3' ])) {
            console.log({c})
            return countries[ c ]
          }
          // return cases.filter((c: any) => Number(c.country_code) === Number(country[ 'iso_n3' ]))
        }
      }),
      tap(data => console.log({data}))
    )
  }

  ngOnInit(): void {
    let usedCache = {cases: false, history: false};

    this.covidCases$ = this._cacheService.checkAllCases().pipe(
      switchMap((cache: any) => {
        if (cache) {
          usedCache.cases = true;
          return of(cache)
        } else {
          return this._covidService.getAllCases()
        }
      }),
      tap((data: any) => {
        if (!usedCache) {
          localStorage.setItem('allCases', JSON.stringify({date: new Date(), data}))
        }
      })
    )

    this.covidHistory$ = this._cacheService.checkAllHistory().pipe(
      switchMap((cache: any) => {
        if (cache) {
          usedCache.history = true;
          return of(cache)
        } else {
          return this._covidService.getAllHistory()
        }
      }),
      tap((data: any) => {
        if (!usedCache) {
          localStorage.setItem('allHistory', JSON.stringify({date: new Date(), data}))
        }
      })
    )

  }
}
