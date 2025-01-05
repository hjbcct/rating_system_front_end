import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Rating } from '@/api/ocr'
import type { Table, TableItem } from '@/components/Table.vue'
import type { SumTable, SumTableData } from '@/components/SummaryTable.vue'

export const useTableStore = defineStore('tableStore', () => {
  const tableArr = ref<Table[][]>([
    [
      { tableData: [], rankLength: 0 },
      { tableData: [], rankLength: 0 },
      { tableData: [], rankLength: 0 },
      { tableData: [], rankLength: 0 },
    ],
    [
      { tableData: [], rankLength: 0 },
      { tableData: [], rankLength: 0 },
      { tableData: [], rankLength: 0 },
      { tableData: [], rankLength: 0 },
    ],
    [
      { tableData: [], rankLength: 0 },
      { tableData: [], rankLength: 0 },
      { tableData: [], rankLength: 0 },
      { tableData: [], rankLength: 0 },
    ],
  ])
  const sumTableArr = ref<SumTable[]>([{ tableData: [] }, { tableData: [] }, { tableData: [] }])

  const ratioArr = ref<number[][]>([
    [0.25, 0.25, 0.25, 0.25],
    [0.25, 0.25, 0.25, 0.25],
    [0.25, 0.25, 0.25, 0.25],
  ])

  // 方法：设置 table 数据
  const setTable = (
    newTable: TableItem[],
    schoolIndex: number,
    stuffIndex: number,
    srcRankLength: number,
  ) => {
    if (tableArr.value[schoolIndex][stuffIndex].rankLength === 0) {
      tableArr.value[schoolIndex][stuffIndex].tableData = newTable
      tableArr.value[schoolIndex][stuffIndex].rankLength = srcRankLength
    } else {
      let curRankLength = tableArr.value[schoolIndex][stuffIndex].rankLength
      for (let i = 0; i < newTable.length; i++) {
        for (let j = 0; j < srcRankLength; j++) {
          tableArr.value[schoolIndex][stuffIndex].tableData[i][`rank${curRankLength + j}`] =
            newTable[i][`rank${j}`]
          tableArr.value[schoolIndex][stuffIndex].tableData[i][`confidence${curRankLength + j}`] =
            newTable[i][`confidence${j}`]
        }
      }
      tableArr.value[schoolIndex][stuffIndex].rankLength += srcRankLength
    }
    refreshSumTable(schoolIndex)
  }

  // 监听 ratioArr.value 的变化
  watch(
    ratioArr,
    () => {
      console.log('ratioArr changed!')
      for (let i = 0; i < 3; i++) {
        refreshSumTable(i)
      }
    },
    { deep: true },
  ) // 添加 deep: true 来确保监听数组内容的变化

  const refreshSumTable = (schoolIndex: number) => {
    const stuffLength = tableArr.value[schoolIndex].length
    const tableList = tableArr.value[schoolIndex]
    sumTableArr.value[schoolIndex].tableData = []

    if (
      tableArr.value[schoolIndex][0].tableData.length <= 0 ||
      tableArr.value[schoolIndex][1].tableData.length <= 0 ||
      tableArr.value[schoolIndex][2].tableData.length <= 0 ||
      tableArr.value[schoolIndex][3].tableData.length <= 0
    ) {
      console.log('Not all table data ready!')
      return
    }

    // 判断 tableList 中的 table 长度是否相同，即每个 stuff 对应的 table 长度是否相同
    let tableLength = tableList[0].tableData.length
    if (tableList.some((table) => table.tableData.length !== tableLength)) {
      console.log('Table length not same!')
      return
    }

    //  初始化 sumTableArr
    for (let i = 0; i < tableLength; i++) {
      let sumTableItem: SumTableData = {
        num: i,
        name: tableList[0].tableData[i].name,
        job: tableList[0].tableData[i].job,
        avgRank0: 0,
        avgRank1: 0,
        avgRank2: 0,
        avgRank3: 0,
        sumRank: 0,
      }
      for (let index = 0; index < stuffLength; index++) {
        let sum = 0
        for (let sIndex = 0; sIndex < tableList[index].rankLength; sIndex++) {
          sum = sum + tableList[index].tableData[i][`rank${sIndex}`] / 1
        }
        if (index > 3) {
          console.error('index > 3')
          return
        }
        //@ts-ignore
        sumTableItem[`avgRank${index}`] = sum / tableList[index].rankLength
      }

      sumTableItem.sumRank =
        sumTableItem.avgRank0 * ratioArr.value[schoolIndex][0] +
        sumTableItem.avgRank1 * ratioArr.value[schoolIndex][1] +
        sumTableItem.avgRank2 * ratioArr.value[schoolIndex][2] +
        sumTableItem.avgRank3 * ratioArr.value[schoolIndex][3]

      sumTableArr.value[schoolIndex].tableData.push(sumTableItem)
    }
  }

  return {
    tableArr,
    sumTableArr,
    ratioArr,
    setTable,
  }
})
