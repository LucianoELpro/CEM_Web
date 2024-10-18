import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LibeyUserService } from 'src/app/core/service/libeyuser/libeyuser.service';
import { DocumentType1 } from 'src/app/entities/DocumentType1';
import { LibeyUser } from 'src/app/entities/libeyuser';
import { Province } from 'src/app/entities/Province';
import { Region } from 'src/app/entities/Region';
import { Ubigeo } from 'src/app/entities/Ubigeo';
import swal from 'sweetalert2';

@Component({
  selector: 'app-modal-update-user',
  templateUrl: './modal-update-user.component.html',
  styleUrls: ['./modal-update-user.component.css']
})
export class ModalUpdateUserComponent implements OnInit {

  UserForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  errorMessages:string[] = [];
  documentTypes: DocumentType1[] = [];
  regions: Region[] = [];
  provinces: Province[] = [];
  ubigeos :Ubigeo[] = [];

  constructor(
    private libeyUserService : LibeyUserService,
    public router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.initializeForm();
    this.getAllDocumentTypes();
    this.getAllRegions();
  }


  @Input() user?: LibeyUser | undefined;
  @Output() users = new EventEmitter<LibeyUser[]>();
  isOpen = false;

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.reciepUser();
  }

  initializeForm(){
    this.UserForm = this.formBuilder.group({
      DocumentType: ['',[Validators.required]],
      FullName: ['',[Validators.required]],
      DocumentNumber: ['',[Validators.required]],
      FatherLastName: ['',[Validators.required]],
      MotherLastName: ['',[Validators.required]],
      Address: ['',[Validators.required]],
      Region: ['',[Validators.required]],
      Province: ['',[Validators.required]],
      Ubigeo: ['',[Validators.required]],
      Phone: ['',[Validators.required]],
      Email: ['',[Validators.required]],
      Password: ['',[Validators.required]],

    })
  }



  getAllDocumentTypes(){

    this.libeyUserService.getAllDocumentTypes().subscribe({
      next: (documentTypes) => {
        this.documentTypes = documentTypes
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  getAllRegions(){

    this.libeyUserService.getAllRegions().subscribe({
      next: (regions) => {

        this.regions = regions

      },
      error: (error) => {
        console.error(error);
      }
    })
  }






  getProvincesByCode(code: string|undefined){


    this.libeyUserService.getProvincesByCode(code).subscribe({
      next: (provinces) => {

        this.provinces = provinces

      },
      error: (error) => {
        console.error(error);
      }
    })
  }


  getUbigeosByCode(provinceCode : string | undefined){

      let regionCode = this.UserForm.get('Region')?.value;
      this.libeyUserService.getUbigeosByCode(regionCode,provinceCode).subscribe({
        next: (ubigeos) => {

          this.ubigeos = ubigeos

        },
        error: (error) => {
          console.error(error);
        }
      })
    }





  Submit(){


    swal.fire({
      title: "Confirmación",
      text: `¿Deseas editar al usuario?`,
      imageUrl: "assets/images/logos/fuse.png",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar!",
      allowOutsideClick: false
    }).then((result) => {


      if(!this.UserForm.valid){
        swal.fire("Oops!", "Something went wrong!", "error");
        return;
      }

      const request : LibeyUser ={
        documentNumber: this.UserForm.get("DocumentNumber")?.value,
        documentTypeId: this.UserForm.get("DocumentType")?.value,
        name: this.UserForm.get("FullName")?.value,
        fathersLastName: this.UserForm.get("FatherLastName")?.value,
        mothersLastName: this.UserForm.get("MotherLastName")?.value,
        address: this.UserForm.get("Address")?.value,
        regionCode: this.UserForm.get("Region")?.value,
        provinceCode: this.UserForm.get("Province")?.value,
        ubigeoCode: this.UserForm.get("Ubigeo")?.value,
        phone: this.UserForm.get("Phone")?.value,
        email: this.UserForm.get("Email")?.value,
        password: this.UserForm.get("Password")?.value,

      }


      this.libeyUserService.editUser(request).subscribe({
        next: (resp) => {

          console.log(resp);
          if(resp > 0){
              swal.fire("Especialidades Médicas", "¡Se actualizó el registro!","success");
              this.getAllUsers();
              this.cleanForm();
              this.isOpen = false;
          }
          else
          {
              swal.fire("Especialidades Médicas", "Ocurrió un error, favor comuniquese con el área de sistemas", "warning").then(() => {
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

  cleanForm(){

    this.UserForm.reset();
    this.UserForm.get('DocumentType')?.setValue('');
    this.UserForm.get('Region')?.setValue('');
    this.UserForm.get('Province')?.setValue('');
    this.UserForm.get('Ubigeo')?.setValue('');
  }

  return(){

    this.closeModal();
  }



  reciepUser(){
    console.log(this.user);

    this.UserForm.patchValue({
        DocumentNumber: this.user?.documentNumber,
        FullName: this.user?.name,
        FatherLastName: this.user?.fathersLastName,
        MotherLastName: this.user?.mothersLastName,
        Address: this.user?.address,
        Phone: this.user?.phone,
        Email: this.user?.email,
        Password: this.user?.password,

    });
    this.UserForm.get('DocumentType')?.setValue(this.user?.documentTypeId);
    this.UserForm.get('Region')?.setValue(this.user?.regionCode);
    this.getProvincesByCode(this.user?.regionCode);
    this.UserForm.get('Province')?.setValue(this.user?.provinceCode)
    this.getUbigeosByCode(this.user?.provinceCode,);
    this.UserForm.get('Ubigeo')?.setValue(this.user?.ubigeoCode,)
  }



  getAllUsers(){

    this.libeyUserService.getAllUsers().subscribe({
      next: (users) => {
        console.log(users);
        this.users.emit(users);

      },
      error: (error) => {
        console.error(error);
      }
    })

  }

}
