export type ICanvasSize ={
    width:number,
    height:number,
} 
export type IDrawItem  = ICanvasSize & {
    /** 索引位置 */
    idx:number,
    /** 图片绘制坐标 default=0 */
    x:number,
    /** 图片绘制坐标 default=0 */
    y:number,
    img?:HTMLImageElement,
    /** canvas 中显示位置 default=0 */
    dx:number, 
    /** canvas 中显示位置 default=0 */
    dy:number,   
}    

export type IDesignItem = ICanvasSize & {
    items: IDrawItem[]
}

export type IConfig = {
    designList: IDesignItem[],
}