import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ReactiveFormsModule} from '@angular/forms';
import {HomePage} from './home.page';

import {HomePageRoutingModule} from './home-routing.module';
import {EventComponent} from './event/event.component';
import {EventPopoverComponent} from './event-popover/event-popover.component';
import {AddEditEventComponent} from './add-edit-event/add-edit-event.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [HomePage, EventComponent, EventPopoverComponent, AddEditEventComponent]
})
export class HomePageModule {}
