import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSchoolIndexStore = defineStore('schoolIndexStore', () => {
  const schoolIndex = ref<number>(0)
  const setSchoolIndex = (sIndex: number) => {
    schoolIndex.value = sIndex
  }

  return {
    schoolIndex,
    setSchoolIndex,
  }
})
