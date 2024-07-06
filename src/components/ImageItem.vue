<script setup lang="ts">
import { Emitter } from '@/Emitter'
import { Evt } from '@/Event'
import { loadImage } from '@/util'
import { ref } from 'vue'

const props = defineProps({index:Number});

const url = ref<string>();
async function upload(evt: Event) {
    let elem = evt.target as HTMLInputElement
    let file = elem?.files?.[0]
    if (!file || !file.type.startsWith('image/')) {
        alert('图片选择失败了 再试试')
        return
    }

    let img = await loadImage(file);
    url.value = img.src;
    Emitter.emit(Evt.upImage, props.index??0, img);
}

function delImg(){
    url.value = "";
    Emitter.emit(Evt.upImage, props.index??0, null);
}

// todo
// 上传本地图片
// 显示上传图片 icon
// 当有图片时 可以选择删除图片
// 可以列表展示
</script>

<template>
    <div class="item">
        <button class="relative-position display-button">上传图片</button>
        <input type="file" class="relative-position active" accept="image/*" @change="upload" />
        <img :src="url" alt="" v-show="url" class="relative-position">
        <div v-show="url" @click="delImg" class="relative-position active">删除图片</div>
    </div>
</template>

<style scoped>
.item {
    position: relative;
    /* display: inline-block; */
    width: 100px;
    height: 100px;
}

div.active:hover {
    opacity: 1;
    background-color: gray;
}

.relative-position {
    position: absolute;
    top: 0;
    left: 0;
    margin: 5% 5%;
    width: 90%;
    height: 90%;
    border-radius: 5px;
}

.active {
    width: 100%;
    height: 100%;
    margin: 0;
    cursor: pointer;
    opacity: 0;
}

.display-button {
    background-color: #b9d5b9;
    color: white;
    font-size: 16px;
}

.preview-image {
    max-width: 100px;
    max-height: 100px;
}
</style>
