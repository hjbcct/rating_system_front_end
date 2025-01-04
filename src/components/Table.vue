<template>
  <div class="table-container">
    <el-table :data="table.tableData" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column fixed prop="num" sortable label="序号" width="180" />
      <el-table-column fixed prop="name" label="述职人员" width="180" />
      <el-table-column fixed prop="job" label="单位职务" width="180" />
      <!-- <el-table-column prop="rank" label="评分" width="180" /> -->
      <template v-for="i in table.rankLength + 1" :key="i">
        <el-table-column :prop="`rank${i - 1}`" sortable :label="`评分${i}`" width="180">
          <template #default="scope">
            <span v-show="scope.row.num !== editIndex">{{ scope.row[`rank${i - 1}`] }}</span>
            <el-input
              v-show="scope.row.num === editIndex"
              v-model="scope.row[`rank${i - 1}`]"
            ></el-input>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="Operate" width="180" fixed>
        <template #default="{ row }">
          <el-button link @click="handleEdit(row)">Edit</el-button>
          <el-button type="primary" link @click="handleSave">Save</el-button>
          <!-- <el-button type="danger" link @click="handleDelete(row)">Delete</el-button> -->
        </template>
      </el-table-column>
      <!-- <el-table-column prop="rank" sortable label="评分" width="180">
        <template #default="scope">
          <span v-show="scope.$index !== editIndex">{{ scope.row.rank }}</span>
          <el-input v-show="scope.$index === editIndex" v-model="scope.row.rank"></el-input>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="advice" label="修改建议" /> -->
    </el-table>
  </div>
</template>

<style>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>

<script lang="ts" setup>
import { useTableStore } from '@/stores/table'
import { computed, ref } from 'vue'

const tableStore = useTableStore() // 引入 Pinia 的 tableStore

const props = defineProps<{
  index: number
  schoolIndex: number
}>()

type RankKeys = `rank${number}`

export interface TableItem {
  num: number
  name: string
  job: string
  [key: RankKeys]: number
  advice: string
  confidence: number
}

export interface Table {
  tableData: TableItem[]
  rankLength: number
}

const table = computed(() => tableStore.tableArr[props.schoolIndex][props.index]) // 响应式绑定 tableStore.table

const tableRowClassName = ({ row, rowIndex }: { row: TableItem; rowIndex: number }) => {
  if (row.confidence <= 0.95) {
    return 'warning-row'
  } else return ''
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
