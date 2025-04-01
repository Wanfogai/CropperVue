export class PositionModel {
    x: number;
    y: number;

    constructor(Dom?: DOMRect) {
        if (!Dom) return
        this.x = Dom.left
        this.y = Dom.top
    }
}