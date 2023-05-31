import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, tap } from 'rxjs';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  constructor(private _userService: UsersService) { }
  searchInput = new FormControl('');


  ngOnInit(): void {
    this.searchInput.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(this.searchInput.value),
      tap((searchString) => {
        this._userService.termSubject.next(searchString!)
      }),
    ).subscribe()
  }
}
