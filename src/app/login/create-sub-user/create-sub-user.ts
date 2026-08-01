import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../_core/_service/all-api.service';
import { ApiUrl } from '../../_core/apiUrl';

@Component({
  selector: 'app-create-sub-user',
 imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './create-sub-user.html',
  styleUrl: './create-sub-user.scss',
})
export class CreateSubUser {
  showSpiner = true;
  submit = false ;
  
  alertMessage =''
  addEditForm!:FormGroup;
  id:any;
  companyId:any;
  clientId:any;
  phoneNumber:any;
  successMessage = '';
  errorMessage = '';
  messageSuccess = true;
  isEdit = false;

 
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,private cdr: ChangeDetectorRef,public dialogRef: MatDialogRef<CreateSubUser>){}
 
 
  ngOnInit(): void {
    this.data;
 
    this.companyId = this.data.companyId;
    this.clientId = this.data.clientId;
  
    this.phoneNumber = this.data.phoneNumber;
    
   
    this.makeForm();
    if (this.data?.editData) {
    this.isEdit = true;
    this.id = this.data.editData.id;

    this.addEditForm.patchValue({
      id: this.data.editData.id,
      companyId: this.data.editData.companyId,
      phoneNumber: this.data.editData.phoneNumber,
      username: this.data.editData.username,
      password: this.data.editData.password,
      permissions: this.data.editData.permissions,
      clientId: this.data.editData.clientId
    });
  }
   }

 
// updateData(): void {
//   this.showSpiner = true;

//   this.http.getAllDataId(ApiUrl.getStateById, this.id)
//     .subscribe({
//       next: (data: any[]) => {
//         if (data?.length) {
//           this.addEditForm.patchValue(data[0]);
//         }

//         this.showSpiner = false;
//         this.cdr.detectChanges(); // 🔥 IMMEDIATE UI update
//       },
//       error: () => {
//         this.showSpiner = false;
//         this.cdr.detectChanges();
//       }
//     });
// }



   makeForm(){
   
    this.addEditForm = this.fb.group({
      id:['0'],
      companyId:[this.companyId,[Validators.required,]],
      phoneNumber:[this.phoneNumber,[Validators.required,]],
        username:['',[Validators.required,]],
      password:['',[Validators.required,]],
       permissions:['',[Validators.required,]],
      clientId:[this.clientId,[Validators.required,]],
     
      
      
      
    });
  }
 
 
 
onSubmit() {
  this.submit = true;

  if (this.addEditForm.invalid) return;

  this.showSpiner = true;

  this.http.addEditData(ApiUrl.createSubUser,this.addEditForm.value)
    .subscribe({
      next: () => {
        this.showSpiner = false;
       this.successMessage = this.isEdit
  ? 'Sub user updated successfully'
  : 'Sub user created successfully';
        this.cdr.detectChanges();
        this.dialogRef.close(true); // close fast
      },
      error: () => {
        this.showSpiner = false;
        this.cdr.detectChanges();
      }
    });
}


  
  changeLocation() {

    // save current route first
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); // navigate to same route
    }); 
  }

  get f() {
    return this.addEditForm.controls;
    
  }

  closeModel(): void {
    this.dialogRef.close();
   
  }

}
