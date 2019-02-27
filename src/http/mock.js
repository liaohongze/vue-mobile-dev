import Mock from 'mockjs'

// Mock.setup({
//   timeout: 2000
// })

Mock.mock('/test', 'get', () => {
  return Mock.mock({
    name: 'Mike',
    age: 20
  })
})
