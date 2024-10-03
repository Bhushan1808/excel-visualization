import { Component } from '@angular/core';
import { DataService } from './services/data-service.service';
import { FormControl } from '@angular/forms';
import { Table } from './components/table-component/table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'exel-visualization';
  public value1!: number;
  public value2!: number[];
  public value3!: number;

  public cb1=true;
  public cb2=false;

  public response1!: Table[];
  public response2!: Table[];
  public response3!: Table[];
  public response3TempVariable!: Table[];

  public listEqs: any;

  public formControl1 = new FormControl<number | null>(null)
  public formControl2 = new FormControl<string | null>(null)
  public formControl3 = new FormControl<number| null>(null)
  public singleSearch = new FormControl<string| null>(null)

  public showSearchBoxForSingleSearch = false;


  constructor(private dataService: DataService) {}

  ngOnInit(){
    this.formControl1.valueChanges.subscribe(r=>{
      if(r)
      this.value1 = r
    })

    this.formControl2.valueChanges.subscribe(r=>{
      if(r)
        this.value2 = r.replaceAll(' ', ',').split(',').filter(x=> !Number.isNaN(x)).map(x=> parseInt(x))
    })

    this.formControl3.valueChanges.subscribe(r=>{
      if(r)
        this.value3 = r
    })
  }

  submit(){
    this.dataService.getByMaterialNo(this.value3).subscribe((r: any) => {
      this.response3=r;
      this.response3TempVariable = r;
      this.listEqs = JSON.stringify(r.map((x: any)=>x.EquipmentNumber));
    });    
  }

  singleMachineSearch(){
    this.dataService.getByEquipmentNo(this.value1).subscribe((r: any) => {
      this.response1=r;
    });    

    this.dataService.getByMultipleEquipmentNoSap([this.value1]).subscribe((r:any)=>{
      this.value3 = parseInt(r[0].Materialnummer);
      this.submit();
    })

    
  }

  allMachines(){
    this.cb1 = true;
    this.response3 = this.response3TempVariable;
  }

  specificMachine(){
    this.showSearchBoxForSingleSearch = !this.showSearchBoxForSingleSearch;
  }

  filterSingleMachine(){
    this.cb1 = false;
    this.cb2=true;
    this.response1 = this.response3.filter((m) =>this.singleSearch.value === m['EquipmentNumber']);
  }
}

