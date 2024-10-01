import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ServiciosService } from '../../../../servicios/servicios.service';
import { SanitizeHtmlPipe } from "../../../../servicios/html.pipe";
import { CommonModule } from '@angular/common';
import { VerImagenComponent } from '../../../ver-imagen/ver-imagen.component';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ClassicEditor, AccessibilityHelp, Alignment, Autosave, Bold, Essentials, Indent, IndentBlock, Italic, Link, 
  Paragraph, SelectAll, SpecialCharacters, Table, TableToolbar, Underline, Undo, type EditorConfig } from 'ckeditor5';
import translations from 'ckeditor5/translations/es.js';
import Swal from 'sweetalert2';
import { AdminService } from '../../../../servicios/admin.service';


@Component({
  selector: 'app-editar-lote',
  standalone: true,
  imports: [SanitizeHtmlPipe, CommonModule, VerImagenComponent, FormsModule, CKEditorModule],
  templateUrl: './editar-lote.component.html',
  styleUrl: '../../usuarios/usuarios.component.css'
})
export class EditarLoteComponent{
  @Output() messageEvent = new EventEmitter<boolean>();
  @Input() lote:{[key: string]: any}={descripcion:''};
  imagenes: Array<{link:SafeResourceUrl,id:number}> = [];
  pdf:SafeResourceUrl|null=null;
  verImg:boolean=false;
  imgID:number=-1;
  loteNuevo:{[key: string]: any}={descripcion:''}
  alertas:Array<string>=['','','',''];
  sources: Array<any> = [];
  imgs: any = [];
  pdfFile: any = [];
  pdfNuevo:SafeResourceUrl|null=null;
  @ViewChild('imagen') inputImagen!: ElementRef;
  @ViewChild('pdfTC') inputPDF!: ElementRef;

  constructor(private changeDetector: ChangeDetectorRef, private sanitizer: DomSanitizer, public api:ServiciosService, public apiAdmin:AdminService) {}

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
			initialData: '',
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

  transform(url: any) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

  handleMessage(message: boolean, tipo:string) {    
    this.verImg=message;
  }

  cerrarModal() {
    this.imagenes=[];
    this.pdf=null;
    this.loteNuevo={descripcion:''};
    this.pdfFile=[];
    this.pdfNuevo=null;
    this.imgs=[];
    this.sources=[];
    this.alertas=['','',''   ,'','','','','',''];
    this.inputImagen.nativeElement.value = "";
    this.inputPDF.nativeElement.value = "";
    this.messageEvent.emit(false);
  }

  cargarImagenes(imgs:Array<any>, pdf:any){
    this.imagenes=[];
    this.pdf=null;
    let index=1        
    for (let i = 0; i < imgs.length; i++) {      
      this.api.cargarArchivo(imgs[i].img,'lotes').then(resp=>{						
        if(resp!=false){
          this.imagenes.push({link:resp.url, id:index});
          index++;
        }
      })
    }    
    this.api.cargarArchivo(pdf.pdf,'pdfs').then(resp=>{
      this.loteNuevo= Object.assign( { }, this.lote);
      if(resp!=false){
        this.pdf=this.transform(resp.url);
      }
    })
  }

  verImagen(id:number){
    this.verImg=true;
    this.imgID=(id-1);    
  }

  showImg(event: Event){
		this.sources=[];
    this.imgs=[];
    const element = event.currentTarget as HTMLInputElement;
		let cantidad = element.files?.length || 0;    
		this.imgs=element.files;
    
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
      this.imgs=element.files;
		}
	}

  showPDF(event: Event){
    this.pdfNuevo=null;
    this.pdfFile=[]
    const element = event.currentTarget as HTMLInputElement;    
    if(element.files?.length!=undefined && element.files?.length>0){ 
      this.pdfNuevo= this.transform(URL.createObjectURL(element.files[0]));
      this.pdfFile=element.files;
    }    
	}

  actualizar(){    
    if(this.loteNuevo['titulo']=='' || this.loteNuevo['descripcion']=='' || this.loteNuevo['precio_base']=='null' || this.loteNuevo['incremento']=='null'){
      this.alertas[0]=this.loteNuevo['titulo']=='' ? 'El campo es obligatorio' : '';
      this.alertas[1]=this.loteNuevo['descripcion']=='' ? 'El campo es obligatorio' : '';
      this.alertas[2]=this.loteNuevo['precio_base']=='null' ? 'El campo es obligatorio' : '';
      this.alertas[3]=this.loteNuevo['incremento']=='null' ? 'El campo es obligatorio' : '';      
      Swal.fire({title:'Hay campos que no pueden estar vacios',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
    }else{
      const formData = new FormData();
      formData.append('aclaracion', this.loteNuevo['aclaracion']);
      formData.append('descripcion', this.loteNuevo['descripcion']);
      formData.append('incremento', this.loteNuevo['incremento']);
      formData.append('moneda', this.loteNuevo['moneda']);
      formData.append('precio_base', this.loteNuevo['precio_base']);
      formData.append('precio_salida', this.loteNuevo['precio_salida']);
      formData.append('titulo', this.loteNuevo['titulo']);
      formData.append('lote', this.loteNuevo['uuid']);
      formData.append('token', localStorage.getItem('token')!);
      formData.append('tipo', '1');
      if(this.pdfFile.length!=0 && this.pdfFile.length!=undefined) formData.append('pdf', this.pdfFile[0]);
      if(this.imgs.length!=0 && this.imgs.length!=undefined) {
        for (let i = 0; i < this.imgs.length; i++) {
          formData.append('img', this.imgs[i]);		
        }
      }      
      
      this.apiAdmin.actualizarLote(formData).then(resp =>{
        if(resp.ok){
          Swal.fire({title:'Lote actualizado con exito',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
        }else{
          Swal.fire({title:'Ocurrio un error',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
        }
        this.cerrarModal();
      }, (err)=>{				
        Swal.fire({title:'Ocurrio un error',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        this.cerrarModal();
      });
    }
  }
}
