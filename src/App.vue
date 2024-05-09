<script setup lang="ts">
import { ref } from 'vue'
// import HelloWorld from './components/HelloWorld.vue'
// import TheWelcome from './components/TheWelcome.vue'

// const input: HTMLInputElement = ref(null)
const canvas = ref<HTMLCanvasElement | null>(null)

function upload(evt: ProgressEvent<HTMLInputElement>): void {
    let files = evt?.target?.files
    if (!files || !files.length) return

    let reader = new FileReader()
    reader.onload = function (evt: ProgressEvent<FileReader>) {
        let img = new Image()
        img.onload = function () {
            let ctx = canvas.value?.getContext('2d')
            ctx?.drawImage(img, 0, 0)

            console.log(img.width, img.height)
        }
        img.src = evt?.target?.result as string
    }
    reader.readAsDataURL(files[0])
}
</script>

<template>
    <!-- <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main> -->

    <canvas class="show" ref="canvas"></canvas>
    <input type="file" @change="upload" accept="image/*" />
</template>

<style scoped>
header {
    line-height: 1.5;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

.show {
    width: 500px;
    height: 600px;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }
}
</style>
