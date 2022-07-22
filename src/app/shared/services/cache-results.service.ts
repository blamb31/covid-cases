import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheResultsService {

  constructor() { }

  checkAllCases() {
    const cache = localStorage.getItem('allCases')
    if(cache) {
      const today = new Date()
      const todayDate =String( today.getFullYear())+String(today.getMonth())+String(today.getDate())
      const parsedCache = JSON.parse(cache)
      console.log({parsedCache})
      const parsedDate = new Date(parsedCache.date)
      const parsedDateStr  = String(parsedDate.getFullYear())+String(parsedDate.getMonth())+String(parsedDate.getDate())
      if(todayDate === parsedDateStr) {
        return of(parsedCache.data)
      }

      }
      return of(null)
  }
  checkAllHistory() {
    const cache = localStorage.getItem('allHistory')
    if(cache) {
      const today = new Date()
      const todayDate =String( today.getFullYear())+String(today.getMonth())+String(today.getDate())
      const parsedCache = JSON.parse(cache)
      console.log({parsedCache})
      const parsedDate = new Date(parsedCache.date)
      const parsedDateStr  = String(parsedDate.getFullYear())+String(parsedDate.getMonth())+String(parsedDate.getDate())
      if(todayDate === parsedDateStr) {
        return of(parsedCache.data)
      }

      }
      return of(null)
  }
}
