import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject,AfterViewInit, NgZone, ViewChild, ElementRef, HostListener } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';
import { AllApiService } from '../../../_core/_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-add-edit-narration',
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-edit-narration.html',
  styleUrl: './add-edit-narration.scss',
   providers: [TitleCasePipe]
})
export class AddEditNarration {
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
  categoryId:any;
  successMessage = '';
  errorMessage = '';
  messageSuccess = true;
  listOfData: any[] = [];

  
 
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private titleCase: TitleCasePipe ,private http:AllApiService,private cRouter:ActivatedRoute,
  private router: Router,private ngZone: NgZone,public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private cdr: ChangeDetectorRef,public dialogRef: MatDialogRef<AddEditNarration>){}
 
 ngAfterViewInit(): void {
  if (this.categoryId) {
    this.updateData();
  }
}
  ngOnInit(): void {
    this.companyId = JSON.parse(localStorage.getItem('loggedUser') || '{}').companyId;
     this.userName = JSON.parse(localStorage.getItem('loggedUser') || '{}').username;
    
    
    this.data;
 
    this.categoryId = this.data?.id || 0;
    this.makeForm();
    if(this.categoryId) { 
      
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

  this.http.getAllDataId(ApiUrl.getNarrationListToEdit,this.categoryId)
    .subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);

        // Make sure the API call was successful and data exists
        if (res?.success && res.data) {
          const data = res.data; // extract actual group object
         this.addEditForm.patchValue({
  id: data.id,
  companyId: data.companyId,
  narration: data.narration,
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
    id: [0],
    companyId: [this.companyId, Validators.required],
    narration: ['', Validators.required],
  });
}







onSubmit() {
  this.submit = true;  // <-- mark form as submitted

  if (this.addEditForm.invalid) {
    return; // stop if form is invalid
  }

 

  this.http.addEditData(ApiUrl.addEditNarration, this.addEditForm.value)
    .subscribe({
      next: (res: any) => {
        const message = res?.message 
          || (this.isEditMode ? 'Narration updated successfully' : 'Narration added successfully');

        this.snackBar.open(message, 'Close', { duration: 3000 });

        setTimeout(() => {
          this.showSpiner = false;
          setTimeout(() => this.dialogRef.close(true));
        });
      },
      error: (err) => {
        this.showSpiner = false;
        this.snackBar.open(err?.error?.message || 'Failed to save Narration', 'Close', { duration: 3000 });
      }
    });
}




get isEditMode(): boolean {
  return !!this.categoryId && this.categoryId > 0;
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
