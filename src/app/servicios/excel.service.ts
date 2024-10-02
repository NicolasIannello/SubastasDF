import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  generateExcel(data: any[], fileName: string): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    let headers=["Nombre", "E-mail", "CUIL / CUIT", "Telefono", "Habilitado", "Validado", "Ultima conexion", "Persona responsable"]
    let letras= [...Array(26)].map((_, i) => String.fromCharCode(i + 65));
    
    worksheet.addRow(headers);
    for (let i = 0; i < data.length; i++) {
      let row:Array<any>=[];
      row.push(data[i].nombre)
      row.push(data[i].mail)
      row.push(data[i].cuil_cuit)
      row.push(data[i].telefono)
      row.push(data[i].habilitado ? "Habiliado":"Deshabiliado")      
      row.push(data[i].validado ? "Validado":"Invalidado")
      row.push(data[i].ultima_conexion)
      if(data[i].dato_empresa)row.push(data[i].dato_empresa.persona_responsable)
        
      worksheet.addRow(row);
    }

    for (let i = 0; i < headers.length; i++) {
      worksheet.getCell(letras[i]+"1").font = { bold: true, size: 12 };
      worksheet.getCell(letras[i]+"1").fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '6FA8DC' } };
      worksheet.getCell(letras[i]+"1").alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getCell(letras[i]+"1").border = { top: { style: 'thin' },left: { style: 'thin' },bottom: { style: 'thin' },right: { style: 'thin' } };;
      worksheet.getColumn(i+1).width = 30;
    }

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }

  generarLote(data: any[], fileName: string): void {
    
  }
}

