import { NgFor, NgStyle } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

export type Table ={
    [key: string]: string | number | null
}

@Component({imports:[NgFor, NgStyle],selector: 'app-table', standalone:true, templateUrl: './table.component.html', styleUrls: ['./table.component.scss'], changeDetection: ChangeDetectionStrategy.Default})
export class TableComponent implements OnInit, OnChanges{
    @Input() public tableData!: Table[];
    @Input() comparisonTable?: Table;

    public headers!: string[]
    public rows!: (string | number | null)[][]
    
    ngOnInit(): void {
        if(this.tableData){
            this.headers = Object.keys(this.tableData[0]);

            this.rows = this.tableData.map(x=>Object.values(x))
        }
    }

    ngOnChanges(): void {
        if(this.tableData){
            this.headers = Object.keys(this.tableData[0]);

            this.rows = this.tableData.map(x=>Object.values(x))
        }    }

    getColor(index: number, value: string | number | null){
        if(value && index>=18 && index<=22 && this.comparisonTable){
            const valuesArray = Object.values(this.comparisonTable);

            if(valuesArray[index] === value ){
                return 'green'
            }return 'red'
        }
        return 'white'
    }
}