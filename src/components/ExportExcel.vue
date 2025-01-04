<template>
  <div>
    <div class="excel-button" @click="exportToExcel">导出 Excel</div>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx'
import type { TableItem, Table } from './Table.vue'
import { useTableStore } from '@/stores/table'
import { computed } from 'vue'
import { useSchoolIndexStore } from '@/stores/schoolIndex'
import { keysOf } from 'element-plus/es/utils/objects.mjs'
import type { SumTableData } from './SummaryTable.vue'

// const props = defineProps<{
//   tableArray: Table[]
// }>()

const tableStore = useTableStore() // 引入 Pinia 的 tableStore
const tableArray = computed(() => tableStore.tableArr)
const summaryTable = computed(() => tableStore.sumTableArr)

const schoolIndexStore = useSchoolIndexStore()
const schoolIndex = computed(() => schoolIndexStore.schoolIndex)

const exportToExcel = () => {
  // 创建一个工作簿
  const workbook = XLSX.utils.book_new()

  // 遍历 tableArray，每个元素生成一个 sheet
  tableArray.value[schoolIndex.value].forEach((item, index) => {
    const tableData = item.tableData

    if (!tableData.length) {
      console.warn(`Table ${index + 1} 的数据为空`)
      return
    }

    // 提取除 advice 和 confidence 外的键作为表头
    const headers = Object.keys(tableData[0]).filter(
      (key) => key !== 'advice' && !key.includes('confidence'),
    ) as (keyof TableItem)[]

    // 需要替换的固定字段及其新名称
    const replacements = {
      num: '序号',
      name: '述职人员',
      job: '单位职务',
    }

    // 生成中文的Headers
    const headersCN = headers.map((header) => {
      // 如果字段是固定替换项
      if (replacements[header as keyof typeof replacements]) {
        return replacements[header as keyof typeof replacements]
      }

      // 如果字段是 rank 后跟数字
      const match = header.match(/^rank(\d+)$/)
      if (match) {
        return `评分${match[1]}` // match[1] 是数字部分
      }

      return header // 其他字段不变
    })

    // 构造表格内容
    const sheetData = [
      headersCN, // 第一行是表头
      ...tableData.map(
        (row) => headers.map((header) => row[header]), // 将每个对象按表头顺序映射成数组
      ),
    ]

    // 将数据转换为 worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

    // 添加 sheet 到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, `Sheet${index + 1}`)
  })

  //  处理Summary Sheet

  // summaryHeaders 是 SumTableData 的键名
  const summaryHeaders = [
    'num',
    'name',
    'job',
    'avgRank0',
    'avgRank1',
    'avgRank2',
    'avgRank3',
    'sumRank',
  ] as (keyof SumTableData)[] // 使用 keyof SumTableData 类型

  const summaryHeadersCN = [
    '序号',
    '述职人员',
    '单位职务',
    '省委组织部、省委教育工委领导平均分',
    '驻厅纪检监察组、处室负责人平均分',
    '“两代表一委员”、基层代表平均分',
    '高校领导平均分',
    '加权平均分',
  ]

  const summarySheetData = [
    summaryHeadersCN,
    ...summaryTable.value[schoolIndex.value].tableData.map((row) =>
      summaryHeaders.map((header) => row[header]),
    ),
  ]

  console.log(summarySheetData)

  // 将数据转换为 worksheet
  const summaryWorksheet = XLSX.utils.aoa_to_sheet(summarySheetData)

  // 添加 sheet 到工作簿
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, `Summary`)

  // 导出 Excel 文件
  XLSX.writeFile(workbook, 'TableData.xlsx')
}
</script>

<style>
.excel-button {
  width: 8rem;
  text-align: center;
  color: white;
  background-color: var(--el-color-primary);
  margin: 0 2rem 0 0;
  padding: 1rem;
  border-radius: 5px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.excel-button:hover {
  background-color: var(--el-color-primary-light-3);
  color: #fff;
}
</style>
