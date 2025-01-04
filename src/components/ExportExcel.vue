<template>
  <div>
    <div class="excel-button" @click="exportToExcel">导出 Excel</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import * as XLSX from 'xlsx'

// 定义 TableItem 接口
export interface TableItem {
  num: number
  name: string
  job: string
  [key: string]: number | string // 动态键值，RankKeys 使用动态属性
  advice: string
  confidence: number
}

// 定义传入数据类型
interface TableData {
  tableData: TableItem[] // 每个表包含的 TableItem 数据
  rankLength: number // 每个表的 rankLength
}

export default defineComponent({
  name: 'ExportExcel',
  props: {
    tableArray: {
      type: Array as PropType<TableData[]>, // 传入的数据类型
      required: true,
    },
  },
  methods: {
    exportToExcel() {
      // 创建一个工作簿
      const workbook = XLSX.utils.book_new()

      // 遍历 tableArray，每个元素生成一个 sheet
      this.tableArray.forEach((item, index) => {
        const tableData = item.tableData

        if (!tableData.length) {
          console.warn(`Table ${index + 1} 的数据为空`)
          return
        }

        // 提取除 advice 和 confidence 外的键作为表头
        const headers = Object.keys(tableData[0]).filter(
          (key) => key !== 'advice' && key !== 'confidence',
        )

        // 构造表格内容
        const sheetData = [
          headers, // 第一行是表头
          ...tableData.map(
            (row) => headers.map((header) => row[header] || ''), // 将每个对象按表头顺序映射成数组
          ),
        ]

        // 将数据转换为 worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

        // 添加 sheet 到工作簿
        XLSX.utils.book_append_sheet(workbook, worksheet, `Sheet${index + 1}`)
      })

      // 导出 Excel 文件
      XLSX.writeFile(workbook, 'TableData.xlsx')
    },
  },
})
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
