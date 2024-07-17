import { assign, cloneDeep } from 'lodash'
import { shallowRef } from 'vue'

export default function useReset<T extends object>(target: T) {
  const originalData = shallowRef(cloneDeep(target))
  const reset = () => {
    assign(target, cloneDeep(originalData.value))
  }
  const update = (target: T) => {
    originalData.value = cloneDeep(target)
  }
  return {
    reset,
    update,
    originalData,
  }
}
