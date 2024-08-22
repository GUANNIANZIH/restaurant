// 透過 Pinia 來管理 dialog 的開關狀態，
// layouts/default.vue 中的按鈕可以觸發狀態改變，
// 而 index.vue 可以響應這個狀態並打開或關閉 dialog。
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 利用 ref 來管理對話框 (dialog) 的開關狀態。
export const useDialogStore = defineStore('dialog',() => {
    const isOpen = ref(false)

    const openDialog = () => {
        isOpen.value = true
    }

    const closeDialog = () => {
        isOpen.value = false
    }

    return {
        isOpen,
        openDialog,
        closeDialog
    }
})