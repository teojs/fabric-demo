import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

const mocks: MockMethod[] = [
  {
    url: '/api/modify-password',
    method: 'post',
    timeout: Math.random() * 2000,
    response: ({ body }) => {
      if (body.oldPassword !== 'e10adc3949ba59abbe56e057f20f883e') {
        return Mock.mock({
          code: '02',
          body: null,
          message: '旧密码不正确',
        })
      }
      if (body.newPassword) {
        return Mock.mock({
          code: '01',
          body: null,
          message: 'success',
        })
      }
    },
  },
]

export default mocks
