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
  const sumTableArr = ref<SumTable[]>([])

  const ratioArr = ref<number[][]>([
    [0.25, 0.25, 0.25, 0.25],
    [0.25, 0.25, 0.25, 0.25],
    [0.25, 0.25, 0.25, 0.25],
    [0.25, 0.25, 0.25, 0.25],
  ])

  // 方法：设置 table 数据
  const setTable = (newTable: TableItem[], schoolIndex: number, stuffIndex: number) => {
    if (tableArr.value[schoolIndex][stuffIndex].tableData.length === 0) {
      console.log('tableArr.value[schoolIndex][stuffIndex].tableData.length === 0')
      tableArr.value[schoolIndex][stuffIndex].tableData = newTable
      tableArr.value[schoolIndex][stuffIndex].rankLength = 0
    } else {
      console.log('tableArr.value[schoolIndex][stuffIndex].tableData.length !== 0')
      tableArr.value[schoolIndex][stuffIndex].rankLength =
        tableArr.value[schoolIndex][stuffIndex].rankLength + 1
      for (let i = 0; i < newTable.length; i++) {
        tableArr.value[schoolIndex][stuffIndex].tableData[i][
          `rank${tableArr.value[schoolIndex][stuffIndex].rankLength}`
        ] = newTable[i].rank0
      }
    }
    refreshSumTable(schoolIndex)
  }

  //  ratioArr发生改变时，执行refreshSumTable函数
  watch(ratioArr, () => {
    for (let i = 0; i < 3; i++) {
      refreshSumTable(i)
    }
  })

  const refreshSumTable = (schoolIndex: number) => {
    const stuffLength = tableArr.value[schoolIndex].length
    const tableList = tableArr.value[schoolIndex]

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
    //
    for (let i = 0; i < tableLength; i++) {
      let sumTableItem: SumTableData = {
        num: i,
        name: tableList[0].tableData[i].name,
        job: tableList[0].tableData[i].job,
        avgRank0: 0,
        avgRank1: 0,
        avgRank2: 0,
        avgRank3: 0,
      }
      for (let index = 0; index < stuffLength; index++) {
        let sumRank = 0
        for (let sIndex = 0; sIndex < tableList[0].rankLength; sIndex++) {
          sumRank += tableList[index].tableData[i][`rank${sIndex}`]
        }
        if (index > 3) {
          console.error('index > 3')
          return
        }
        //@ts-ignore
        sumTableItem[`avgRank${index}`] = sumRank / tableList[index].rankLength
      }
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
