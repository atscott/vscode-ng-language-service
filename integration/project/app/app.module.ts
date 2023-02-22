import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {PostModule} from 'post';

import {AppComponent} from './app.component';
import {FooComponent} from './foo.component';

@NgModule({
  imports: [
    CommonModule,
    PostModule,
  ],
  declarations: [
    FooComponent,
  ],
})
export class OtherModule {
}

@NgModule({
  imports: [
    CommonModule,
    PostModule,
    OtherModule,
  ],
  declarations: [
    AppComponent,
    FooComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}