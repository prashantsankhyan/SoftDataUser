import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../_core/_service/all-api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiUrl } from '../../_core/apiUrl';

@Component({
  selector: 'app-delete-sub-user',
  imports: [CommonModule,MaterialModule],
  templateUrl: './delete-sub-user.html',
  styleUrl: './delete-sub-user.scss',
})
export class DeleteSubUser {

  cityId ='';
  
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private http:AllApiService,
  private router:Router,
    private snackBar: MatSnackBar,
   private dialogRef: MatDialogRef<DeleteSubUser>) { }

  ngOnInit(): void {
    this.data;
    
    this.cityId = this.data
  
   
  }
  

  
  

  deleteRecord(){
    
    this.http.deleteById(ApiUrl.deleteSubUser,this.cityId).subscribe({
        next: (res: any) => {
          this.snackBar.open(
            res?.message || 'subUser deleted successfully',
            'Close',
            { duration: 3000 }
          );
          
          this.doneClose()
         
        },
        error: (err) => {
          this.snackBar.open(
            err?.error?.message || 'Failed to delete city',
            'Close',
            { duration: 3000 }
          );
          console.error(err);
        }
      });
    
  }


    doneClose(){
    this.closeComponent();
    this.changeLocation();
  }
  
  closeComponent(): void {
    this.dialogRef.close();
  }




  changeLocation() {

    // save current route first
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); // navigate to same route
    }); 
  }


  


  onNoClick(): void {
    this.dialogRef.close();
   
  }
}
