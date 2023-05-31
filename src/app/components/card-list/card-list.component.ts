import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent {

  constructor(private _userService: UsersService) { }


  users$ = this._userService.usersFilter$.pipe(
    //sorting by rating 
    map(users => users.sort((a, b) => b.stars_count - a.stars_count))
  );
}
