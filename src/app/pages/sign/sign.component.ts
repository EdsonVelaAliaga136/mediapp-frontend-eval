import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SignService } from 'src/app/service/sign.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sign } from 'src/app/model/sign';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})

export class SignComponent implements OnInit{
  displayedColumns: string[] = ['id', 'date', 'temperature', 'pulse', 'respiratoryRate', 'patient', 'actions'];
  dataSource: MatTableDataSource<Sign>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number;

  constructor(
    private route: ActivatedRoute,
    private signService: SignService,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe
    ){
  }

  ngOnInit(): void {

    this.signService.getSignChange().subscribe(data => {
      this.createTable(data);
    });

    this.signService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
    });

    this.signService.listPageable(0, 2).subscribe(data => {
      this.createTable(data);
    });

  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim();
  }

  createTable(data: any){
    this.dataSource = new MatTableDataSource(data.content);
    this.totalElements = data.totalElements;
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  delete(idSign: number){
    this.signService.delete(idSign).pipe(switchMap( ()=>{
      return this.signService.findAll();
    }))
    .subscribe(data => {
      this.signService.setSignChange(data);
      this.signService.setMessageChange("DELETED!");
    });
    ;
  }

  showMore(e: any){
    this.signService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.createTable(data);
    });
  }

  get router(): ActivatedRoute {
    return this.route;
  }

}
