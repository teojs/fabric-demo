/* eslint-disable no-console */

import fs from 'node:fs'
import { mergePath, crossbar2Case } from './utils'
import { readAllFileSync } from './readAllFileSync'
import set from 'lodash/set'

interface DirStructure {
  filePath?: string
  index?: DirStructure
}

interface CusConfig {
  serviceDir: string
  apisDir: string
}

export default async function initRoutes(cusConfig: CusConfig) {
  console.log('\n==正在初始化接口...')
  console.time('==初始化接口耗时：')

  // 获取全部vue文件并格式化结构关系
  const files = readAllFileSync(cusConfig.apisDir)
  const dirStructure: DirStructure = {}
  let apiImport = ''
  files.forEach((file) => {
    const regExp = new RegExp(`${cusConfig.apisDir}/(.+?).ts`)
    const key = file.match(regExp)?.[1].replace(/\//g, '.')
    const filePath = `${file.replace('src', '@').replace('.ts', '')}`
    set(
      dirStructure,
      crossbar2Case(key!),
      `==typeof import('${filePath}').default==`
    )
    apiImport += `export * from '${filePath}'\n`
  })

  const apisDeclareContent = `/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
/* !!!请勿修改此文件!!! */
${apiImport}

interface BaseIApi {
  $http: typeof import('@/service/axios.config').default
}

export interface IApis extends BaseIApi ${JSON.stringify(dirStructure, null, 2)}
    
  `.replace(/=="|"==/g, '')

  const apisDeclareFile = mergePath(
    process.cwd(),
    cusConfig.serviceDir,
    'types/api.d.ts'
  )
  fs.writeFileSync(apisDeclareFile, apisDeclareContent)
  console.log('==接口初始化完毕，文件位置：', apisDeclareFile)
  console.timeEnd('==初始化接口耗时：')
}
