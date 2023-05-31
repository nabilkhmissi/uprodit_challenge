import { Component } from '@angular/core';
import { LoadingService } from './service/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private _loading: LoadingService) {
    this._loading.showLoading();
  }

  title = 'comworkApiStageTest';
  loading$ = this._loading.loading$;
}
