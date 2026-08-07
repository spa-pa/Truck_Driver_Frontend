import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }

    exportAsExcelFile(data: any[], excelFileName: string, keys: { [key: string]: string }): void {
        const headers = this.getHeaders(keys);
        const filteredData = this.filterData(data, keys);
        const worksheetData = [headers, ...filteredData];
        const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const columnWidths = this.getColumnWidths([headers, ...filteredData]);
        worksheet['!cols'] = columnWidths;
        this.wrapTextInWorksheet(worksheet);

        const workbook: XLSX.WorkBook = {
            Sheets: { 'data': worksheet },
            SheetNames: ['data']
        };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private getHeaders(keys: { [key: string]: string }): string[] {
        return Object.values(keys);
    }

    private filterData(data: any[], keys: { [key: string]: string }): any[] {
        return data.map(item => {
            const filteredItem: any = [];
            Object.keys(keys).forEach(key => {
                let value = item[key];
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                filteredItem.push(value);
            });
            return filteredItem;
        });
    }

    private getColumnWidths(data: any[][]): any[] {
        const MAX_WIDTH = 30; 
        return data[0].map((col, index) => {
            const maxLength = data.reduce((acc, row) => {
                const cellLength = row[index] ? row[index].toString().length : 0;
                return Math.min(Math.max(acc, cellLength), MAX_WIDTH);
            }, 0);
            return { wch: maxLength };
        });
    }

    private wrapTextInWorksheet(worksheet: XLSX.WorkSheet): void {
        const range = XLSX.utils.decode_range(worksheet['!ref'] as string);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = { c: C, r: R };
                const cellRef = XLSX.utils.encode_cell(cellAddress);
                if (!worksheet[cellRef]) continue;
                if (!worksheet[cellRef].s) worksheet[cellRef].s = {};
                worksheet[cellRef].s.alignment = { wrapText: true };
            }
        }
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    // Function to export base64 data with styled headers
    async exportFromBase64(base64Data: string, excelFileName: string): Promise<void> {
        const binaryData = this.base64ToArrayBuffer(base64Data);

        // Create a new workbook and load the data
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(binaryData);

        // const worksheet = workbook.worksheets[0]; // Assuming you want the first sheet

        // Style the header row
        // this.styleHeaderRow(worksheet, headersToStyle);

        // Create buffer and save the file
        const excelBuffer = await workbook.xlsx.writeBuffer();
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    // Function to convert base64 string to ArrayBuffer
    private base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // Function to style the header row
    private styleHeaderRow(worksheet: ExcelJS.Worksheet, headersToStyle: string[]): void {
        // Get the first row (header row)
        const headerRow = worksheet.getRow(1);

        // Normalize headersToStyle array to handle case insensitivity
        const normalizedHeadersToStyle = headersToStyle.map(header => header.trim().toLowerCase());

        // Loop through each cell in the header row
        headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const headerText = cell.text.trim().toLowerCase(); // Normalize header text

            if (normalizedHeadersToStyle.includes(headerText)) {
                // Style headers that are in the headersToStyle array
                cell.font = { 
                    bold: true, 
                    color: { argb: 'FF0000' }, // Red text
                    size: 11 
                };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFF' } // White background
                };
            } 
            // else {
            //     // Style headers not in the headersToStyle array
            //     cell.font = {
            //         color: { argb: '000000' }, // Black text
            //         size: 11
            //     };
            //     cell.fill = {
            //         type: 'pattern',
            //         pattern: 'solid',
            //         fgColor: { argb: 'FFFFFF' } // White background
            //     };
            // }
            cell.alignment = { horizontal: 'center' }; // Apply alignment to all headers
        });
    }
    
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
