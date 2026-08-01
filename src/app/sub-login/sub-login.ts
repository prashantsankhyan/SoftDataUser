import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AllApiService } from '../_core/_service/all-api.service';
import { ApiUrl } from '../_core/apiUrl';

@Component({
  selector: 'app-sub-login',
  imports: [RouterLink,CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './sub-login.html',
  styleUrl: './sub-login.scss',
})
export class SubLogin {

  form!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private api: AllApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Clear previous login data
    localStorage.clear();
    this.buildForm();
  }

getCompanyId(): void {

  const phoneNumber = this.form.get('phoneNumber')?.value;

  if (!phoneNumber || phoneNumber.length !== 10) {
    return;
  }

  this.api.getAllDataId(ApiUrl.getCompanyByPhoneNumber,phoneNumber
  ).subscribe({
    next: (res: any) => {

      if (res.success) {

        this.form.patchValue({
          companyId: res.companyId
        });

      } else {

        this.form.patchValue({
          companyId: ''
        });

        this.snackBar.open(res.message, 'Close', {
          duration: 3000
        });
      }

    },
    error: () => {

      this.form.patchValue({
        companyId: ''
      });

      this.snackBar.open('Unable to fetch Company ID', 'Close', {
        duration: 3000
      });

    }
  });

}
  private buildForm(): void {
    this.form = this.fb.group({
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)]
      ],
      companyId: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.api.addEditData(ApiUrl.subUserLogin, this.form.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res?.responseCode !== 1) {
          this.showError(res?.message);
          return;
        }

        // ✅ Save logged-in sub user data
        localStorage.setItem('loggedUser', JSON.stringify(res.data));
        localStorage.setItem('permissions', res.data.permissions);

        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        this.showError();
      }
    });
  }

  private showError(message: string = 'Invalid login credentials'): void {
    this.form.get('password')?.setErrors({ invalid: true });

    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  get f() {
    return this.form.controls;
  }
}
