import { Patient } from "./patient";

export class Sign{
  idSign: number;
  date: string;
  temperature: string;
  pulse: string;
  respiratoryRate: string;
  patient: Patient;
}
