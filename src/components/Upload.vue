<template>
  <el-upload v-model:file-list="fileList" class="upload-demo" action="#" :http-request="uploadFile">
    <el-button type="primary">点击上传</el-button>
    <template #tip>
      <div class="el-upload__tip">请上传pdf文件</div>
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

import { useTableStore } from '@/stores/table'

import type {
  UploadProps,
  UploadRequestHandler,
  UploadRequestOptions,
  UploadUserFile,
} from 'element-plus'
import { ocrPDF } from '@/api/ocr'
import type { TableItem } from './Table.vue'
import { tableV2GridProps } from 'element-plus/es/components/table-v2/src/grid.mjs'

const props = defineProps<{
  index: number
  schoolIndex: number
}>()

const tableStore = useTableStore() // 引入 Pinia 的 tableStore

const fileList = ref<UploadUserFile[]>([])

// const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
//   console.log(file, uploadFiles)
// }

// const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
//   console.log(uploadFile)
// }

// const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
//   ElMessage.warning(
//     `The limit is 3, you selected ${files.length} files this time, add up to ${
//       files.length + uploadFiles.length
//     } totally`,
//   )
// }

// const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
//   return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
//     () => true,
//     () => false,
//   )
// }

const uploadFile: UploadRequestHandler = async (fileRequest: UploadRequestOptions) => {
  // let file: UploadRawFile = fileRequest().file
  console.log(fileRequest)
  // console.log(ocrPDF({ file }))
  let res = await ocrPDF({ file: fileRequest.file })
  let table: TableItem[] = []
  console.log(res)
  for (let i = 0; i < res.length; i++) {
    let score = 0
    let confidence = 100
    const tableItem: TableItem = {
      num: i + 1,
      name: res[i].name,
      job: res[i].position,
      rank0: 0,
      confidence0: 0,
      advice: '无',
    }
    for (let j = 0; j < res[i].scores.length; j++) {
      tableItem[`rank${j}`] = res[i].scores[j].score
      tableItem[`confidence${j}`] = res[i].scores[j].confidence
    }
    table.push(tableItem)
  }

  tableStore.setTable(table, props.schoolIndex, props.index, res[0].scores.length)
}
</script>
