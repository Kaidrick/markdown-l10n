<template>
  <v-main class="grow d-flex flex-column flex-nowrap fill-height">
    <v-row class="shrink flex-0-0">
      <v-col cols="8">
        <v-card elevation="2" class="pa-3">
          <v-file-input
              label="Markdown"
              placeholder="Choose a Markdown file here"
              prepend-icon="mdi-upload-circle-outline"
              @update:modelValue="handleFileInput"
              :rules="fileRules"
          ></v-file-input>

          <!-- file error feedback -->
          <v-snackbar
              v-model="fileErrorOpen"
              multi-line
          >
            {{ fileErrorText }}

            <template v-slot:actions>
              <v-btn
                  color="red"
                  variant="text"
                  @click="fileErrorOpen = false"
              >
                Close
              </v-btn>
            </template>
          </v-snackbar>
          <!-- /file error feedback -->
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card elevation="2" class="pa-3 fill-height">
          <v-row>
            <v-btn @click="handleFormatClean">FORMAT</v-btn>
            <v-checkbox label="half-width punctuation" v-model="formatHalfWidthPunctuation"></v-checkbox>
            <v-checkbox label="trim excessive space" v-model="trimExcessiveSpaces"></v-checkbox>
          </v-row>

          <v-row>
            <v-btn @click="handleGeneratePo">SEND TO TRANSLATION</v-btn>
          </v-row>
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
import {onMounted, reactive, ref} from 'vue'
import {useAppStore} from "../stores/app";
import {useRouter} from "vue-router";
import PO from 'pofile'

const store = useAppStore()

const router = useRouter()

// Markdown text
const mdFileSingleton = ref(null)

const editorWrapper = ref(null)

const fileErrorText = ref('')
const fileErrorOpen = ref(false)

const formatHalfWidthPunctuation = ref(true)
const trimExcessiveSpaces = ref(true)

const fileRules = ref([
  value => {
    if (!value) {
      return 'Please upload a file'
    }

    if (!value[0].name.toLowerCase().endsWith('.md')) {
      return 'File extension is expected to be *.md (Markdown file)'
    }

    return true
  },
])

/**
 * handle file list update event
 * @param fileList
 */
function handleFileInput(fileList) {
  console.log(fileList, 'fileList');
  const file = fileList[0]

  store.startFile = file

  const {name} = file

  if (!name.toLowerCase().endsWith('md')) {
    fileErrorOpen.value = true
    fileErrorText.value = 'Markdown file (*.md) only'
    throw new Error('Markdown file only')
  }

  const reader = new FileReader()
  reader.onload = function(e) {
    const result = e.target.result

    store.mainEditor.setValue(result)
  }
  reader.readAsText(file, 'UTF-8')
}

function handleGeneratePo() {
  // push to generate page?
  // open dialog?

  // loading

  console.log(store, 'store.poFileItems');


  // TODO: refine later
  const data = store.mainEditor.getValue()

  console.log(data, 'data');


  store.editorContent = data

  // split by lines and maybe categorize headings and marks


  const fileName = store.startFile?.name || `draft-${new Date().valueOf()}`

  new Promise((resolve, reject) => {
    const po = new PO()
    po.headers["X-Generator"] = 'Markdown Translation Tool'
    po.headers['Project-Id-Version'] = ''
    po.headers["Report-Msgid-Bugs-To"] = ''
    po.headers["POT-Creation-Date"] = ''
    po.headers["PO-Revision-Date"] = ''
    po.headers["Last-Translator"] = ''
    po.headers["Language"] = ''
    po.headers["Language-Team"] = ''
    po.headers["Content-Type"] = ''
    po.headers["Content-Transfer-Encoding"] = ''
    po.headers["Plural-Forms"] = ''

    po.items = data.split('\n').map((t, idx) => {
      const item = new PO.Item()
      item.msgid = t
      item.references.push(`${fileName}:ln ${idx + 1}`)

      return item
    }).filter(t => t.msgid)

    store.poFileItems = po.items

    delete po.items
    store.poFileMeta = { ...po }

    resolve()
  }).then(() => {
    router.push({ name: 'translate' })
  })
}

/**
 * Suppose that every line can have 0+ line separator
 * remove all \n that is not immediately followed by a \n
 */
function handleFormatClean() {
  // modify editor content directly
  const data = store.mainEditor.getValue()

  // for each line, find next line? if next line is \n?
  let prep = data.replaceAll(/(\S)\n([^\n])/mg, '$1 $2')

  if (formatHalfWidthPunctuation.value) {
    // ， ’ ‘ ” “
    prep = prep.replaceAll('‘', '\'')
        .replaceAll('’', '\'')
        .replaceAll('”', '\"')
        .replaceAll('“', '\"')
        .replaceAll('，', ', ')
        .replaceAll('。', '. ')
  }

  store.mainEditor.setValue(prep)
}


onMounted(() => {
  const editorCalcHeight = editorWrapper.value.$el.getBoundingClientRect().height - 12 * 2

  store.mainEditor = new Vditor('vditor', {
    height: editorCalcHeight,
    toolbarConfig: {
      pin: true,
    },
    cache: {
      enable: false,
    },
    after: () => {
      store.mainEditor.setValue(`
# 开始

使用上面的文件上传来载入一个Markdown（*.md）文档。

页面中部的md预览区域可以查看上传的内容，同时也支持编辑。

点击页面底部的生成PO文件按钮会将当前md编辑器中的内容分解成PO文档条目，每一行（不含空行，如果存在）对应一条PO。重复的条目将会被合并。

PO生成后，会自动跳转到翻译页面。

# 翻译

翻译页面可以对生成的PO进行编辑。

翻译页面顶部同样提供了上传入口，用于载入已经存在于本地的PO。通过这种方式可以继续编辑之前未完成的PO。翻译页面的功能类似于简化版的poedit。

# 替换

结合开始页载入的md文档内容和翻译页载入的po文件内容，尝试生成一份逐行替换的最终翻译md文件。

可以尝试直接使用此内容来生成一份PO文件预览，以熟悉大致的操作步骤。
      `)
    },
  })
})

</script>


