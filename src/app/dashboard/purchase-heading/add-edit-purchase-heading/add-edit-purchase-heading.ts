import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Inject, NgZone } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AllApiService } from '../../../_core/_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-add-edit-purchase-heading',
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-edit-purchase-heading.html',
  styleUrl: './add-edit-purchase-heading.scss',
  providers: [TitleCasePipe]
})
export class AddEditPurchaseHeading {
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
focusNext(select: MatSelect) {

  setTimeout(() => {

    const current = select._elementRef.nativeElement;

    const form = current.closest('form');
    if (!form) return;

    const elements = Array.from(
      form.querySelectorAll(
        `
        input:not([disabled]),
        textarea:not([disabled]),
        .mat-mdc-select,
        select:not([disabled]),
        button:not([disabled])
        `
      )
    ).filter((el: any) =>
      el.offsetParent !== null &&
      !el.hasAttribute('readonly')
    ) as HTMLElement[];

    const index = elements.indexOf(current);

    if (index === -1) return;

    const next = elements[index + 1];

    if (!next) return;

    // Next is Angular Material Select
    const trigger = next.querySelector('.mat-mdc-select-trigger') as HTMLElement;

    if (trigger) {
      trigger.focus();
      trigger.click();   // automatically open next select
    } else {
      next.focus();
    }

  }, 150);
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
   listOfGroupData: any[] = [];
  
 
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private titleCase: TitleCasePipe ,private http:AllApiService,private cRouter:ActivatedRoute,
  private router: Router,private ngZone: NgZone,public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private cdr: ChangeDetectorRef,public dialogRef: MatDialogRef<AddEditPurchaseHeading>){}
 
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
   
   

     // Reset Under Group dynamically
  
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

  this.http.getAllDataId(ApiUrl.getPurchaseHeadingById,this.categoryId)
    .subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);

        // Make sure the API call was successful and data exists
        if (res?.success && res.data) {
          const data = res.data; // extract actual group object

          this.addEditForm.patchValue({
            id: data.id,
            companyId: data.companyId,
            typeOfPurchase: data.typeOfPurchase,
            prefix: data.prefix,
            suffix: data.suffix,
            taxOnPurchaseType: data.taxOnPurchaseType,
             numberStartFrom: data.numberStartFrom,
             permission:data.permission
           
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
    typeOfPurchase: ['', Validators.required],
    prefix: [''],
     suffix: ['',],
    taxOnPurchaseType: [''],
     numberStartFrom: [''],
     permission:['1'],
   
   


  
  });
}






onSubmit() {
  this.submit = true;  // <-- mark form as submitted

  if (this.addEditForm.invalid) {
    return; // stop if form is invalid
  }

 

  this.http.addEditData(ApiUrl.addEditPurchaseHeading, this.addEditForm.value)
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
