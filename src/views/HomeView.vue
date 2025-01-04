<script setup lang="ts">
import Table from '../components/Table.vue'
import Upload from '../components/Upload.vue'
import { useSchoolIndexStore } from '@/stores/schoolIndex'
import { computed } from 'vue'
const schoolIndexStore = useSchoolIndexStore()
const schoolIndex = computed(() => schoolIndexStore.schoolIndex)
// import { ElMessage, ElMessageBox } from 'element-plus'
// ElMessage.warning(`The limit is 3, you selected files this time, add up to`)
</script>

<template>
  <!-- <main> -->
  <div class="home-container">
    <div class="department-block">
      <div class="sub-title">省委组织部、省委教育工委领导</div>
      <div class="upload-container">
        <Upload :index="0" :school-index="schoolIndex"></Upload>
      </div>
      <div class="table-conatainer">
        <Table :index="0" :school-index="schoolIndex"></Table>
      </div>
    </div>

    <div class="department-block">
      <div class="sub-title">驻厅纪检监察组、处室负责人</div>
      <div class="upload-container">
        <Upload :index="1" :school-index="schoolIndex"></Upload>
      </div>
      <div class="table-conatainer">
        <Table :index="1" :school-index="schoolIndex"></Table>
      </div>
    </div>

    <div class="department-block">
      <div class="sub-title">“两代表一委员”、基层代表</div>
      <div class="upload-container">
        <Upload :index="2" :school-index="schoolIndex"></Upload>
      </div>
      <div class="table-conatainer">
        <Table :index="2" :school-index="schoolIndex"></Table>
      </div>
    </div>

    <div class="department-block">
      <div class="sub-title">高校领导</div>
      <div class="upload-container">
        <Upload :index="3" :school-index="schoolIndex"></Upload>
      </div>
      <div class="table-conatainer">
        <Table :index="3" :school-index="schoolIndex"></Table>
      </div>
    </div>

    <div class="department-block">
      <div class="sub-title">汇总</div>
      <div class="table-conatainer">
        <!-- <Summ :index="3" :school-index="schoolIndex"></Table> -->
        <SummaryTable :school-index="schoolIndex"></SummaryTable>
      </div>
    </div>
  </div>

  <ExportExcel :tableArray="tableArray" />
  <!-- </main> -->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ExportExcel from '../components/ExportExcel.vue'

const tableArray = ref([
  {
    tableData: [
      {
        num: 1,
        name: 'Alice',
        job: 'Engineer',
        rank0: 5,
        rank1: 3,
        rank2: 4,
        rank3: 5,
        advice: 'Good performance',
        confidence: 0.95,
      },
      {
        num: 2,
        name: 'Bob',
        job: 'Designer',
        rank0: 4,
        rank1: 2,
        rank2: 3,
        rank3: 4,
        advice: 'Needs improvement',
        confidence: 0.8,
      },
    ],
    rankLength: 4,
  },
  {
    tableData: [
      {
        num: 1,
        name: 'Charlie',
        job: 'Manager',
        rank0: 4,
        rank1: 4,
        rank2: 4,
        rank3: 4,
        advice: 'Consistent',
        confidence: 0.9,
      },
      {
        num: 2,
        name: 'David',
        job: 'Analyst',
        rank0: 3,
        rank1: 5,
        rank2: 4,
        rank3: 5,
        advice: 'Strong analysis',
        confidence: 0.85,
      },
    ],
    rankLength: 4,
  },
])
</script>

<style lang="scss" scoped>
.home-container {
  display: flex;
  flex-direction: column;
  // height: 100vh;
  padding-bottom: 5rem;
  width: 100%;

  .department-block {
    display: flex;
    flex-direction: column;
    margin: 3rem 0;
    padding: 5rem;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    .sub-title {
      font-size: 2.6rem;
      font-weight: 500;
      margin: 1rem 0;
    }

    .table-conatainer {
      margin-top: 2rem;
    }
  }
}
</style>
