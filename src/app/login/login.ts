import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, NgZone } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../_core/_service/all-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiUrl } from '../_core/apiUrl';

@Component({
  selector: 'app-login',
  imports: [RouterLink,CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
 showSpiner = true;
  submit = false ;
  addEditForm!:FormGroup;
 isLoading = false;   // ✅ ADD THIS
 
 
  constructor(private fb: FormBuilder, private http:AllApiService,private cRouter:ActivatedRoute,
  private router: Router,private ngZone: NgZone,public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private cdr: ChangeDetectorRef,){}
 
 
  ngOnInit(): void {
    
    
    this.makeForm()
   
   }

 







   makeForm(){
   
    this.addEditForm = this.fb.group({
      
      phoneNumber:['', [
    Validators.required,
    Validators.pattern(/^[0-9]{10}$/)
  ]],
      password:['',[Validators.required,]],
     
      
      
      
    });
  }

onSubmit(): void {

  localStorage.clear();

  if (this.addEditForm.invalid) return;

  this.showSpiner = true;
  this.isLoading = true;
  this.removeLocalStarage();

  this.http.addEditData(ApiUrl.ClinetLogin, this.addEditForm.value)
    .subscribe({
      next: (res: any) => {

        this.showSpiner = false;

        if (res?.responseCode !== 1 || !res?.data?.length) {
          this.isLoading = false;
          this.setPasswordError();
          return;
        }

        const client = res.data[0];   // ✅ first company

        const user = {
          id: client.id,
          clientName: client.clientName,
          phoneNumber: client.phoneNumber,
          email: client.email,
          package: client.package,
          isActive: client.isActive,
          companyId:client.companyId,
          
          companyName:client.companyName,
          companyPhoneNumber:client.companyPhoneNumber,
          companyAddress:client.companyAddress
        };

        localStorage.setItem('loggedUser', JSON.stringify(user));

        // optional: store company list
       

        this.router.navigate(['/loging/viewSubUser']);
      },

      error: () => {
        this.showSpiner = false;
        this.isLoading = false;
        this.setPasswordError();
      }
    });
}
 
// onSubmit(): void {
//  localStorage.clear();
//   if (this.addEditForm.invalid) return;

//   this.showSpiner = true;
//  this.isLoading = true;
//  this.removeLocalStarage()
//   this.http.addEditData(ApiUrl.ClinetLogin,this.addEditForm.value)
//     .subscribe({
//       next: (res: any) => {
//         this.showSpiner = false;

//         // ❌ Invalid password / login failed
//         if (res?.responseCode !== 1) {
//            this.isLoading = false;  
//           this.setPasswordError();
//           return;
//         }

//         // ✅ Login success
//         const user = {
//           id: res.data.id,
//           clientName: res.data.clientName,
//           phoneNumber: res.data.phoneNumber,
//           email: res.data.email,
//           package: res.data.package,
//           isActive: res.data.isActive
//         };

//         localStorage.setItem('loggedUser', JSON.stringify(user));
//         this.router.navigate(['/loging/viewSubUser']);
//       },

//       error: () => {
//         this.showSpiner = false;
//         this.setPasswordError();
//       }
//     });
// }

/** Sets password error cleanly */
private setPasswordError(): void {
  const ctrl = this.addEditForm.get('password');

  ctrl?.setErrors({ invalid: true });
  ctrl?.markAsTouched();

  this.snackBar.open('Incorrect phone number or password', 'Close', {
    duration: 3000
  });
}




removeLocalStarage(): void {
  localStorage.removeItem('loggedUser');
 
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


}
