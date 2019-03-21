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

export const videoList = (data) => {
  return axios.request({
    url: '/videos',
    method: 'get',
    params: data
  })
}

export const imgList = (data) => {
  return axios.request({
    url: '/pics',
    method: 'get',
    params: data
  })
}
