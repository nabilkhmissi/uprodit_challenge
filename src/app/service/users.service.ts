import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, map, mergeMap, switchMap, tap } from 'rxjs';
import { User } from '../models/user.model';
import { LoadingService } from './loading.service';
import { Image } from '../models/image.interface';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private _http: HttpClient,
    private _loading: LoadingService,
    private _sanitizer: DomSanitizer) { }

  private baseUrl = "https://api.uprodit.com";

  pageSubject = new BehaviorSubject<number>(1);
  page$ = this.pageSubject.asObservable();

  sizeSubject = new BehaviorSubject<number>(10);
  size$ = this.sizeSubject.asObservable();

  termSubject = new BehaviorSubject<string>('');
  term$ = this.termSubject.asObservable();


  usersFilter$ = combineLatest([
    this.term$,
    this.page$,
    this.size$]).pipe(
      tap(() => { this._loading.showLoading() }),
      switchMap(([term, page, size]) => {
        return this.getUsers(
          term,
          page,
          size
        )
      }
      )
    );

  getUsers(term: string, page: number, size: number) {
    let mapped_users: User[] = [];
    return this.getUsersByTermAndPageAndSize(term, page, size)
      .pipe(
        //get all users
        switchMap(users => from(users)),
        // get users one by one
        mergeMap(user => {
          //get each users's profile image
          return this.getUserPicById(user.image_id).pipe(
            map(image => {
              let imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(`data:${image.mimeType};base64, ${image.b64Content}`) as string
              let processedUser = {
                ...user,
                image: imagePath
              };
              mapped_users.push(processedUser);
              return mapped_users
            })
          )
        }),
        tap(() => this._loading.hideLoading())
      )
  }

  getUserPicById(id: number) {
    let url = `${this.baseUrl}/v2/profile/picture/f/${id}`;
    let body = {
      appid: "challenge_uprodit",
      env: "production",
      uri: url
    }
    return this._http.post<AuthorizationToken>(`${this.baseUrl}/v1/authheader`, body).pipe(
      switchMap(token => {
        let headers = new HttpHeaders({
          Authorization: token.authorization
        });
        let httpOptions = { headers: headers };
        return this._http.get<Image>(url, httpOptions)
      })
    )
  }

  getUsersByTermAndPageAndSize(term: string, page: number, size: number) {
    let url = `${this.baseUrl}/v1/search/all?terms=${term}&startIndex=${page - 1}&maxResults=${size}&usecase=perso`;
    let body = {
      appid: "challenge_uprodit",
      env: "production",
      uri: url
    }
    //get auth token
    return this._http.post<AuthorizationToken>(`${this.baseUrl}/v1/authheader`, body).pipe(
      switchMap(authToken => {
        let headers = new HttpHeaders({
          Authorization: authToken.authorization
        });
        let httpOptions = { headers: headers };
        //get Users using the requested token
        return this._http.get<User[]>(url, httpOptions);
      })
    )
  }

}

export interface AuthorizationToken {
  authorization: string
}