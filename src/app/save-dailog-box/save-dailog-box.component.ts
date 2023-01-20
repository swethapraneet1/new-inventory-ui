import { Component, OnInit,Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
export interface DialogData {
  name: string;
}


@Component({
  selector: 'app-save-dailog-box',
  templateUrl: './save-dailog-box.component.html',
  styleUrls: ['./save-dailog-box.component.scss']
})
export class SaveDailogBoxComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SaveDailogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}
  onNoClick(): void {
    this.dialogRef.close();
  }

}
