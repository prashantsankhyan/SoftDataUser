import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../_core/_service/all-api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-delete-payment-receipt',
 imports: [CommonModule,MaterialModule],
  templateUrl: './delete-payment-receipt.html',
  styleUrl: './delete-payment-receipt.scss',
})
export class DeletePaymentReceipt {
   id ='';
  
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private http:AllApiService,
  private router:Router,
    private snackBar: MatSnackBar,
   private dialogRef: MatDialogRef<DeletePaymentReceipt>) { }

  ngOnInit(): void {
    this.data;
    
    this.id = this.data
   
  
   
  }
  

  
  

 deleteRecord() {
  this.http.deleteById(ApiUrl.deletePayment,this.id).subscribe({
    next: (res: any) => {
      this.snackBar.open(
        res?.message || 'Narration  deleted successfully',
        'Close',
        { duration: 3000 }
      );
      this.doneClose();
    },
    error: (err) => {
      this.snackBar.open(
        err?.error?.message || 'Failed to delete Narration',
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
