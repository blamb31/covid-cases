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
  public regions: string[] = []

  constructor(private _covidService: CovidService, private _cacheService: CacheResultsService, private _route: ActivatedRoute) { }

  goBack() {
    window.history.back()
  }

  calcPerCapita(stat: string, pop: string) {
    console.log({stat, pop})
    return ((Number(stat) / Number(pop))).toFixed(5)
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
        console.log({countries})
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
      map(data => {
        console.log("DATA", data)
        if (!data[ "All" ].lat || !data[ "All" ].long) {
          const keys = Object.keys(data)
          data[ "All" ].lat = data[ keys[ keys.length - 1 ] ].lat
          data[ "All" ].long = data[ keys[ keys.length - 1 ] ].long
        }
        if (data[ 'All' ].country === 'US') {
          console.log("IS US")
          data[ 'All' ].country = 'United States'
        }
        this.regions = Object.keys(data)
        console.log({regions: this.regions})
        return data
      }),
      tap(data => console.log({data}))
    )
  }

}
