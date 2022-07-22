import { Component, OnInit } from '@angular/core';
import {Observable, of, switchMap, tap} from 'rxjs';
import {CacheResultsService} from 'src/app/shared/services/cache-results.service';
import {CovidService} from 'src/app/shared/services/covid.service';

@Component({
  selector: 'app-all-history',
  templateUrl: './all-history.component.html',
  styleUrls: ['./all-history.component.scss']
})
export class AllHistoryComponent implements OnInit {

  public covidHistory$!: Observable<any>;

  constructor(private _covidService: CovidService, private _cacheService: CacheResultsService) { }

  ngOnInit(): void {
    let usedCache = false;
    this.covidHistory$ = this._cacheService.checkAllHistory().pipe(
      switchMap((cache:any) => {
        console.log({cache})
        if(cache) {
          usedCache = true;
          console.log({usedCache})
          return of(cache)
        }else {
          return this._covidService.getAllHistory()
        }
      }),
      tap( (data:any) => {
        console.log({data})
        if(!usedCache) {
          console.log("Setting Cache")
          localStorage.setItem('allHistory', JSON.stringify({date: new Date(), data}))
        }
      })
    )
  }
}
