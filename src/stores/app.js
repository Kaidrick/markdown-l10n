import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import PO from 'pofile'

export const useAppStore = defineStore('app', () => {
    /**
     * This is the global Markdown text reference
     * @type {Ref<UnwrapRef<string>>}
     */
    const editorContent = ref('')

    /**
     * File uploaded in start page
     * @type {Ref<UnwrapRef<File>>}
     */
    const startFile = ref(null)

    const compileContent = ref('')

    /**
     * ag grid
     * @type {Ref<UnwrapRef<Item[]>>}
     */
    const poFileItems = ref((new PO()).items)
    const poFileMeta = ref(new PO())


    const mainEditor = ref(null)

    const compileEditor = ref(null)


    const count = ref(0)

    const doubleCount = computed(() => count.value * 2)

    function increment() {
        count.value++
    }

    return {
        count, doubleCount,

        mainEditor, compileEditor,

        startFile,
        editorContent, poFileItems, poFileMeta,
        compileContent,

        increment
    }
})
