import { getParams } from '@/libs/util'
const USER_MAP = {
  admin: {
    name: 'admin',
    user_id: '1',
    access: ['admin', 'admin'],
    token: 'admin',
    avator: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
  },
  user1: {
    name: 'user1',
    user_id: '2',
    access: ['user'],
    token: 'user1',
    avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  },
  user2: {
    name: 'user2',
    user_id: '3',
    access: ['user'],
    token: 'user2',
    avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  },
  user3: {
    name: 'user3',
    user_id: '4',
    access: ['user'],
    token: 'user3',
    avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  }
}

export const login = req => {
  req = JSON.parse(req.body)
  return {token: USER_MAP[req.userName].token}
}

export const getUserInfo = req => {
  const params = getParams(req.url)
  return USER_MAP[params.token]
}

export const logout = req => {
  return null
}
