import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

const mocks: MockMethod[] = [
  {
    url: '/api/login',
    method: 'post',
    timeout: Math.random() * 2000,
    response: ({ body }) => {
      /** 123456 */
      if (body.password === 'e10adc3949ba59abbe56e057f20f883e') {
        return Mock.mock({
          code: '01',
          body: {
            token: Mock.mock('@guid'),
            userName: body.userName,
            avatar: 'https://avatars.githubusercontent.com/u/25993112',
          },
          message: 'ok',
        })
      }
      return Mock.mock({
        code: '02',
        body: null,
        message: '帐号或密码不正确',
      })
    },
  },
]

export default mocks
