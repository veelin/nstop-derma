// import http from './http'
import { request } from './http'
// import {
//   TypeRequestApiParams,
//   TypeRequestApiResult,
// } from '#types/***';

const baseUrl = '/n_stop'

/**
 * 流程查询
 */
export const queryFlow = (data: any) => {
  const url = baseUrl + '/m/sys/flowDetail'

  return request({
    method: 'post',
    data,
    url: url,
  })
}

export const createFlow = (data: any) => {
  const url = baseUrl + '/m/sys/createFlow'
  return request({
    method: 'post',
    data,
    url: url,
  })
}

export const saveFlow = (data: any) => {
  const url = baseUrl + '/m/sys/updateFlow'
  return request({
    method: 'post',
    data,
    url: url,
  })
}

export const deployFlow = (data: any) => {
  const url = baseUrl + '/m/sys/deployFlow'
  return request({
    method: 'post',
    data,
    url: url,
  })
}

export const queryFlowList = (data: any) => {
  const url = baseUrl + '/m/sys/flowList'
  return request({
    method: 'post',
    data,
    url: url,
  })
}

export const debugFlow = (path:string, data: any) => {
  const url = baseUrl +'/debug/m'+ path
  return request({
    method: 'post',
    data,
    url: url,
  })
}

export const queryDatasources = () => {
  const url = baseUrl +'/m/sys/datasource/query'
  return request({
    method: 'post',
    data:{},
    url: url,
  })
}