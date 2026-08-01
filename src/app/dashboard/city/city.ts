import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject,AfterViewInit, NgZone, ViewChild, ElementRef, HostListener } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material.module';
import { ApiUrl } from '../../_core/apiUrl';
import { AllApiService } from '../../_core/_service/all-api.service';
import { State } from '../state/state';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-city',
   imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './city.html',
  styleUrl: './city.scss',
})
export class City {
  @ViewChild('state') stateSelect!: MatSelect;
 showSpiner = true;
  submit = false ;
  
  alertMessage =''
  addEditForm!:FormGroup;
  cityId:any;
  successMessage = '';
  errorMessage = '';
  messageSuccess = true;
  listOfData:any=[];
 
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private cRouter:ActivatedRoute,
  private router: Router,private ngZone: NgZone,public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private cdr: ChangeDetectorRef,public dialogRef: MatDialogRef<City>){}
 
 ngAfterViewInit(): void {
  if (this.cityId) {
   
  }
}
  ngOnInit(): void {
    this.data;
 
    this.cityId = this.data?.cityId || 0 ;
   
    this.makeForm();
    this.getAllData();
    if(this.cityId) { 
     
      
   }
   else{
   this.showSpiner = false;
      }
   }

@HostListener('document:keydown', ['$event'])
handleKeyboardShortcuts(event: KeyboardEvent) {

  if (event.altKey && event.key.toLowerCase() === 'c') {

    // ✅ check mat-select focus correctly
    if (this.stateSelect?.focused) {
      event.preventDefault();
      this.openState();
    }
  }
}


openState(data?: any) {
   const dialogRef = this.dialog.open(State, {
      width: '500px',
      data: data || null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         this.getAllData(); // reload list automatically
      }
    });
}






   makeForm(){
   
    this.addEditForm = this.fb.group({
      id:['0'],
      city:['',[Validators.required,]],
      state:[null,[Validators.required,]],
     
      
      
      
    });
  }

  getAllData(): void {
  this.http.getAllData(ApiUrl.getAllState)
    .pipe(
      finalize(() => {
       
        this.cdr.markForCheck(); // fast UI update
      })
    )
    .subscribe({
      next: (data: any[]) => {
        
        this.listOfData = (data ?? []).sort((a, b) =>
          (a.state || '').localeCompare(b.state || '')
        );
      },
      error: (err:any) => {
        console.error(err);
      }
    });
}
 
onSubmit() {
  if (this.addEditForm.invalid) return;

  this.showSpiner = true;

  this.http.addEditData(ApiUrl.addEditCity, this.addEditForm.value)
    .subscribe({
      next: (res: any) => {

        // show success message
        this.snackBar.open(
          res?.message || 'City saved successfully',
          'Close',
          { duration: 3000 }
        );

        // hide spinner safely
        setTimeout(() => {
          this.showSpiner = false;

          // close dialog after UI updates
          setTimeout(() => {
            this.dialogRef.close(true); // parent refresh
          });
        });
      },
      error: (err) => {
        this.showSpiner = false;

        // show error message
        this.snackBar.open(
          err?.error?.message || 'Failed to save city',
          'Close',
          { duration: 3000 }
        );

        console.error(err);
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
    this.changeLocation()
   
  }
}
