import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-dailog-box',
  templateUrl: './dailog-box.component.html',
  styleUrls: ['./dailog-box.component.scss'],
})
export class DailogBoxComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DailogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
