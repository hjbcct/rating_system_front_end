<template>
  <div class="table-controller">
    <div class="ratio-controller" v-for="index in ratioArr.length" :key="index">
      <div class="title">{{ title[index - 1] }}</div>
      <el-input-number v-model="ratioArr[index - 1]" :min="0" :max="1" :step="0.1" />
    </div>
  </div>
  <div class="table-container">
    <el-table :data="sumTableData.tableData" style="width: 100%">
      <el-table-column prop="num" label="序号" width="180" />
      <el-table-column prop="name" label="述职人员" width="180" />
      <el-table-column prop="job" label="单位职务" width="180" />
      <!-- <el-table-column prop="rank" label="评分" width="180" /> -->
      <el-table-column prop="avgRank0" label="平均分" width="180" />
      <!-- <el-table-column prop="advice" label="修改建议" /> -->
    </el-table>
  </div>
</template>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

.table-controller {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 2rem 0;
  .title {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
}
</style>

<script lang="ts" setup>
import { useTableStore } from '@/stores/table'
import { computed, ref } from 'vue'

const tableStore = useTableStore() // 引入 Pinia 的 tableStore

const title = ref([
  '省委组织部、省委教育工委领导',
  '驻厅纪检监察组、处室负责人',
  '“两代表一委员”、基层代表',
  '高校领导',
])

const props = defineProps<{
  schoolIndex: number
}>()

export interface SumTableData {
  num: number
  name: string
  job: string
  avgRank0: number
  avgRank1: number
  avgRank2: number
  avgRank3: number
}

export interface SumTable {
  tableData: SumTableData[]
  length: number
}

const sumTableData = computed(() => tableStore.sumTableArr[props.schoolIndex]) // 响应式绑定 tableStore.table

const ratioArr = computed(() => tableStore.ratioArr[props.schoolIndex])
</script>
