import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

const mocks: MockMethod[] = [
  {
    url: '/api/demo',
    method: 'get',
    timeout: Math.random() * 2000,
    response: ({ query }) => {
      const page = Number(query.page)
      const data = Mock.mock({
        code: '01',
        body: {
          'list|20': [
            {
              'id|+1': 1 * page,
              name: '@cname',
              'age|18-60': 0,
              email: '@email',
              'gender|1': ['Male', 'Female'],
              address: '@county(true)',
              phone: /^1[3456789]\d{9}$/,
              avatar: '@image("200x200")',
            },
          ],
          page,
          total: 100,
        },
        message: 'success',
      })
      return data
    },
  },
]

export default mocks
