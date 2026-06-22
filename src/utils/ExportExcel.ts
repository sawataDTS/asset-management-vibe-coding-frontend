import ExcelJS from "exceljs"
import { saveAs } from "file-saver"

export interface ExportToExcelProps<T> {
  data: T[]
  fileName: string
}

export async function ExportToExcel<T>({ data, fileName }: ExportToExcelProps<T>) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Requests")

  if (data.length > 0) {
    worksheet.addRow(Object.keys(data[0]))
  }

  data.forEach((item) => {
    worksheet.addRow(Object.values(item))
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  saveAs(blob, `${fileName}.xlsx`)
}
