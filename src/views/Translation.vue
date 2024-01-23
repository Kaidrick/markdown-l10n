<template>
  <v-main class="grow d-flex flex-column flex-nowrap fill-height">
    <v-row class="shrink flex-0-0">
      <v-col cols="8">
        <v-card elevation="2" class="pa-3">
          <v-file-input
              label="Click to load an existing PO file"
              v-model="mdFileSingleton"
              @update:modelValue="handleFileInput"
          ></v-file-input>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card elevation="2" class="pa-3 fill-height">
          <v-btn @click="handleCompile" :disabled="!canFileCompile">Compile</v-btn>
          <v-btn class="ml-3" @click="downloadAsPo" :disabled="!canPoFileDownload">Download</v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="grow">
      <v-col cols="12">
        <v-card ref="editorWrapper" elevation="2" class="pa-3 fill-height flex-0-0">
          <v-row>
            <v-expansion-panels>
              <v-expansion-panel
                  title="Portable Object Meta-data"
              >
                <!-- comments part is an array consisting of multiple lines; should be editable -->
                <v-expansion-panel-text>
                  <!-- po file headers -->
                  <v-form>
                    <v-container>
                      <v-row>
                        <v-col
                            cols="24"
                            md="12"
                        >
                          <v-textarea
                              label="Comments"
                              v-model="comments"
                              hide-details
                              placeholder="Enter po file comments here"
                          ></v-textarea>
                        </v-col>
                      </v-row>

                      <v-row>
                        <!-- respect the order given by header order array for string -->
                        <v-col
                            v-for="(headerKey, index) in sortedHeaders"
                            :key="index"
                            cols="12"
                            md="4"
                        >
                          <v-text-field
                              v-model="store.poFileMeta.headers[headerKey]"
                              :label="headerKey"
                              hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>

                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>

          <v-row class="fill-height">
            <ag-grid-vue
                class="entry-grid ag-theme-quartz"
                ref="grid"
                v-model="gridRowData"
                :columnDefs="headers"
                :defaultColDef="defaultColDef"
                rowSelection="single"
                v-on:update:modelValue="handleDataModelChanged"
                @cell-value-changed="onCellValueChanged"
                @selection-changed="onSelectionChanged"
                :onRowSelected="onRowSelected"
                :undoRedoCellEditing="true"
                :undoRedoCellEditingLimit="20"
                :enableCellChangeFlash="true"
            >
            </ag-grid-vue>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="shrink flex-0-0">
      <v-col cols="12">
        <v-card elevation="2" class="pa-3">
          <v-row>
            <v-col cols="9">
              <!-- original -->
              <v-textarea label="Original" v-model="currentSelectedEntry.msgid" :readonly="true" no-resize></v-textarea>
            </v-col>
            <v-col cols="3">
              <v-textarea label="Comments" v-model="currentSelectedEntry.comments" @input="updateCurrentRowComment" no-resize></v-textarea>
            </v-col>
          </v-row>

          <!-- translation  -->
          <v-textarea label="Translation" v-model="currentSelectedEntry.msgstr" @input="updateCurrentRow" no-resize>
            <template v-slot:append-inner>
              <v-chip
                  class="ml-1"
                  color="secondary"
                  v-for="(cp, index) in getChipHintText(currentSelectedEntry.msgid)"
                  :key="index"
              >
                {{ cp.label }}
              </v-chip>
            </template>
          </v-textarea>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script setup>
import {computed, onActivated, onMounted, ref} from "vue";

import {AgGridVue} from "ag-grid-vue3"; // Vue Grid Logic
import {useAppStore} from "../stores/app";

import {download} from "../lib";

import PO from 'pofile'
import _ from 'lodash'
import {useRouter} from "vue-router";

import mdSyntaxHint from "../config/md-syntax-hint"

import CommentCellRenderer from "../components/CommentCellRenderer";

const mdHintList = mdSyntaxHint()

const store = useAppStore()

const mdFileSingleton = ref(null)

// keep a reference to the grid in order to call api
const grid = ref(null)

const gridRowData = ref(null)

const router = useRouter()


const headers = ref([
  { field: '_hasComment', headerName: '', cellRenderer: CommentCellRenderer, valueGetter: 'node.data.comments' },
  { field: 'id', headerName: '#', valueGetter: "node.rowIndex + 1" },
  { field: 'msgid', headerName: 'Original', flex: 1 },
  { field: 'msgstr', headerName: 'Translation', flex: 1, editable: true },
  { field: 'comments', hide: true, }
])

// map to order number then sort
const sortedHeaders = computed(() => {
  if (!store.poFileMeta.headerOrder) {
    return store.poFileMeta.headers
  }

  return Object.keys(store.poFileMeta.headers).sort((a, b) => {
    const left = store.poFileMeta.headerOrder.findIndex(t => t === a)
    const right = store.poFileMeta.headerOrder.findIndex(t => t === b)
    return left - right
  })
})

const canPoFileDownload = computed(() => store.poFileItems && store.poFileItems.length > 0)

const canFileCompile = computed(() => store.editorContent)


function getChipHintText(text) {
  const scan = []

  mdHintList.forEach(rule => {
    if (rule.regex.test(text)) {
      scan.push({
        label: rule.label,
        hint: rule.hint,
      })
    }
  })

  return scan
}


// https://www.ag-grid.com/vue-data-grid/row-selection/#selection-events

const comments = computed({
  get() {
    return store.poFileMeta.comments.join('\n')
  },
  set(newValue) {
    store.poFileMeta.comments = newValue.split('\n')
  }
})

// FIXME: msgstr is actually an array for string
const currentSelectedEntry = ref(new PO.Item())

const currentRowNode = ref(null)

const defaultColDef = ref({
  editable: false,
  cellDataType: 'text',
})

onMounted(() => {
  grid.value.api.autoSizeColumn('id')
  grid.value.api.autoSizeColumn('_hasComment')
})

onActivated(() => {
  initAgGrid()
})


function initAgGrid() {
  const rowData = store.poFileItems
  if (!rowData) {
    return
  }

  gridRowData.value = Object.freeze(rowData.map(row => {
    return {...row, msgstr: row.msgstr.join(''), comments: row.comments.join('') }  // convert to string for editing
  }))
}

/**
 * handle file list update event
 * @param fileList
 */
function handleFileInput(fileList) {
  console.log(fileList, 'fileList');
  const file = fileList[0]

  const reader = new FileReader()
  reader.onload = function(e) {
    const result = e.target.result
    const data = PO.parse(result)

    store.poFileItems = data.items

    delete data.items
    store.poFileMeta = { ...data }

    // resize again
    grid.value.api.autoSizeColumn('id')

    initAgGrid()
  }
  reader.readAsText(file, 'UTF-8')
}

function onCellValueChanged(event) {
  console.log(event);
  console.log(`New Cell Value: ${event.value}`);

  // currentSelectedEntry.value = event.data
  currentSelectedEntry.value.msgid = event.data.msgid
  currentSelectedEntry.value.msgstr = event.data.msgstr
  currentSelectedEntry.value.comments = event.data.comments
}

/**
 * function wise, only single selection is allowed
 * @param event
 */
function onSelectionChanged(event) {
  // const row = _.get(grid.value.api.getSelectedRows(), 0)
  //
  // console.log(event, 'event.rowIndex');
  //
  // currentSelectedEntry.value.msgid = row.msgid
  // currentSelectedEntry.value.msgstr = row.msgstr
}

function handleDataModelChanged(data) {
  console.log(data, 'data in handle data model changed');

  store.poFileItems = data.map(t => ({...t, msgstr: [t.msgstr], comments: [t.comments]}))
}


function onRowSelected(event) {
  console.log(event, 'onRowSelected event');

  if (event.node.isSelected()) {
    currentSelectedEntry.value = _.cloneDeep(event.node.data)

    currentRowNode.value = event.node
  }

  //
  // window.alert(
  //     'row ' +
  //     event.node.data.msgid +
  //     ' selected = ' +
  //     event.node.isSelected()
  // );
}
// function onSelectionChanged(event) {
//   var rowCount = event.api.getSelectedNodes().length;
//   window.alert('selection changed, ' + rowCount + ' rows selected');
// }

function updateCurrentRow() {
  currentRowNode.value.setDataValue('msgstr', currentSelectedEntry.value.msgstr)
}

function updateCurrentRowComment() {
  currentRowNode.value.setDataValue('comments', currentSelectedEntry.value.comments)
}

function downloadAsPo() {
  const po = new PO()
  po.headers = store.poFileMeta.headers
  po.comments = store.poFileMeta.comments
  po.extractedComments = store.poFileMeta.extractedComments

  po.items = store.poFileItems.map(t => {
    const item = new PO.Item()
    item.msgid = t.msgid
    item.comments = t.comments
    item.flags = t.flags
    item.references = t.references
    item.msgstr = t.msgstr
    item.extractedComments = t.extractedComments
    item.msgid_plural = t.msgid_plural
    item.obsolete = t.obsolete

    return item
  })

  download('test.po', po.toString(), 'text/x-gettext-translation')

  console.log(po.toString())
}

function handleCompile() {
  // use list search for repeated msgid with different msgstr
  // once a match is made, it is deleted from the item list

  const matchList = store.poFileItems.map(t => ({msgid: t.msgid, msgstr: t.msgstr}))

  // split lines then replace
  const draft = store.editorContent.split('\n').map((line, idx) => {
    const rep = matchList.find(t => t.msgid === line)

    // since msgstr is an array for string
    return rep?.msgstr.join('') || line
  })

  store.compileContent = draft.join('\n')

  console.log(store.compileContent, 'store.compileContent before push to compile page');


  // if compile page has been mounted, call setValue
  store.compileEditor && store.compileEditor.setValue(store.compileContent)

  router.push({ name: 'compile' })
}


</script>

<style lang="scss" scoped>
.entry-grid {
  width: 100%;
  height: 100%;
}
</style>
