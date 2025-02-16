export default class SelectionModel{

    constructor(X:number,Y:number,Width:number,Height:number,Dragging:boolean,Resizing:boolean){
        this.x =X;
        this.y = Y;
        this.width = Width;
        this.height = Height;
        this.dragging = Dragging;
        this.resizing = Resizing;
    }

    x:number;
    y:number;
    width:number;
    height:number;
    dragging:boolean;
    resizing:boolean;
}

