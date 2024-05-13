<script setup lang="ts">
import { ref, watch } from 'vue'
import type { IDrawItem } from '../Interface'

interface Props {
    width: number
    height: number
    drawItem?: IDrawItem
}
const props = defineProps<Props>()

const canvas = ref<HTMLCanvasElement>()

let itemList: IDrawItem[] = []
let selIdx: number = 0
watch(
    () => props.drawItem,
    (item) => {
        if (!item) return
        itemList[item.idx] = item
        selIdx = item.idx
        upUI(0, 0)
        // console.log(item)
    }
)

function upUI(x: number, y: number) {
    // if (!canvas.value) return
    let item = itemList[selIdx]
    if (!item || !item.img) return

    item.x = x
    item.y = y
    let ctx = canvas.value?.getContext('2d')
    ctx?.clearRect(item.dx || 0, item.dy || 0, item.width, item.height)
    ctx?.drawImage(
        item.img,
        x,
        y,
        item.width,
        item.height,
        item.dx || 0,
        item.dy || 0,
        item.width,
        item.height
    )
}

let last: number[]
function moveHandle(evt: MouseEvent) {
    switch (evt.type) {
        case 'mousedown':
            selIdx = 0
            itemList.forEach((e, i) => {
                if (!i || !e) return
                if (
                    evt.offsetX >= e.dx &&
                    evt.offsetX <= e.dx + e.width &&
                    evt.offsetY >= e.dy &&
                    evt.offsetY <= e.dy + e.height
                ) {
                    selIdx = i
                }
            })
            if (!itemList[selIdx]) return
            last = [evt.x + itemList[selIdx].x, evt.y + itemList[selIdx].y]
            document.addEventListener('mousemove', moveHandle)
            document.addEventListener('mouseup', moveHandle)
            break
        case 'mousemove':
            // todo
            upUI(last[0] - evt.x, last[1] - evt.y)
            // upUI(evt.x + last[0], evt.y + last[1])
            break
        case 'mouseup':
            document.removeEventListener('mousemove', moveHandle)
            document.removeEventListener('mouseup', moveHandle)
            break
    }
}
</script>

<template>
    <canvas class="box" ref="canvas" :width :height @mousedown="moveHandle"></canvas>
    <!-- <input type="file" @change="upload" accept="image/*" /> -->
</template>

<style scoped>
.box {
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}
</style>
