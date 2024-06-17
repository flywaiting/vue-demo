<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { IDrawItem } from '../Interface'
import {fabric} from 'fabric'
// https://blog.csdn.net/babalamoxian/article/details/123117432
interface Props {
    width: number
    height: number
    drawItem?: IDrawItem
}
const props = defineProps<Props>()

const tmp = ref<HTMLCanvasElement>()
const canvas = ref<fabric.Canvas>()

onMounted(()=>{
    if (!tmp.value) return;
    fabric.Object.prototype.transparentCorners =false;
    let c = new fabric.Canvas(tmp.value, {
        width: 500,
        height: 500,
    });
    c.preserveObjectStacking = true
    canvas.value = c

    // 可控 应该是默认参数问题
    fabric.Image.fromURL('/static/1.jpg', (img)=>{
        c.add(img)
    })
})

watch(
    () => props.drawItem,
    (item) => {
        if (!item || !item.img) return
        if (!canvas.value) return

        let w = 500, h = 500;
        // 只能移动, 确定相关参数
        let img = new fabric.Image(item.img)
        let s = Math.min(w/img.width, h/img.height)
        img.set({
            scaleX: s,
            scaleY: s,
            left: w/2,
            top: h/2,
            originX: 'center',
            originY: 'center',
        })
        canvas.value.add(img)
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
