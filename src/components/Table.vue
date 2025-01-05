<template>
  <div class="table-container">
    <el-table
      :data="table.tableData"
      style="width: 90%; height: 100%"
      :cell-style="tableRowClassName"
    >
      <el-table-column fixed prop="num" label="序号" width="70" />
      <el-table-column fixed prop="name" label="述职人员" width="120" />
      <el-table-column fixed prop="job" label="单位职务" width="200" />
      <!-- <el-table-column prop="rank" label="评分" width="180" /> -->
      <template v-for="i in table.rankLength" :key="i">
        <el-table-column :prop="`rank${i - 1}`" sortable :label="`评分${i}`" width="100">
          <template #default="scope">
            <span v-show="scope.row.num !== editIndex">{{ scope.row[`rank${i - 1}`] }}</span>
            <el-input
              v-show="scope.row.num === editIndex"
              v-model="scope.row[`rank${i - 1}`]"
            ></el-input>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="Operate" width="120" fixed>
        <template #default="{ row }">
          <el-button link @click="handleEdit(row)">Edit</el-button>
          <el-button type="primary" link @click="handleSave">Save</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { useTableStore } from '@/stores/table'
import { computed, ref } from 'vue'
import { type CellStyle, type Column } from 'element-plus/lib'

const tableStore = useTableStore() // 引入 Pinia 的 tableStore

const props = defineProps<{
  index: number
  schoolIndex: number
}>()

type RankKeys = `rank${number}`
type ConfidenceKeys = `confidence${number}`

export interface TableItem {
  num: number
  name: string
  job: string
  [key: RankKeys]: number
  advice: string
  [key: ConfidenceKeys]: number
}

export interface Table {
  tableData: TableItem[]
  rankLength: number
}

const table = computed(() => tableStore.tableArr[props.schoolIndex][props.index]) // 响应式绑定 tableStore.table

const tableRowClassName: CellStyle<TableItem> = ({ row, column, rowIndex, columnIndex }) => {
  if (!column.property) return {}
  let isRank = column.property.includes('rank')
  if (!isRank) return {}
  let rankIndex = Number(column.property[4])
  if (isNaN(rankIndex)) {
    return {}
  }

  if (row[`confidence${rankIndex}`] < 0.95 && isRank) {
    return { backgroundColor: 'pink' } // 低于60分，背景色为红色
  }
  return {}
}

const editIndex = ref(-1)

const handleSave = () => {
  editIndex.value = -1
  console.log(table.value.tableData)
}

const handleEdit = (row: TableItem) => {
  editIndex.value = row.num
  // editIndex.value = table.value!.tableData.indexOf(row)
}
</script>

<style>
.table-container {
  height: 40vh;
}

.warning-row {
  /* --el-table-tr-bg-color: var(--el-color-danger-light-9); */
  background-color: 'pink';
}
.success-row {
  background-color: 'pink';
}
</style>
