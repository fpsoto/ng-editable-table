import { Component, OnInit, Input } from '@angular/core';
import { TableRow } from '../util/table-row';
import { TableCell } from '../util/table-cell';

@Component({
  selector: 'nv-editable-table',
  template: `
              <table class="{{class}}">
              <thead>
                <tr>
                  <th *ngFor="let title of tableHeadersObjects">{{title.content}}</th>
                  <th *ngIf="canEditRows||canDeleteRows"></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of tableRowsObjects">
                  <td *ngFor="let cell of row.cells">
                    <span *ngIf="isEditing.indexOf(row) === -1">{{cell.content}}</span>
                    <div class="ui input" *ngIf="!(isEditing.indexOf(row) == -1)">
                      <input type="text" [(ngModel)]="cell.content" [name]="cell.content">
                    </div>
                  </td>
                  <td *ngIf="canEditRows||canDeleteRows">
                    <button *ngIf="isEditing.indexOf(row) === -1 && canEditRows" (click)="editRow(row)">Edit</button>
                    <button *ngIf="!(isEditing.indexOf(row) == -1) && canEditRows" (click)="cancelEditing(row)">Ok</button>
                    <button *ngIf="canDeleteRows" (click)="deleteRow(row)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <button (click)="addRow()" *ngIf="canAddRows">Add</button>
  `
})
export class EditableTableComponent implements OnInit {

  @Input('table-headers') tableHeaders: string[] = [];
  @Input('table-rows') tableRows: string[][] = [];
  @Input('can-delete-rows') canDeleteRows = true;
  @Input('can-edit-rows') canEditRows = true;
  @Input('can-add-rows') canAddRows = true;
  @Input('class') class: string;

  tableHeadersObjects: TableCell[] = [];
  tableRowsObjects: TableRow[] = [];

  isEditing: TableRow[] = [];

  constructor() {
  }

  ngOnInit() {
    for (const obj of this.tableHeaders) {
      this.tableHeadersObjects.push(
        new TableCell(obj)
      );
    }

    let tableCells: TableCell[] = [];

    for (const row of this.tableRows) {
      for (const cell of row) {
        tableCells.push(
          new TableCell(cell),
        );
      }
      this.tableRowsObjects.push(new TableRow(tableCells));
      tableCells = [];
    }
  }

  addRow() {
    const newCells: TableCell[] = [];
    let newRow: TableRow;
    for (let i = 0; i < this.tableHeadersObjects.length; i++) {
      newCells.push(new TableCell(''));
    }

    this.tableRowsObjects.push(
      newRow = new TableRow(newCells)
    );

    this.isEditing.push(newRow);
  }

  editRow(selectedRow: TableRow) {
    this.isEditing.push(selectedRow);
  }

  cancelEditing(selectedRow: TableRow) {
    this.isEditing = this.isEditing.filter(temporalRow => temporalRow !== selectedRow);
  }

  deleteRow(selectedRow: TableRow) {
    this.isEditing = this.isEditing.filter(temporalRow => temporalRow !== selectedRow);
    this.tableRowsObjects = this.tableRowsObjects.filter(temporalRow => temporalRow !== selectedRow);
  }
}
