export type ISize ={
    width:number,
    height:number,
} 

export type IImgSel = {
    idx:number,
    img:HTMLImageElement
}    
export type IDrawItem  = ISize & {
    /** 索引位置 */
    idx:number,
    /** 图片绘制坐标 default=0 */
    x?:number,
    /** 图片绘制坐标 default=0 */
    y?:number,
    img?:HTMLImageElement,
    /** canvas 中显示位置 default=0 */
    dx?:number, 
    /** canvas 中显示位置 default=0 */
    dy?:number,   
}    

export type IDesignItem = ISize & {
    items: IDrawItem[]
}

export type IConfig = {
    designList: IDesignItem[],
}