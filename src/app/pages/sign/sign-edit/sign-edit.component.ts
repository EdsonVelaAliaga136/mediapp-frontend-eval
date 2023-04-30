import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { SignService } from 'src/app/service/sign.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from 'src/app/model/patient';
import { switchMap } from 'rxjs';
import { Sign } from 'src/app/model/sign';
import { PatientService } from 'src/app/service/patient.service';


@Component({
  selector: 'app-sign-edit',
  templateUrl: './sign-edit.component.html',
  styleUrls: ['./sign-edit.component.css']
})
export class SignEditComponent implements OnInit{

  id: number;
  isEdit: boolean;
  form: FormGroup;

  patients: Patient[];
  minDate: Date = new Date();

  constructor(
    private patientService: PatientService,
    private signService: SignService,
    private route: ActivatedRoute,
    private router: Router
  ){
  }

  ngOnInit(): void {

    this.loadInitialData();

    this.form = new FormGroup({
      idSign: new FormControl(0),
      date: new FormControl(new Date()),
      temperature: new FormControl(''),
      pulse: new FormControl(''),
      respiratoryRate: new FormControl(''),
      patient : new FormControl(),
    });

    this.route.params.subscribe( data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });


  }
  loadInitialData(){
    this.patientService.findAll().subscribe(data => this.patients = data);
  }


  initForm(){
      if(this.isEdit){
        this.signService.findById(this.id).subscribe(data => {
          const selectedPatient = this.patients.find(patient => patient.idPatient === data.patient.idPatient);
          this.form = new FormGroup({
            idSign: new FormControl(data.idSign),
            date: new FormControl(data.date),
            temperature: new FormControl(data.temperature),
            pulse: new FormControl(data.pulse),
            respiratoryRate: new FormControl(data.respiratoryRate),
            patient: new FormControl(selectedPatient),
          });
        });
      }
  }

  operate(){

    if(this.form.invalid){
      return;
    }

    const sign = new Sign();
    sign.idSign = this.form.value['idSign'];
    sign.date = this.form.value['date'];
    sign.temperature = this.form.value['temperature'];
    sign.pulse = this.form.value['pulse'];
    sign.respiratoryRate = this.form.value['respiratoryRate'];
    sign.patient = this.form.value['patient'];

    if(this.isEdit){
      this.signService.update(sign, this.id).subscribe(data => {
        this.signService.findAll().subscribe(data => {
          this.signService.setSignChange(data);
          this.signService.setMessageChange("UPDATED!");
        });
      });
    }else{
      this.signService.save(sign).pipe(switchMap( ()=> {
        return this.signService.findAll();
      }))
      .subscribe(data => {
        this.signService.setSignChange(data);
        this.signService.setMessageChange("CREATED!");
      });
    }

    this.router.navigate(['/pages/sign']);
  }

  get f(){
    return this.form.controls;
  }

}
