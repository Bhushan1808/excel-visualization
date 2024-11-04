import { Component } from '@angular/core';
import { Table } from '../table-component/table.component';
import { FormControl } from '@angular/forms';
import { DataService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  title = 'exel-visualization';
  public value1!: number;
  public value2!: number[];
  public value3!: number;

  public dropdownOptions = [];

  public cb1 = true;
  public cb2 = false;

  public response1!: Table[];
  public response2!: Table[];
  public response3!: Table[];
  public response3TempVariable!: Table[];
  public rDropdown!: any[];
  public sDropdown!: any[];
  public tDropdown!: any[];
  public uDropdown!: any[];
  public vDropdown!: any[];
  public filteredResponse3!: Table[];

  public selectedR: string = 'all';
  public selectedS: string = 'all';
  public selectedT: string = 'all';
  public selectedU: string = 'all';
  public selectedV: string = 'all';

  public listEqs: any;

  public formControl1 = new FormControl<number | null>(null);
  public formControl2 = new FormControl<string | null>(null);
  public formControl3 = new FormControl<number | null>(null);
  public singleSearch = new FormControl<string | null>(null);

  public showSearchBoxForSingleSearch = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.formControl1.valueChanges.subscribe((r) => {
      if (r) this.value1 = r;
    });

    this.formControl2.valueChanges.subscribe((r) => {
      if (r)
        this.value2 = r
          .replaceAll(' ', ',')
          .split(',')
          .filter((x) => !Number.isNaN(x))
          .map((x) => parseInt(x));
    });

    this.formControl3.valueChanges.subscribe((r) => {
      if (r) this.value3 = r;
    });
  }

  onSelectChange() {
    this.filteredResponse3 = this.response3.filter((item) => {
      return (
        (this.selectedR === 'all' ||
          item['sps - allgemein'] === this.selectedR) &&
        (this.selectedS === 'all' ||
          item['sps - extruder'] === this.selectedS) &&
        (this.selectedT === 'all' ||
          item['sps - blaskopf'] === this.selectedT) &&
        (this.selectedU === 'all' || item['krob'] === this.selectedU) &&
        (this.selectedV === 'all' || item['abzug'] === this.selectedV)
      );
    });
  }

  public resetFilters() {
    this.filteredResponse3 = this.response3;
  }

  submit() {
    this.dataService.getByMaterialNo(this.value3).subscribe((r: any) => {
      this.response3 = r;
      this.filteredResponse3 = r;

      console.log(this.response3);
      this.rDropdown = this.getUniqueValues('sps - allgemein');
      this.sDropdown = this.getUniqueValues('sps - extruder');
      this.tDropdown = this.getUniqueValues('sps - blaskopf');
      this.uDropdown = this.getUniqueValues('krob');
      this.vDropdown = this.getUniqueValues('abzug');
      console.log(
        this.rDropdown,
        this.sDropdown,
        this.tDropdown,
        this.uDropdown,
        this.vDropdown
      );
      this.response3TempVariable = r;
      this.listEqs = JSON.stringify(r.map((x: any) => x.EquipmentNumber));
    });
  }

  singleMachineSearch() {
    this.dataService.getByEquipmentNo(this.value1).subscribe((r: any) => {
      this.response1 = r;
    });

    this.dataService
      .getByMultipleEquipmentNoSap([this.value1])
      .subscribe((r: any) => {
        this.value3 = parseInt(r[0].Materialnummer);
        this.submit();
      });
  }

  allMachines() {
    this.cb1 = true;
    this.response3 = this.response3TempVariable;
  }

  specificMachine() {
    this.showSearchBoxForSingleSearch = !this.showSearchBoxForSingleSearch;
  }

  filterSingleMachine() {
    this.cb1 = false;
    this.cb2 = true;
    this.response1 = this.response3.filter(
      (m) => this.singleSearch.value === m['EquipmentNumber']
    );
  }

  private getUniqueValues(property: string): (string | number | null)[] {
    return Array.from(
      new Set(
        this.response3
          .map((value) => value[property])
          .filter((value) => value !== null) // Remove null values
      )
    );
  }
}
