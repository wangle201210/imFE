import axios from '@/libs/api.request'

export const recordList = () => {
  return axios.request({
    url: '/records',
    method: 'get'
  })
}

export const wayList = (data) => {
  return axios.request({
    url: '/courses',
    method: 'get',
    params: data
  })
}

export const historyList = () => {
  return axios.request({
    url: '/histories',
    method: 'get'
  })
}
// export const videoList = () => {
//   return axios.request({
//     url: '/videos',
//     method: 'get'
//   })
// }
