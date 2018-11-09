import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewPage } from './view';
import { AwriConnectProvider } from '../../providers/awri-connect/awri-connect';
@NgModule({
  declarations: [
    ViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewPage),
  ],
  providers: [AwriConnectProvider]
})

export class ViewPageModule {}
