import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { ClassicEditor, AccessibilityHelp, Alignment, Autosave, Bold, Essentials, Indent, IndentBlock, Italic, Link, 
        Paragraph, SelectAll, SpecialCharacters, Table, TableToolbar, Underline, Undo, type EditorConfig } from 'ckeditor5';
import translations from 'ckeditor5/translations/es.js';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdminService } from '../../../../servicios/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-lote',
  standalone: true,
  imports: [FormsModule, CommonModule, CKEditorModule],
  templateUrl: './crear-lote.component.html',
  styleUrl: '../../usuarios/usuarios.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CrearLoteComponent {
  datos:Array<any>=     ['','','ARS','','','','',[],[],true];
  alertas:Array<string>=['','',''   ,'','','','','','',''];
  sources: Array<any> = [];
  pdf:SafeResourceUrl|null=null;
  @Output() messageEvent = new EventEmitter<boolean>();
  @ViewChild('imagen') inputImagen!: ElementRef;
  @ViewChild('pdfTC') inputPDF!: ElementRef;

  cerrarModal() {
    this.datos=  ['','','ARS','','','','',[],[],true];
    this.alertas=['','',''   ,'','','','','',''];
    this.sources = [];
    this.pdf=null;
    this.inputImagen.nativeElement.value = "";
    this.inputPDF.nativeElement.value = "";
    this.messageEvent.emit(false);
  }

  constructor(private changeDetector: ChangeDetectorRef, private sanitizer: DomSanitizer, public api:AdminService) {}

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
    this.datos[7]=[];
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
          setTimeout(() => {
            const reader = new FileReader();
            reader.readAsDataURL(element.files![index]);

            reader.onloadend = ()=>{
              this.sources.push({id: (index+1), link: reader.result, name: element.files![index].name})
            }            
          }, index*200);
				}
			}			
      //this.datos[7]=Object.assign( { }, element.files)//element.files;
		}
	}

  transform(url: any) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

  showPDF(event: Event){
    this.pdf=null;
    this.datos[8]=[]
    const element = event.currentTarget as HTMLInputElement;    
    if(element.files?.length!=undefined && element.files?.length>0){ 
      this.pdf= this.transform(URL.createObjectURL(element.files[0]));
      this.datos[8]=element.files;
    }    
	}

  crearLote(){    
    let flag=true;
    for (let i = 0; i < this.datos.length; i++) {
      if(i!=5 && i!=6 && i!=7 &&  i!=9 && this.datos[i]=='') flag=false;
      this.alertas[i]= (i!=5 && i!=6 && i!=9 && this.datos[i]=='') ? 'Campo obligatorio' : '';
    }
    if(this.datos[8].length==0 || this.datos[7].length==0) flag=false;
    this.alertas[7]= this.datos[7].length==0 ? 'Campo obligatorio' : '';
    this.alertas[8]= this.pdf==null ? 'Campo obligatorio' : '';

    if(flag){
      const formData = new FormData();
      formData.append('titulo', this.datos[0]);
      formData.append('descripcion', this.datos[1]);
      formData.append('moneda', this.datos[2]);
      formData.append('precio_base', this.datos[3]);
      formData.append('incremento', this.datos[4]);
      formData.append('precio_salida', this.datos[5]);
      formData.append('aclaracion', this.datos[6]);
      formData.append('base_salida', this.datos[9]);
      formData.append('token', localStorage.getItem('token')!);
      formData.append('tipo', '1');
			for (let i = 0; i < this.datos[7].length; i++) {
				formData.append('img', this.datos[7][i]);  
        formData.append('imgOrden', this.sources[i].name);	
			}
      formData.append('pdf', this.datos[8][0]);

      this.api.crearLote(formData).then(resp =>{
        if(resp.ok){
          Swal.fire({title:'Lote creado con exito',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
        }else{
          Swal.fire({title:resp.msg,confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
        }
        this.cerrarModal();
      }, (err)=>{				
        Swal.fire({title:'Ocurrio un error',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        this.cerrarModal();
      });
    }
  }

  cambiarOrden(id:number){
    let index=id-1
    let link=this.sources[index].link;
    let name=this.sources[index].name;

    if(id==this.sources.length){
      this.sources[index].link=this.sources[0].link;
      this.sources[0].link=link;
      this.sources[index].name=this.sources[0].name;
      this.sources[0].name=name;
    }else{
      this.sources[index].link=this.sources[id].link;
      this.sources[id].link=link;
      this.sources[index].name=this.sources[id].name;
      this.sources[id].name=name;
    }
  }
}