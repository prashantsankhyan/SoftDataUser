import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AllApiService } from '../_core/_service/all-api.service';
import { ApiUrl } from '../_core/apiUrl';

@Component({
  selector: 'app-sub-login',
  imports: [
    RouterLink,
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './sub-login.html',
  styleUrl: './sub-login.scss',
})
export class SubLogin {

  form!: FormGroup;

  isLoading = false;
  companyLoading = false;

  // Company list
  companyList: any[] = [];

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


  // ============================================================
  // FORM
  // ============================================================

  private buildForm(): void {

    this.form = this.fb.group({

      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],

      companyId: [
        null,
        Validators.required
      ],

      username: [
        '',
        Validators.required
      ],

      password: [
        '',
        Validators.required
      ]

    });

  }


  // ============================================================
  // GET COMPANY LIST
  // ============================================================

  getCompanyId(): void {

    const phoneControl = this.form.get('phoneNumber');

    const phoneNumber = String(
      phoneControl?.value || ''
    ).trim();

    console.log('Phone Number:', phoneNumber);


    // ----------------------------------------------------------
    // Clear old company data
    // ----------------------------------------------------------

    this.companyList = [];

    this.form.get('companyId')?.setValue(null);

    this.form.get('companyId')?.markAsUntouched();

    this.form.get('companyId')?.updateValueAndValidity();


    // ----------------------------------------------------------
    // Validate phone
    // ----------------------------------------------------------

    if (!/^[0-9]{10}$/.test(phoneNumber)) {

      console.log('Invalid phone number');

      return;
    }


    // ----------------------------------------------------------
    // Start loading
    // ----------------------------------------------------------

    this.companyLoading = true;


    // ----------------------------------------------------------
    // API
    // ----------------------------------------------------------

    this.api
      .getAllDataId(
        ApiUrl.getCompanyByPhoneNumber,
        phoneNumber
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Company API Response:',
            res
          );


          this.companyLoading = false;


          // ----------------------------------------------------
          // No company
          // ----------------------------------------------------

          if (
            !res?.success ||
            !Array.isArray(res?.data) ||
            res.data.length === 0
          ) {

            this.companyList = [];

            this.form
              .get('companyId')
              ?.setValue(null);

            this.form
              .get('companyId')
              ?.updateValueAndValidity();

            this.snackBar.open(
              res?.message ||
              'No company found for this phone number.',
              'Close',
              {
                duration: 3000
              }
            );

            return;
          }


          // ----------------------------------------------------
          // Normalize API data
          // ----------------------------------------------------

          this.companyList = res.data.map(
            (company: any) => {

              return {
                id: Number(
                  company.id ??
                  company.Id ??
                  company.companyId ??
                  company.CompanyId
                ),

                companyName:
                  company.companyName ??
                  company.CompanyName ??
                  '',

                phoneNumber:
                  company.phoneNumber ??
                  company.PhoneNumber ??
                  ''
              };

            }
          );


          console.log(
            'Company List:',
            this.companyList
          );


          // ----------------------------------------------------
          // ONLY ONE COMPANY
          // ----------------------------------------------------

          if (this.companyList.length === 1) {

            const company =
              this.companyList[0];

            console.log(
              'One company found:',
              company
            );


            // Automatically select company
            this.form
              .get('companyId')
              ?.setValue(company.id);


            this.form
              .get('companyId')
              ?.updateValueAndValidity();


            console.log(
              'Auto Company ID:',
              this.form.get('companyId')?.value
            );


            console.log(
              'Company Control Valid:',
              this.form.get('companyId')?.valid
            );


            return;
          }


          // ----------------------------------------------------
          // MULTIPLE COMPANIES
          // ----------------------------------------------------

          if (this.companyList.length > 1) {

            console.log(
              'Multiple companies found.'
            );


            // IMPORTANT:
            // Don't automatically select anything.
            this.form
              .get('companyId')
              ?.setValue(null);


            this.form
              .get('companyId')
              ?.markAsUntouched();


            this.form
              .get('companyId')
              ?.updateValueAndValidity();


            return;
          }

        },


        // ======================================================
        // ERROR
        // ======================================================

        error: (error) => {

          this.companyLoading = false;

          console.error(
            'Company API Error:',
            error
          );


          this.companyList = [];


          this.form
            .get('companyId')
            ?.setValue(null);


          this.form
            .get('companyId')
            ?.updateValueAndValidity();


          this.snackBar.open(
            'Unable to fetch company details.',
            'Close',
            {
              duration: 3000
            }
          );

        }

      });

  }


  // ============================================================
  // COMPANY SELECT
  // ============================================================

  onCompanyChange(): void {

    const companyId =
      this.form.get('companyId')?.value;

    console.log(
      'Selected Company ID:',
      companyId
    );


    if (!companyId) {

      this.form
        .get('companyId')
        ?.setValue(null);

      return;
    }


    this.form
      .get('companyId')
      ?.updateValueAndValidity();


    const company =
      this.companyList.find(
        x => Number(x.id) === Number(companyId)
      );


    console.log(
      'Selected Company:',
      company
    );

  }


  // ============================================================
  // LOGIN
  // ============================================================

  onSubmit(): void {

    console.log(
      '=============================='
    );

    console.log(
      'SUBMIT FUNCTION CALLED'
    );

    console.log(
      'FORM VALUE:',
      this.form.value
    );

    console.log(
      'FORM VALID:',
      this.form.valid
    );

    console.log(
      'COMPANY ID:',
      this.form.get('companyId')?.value
    );


    // ----------------------------------------------------------
    // Validate form
    // ----------------------------------------------------------

    if (this.form.invalid) {

      console.log(
        'FORM INVALID'
      );

      this.form.markAllAsTouched();

      return;
    }


    // ----------------------------------------------------------
    // Start loading
    // ----------------------------------------------------------

    this.isLoading = true;


    console.log(
      'LOGIN REQUEST:',
      this.form.value
    );


    // ----------------------------------------------------------
    // Login API
    // ----------------------------------------------------------

    this.api
      .addEditData(
        ApiUrl.subUserLogin,
        this.form.value
      )
      .subscribe({

        next: (res: any) => {

          this.isLoading = false;


          console.log(
            'LOGIN RESPONSE:',
            res
          );


          if (res?.responseCode !== 1) {

            this.showError(
              res?.message ||
              'Invalid login credentials'
            );

            return;
          }


          // ----------------------------------------------------
          // Save user
          // ----------------------------------------------------

          localStorage.setItem(
            'loggedUser',
            JSON.stringify(res.data)
          );


          localStorage.setItem(
            'permissions',
            res.data.permissions
          );


          // ----------------------------------------------------
          // Dashboard
          // ----------------------------------------------------

          this.router.navigate([
            '/dashboard'
          ]);

        },


        error: (error) => {

          this.isLoading = false;


          console.error(
            'LOGIN ERROR:',
            error
          );


          this.showError(
            'Unable to login. Please try again.'
          );

        }

      });

  }


  // ============================================================
  // ERROR
  // ============================================================

  private showError(
    message: string = 'Invalid login credentials'
  ): void {

    this.form
      .get('password')
      ?.setErrors({
        invalid: true
      });


    this.snackBar.open(
      message,
      'Close',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    );

  }


  // ============================================================
  // FORM CONTROLS
  // ============================================================

  get f() {
    return this.form.controls;
  }

}