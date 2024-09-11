import { NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

export type Table ={
    [key: string]: string | number | null
}

@Component({imports:[NgFor],selector: 'app-table', standalone:true, templateUrl: './table.component.html', styleUrls: ['./table.component.scss'], changeDetection: ChangeDetectionStrategy.Default})
export class TableComponent implements OnInit, OnChanges{
    @Input() public tableData!: Table[];

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
}