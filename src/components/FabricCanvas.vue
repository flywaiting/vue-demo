<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import {fabric} from 'fabric'
import { Evt } from '@/Event';
import { Emitter } from '@/Emitter';

// https://blog.csdn.net/babalamoxian/article/details/123117432

type CanvasItem = {
    img?:fabric.Image, 
    mask: fabric.Rect,
}

// note: 使用 ref 的话, 只剩下移动功能
let canvas: fabric.Canvas;
let itemList: CanvasItem[];

const tmp = ref<HTMLCanvasElement>()
onMounted(()=>{
    if (!tmp.value) return;
    fabric.Object.prototype.transparentCorners =false;
    let c = new fabric.Canvas(tmp.value, {
        width: 800,
        height: 800,
    });
    c.preserveObjectStacking = true
    canvas = c

    itemList=[];
    Emitter.on(Evt.upTemp, upTemp);
    Emitter.on(Evt.upImage, upImage);
})
onUnmounted(()=>{
    Emitter.off(Evt.upTemp, upTemp);
    Emitter.off(Evt.upImage, upImage);
})

function upTemp(temp:fabric.IRectOptions[]){
    itemList.forEach(removeImage);
    temp.forEach((e, i)=>{
        if (itemList.length>i){
            let mask = itemList[i].mask;
            mask.set({...e});
            return;
        }

        let mask = new fabric.Rect({...e});
        mask.absolutePositioned = true;
        itemList.push({mask});
    });
}
function upImage(idx:number, img?:HTMLImageElement){
    let item = itemList[idx];
    removeImage(item);
    if (!img) {
        canvas.renderAll();
        return;
    }
    
    let mask = item.mask;
    item.img = new fabric.Image(img, {
        left: mask.left+(mask.width>>1),
        top: mask.top+(mask.height>>1),
        originX: 'center',
        originY: 'center',
        clipPath: mask,
    });
    item.img.scale(Math.max(mask.width/img.width, mask.height/img.height));
    canvas.insertAt(item.img, idx, true);
}

function removeImage(item: CanvasItem){
    if (!item.img) return;
    canvas.remove(item.img);
    item.img.clipPath=undefined;
    item.img.dispose();
    item.img = undefined;
}


// todo 
// 1. 画布变更 清空所有图片 更新所有遮罩尺寸
// 2. 添加图片 索引+图片 更新列表数据 缓存图片 以便后续移除操作
// 3. 移除图片 索引就行 
</script>

<template>
    <div>
        <canvas class="box" ref="tmp"></canvas>
        <!-- todo block -->
        <!-- <canvas :width :height></canvas> -->
    </div>
</template>

<style scoped>
.box {
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}
/* canvas {
    position: absolute;
    left: 15px;
    top: 15px;
} */
</style>
