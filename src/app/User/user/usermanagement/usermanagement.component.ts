import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LibeyUserService } from 'src/app/core/service/libeyuser/libeyuser.service';
import { LibeyUser } from 'src/app/entities/libeyuser';
import { ModalUpdateUserComponent } from '../../components/modal-update-user/modal-update-user.component';
import swal from 'sweetalert2';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css']
})
export class UsermanagementComponent implements OnInit {

  @ViewChild(ModalUpdateUserComponent) modal!: ModalUpdateUserComponent;
  users : LibeyUser[] = []; //
  user : LibeyUser ={
    documentNumber: '',
    documentTypeId: 0,
    name: '',
    fathersLastName: '',
    mothersLastName: '',
    address: '',
    regionCode: '',
    provinceCode: '',
    ubigeoCode: '',
    phone: '',
    email: '',
    password: ''
  };

  constructor(
    private libeyUserService : LibeyUserService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }


  getAllUsers(){

    this.libeyUserService.getAllUsers().subscribe({
      next: (users) => {
        console.log(users);
        this.users = users

      },
      error: (error) => {
        console.error(error);
      }
    })

  }

  OpenModal(user : LibeyUser){
    this.user = user;
    this.modal.openModal();
  }

  recibeUsersUpdated(users : LibeyUser[]){
    this.users = users
  }

  deleteUser(documentNumber : string){
    swal.fire({
      title: "Confirmación",
      text: `¿Deseas eliminar  al cliente?`,
      imageUrl: "assets/images/logos/fuse.png",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar!",
      allowOutsideClick: false
    }).then((result) => {

      this.libeyUserService.deleteUser(documentNumber).subscribe({
        next: (resp) => {

          console.log(resp);
          if(resp > 0){
             this.getAllUsers();
              swal.fire("Especialidades Médicas", "¡Se eliminó correctamente el registro!","success");
          }
          else
          {
              swal.fire("Especialidades Médicas", "Ocurrió un error, favor comuníquese con el área de sistemas", "warning").then(() => {
                  }
              );
          }

        },
        error: (error) => {
          swal.hideLoading();
          console.error(error);
        }
      })
    });

  }

  addUser(){
    this.router.navigate(['/user/maintenance']);
  }

}
