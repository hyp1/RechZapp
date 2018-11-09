import { NgModule } from '@angular/core';
import { IonicPageModule,IonicModule } from 'ionic-angular';
import { CreatePage } from './create';

@NgModule({
  declarations: [
    CreatePage,    
  ],
  imports: [
    IonicModule,
    IonicPageModule.forChild(CreatePage),
  ],
})

export class CreatePageModule {}
