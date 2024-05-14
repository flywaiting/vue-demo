<script setup lang="ts">
import DesignCanvas from './components/DesignCanvas.vue'

import { ref, onBeforeMount } from 'vue'
import type { IDrawItem, IConfig } from './Interface'
import { loadImage } from './util'

onBeforeMount(async () => {
    try {
        const rsp = await fetch('/static/config.json')
        if (!rsp.ok) {
            throw new Error('配置文件加载失败')
        }
        cfgInit(await rsp.json())
    } catch (error) {
        console.error('找不到文件:', error)
    }
})

let cfgInfo: IConfig
const sizeList = ref<number[][]>([])
function cfgInit(info: IConfig) {
    cfgInfo = info
    sizeList.value = info?.designList?.map((e) => [e.width, e.height])
    upSize(0)
}

const drawSize = ref({ width: 0, height: 0 })
const imgNum = ref(0)
let list: IDrawItem[]
function upSize(sel: number) {
    let info = sizeList.value[sel]
    drawSize.value.width = info[0]
    drawSize.value.height = info[1]

    let cfg = cfgInfo.designList[sel]
    list = cfg.items.map((e, i) => {
        let item = { ...e }
        item.idx = i + 1
        return item
    })
    list.unshift({ idx: 0, width: cfg.width, height: cfg.height })
    imgNum.value = list.length
}

const drawItem = ref<IDrawItem>()
async function selImg(el: HTMLInputElement, idx: number) {
    let file = el?.files?.[0]
    if (!file) return
    let item = list[idx]
    if (!item) return

    item.img = await loadImage(file)
    drawItem.value = { ...item }
}
</script>

<template>
    <main>
        <DesignCanvas v-bind="drawSize" :draw-item />
    </main>

    <aside>
        <label for="canvas-size">选择画布大小</label>
        <select name="size" id="canvas-size">
            <option v-for="(item, idx) in sizeList" :key="idx" @click="upSize(idx)">
                {{ `${item[0]}x${item[1]}` }}
            </option>
        </select>
        <ul>
            <li v-for="idx in imgNum" :key="idx">
                <label :for="`img${idx}`">{{ idx > 1 ? `图片${idx - 1}` : '背景' }}</label>
                <input
                    type="file"
                    :name="`img${idx}`"
                    @change="selImg($event.target as HTMLInputElement, idx - 1)"
                    accept="image/*"
                />
            </li>
        </ul>
    </aside>
</template>

<style scoped></style>
