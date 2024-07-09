import { api } from 'lwc';
import ExtendaElement from 'c/extendaElement';
import StaticRes from "@salesforce/resourceUrl/writeExcelFile";
import { loadScript } from "lightning/platformResourceLoader";

export default class ExtendaExcelExport extends ExtendaElement {

    connectedCallback() {
        loadScript(this, StaticRes)// loads writeXlsxFile
        .catch(this.handleError)
    }


    @api
    exportWorkbook(tabs, filename = 'Salesforce-Export.xlsx') {
        const columns = tabs.map(t => t.columns)
        // eslint-disable-next-line no-undef
        return writeXlsxFile(tabs.map(t => t.rows), {
            columns: columns[0],
            fileName: filename,
            sheets: tabs.map(t => t.name),
        })
        .then(() => {
            this.toast({ title: 'Success', message: 'File created successfully', variant: 'success' })
        })
        .catch((e) => this.error(e))
    }

    demoTabs(){

        const columns = [
            {
              value: 'Name',
              fontWeight: 'bold'
            },
            {
              value: 'Date of Birth',
              fontWeight: 'bold'
            },
            {
              value: 'Cost',
              fontWeight: 'bold'
            },
            {
              value: 'Paid',
              fontWeight: 'bold'
            }
        ]
          
        const row = [
            // "Name"
            {
            type: String,
            value: 'John Smith'
            },
        
            // "Date of Birth"
            {
            type: Date,
            value: new Date(),
            format: 'mm/dd/yyyy'
            },
        
            // "Cost"
            {
            type: Number,
            value: 1800
            },
        
            // "Paid"
            {
            type: Boolean,
            value: true
            }
        ]
        
        const tabs = [
            columns,
            row,
            row,
            row,
        ]

        return tabs
    }
}