/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'

/**
 * 自动写入模板
 *
 * @export
 * @param {string} filePath
 */
export default function initTemplate(filePath: string) {
  try {
    console.log('\n==发现空文件，正在写入模板：', filePath)

    const template = fs.readFileSync(
      path.resolve(__dirname, '../tpl.ts'),
      {
        encoding: 'utf-8',
      }
    )
    fs.writeFileSync(filePath, template)

    console.log('==空文件模板写入成功！\n')
  } catch (error) {
    console.log('==空文件模板写入失败！\n')
    console.error(error)
  }
}
