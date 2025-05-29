export interface PointModel {
    x: number;
    y: number;
}

export type HandlePosition = 'tl' | 'tm' | 'tr' | 'ml' | 'mr' | 'bl' | 'bm' | 'br';

export interface HandleMouseDownPayload {
    originalEvent: MouseEvent;
    handleId: HandlePosition;
}
