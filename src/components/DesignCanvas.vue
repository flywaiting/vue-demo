<script setup lang="ts">
import { ref, watch } from 'vue'
import type { IDrawItem } from '../Interface'

interface Props {
    width: number
    height: number
    drawItem?: IDrawItem
}
const props = defineProps<Props>()

let itemList: IDrawItem[] = []
let selIdx: number = 0
watch(
    () => props.drawItem,
    (item) => {
        if (!item) return
        itemList[item.idx] = { ...item }
        selIdx = item.idx
        upUI(0, 0)
    }
)

const canvas = ref<HTMLCanvasElement>()
function upUI(x: number, y: number) {
    let item = itemList[selIdx]
    if (!item || !item.img) return

    item.x = x
    item.y = y
    let ctx = canvas.value?.getContext('2d')
    ctx?.clearRect(item.dx ?? 0, item.dy ?? 0, item.width, item.height)

    // 处理 bg
    let bg = itemList[0]
    if (bg && bg.img) {
        // 挖空 填充
        let sx = bg.x ?? 0
        let sy = bg.y ?? 0
        if (selIdx != 0) {
            sx += item.dx ?? 0
            sy += item.dy ?? 0
        }
        ctx?.drawImage(
            bg.img,
            sx,
            sy,
            item.width,
            item.height,
            item.dx ?? 0,
            item.dy ?? 0,
            item.width,
            item.height
        )
    }

    // 过滤出需要绘制的内容
    itemList
        .filter((e, i) => e && (selIdx == 0) != (i == selIdx))
        .forEach((e) => {
            e.img &&
                ctx?.drawImage(
                    e.img,
                    e.x ?? 0,
                    e.y ?? 0,
                    e.width,
                    e.height,
                    e.dx ?? 0,
                    e.dy ?? 0,
                    e.width,
                    e.height
                )
        })
}

let last: number[]
function moveHandle(evt: MouseEvent) {
    switch (evt.type) {
        case 'mousedown':
            selIdx = Math.max(
                0,
                itemList.findIndex((e, i) => {
                    return (
                        i &&
                        e &&
                        evt.offsetX >= (e.dx ?? 0) &&
                        evt.offsetX <= (e.dx ?? 0) + e.width &&
                        evt.offsetY >= (e.dy ?? 0) &&
                        evt.offsetY <= (e.dy ?? 0) + e.height
                    )
                })
            )
            if (!itemList[selIdx]) return

            last = [evt.x + (itemList[selIdx].x ?? 0), evt.y + (itemList[selIdx].y ?? 0)]
            document.addEventListener('mousemove', moveHandle)
            document.addEventListener('mouseup', moveHandle)
            break
        case 'mousemove':
            upUI(last[0] - evt.x, last[1] - evt.y)
            break
        case 'mouseup':
            document.removeEventListener('mousemove', moveHandle)
            document.removeEventListener('mouseup', moveHandle)
            break
    }
}
</script>

<template>
    <div>
        <canvas class="box" ref="canvas" :width :height @mousedown="moveHandle"></canvas>
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
