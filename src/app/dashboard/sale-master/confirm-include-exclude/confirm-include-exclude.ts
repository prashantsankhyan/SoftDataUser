import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-confirm-include-exclude',
  imports: [MaterialModule],
  templateUrl: './confirm-include-exclude.html',
  styleUrl: './confirm-include-exclude.scss',
})
export class ConfirmIncludeExclude {
constructor(
    private dialogRef: MatDialogRef<ConfirmIncludeExclude>,
    @Inject(MAT_DIALOG_DATA) public data: { value: boolean }
  ) {}

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
