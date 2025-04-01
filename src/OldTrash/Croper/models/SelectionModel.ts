export class SelectionModel {

    constructor(X: number, Y: number, Width: number, Height: number) {
        this.x = X;
        this.y = Y;
        this.width = Width;
        this.height = Height;

    }

    x: number;
    y: number;
    width: number;
    height: number;
    dragging: boolean = false;
    resizing: boolean = false;
    zoom :number = 1;
    startX?: number;
    startY?: number;
    startWidth?: number;
    startHeight?: number;
    resizeDirection: string;
}