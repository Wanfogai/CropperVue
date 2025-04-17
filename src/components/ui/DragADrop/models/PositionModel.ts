export class PositionModel {
    constructor(Dom?: DOMRect) {
        if (!Dom) return
        this.x = Dom.left
        this.y = Dom.top
    }

    x: number;
    y: number;


}