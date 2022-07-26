import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, of, switchMap, tap, map} from 'rxjs';
import {CacheResultsService} from 'src/app/shared/services/cache-results.service';
import {CovidService} from 'src/app/shared/services/covid.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: [ './summary.component.scss' ]
})
export class SummaryComponent implements OnInit {

  public covidCases$!: Observable<any>;
  public selectedCountryInfo$!: Observable<any>;
  public covidHistory$!: Observable<any>;
  public selectedCountry: {[ name: string ]: any} = {};
  public countryName: string = "";

  constructor(private _covidService: CovidService, private _cacheService: CacheResultsService, private _route: ActivatedRoute) { }

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
        if (!usedCache.cases) {
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
    let countryMap: any = {}
    this.selectedCountryInfo$ = this.covidCases$.pipe(
      switchMap((countries: any) => {
        countryMap = countries
        return this._route.params
      }),
      map((params: any) => {
        this.countryName = params.name
        for (let c in countryMap) {
          if (countryMap[ c ][ 'All' ].iso) {
            if (countryMap[ c ][ "All" ].iso === Number(params.iso)) {
              return countryMap[ c ]
            }
          } else if (countryMap[ c ][ 'All' ].iso === null) {
            if (countryMap[ c ][ "All" ].country === params.name) {
              console.log("FOUND")
              return countryMap[ c ]
            }
          }
        }

      }),
      tap(data => console.log({data}))
    )
  }

}
