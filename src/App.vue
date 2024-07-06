<!-- eslint-disable vue/valid-v-for -->
<script setup lang="ts">
// import DesignCanvas from './components/DesignCanvas.vue'
import FabricCanvas from '@/components/FabricCanvas.vue'
import ImageItem from '@/components/ImageItem.vue'

import { ref, onBeforeMount } from 'vue'
import { loadImage } from '@/util'
import type { Config } from '@/Interface'
import { Emitter } from '@/Emitter'
import { Evt } from '@/Event'

onBeforeMount(async () => {
    try {
        const rsp = await fetch('/static/config.json')
        if (!rsp.ok) {
            throw new Error('配置文件加载失败')
        }
        initConfig(await rsp.json())
    } catch (error) {
        console.error('找不到文件:', error)
    }
})

let config: Config
const sizeList = ref<number[][]>([])
function initConfig(info: Config) {
    config = info
    sizeList.value = info.temps.map((e) => [e[0].width, e[0].height])
    upTemp(0)
}

const items = ref<number>(0)
function upTemp(sel: number) {
    let temp = config.temps[sel]
    if (!temp) {
        alert('未找到对应模板')
        return
    }
    items.value = temp.length
    Emitter.emit(Evt.upTemp, temp)
}

async function selImg(el: HTMLInputElement, idx: number) {
    let file = el?.files?.[0]
    let image: HTMLImageElement
    if (file) {
        image = await loadImage(file)
    }

    Emitter.emit(Evt.upImage, idx, image)
}
</script>

<template>
    <main>
        <FabricCanvas />
    </main>

    <aside>
        <label for="canvas-size">选择画布大小</label>
        <select name="size" id="canvas-size">
            <option v-for="(item, idx) in sizeList" :key="idx" @click="upTemp(idx)">
                {{ `${item[0]}x${item[1]}` }}
            </option>
        </select>
        <ImageItem v-for="n in items" :key="n" :index="n-1" />
    </aside>
</template>

<style scoped></style>
