import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
@Component({
  selector: 'app-confirm-item-delete',
  imports: [CommonModule,MaterialModule],
  templateUrl: './confirm-item-delete.html',
  styleUrl: './confirm-item-delete.scss',
})
export class ConfirmItemDelete {
  constructor(
    private dialogRef: MatDialogRef<ConfirmItemDelete>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
