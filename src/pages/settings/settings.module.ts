import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';
import { AwriConnectProvider } from '../../providers/awri-connect/awri-connect';

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPage),
   
  ],
  providers: [AwriConnectProvider]
})
export class SettingsPageModule {}
