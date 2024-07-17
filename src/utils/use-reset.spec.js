import useReset from '@/utils/use-reset'
import {
  describe, expect, test,
} from 'vitest'
import { reactive } from 'vue'

describe('useReset', () => {
  test('应将目标数据重置为其原始状态', () => {
    const originalData = reactive({
      name: 'John',
      age: 25,
    })
    const resettableData = useReset(originalData)
    originalData.age = 30
    resettableData.reset()
    expect(originalData.age).toEqual(25)
  })

  test('应将原始数据更新到新目标', () => {
    const originalData = reactive({
      name: 'John',
      age: 25,
    })
    const newData = {
      name: 'Alice',
      age: 25,
    }
    const resettableData = useReset(originalData)
    resettableData.update(newData)
    originalData.age = 30
    resettableData.reset()
    expect(originalData.age).toEqual(25)
    expect(originalData.name).toEqual('Alice')
  })

  test('应处理空或未定义的目标', () => {
    const resettableData = useReset(null)
    expect(resettableData.originalData.value).toBeNull()
  })
})
