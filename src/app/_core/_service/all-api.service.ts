import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';

import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError, } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ApiUrl } from '../apiUrl';
@Injectable({
  providedIn: 'root'
})
export class AllApiService {
 

  constructor(private http:HttpClient,private router: Router,) { }


  clearConsoleError() {
    setTimeout(() => console.clear(), 500); // Small delay to ensure the error is logged before clearing
  }



getNextInvoiceNo(
  companyId: number,
  invoiceHeadingInt: number,
  startFrom: number,
    prefix: string | null,
  suffix: string | null
    // new parameter
) {
  const apiUrl = `${environment.apiBaseUrl}${ApiUrl.invoiceNumberForSale}`;

  return this.http.get<{ nextInvoiceNo: string }>(apiUrl, {
    params: {
      companyId: companyId.toString(),
      invoiceHeadingInt: invoiceHeadingInt.toString(),
      startFrom: startFrom.toString(),
      prefix: prefix ?? '',   // send empty if null
      suffix: suffix ?? ''    // new suffix param
    }
  });
}

getNextInvoiceNoPurchase(
  companyId: number,
  invoiceHeadingInt: number,
  startFrom: number,
    prefix: string | null,
  suffix: string | null
    // new parameter
) {
  const apiUrl = `${environment.apiBaseUrl}${ApiUrl.invoiceNumberForPurchase}`;

  return this.http.get<{ nextInvoiceNo: string }>(apiUrl, {
    params: {
      companyId: companyId.toString(),
      invoiceHeadingInt: invoiceHeadingInt.toString(),
      startFrom: startFrom.toString(),
      prefix: prefix ?? '',   // send empty if null
      suffix: suffix ?? ''    // new suffix param
    }
  });
}


  getAllData(url:string):Observable<any>{
    let params = new HttpParams();
    const ApiUrl = `${environment.apiBaseUrl}${url}`;
    return this.http.get(ApiUrl).pipe((data=>{
      return data;
    }))
  }

  
  thiredParty(url: string): Observable<any> {
    return this.http.get(url);
  }

 

  addEditData(url:string,json:JSON,):Observable<any>{
    const apiUrl = `${environment.apiBaseUrl}${url}`;
    var params  = json;
    return this.http.post<any>(apiUrl,params,).pipe((data=>{
      return data;
    })
    )
  } 

  addEditDataAnother(url: string, body: any): Observable<any> {
  const apiUrl = `${environment.apiBaseUrl}${url}`;
  return this.http.post<any>(apiUrl, body);
}
 
  
  getAllDataId(url:string,id?:any):Observable<any>{
    const apiUrl =`${environment.apiBaseUrl}${url}/${id}`;
    return this.http.get(apiUrl ,id) .pipe((data=>{
      return data;
    }))
  }

  getAllDataIdSale(url: string, id?: any): Observable<any> {
  const apiUrl = `${environment.apiBaseUrl}${url}/${id}`;
  return this.http.get(apiUrl, { responseType: 'text' });
}



  postData(url: string, body: any): Observable<any> {
  const apiUrl = `${environment.apiBaseUrl}${url}`;
  return this.http.post(apiUrl, body);
}
  
getAndEditById(
  url: string,
  companyId?: number,
  transportId?: number
): Observable<any> {

  const params: any = {};

  if (companyId !== undefined && companyId !== null) {
    params.companyId = companyId;
  }

  if (transportId !== undefined && transportId !== null) {
    params.transportId = transportId;
  }

  return this.http.get(
    `${environment.apiBaseUrl}${url}`,
    { params }
  );
}

   
  

  getPolicyDetailsByAccountIdId(url:string,id?:any):Observable<any>{
    const apiUrl =`${environment.apiBaseUrl}${url}/${id}`;
    return this.http.post(apiUrl ,id) .pipe((data=>{
      return data;
    }))
  }
  getAllDataByTwoId(url:string,id?:any ,id1?:any) :Observable<any>{
    const apiUrl =`${environment.apiBaseUrl}${url}/${id}/${id1}`;
    return this.http.get(apiUrl ,id) .pipe((data=>{
      return data;
    }))
  }
//   getItemWiseStock(
//   url: string,
//   companyId: any,
//   itemId?: any,
//   fromDate?: any,
//   toDate?: any
// ): Observable<any> {

//   let apiUrl = `${environment.apiBaseUrl}${url}?companyId=${companyId}`;

//   if (itemId !== null && itemId !== undefined) {
//     apiUrl += `&itemId=${itemId}`;
//   }

//   if (fromDate) {
//     apiUrl += `&fromDate=${fromDate}`;
//   }

//   if (toDate) {
//     apiUrl += `&toDate=${toDate}`;
//   }

//   return this.http.get(apiUrl);
// }

getItemWiseStock(url: string, companyId: any, itemId: any): Observable<any> {
  const apiUrl = `${environment.apiBaseUrl}${url}?companyId=${companyId}&itemId=${itemId}`;
  return this.http.get(apiUrl);
}
  getAllDataByThreId(url:string,id?:any ,id1?:any,id2?:any) :Observable<any>{
    const apiUrl =`${environment.apiBaseUrl}${url}/${id}/${id1}/${id2}`;
    return this.http.get(apiUrl ,id) .pipe((data=>{
      return data;
    }))
  }
  getAllDataByfour(url:string,id?:any ,id1?:any,id2?:any,id3?:any) :Observable<any>{
    const apiUrl =`${environment.apiBaseUrl}${url}/${id}/${id1}/${id2}/${id3}`;
    return this.http.get(apiUrl ,id) .pipe((data=>{
      return data;
    }))
  }
  
  getAllDataByIdAndDate(url:string,id?:any,date?:any){
    const apiUrl =`${environment.apiBaseUrl}${url}/${id}/${date}`;
    return this.http.get(apiUrl ,id) .pipe((data=>{
      return data;
    }))

  }


 

  addEditFormData(url:string,productData:FormData,):Observable<any>{
    const apiUrl = `${environment.apiBaseUrl}${url}`;
    var params  = productData;
    return this.http.post<any>(apiUrl,params).pipe((data=>{
      return data;
    })
    )
  }

  delete(id?:any):Observable<any>{
    const apiUrl =`${environment.apiBaseUrl}${id}`;
    return this.http.post(apiUrl ,id) .pipe((data=>{
      return data;
    }))
  }
  upDateByPassParameter(url:string,id?:any, name?:any):Observable<any>{
    const apiUrl =`${environment.apiBaseUrl}${url}/${id}//${name}`;
    return this.http.post(apiUrl ,id ,name) .pipe((data=>{
      return data;
    }))
  }
  
  deleteByThree(url:string,id?:any, name?:any,DeletedBy?:any):Observable<any>{
    const apiUrl =`${environment.apiBaseUrl}${url}/${id}/${name}/${DeletedBy}`;
    return this.http.post(apiUrl ,id ,name) .pipe((data=>{
      return data;
    }))
  }

  deleteByDelete(url:string,id?:any):Observable<any>{
    const apiUrl =`${environment.apiBaseUrl}${url}/${id}`;
    return this.http.delete(apiUrl ,id) .pipe((data=>{
      return data;
    }))
  }
  deleteById(url:string,id?:any):Observable<any>{
    const apiUrl =`${environment.apiBaseUrl}${url}/${id}`;
    return this.http.delete(apiUrl ,id) .pipe((data=>{
      return data;
    }))
  }

  deleteAddQuery(url:string,json:JSON,):Observable<any>{
    const apiUrl = `${environment.apiBaseUrl}${url}`;
    var params  = json;
    return this.http.post<any>(apiUrl,params,).pipe((data=>{
      return data;
    })
    )
  } 

  deleteByTwo(url:string,id:any,id1:any):Observable<any>{
    const apiUrl = `${environment.apiBaseUrl}${url}/${id}/${id1}`;
   
    return this.http.post<any>(apiUrl,id).pipe((data=>{
      return data;
    })
    )
  } 

  getWithParams(url: string, paramsObj: any): Observable<any> {
  let params = new HttpParams();

  Object.keys(paramsObj).forEach(key => {
    if (paramsObj[key] !== null && paramsObj[key] !== undefined && paramsObj[key] !== '') {
      params = params.set(key, paramsObj[key]);
    }
  });

  const apiUrl = `${environment.apiBaseUrl}${url}`;
  return this.http.get(apiUrl, { params });
}


  private _listner = new Subject<any>();
  listen():Observable<any>{
    return this._listner.asObservable();
  }
  filter(filterBy:String){
    this._listner.next(filterBy);
  }



}
