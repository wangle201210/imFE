import axios from '@/libs/api.request'

export const recordList = (data) => {
  return axios.request({
    url: '/records',
    method: 'get',
    params: data
  })
}

export const wayList = (data) => {
  return axios.request({
    url: '/courses',
    method: 'get',
    params: data
  })
}

export const historyList = (data) => {
  return axios.request({
    url: '/histories',
    method: 'get',
    params: data
  })
}
// export const videoList = () => {
//   return axios.request({
//     url: '/videos',
//     method: 'get'
//   })
// }
