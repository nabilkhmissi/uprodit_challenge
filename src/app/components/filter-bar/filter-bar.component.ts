import { Component, OnInit } from '@angular/core';
import { first, map, tap } from 'rxjs';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent implements OnInit {

  constructor(private _userService: UsersService) { }

  currentPage$ = this._userService.page$;

  isFirstPage = true;

  ngOnInit(): void {
  }

  setSize(event: any) {
    this._userService.sizeSubject.next(event.target.value)
  }

  goToNextPage() {
    this.currentPage$.pipe(
      first(),
      map(page => page + 1),
      tap((nextPage) => {
        this.isFirstPage = nextPage === 1 ? true : false;
        this._userService.pageSubject.next(nextPage)
      })
    ).subscribe()
  }
  goToPreviousPage() {
    this.currentPage$.pipe(
      first(),
      map(page => {
        return page = page - 1 >= 1 ? page - 1 : page
      }),
      tap((previousPage) => {
        this.isFirstPage = previousPage === 1 ? true : false;
        this._userService.pageSubject.next(previousPage)
      })

    ).subscribe()
  }
}
