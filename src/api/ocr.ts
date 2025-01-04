import { post } from '../utils/request'
type SourcePDF = {
  file: File
}

export type Rating = {
  names: string[][] // 二维数组，包含多个字符串
  score: [number, number][] // 数组，包含每个元素为包含两个数字的元组
}

export const ocrPDF = async (sourcePDF: SourcePDF) => {
  let formData = new FormData()
  formData.append('file', sourcePDF.file)
  let res: Rating = await post('ocr', formData)
  return res
}
