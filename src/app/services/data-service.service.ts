import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http"

@Injectable({providedIn: 'root'})
export class DataService{

    private readonly url = 'http://localhost:3000/api/'

    constructor(private http: HttpClient) {}

    public getByEquipmentNo(equipmentNumber: number){
        return this.http.get(`${this.url}kommissionen`,{params: {EquipmentNumber: [equipmentNumber]}})
    }

    public getByMultipleEquipmentNoSap(equipmentNumbers: number[]){
        return this.http.get(`${this.url}sap`, {params: {EquipmentNumber: equipmentNumbers}})
    }

    public getByMultipleEquipmentNo(equipmentNumbers: number[]){
        return this.http.get(`${this.url}multi-eq`, {params: {EquipmentNumber: equipmentNumbers}})
    }

    public getByMaterialNo(materialNumber: number){
        return this.http.get(`${this.url}sap-material`, {params: {MaterialNumber: materialNumber.toString()}})
    }
}