<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { IDrawItem } from '../Interface'
import {fabric} from 'fabric'
import type { IImageOptions } from 'fabric/fabric-impl';
// https://blog.csdn.net/babalamoxian/article/details/123117432
interface Props {
    width: number
    height: number
    drawItem?: IDrawItem
}
const props = defineProps<Props>()

// note: 使用 ref 的话, 只剩下移动功能
// const canvas = ref<fabric.Canvas>()
let canvas: fabric.Canvas;

const tmp = ref<HTMLCanvasElement>()
onMounted(()=>{
    if (!tmp.value) return;
    fabric.Object.prototype.transparentCorners =false;
    let c = new fabric.Canvas(tmp.value, {
        width: 500,
        height: 500,
    });
    c.preserveObjectStacking = true
    canvas = c
})

watch(
    () => props.drawItem,
    (item) => {
        // if (!item || !item.url) return

        let w = 500, h = 500;


        let img = new fabric.Image(item.img)
        let s = Math.max(w/img.width, h/img.height)
        img.scale(s).set({
            // scaleX: s,
            // scaleY: s,
            left: w/2,
            top: h/2,
            originX: 'center',
            originY: 'center',
            // clipPath: new fabric.Rect({width: 400, height: 400})
        } as IImageOptions)
        if (!item.idx){
            let rect = new fabric.Rect({
                top: 10,
                left: 20,
                width: 400, 
                height: 400,
                absolutePositioned: true,
            })
            img.clipPath = rect;
        }
        canvas.add(img)
    }
)
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
