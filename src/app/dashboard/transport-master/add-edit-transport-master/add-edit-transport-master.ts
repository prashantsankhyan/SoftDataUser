import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject,AfterViewInit, NgZone, HostListener } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';
import { AllApiService } from '../../../_core/_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-add-edit-transport-master',
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-edit-transport-master.html',
  styleUrl: './add-edit-transport-master.scss',
    providers: [TitleCasePipe]
})
export class AddEditTransportMaster {
  isSaving = false;
    @HostListener('keydown', ['$event'])
onKeyDown(event: KeyboardEvent) {
  if (this.isSaving) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  if (event.repeat) {
    event.preventDefault();
    return;
  }

  if (event.key !== 'Enter') {
    return;
  }

  const target = event.target as HTMLElement;

  // Allow Shift+Enter in textarea
  if (target.tagName === 'TEXTAREA' && event.shiftKey) {
    return;
  }

  event.preventDefault();

  const form = target.closest('form');

  if (!form) return;

  const elements = Array.from(
    form.querySelectorAll(
      `
      input:not([disabled]),
      textarea:not([disabled]),
      select:not([disabled]),
      button:not([disabled]),
      .mat-mdc-select-trigger,
      [tabindex]
      `
    )
  ).filter(
    (el: any) =>
      el.offsetParent !== null &&
      !el.hasAttribute('readonly')
  ) as HTMLElement[];

  const index = elements.indexOf(target);

  if (index > -1 && index < elements.length - 1) {
    elements[index + 1].focus();
  } else {
    this.onSubmit();
  }
}
 showSpiner = true;
  submit = false ;
  companyId:any;
  userName:any;
  
  alertMessage =''
  addEditForm!:FormGroup;
  transportId:any;
  successMessage = '';
  errorMessage = '';
  messageSuccess = true;
  listOfData: any[] = [];
   listOfGroupData: any[] = [];
  
 
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private titleCase: TitleCasePipe ,private http:AllApiService,private cRouter:ActivatedRoute,
  private router: Router,private ngZone: NgZone,public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private cdr: ChangeDetectorRef,public dialogRef: MatDialogRef<AddEditTransportMaster>){}
 
 ngAfterViewInit(): void {
  if (this.transportId) {
    this.updateData();
  }
}
  ngOnInit(): void {
    this.companyId = JSON.parse(localStorage.getItem('loggedUser') || '{}').companyId;
     this.userName = JSON.parse(localStorage.getItem('loggedUser') || '{}').username;
    
    
    this.data;
 
    this.transportId = this.data?.transportId || 0 ;
   
   
    this.makeForm();
   
   

     // Reset Under Group dynamically
  
    if(this.transportId) { 
      
       this.updateData() ;
      
   }
   else{
   this.showSpiner = false;
      }
   }

handleTitleCase(event: KeyboardEvent, controlName: string) {
  const control = this.addEditForm.get(controlName);
  if (!control) return;

  const value = control.value || '';

  // Caps Lock → ALL CAPS
  if (event.getModifierState && event.getModifierState('CapsLock')) {
    control.setValue(value.toUpperCase(), { emitEvent: false });
  } 
  // Otherwise → Title Case
  else {
    const titleCase = value
      .toLowerCase()
      .replace(/\b\w/g, (c: string) => c.toUpperCase());

    control.setValue(titleCase, { emitEvent: false });
  }
}



 
updateData(): void {
  this.showSpiner = true;

  this.http.getAndEditById(ApiUrl.getAndEdit, undefined, this.transportId)
    .subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);

        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {

          const data = res.data[0]; // ✅ FIX HERE

          this.addEditForm.patchValue({
            transportId: data.transportId,
            companyId: data.companyId,
            name: data.name,
            phone: data.phone,
            gstNo: data.gstNo
          });

          console.log('FORM AFTER PATCH:', this.addEditForm.value);
        }

        this.showSpiner = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.showSpiner = false;
        this.cdr.detectChanges();
      }
    });
}







makeForm() {
  this.addEditForm = this.fb.group({
    transportId: [0],
    companyId: [this.companyId, Validators.required],
    name: ['', Validators.required],
    phone: [''],
    gstNo: [''],
   


  
  });
}






onSubmit() {
  this.submit = true;  // <-- mark form as submitted

  if (this.addEditForm.invalid) {
    return; // stop if form is invalid
  }

 

  this.http.addEditData(ApiUrl.addEditTransport, this.addEditForm.value)
    .subscribe({
      next: (res: any) => {
        const message = res?.message 
          || (this.isEditMode ? 'Group updated successfully' : 'Group added successfully');

        this.snackBar.open(message, 'Close', { duration: 3000 });

        setTimeout(() => {
          this.showSpiner = false;
          setTimeout(() => this.dialogRef.close(true));
        });
      },
      error: (err) => {
        this.showSpiner = false;
        this.snackBar.open(err?.error?.message || 'Failed to save group', 'Close', { duration: 3000 });
      }
    });
}




get isEditMode(): boolean {
  return !!this.transportId && this.transportId > 0;
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
