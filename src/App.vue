<script setup lang="ts">
import DesignCanvas from './components/DesignCanvas.vue'

import { ref, onBeforeMount } from 'vue'
import type { IDrawItem, IConfig } from './Interface'

onBeforeMount(async () => {
    try {
        const rsp = await fetch('public/static/config.json')
        if (!rsp.ok) {
            throw new Error('配置文件加载失败')
        }
        cfgInit(await rsp.json())
    } catch (error) {
        console.error('找不到文件:', error)
    }
})

let cfgInfo: IConfig
function cfgInit(info: IConfig) {
    cfgInfo = info
    sizeList.value = info?.designList?.map((e) => [e.width, e.height])
    upSize(0)
    // size.value.width = sizeList.value[0][0]
    // size.value.height = sizeList.value[0][1]
}

const size = ref({ width: 0, height: 0 })
const drawItem = ref<IDrawItem>()
const sizeList = ref<number[][]>([])
const imgList = ref<IDrawItem[]>([])

// function upSize(evt: Event) {
function upSize(sel: number) {
    // let target = evt.target as HTMLSelectElement
    // if (!target) return

    let info = sizeList.value[sel]
    size.value.width = info[0]
    size.value.height = info[1]

    let cfg = cfgInfo.designList[sel]
    let list: IDrawItem[] = cfg.items.map((e, idx) => {
        return {
            idx: idx + 1,
            width: e.width,
            height: e.height,
            x: 0,
            y: 0,
            dx: 0,
            dy: 0
        }
    })
    list.unshift({ idx: 0, x: 0, y: 0, dx: 0, dy: 0, width: cfg.width, height: cfg.height })
    imgList.value = list
}

function upload(el: HTMLInputElement, idx: number) {
    let file = el?.files?.[0]
    if (!file) return

    let item = imgList.value?.[idx]
    if (!item) return
    let reader = new FileReader()
    reader.onload = (evt: ProgressEvent<FileReader>) => {
        let img = new Image()
        img.onload = () => {
            item.img = img
            drawItem.value = item
        }
        img.src = evt.target?.result as string
    }
    reader.readAsDataURL(file)
}
</script>

<template>
    <main>
        <DesignCanvas v-bind="size" :draw-item />
    </main>

    <aside>
        <label for="canvas-size">选择画布大小</label>
        <select name="size" id="canvas-size">
            <option v-for="(item, idx) in sizeList" :value="item" :key="idx" @click="upSize(idx)">
                {{ `${item[0]}x${item[1]}` }}
            </option>
        </select>
        <ul>
            <li v-for="(item, idx) of imgList" :key="idx">
                <label :for="`img${idx}`">选择图片</label>
                <input
                    type="file"
                    :name="`img${idx}`"
                    @change="upload($event.target as HTMLInputElement, idx)"
                    accept="image/*"
                />
            </li>
        </ul>
    </aside>
</template>

<style scoped></style>
