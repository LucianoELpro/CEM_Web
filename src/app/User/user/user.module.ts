import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsercardsComponent } from './usercards/usercards.component';
import { UsermaintenanceComponent } from './usermaintenance/usermaintenance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from "@ng-select/ng-select";
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { ModalUpdateUserComponent } from '../components/modal-update-user/modal-update-user.component';
@NgModule({
  declarations: [
    UsercardsComponent,
    UsermaintenanceComponent,
    UsermanagementComponent,
    ModalUpdateUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,

  ]
})
export class UserModule { }
