import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LibeyUserService } from 'src/app/core/service/libeyuser/libeyuser.service';
import { DocumentType1 } from 'src/app/entities/DocumentType1';
import { Region } from 'src/app/entities/Region';
import { Province } from 'src/app/entities/Province';
import { Ubigeo } from 'src/app/entities/Ubigeo';
import { LibeyUser } from 'src/app/entities/libeyuser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-usermaintenance',
  templateUrl: './usermaintenance.component.html',
  styleUrls: ['./usermaintenance.component.css']
})
export class UsermaintenanceComponent implements OnInit {


  UserForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  errorMessages:string[] = [];
  documentTypes: DocumentType1[] = [];
  regions: Region[] = [];
  provinces: Province[] = [];
  ubigeos :Ubigeo[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private libeyUserService : LibeyUserService,
    public router: Router,
    )
   { }
  ngOnInit(): void {

    this.initializeForm();
    this.getAllDocumentTypes();
    this.getAllRegions();
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






  getProvincesByCode(code: string){


    this.libeyUserService.getProvincesByCode(code).subscribe({
      next: (provinces) => {

        this.provinces = provinces

      },
      error: (error) => {
        console.error(error);
      }
    })
  }


  getUbigeosByCode(provinceCode : string){

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
      text: `¿Deseas registrar al usuario?`,
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


      this.libeyUserService.createClient(request).subscribe({
        next: (resp) => {

          console.log(resp);
          if(resp > 0){
              swal.fire("Especialidades Médicas", "¡Se registró al cliente!","success");
              this.cleanForm();
              //this.router.navigate(['/pages/inicio']);
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
    debugger;
    this.UserForm.reset();
    this.UserForm.get('DocumentType')?.setValue('');
    this.UserForm.get('Region')?.setValue('');
    this.UserForm.get('Province')?.setValue('');
    this.UserForm.get('Ubigeo')?.setValue('');
  }

  return(){
    this.router.navigate(['/user/card']);
  }
}
