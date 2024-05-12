<script setup lang="ts">
// import type { IData_canvaseItem } from './Interface';
import DesignCanvas from './DesignCanvas.vue'

import { ref , onBeforeMount} from 'vue'
import type { IConfig } from './Interface';

onBeforeMount(async ()=>{
    try {
        const rsp = await fetch('public/static/config.json')
        if (!rsp.ok){
            throw new Error('配置文件加载失败')
        }
        initCfg(await rsp.json())
    }catch (error){
        console.error('找不到文件:', error)
    }
})

function initCfg(info:IConfig){
    sizeList.value = info?.designList?.map(e=>[e.width, e.height])
    size.value.width = sizeList.value[0][0]
    size.value.height = sizeList.value[0][1]
}

const sizeList = ref<number[][]>([])
const size = ref({ width: 0, height: 0 })

function upSize(evt: Event) {
    let target = evt.target as HTMLSelectElement
    if (!target) return

    let info = target.value.split(',').map(Number)
    size.value.width = info[0]
    size.value.height = info[1]
}
</script>

<template>
    <!-- <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header> -->

    <main>
        <DesignCanvas v-bind="size" />
    </main>

    <aside>
        <label for="canvas-size">选择画布大小</label>
        <select name="size" id="canvas-size" @change="upSize">
            <option v-for="(item, idx) in sizeList" :value="item" :key="idx">
                {{ `${item[0]}x${item[1]}` }}
            </option>
        </select>
    </aside>
</template>

<style scoped></style>
