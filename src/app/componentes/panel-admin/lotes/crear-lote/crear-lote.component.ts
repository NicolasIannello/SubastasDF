import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { ClassicEditor, AccessibilityHelp, Alignment, Autosave, Bold, Essentials, Indent, IndentBlock, Italic, Link, 
        Paragraph, SelectAll, SpecialCharacters, Table, TableToolbar, Underline, Undo, type EditorConfig } from 'ckeditor5';
import translations from 'ckeditor5/translations/es.js';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-crear-lote',
  standalone: true,
  imports: [FormsModule, CommonModule, CKEditorModule],
  templateUrl: './crear-lote.component.html',
  styleUrl: '../../usuarios/usuarios.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CrearLoteComponent {
  datos:Array<any>=     ['','','ars','','','','',[],[]];
  alertas:Array<string>=['','',''   ,'','','','','',''];
  sources: Array<any> = [];
  pdf:SafeResourceUrl|null=null;

  constructor(private changeDetector: ChangeDetectorRef, private sanitizer: DomSanitizer) {}

  public isLayoutReady = false;
	public Editor = ClassicEditor;
	public config: EditorConfig = {};
	public ngAfterViewInit(): void {
		this.config = {
			toolbar: {
				items: [ 'undo', 'redo',	'|', 'bold', 'italic', 'underline',	'|', 'specialCharacters', 'link', 'insertTable', '|', 'alignment', '|', 'outdent', 'indent' ],
				shouldNotGroupWhenFull: false
			},
			plugins: [ AccessibilityHelp, Alignment, Autosave, Bold, Essentials, Indent, IndentBlock, Italic, Link, Paragraph, SelectAll, SpecialCharacters, Table, TableToolbar, Underline, Undo ],
			initialData: this.datos[1],
			language: 'es',
			link: {
				addTargetToExternalLinks: true,
				defaultProtocol: 'https://',
				decorators: { toggleDownloadable: { mode: 'manual', label: 'Downloadable', attributes: { download: 'file' } } }
			},
			placeholder: 'Descripcion',
			table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'] },
			translations: [translations]
		};
		this.isLayoutReady = true;
		this.changeDetector.detectChanges();
	}

  showImg(event: Event){
		this.sources=[];
    const element = event.currentTarget as HTMLInputElement;
		let cantidad = element.files?.length || 0;    
		this.datos[7]=element.files;
    
		if(cantidad==0) {
			this.sources=[];
		}else{
			for (let index = 0; index < cantidad; index++) {
				var nombreCortado=element.files![index].name.split('.');
				var extensionArchivo=nombreCortado[nombreCortado.length-1];
				
				if(extensionArchivo!="pdf"){
					const reader = new FileReader();
					reader.readAsDataURL(element.files![index]);

					reader.onloadend = ()=>{
						this.sources.push({id: (index+1), link: reader.result})
					}
				}
			}			
		}
	}

  transform(url: any) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

  showPDF(event: Event){
    this.pdf=null;
    const element = event.currentTarget as HTMLInputElement;    
    if(element.files?.length!=undefined && element.files?.length>0) this.pdf= this.transform(URL.createObjectURL(element.files[0]));    
	}

}