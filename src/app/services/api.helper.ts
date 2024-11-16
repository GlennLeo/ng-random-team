import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export module ApiHelper {
  export function onSuccess(res: any | any): any {
    return res;
  }

  export function onFail(err: HttpErrorResponse | any) {
    return throwError(err);
  }
}
