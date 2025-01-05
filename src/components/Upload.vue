<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    action="#"
    :http-request="uploadFile"
    :on-preview="handlePreview"
  >
    <el-button type="primary">点击上传</el-button>
    <template #tip>
      <div class="el-upload__tip">请上传 pdf 文件</div>
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

const props = defineProps<{
  index: number
  schoolIndex: number
}>()

const tableStore = useTableStore() // 引入 Pinia 的 tableStore

const fileList = ref<UploadUserFile[]>([])

const handlePreview: UploadProps['onPreview'] = (file) => {
  console.log(file)
  if (!file || !file.raw) {
    console.warn('文件不存在或缺少原始数据')
    return
  }

  const rawFile = file.raw as File

  // 检查文件类型是否为 PDF
  if (rawFile.name.toLowerCase().endsWith('.pdf') || rawFile.type === 'application/pdf') {
    // 创建临时 URL
    const objectUrl = URL.createObjectURL(rawFile)

    // 打开新标签页
    window.open(objectUrl, '_blank')

    // 可选：释放 URL（当不再需要时）
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl)
    }, 60 * 1000) // 30秒后释放
  } else {
    console.warn('文件不是 PDF 格式')
  }
}

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
  // console.log(ocrPDF({ file }))
  let res = await ocrPDF({ file: fileRequest.file })
  let table: TableItem[] = []
  console.log(res)
  for (let i = 0; i < res.length; i++) {
    const tableItem: TableItem = {
      num: i + 1,
      name: res[i].name,
      job: res[i].position,
      rank0: 0,
      confidence0: 0,
      imgUrl0: '',
      advice: '无',
    }
    for (let j = 0; j < res[i].scores.length; j++) {
      tableItem[`rank${j}`] = Number(res[i].scores[j].score)
      tableItem[`confidence${j}`] = Number(res[i].scores[j].confidence)
      tableItem[`imgUrl${j}`] = res[i].scores[j].original_picture
    }
    table.push(tableItem)
  }

  tableStore.setTable(table, props.schoolIndex, props.index, res[0].scores.length)
}
</script>
