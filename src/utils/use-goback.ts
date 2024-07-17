import { useRouter } from 'vue-router/auto'

export default function useGoback() {
  const router = useRouter()
  return (path?: string) => {
    if (window.history.length > 1) {
      router.back()
    } else if (path) {
      router.push(path)
    }
  }
}
