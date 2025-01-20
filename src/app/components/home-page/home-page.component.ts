import { Component } from '@angular/core';
import { Table } from '../table-component/table.component';
import { FormControl } from '@angular/forms';
import { DataService } from 'src/app/services/data-service.service';
import { retry } from 'rxjs';

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

  public matchedEQMachineTable: any[] = [];

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

  copyContent() {
    const content = this.matchedEQMachineTable.join(', '); // Join all entries with a comma
    navigator.clipboard
      .writeText(content)
      .then(() => {
        alert('Content copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy content: ', err);
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

  public checkBoxLabel = [
    { title: 'SPS allgemein', checked: false, id: 1 },
    { title: 'SPS extruder', checked: false, id: 2 },
    { title: 'SPS blaskopf', checked: false, id: 3 },
    { title: 'krob', checked: false, id: 4 },
    { title: 'abzug', checked: false, id: 5 },
  ];

  submit() {
    this.dataService.getByMaterialNo(this.value3).subscribe((r: any) => {
      this.response3 = r;
      this.filteredResponse3 = r;
      this.filteredResponse3 = this.filteredResponse3.filter((value) => {
        const fieldsToCheck = [
          'sps - allgemein',
          'sps - extruder',
          'sps - blaskopf',
          'krob',
          'abzug',
        ];
        return fieldsToCheck.some(
          (field) => value[field] === this.response1[0][field]
        );
      });
      this.response3 = this.filteredResponse3;
      this.rDropdown = this.getUniqueValues('sps - allgemein');
      this.sDropdown = this.getUniqueValues('sps - extruder');
      this.tDropdown = this.getUniqueValues('sps - blaskopf');
      this.uDropdown = this.getUniqueValues('krob');
      this.vDropdown = this.getUniqueValues('abzug');
      this.response3TempVariable = r;
      this.listEqs = JSON.stringify(r.map((x: any) => x.EquipmentNumber));
    });
  }

  filterMatchedMachine() {
    const selectedBox: number[] = [];

    console.log(this.checkBoxLabel);
    // Collect selected checkboxes
    this.checkBoxLabel.forEach((check) => {
      if (check.checked) {
        selectedBox.push(check.id);
      }
    });

    console.log('Selected Checkboxes:', selectedBox);

    // Filter data from response3 based on selected checkboxes using AND operation
    let filteredData = [...this.response3];

    selectedBox.forEach((id) => {
      filteredData = filteredData.filter((item3) => {
        return this.response1.some((item1) => {
          switch (id) {
            case 1:
              return item1['sps - allgemein'] === item3['sps - allgemein'];
            case 2:
              return item1['sps - extruder'] === item3['sps - extruder'];
            case 3:
              return item1['sps - blaskopf'] === item3['sps - blaskopf'];
            case 4:
              return item1['krob'] === item3['krob'];
            case 5:
              return item1['abzug'] === item3['abzug'];
            default:
              return false;
          }
        });
      });
    });

    // Assign the filtered data to matchedEQMachineTable
    this.matchedEQMachineTable = filteredData.map(
      (value) => value['EquipmentNumber']
    );
    console.log(this.matchedEQMachineTable);
  }

  // Add similar blocks for other checkbox IDs if neede
  // filterMatchedMachine() {
  //   const selectedBox: number[] = [];
  //   this.checkBoxLabel.map((check) => {
  //     if (check.checked === true && check.id === 1) {
  //       selectedBox.push(1);
  //     }
  //     if (check.checked === true && check.id === 2) {
  //       selectedBox.push(2);
  //     }
  //     if (check.checked === true && check.id === 3) {
  //       selectedBox.push(3);
  //     }
  //     if (check.checked === true && check.id === 4) {
  //       selectedBox.push(4);
  //     }
  //     if (check.checked === true && check.id === 5) {
  //       selectedBox.push(5);
  //     }
  //   });
  //   selectedBox.map((value) => {
  //     if (value === 1) {
  //       this.response1.some((item) =>
  //         this.response3.map(
  //           (value) => value['sps - allgemein'] === item['sps - allgemein']
  //         )
  //       );
  //     }
  //   });
  // }

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
