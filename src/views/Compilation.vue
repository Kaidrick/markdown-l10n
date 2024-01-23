<template>
  <v-main class="grow d-flex flex-column flex-nowrap fill-height">
    <v-row class="shrink flex-0-0">
      <v-col cols="12">
        <v-card elevation="2" class="pa-3 d-flex">
          <v-btn @click="downloadAsMarkdown">DOWNLOAD</v-btn>
          <!--          <v-sheet>Download this document as *.md file</v-sheet>-->
        </v-card>
      </v-col>
    </v-row>
    <v-row class="grow">
      <v-col cols="12">
        <v-card ref="editorWrapper" elevation="2" class="pa-3 fill-height flex-0-0">
          <div id="vditor"></div>
        </v-card>
      </v-col>
    </v-row>
<!--    <v-row class="shrink flex-0-0">-->
<!--      <v-col cols="12">-->
<!--        -->
<!--      </v-col>-->
<!--    </v-row>-->
  </v-main>
</template>

<script setup>
import {nextTick, onActivated, onMounted, ref} from 'vue'
import {useAppStore} from "../stores/app";
import {useRouter} from "vue-router";

import {download} from "../lib";

const store = useAppStore()

const router = useRouter()

const editorWrapper = ref(null)

onMounted(() => {
  const editorCalcHeight = editorWrapper.value.$el.getBoundingClientRect().height - 12 * 2

  store.compileEditor = new Vditor('vditor', {
    height: editorCalcHeight,
    toolbarConfig: {
      pin: true,
    },
    cache: {
      enable: false,
    },
    after: () => {
      store.compileEditor.setValue(store.compileContent)
    },
  })
})

function testLoad() {
  console.log(store.compileContent, 'store.compileContent');

  store.compileEditor.setValue(store.compileContent)

}

function downloadAsMarkdown() {
  download('test.md', store.compileEditor.getValue(), 'text/markdown')
}


</script>


