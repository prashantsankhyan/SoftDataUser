import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllApiService } from '../../_core/_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiUrl } from '../../_core/apiUrl';
import { AddEditScreenManagemenet } from './add-edit-screen-managemenet/add-edit-screen-managemenet';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-screen-management',
 imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule,ReactiveFormsModule,FormsModule],
  templateUrl: './screen-management.html',
  styleUrl: './screen-management.scss',
})
export class ScreenManagement {
 form!: FormGroup;
  companyId:any;
  showSpiner = true;

  constructor(
    private fb: FormBuilder,
    private api: AllApiService,
    private cdr: ChangeDetectorRef,
     private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.companyId = JSON.parse(localStorage.getItem('loggedUser') || '{}').companyId;
    this.createForm();
    this.getAllData();
  }

  private createForm(): void {
    this.form = this.fb.group({
      companyId: [this.companyId],
      screenId: [0],

      termAndConditionSale: [''],
      termAndConditionPurchase:[''],

      whatWeDoInSale: [''],
      descriptionSale: [''],


      whatWeDoInPurchase: [''],
      descriptionPurchase: [''],

      remarksSale: false,
      hsnSale: false,
      artSale: false,
      sizeSale: false,
      colorSale: false,
      pack1Sale: false,
      pack2Sale: false,
      mRateSale: false,

      remarksPurchase: false,
      hsnPurchase: false,
      artPurchase: false,
      sizePurchase: false,
      colorPurchase: false,
      pack1Purchase: false,
      pack2Purchase: false,
      mRatePurchase: false,

      barcodeSale: false,
      discPercentSale: false,
      discountSale: false,

      barcodePurchase: false,
      discPercentPurchase: false,
      discountPurchase: false
    });
  }

  getAllData(): void {
    this.api
      .getAllDataId(ApiUrl.listOfScreenManagement, this.companyId)
      .subscribe((res: any) => {

        if (res?.data?.length) {
          this.form.patchValue(res.data[0]);
        }

        this.cdr.detectChanges();
      });
  }

save(): void {
  if (this.form.invalid) return;

  this.showSpiner = true;

  const isEdit = !!this.form.value.screenId;

  const message = isEdit
    ? ' updated successfully'
    : ' added successfully';

  this.api
    .addEditData(ApiUrl.screenManagement, this.form.value)
    .subscribe({
      next: (res: any) => {
        this.showSpiner = false;

        if (res?.success) {
          this.snackBar.open(message, 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Failed to save group', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.showSpiner = false;
        this.snackBar.open(
          err?.error?.message || 'Failed to save group',
          'Close',
          { duration: 3000 }
        );
      }
    });
}


}
