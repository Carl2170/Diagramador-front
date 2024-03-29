import {  AfterViewInit, HostListener, Component, OnInit, ViewChild, viewChild} from '@angular/core';
import { SocketWebService } from '../../services/socketIO/socket-web.service';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrl: './draw.component.scss'
})
export class DrawComponent implements OnInit, AfterViewInit{

  @ViewChild('canvasRef',{static:false}) canvasRef:any
  isAvailable:boolean=false
  public width = 800;
  public height = 800;

  private cx:CanvasRenderingContext2D={} as CanvasRenderingContext2D
  private points:Array<any> =[]

  @HostListener('document:mousemove',['$event'])
  onMouseMove=(e:any)=>{
    if(e.target.id ==='canvasId' && (this.isAvailable)){
            this.write(e);
    }
    
  }

  @HostListener('click',['$event'])
  onClick = (e:any)=>{
    if(e.target.id === 'canvasId'){
      this.isAvailable= !this.isAvailable;
    }
  }

  constructor( private socketWebService:SocketWebService){
    socketWebService.callback.subscribe(res=>{
      const {prevPos} = res
      console.log(res);
      this.writeSingle(prevPos,false)
      
    })
  }

  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void {
    this.render();
  }

  private render():any{
    const canvasEl = this.canvasRef.nativeElement;
    
    this.cx= canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height= this.height;

    this.cx.lineWidth= 3;
    this.cx.lineCap= 'round';
    this.cx.strokeStyle= '#000';
  }

  private write(res:any){
    const canvasEl:any= this.canvasRef.nativeElement;
    const rect= canvasEl.getBoundingClientRect();
    const prevPos={
      x:res.clientX - rect.left,
      y:res.clientY - rect.top
    };
    this.writeSingle(prevPos);
  
  }

  
  private writeSingle = (prevPos:any, emit = true)=>{
    this.points.push(prevPos);
    if(this.points.length>3){
      const prevPost= this.points[this.points.length-1];
      const currentPos=this.points[this.points.length-2];
      this.drawOnCanvas(prevPos, currentPos);
      if(emit){
        this.socketWebService.emitEvent({prevPos});
      }
    }
  }

  private drawOnCanvas(prevPos:any, currentPos:any){
    if(!this.cx){
      return;
    }
    this.cx.beginPath();
    if(prevPos){
      this.cx.moveTo(prevPos.x,prevPos.y);
      this.cx.lineTo(currentPos.x,currentPos.y);
      this.cx.stroke();
    }
  }

  public clearZone=()=>{
    this.points=[]
    this.cx.clearRect(0,0, this.width, this.height);
  }
}
