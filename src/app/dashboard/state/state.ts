import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { ApiUrl } from '../../_core/apiUrl';
import { AllApiService } from '../../_core/_service/all-api.service';

@Component({
  selector: 'app-state',
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './state.html',
  styleUrl: './state.scss',
})
export class State {
 showSpiner = true;
  submit = false ;
  
  alertMessage =''
  addEditForm!:FormGroup;
  id:any;
  successMessage = '';
  errorMessage = '';
  messageSuccess = true;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,private cdr: ChangeDetectorRef,public dialogRef: MatDialogRef<State>){}
 
 
  ngOnInit(): void {
    this.data;
 
    this.id = this.data?.id|| 0;
   
    this.makeForm()
    if(this.id == undefined) { 
       this.showSpiner = false;
     
   }
   else{
    // this.updateData()
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
      state:['',[Validators.required,]],
      stateCode:['',[Validators.required,]],
     
      
      
      
    });
  }
 
 
 
onSubmit() {
  this.submit = true;

  if (this.addEditForm.invalid) return;

  this.showSpiner = true;

  this.http.addEditData(ApiUrl.addEditState, this.addEditForm.value)
    .subscribe({
      next: () => {
        this.showSpiner = false;
        this.successMessage = this.id
            ? 'State updated successfully'
            : 'State saved successfully';
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
