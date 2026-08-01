import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AllApiService } from '../../../_core/_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-delete-gst-vat-master',
 imports: [CommonModule,MaterialModule],
  templateUrl: './delete-gst-vat-master.html',
  styleUrl: './delete-gst-vat-master.scss',
})
export class DeleteGstVatMaster {
id ='';
  
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private http:AllApiService,
  private router:Router,
    private snackBar: MatSnackBar,
   private dialogRef: MatDialogRef<DeleteGstVatMaster>) { }

  ngOnInit(): void {
    this.data;
    
    this.id = this.data
  
   
  }
  

  
  

 deleteRecord() {
  this.http.deleteById(ApiUrl.deleteGstVat, this.id).subscribe({
    next: (res: any) => {
      this.snackBar.open(
        res?.message || 'GST VAT  deleted successfully',
        'Close',
        { duration: 3000 }
      );
      this.doneClose();
    },
    error: (err) => {
      this.snackBar.open(
        err?.error?.message || 'Failed to delete ',
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
