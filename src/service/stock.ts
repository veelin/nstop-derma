import http from './http'
import { log } from 'console'
import { request } from './http'
// import {
//   TypeRequestApiParams,
//   TypeRequestApiResult,
// } from '#types/***';

const baseUrl = ''

/**
 * 查询订阅列表
 */
export const querySubscribeDataList = (data: any) => {
  const url = baseUrl + '/subscribe/mng/subscribe/list'
  return request({
    method: 'post',
    data,
    url: url,
  })
}

export const subscribeData = (data: any) => {
  const url = baseUrl + '/subscribe/reSubscribe'
  return request({
    method: 'post',
    data:{"conId":data},
    url: url,
  })
}

export const queryTacticList = (data: any) => {
  const url = baseUrl + '/tactic/list'
  return request({
    method: 'get',
    data,
    url: url,
  })
}

export const openTactic = (data: any) => {
  const url = baseUrl + '/tactic/open'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const shutdownTactic = (data: any) => {
  const url = baseUrl + '/tactic/shutdown'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
export const queryTacticDetail = (data: any) => {
  const url = baseUrl + '/tactic/detail'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const queryTacticStocks = (data: any) => {
  const url = baseUrl + '/tactic/tacticStocks'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const queryDataByKey = (data: any) => {
  const url = baseUrl + '/data_pool/queryByKey'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const queryExecutionRecord = (data: any) => {
  const url = baseUrl + '/tactic/executionRecord'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const queryExecutionDetail = (data: any) => {
  const url = baseUrl + '/tactic/executionDetail'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const queryChartInitData = (data: any) => {
  const url = baseUrl + '/chart/today'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const queryChartModifiedData = (data: any) => {
  const url = baseUrl + '/chart/today_more'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const subscribeTacticData = (data: any) => {
  const url = baseUrl + '/tactic/subscribe'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const removeBankCache = (data: any) => {
  const url = baseUrl + '/tactic/deleteBankCache'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const todayOrder = (data: any) => {
  const url = baseUrl + '/chart/today_order'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const subscribeAll = (data: any) => {
  const url = baseUrl + '/tactic/subscribeAll'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}


export const queryTacticDayPnl = (data: any) => {
  const url = baseUrl + '/chart/today_pnl'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const queryOrderList = (data: any) => {
  const url = baseUrl + '/order/list'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}


export const queryBTestList = (data: any) => {
  const url = baseUrl + '/bt/page'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const queryBMainTestList = (data: any) => {
  const url = baseUrl + '/bt/main'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const queryBTestSubList = (data: any) => {
  const url = baseUrl + '/bt/sub/list'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const staticsBTest = (data: any) => {
  const url = baseUrl + '/bt/statics'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const queryBtEDetail = (data: any) => {
  const url = baseUrl + '/bt/e/detail'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}


export const queryBtOrderList = (data: any) => {
  const url = baseUrl + '/bt/order/list'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const queryBtCandle = (data: any) => {
  const url = baseUrl + '/bt/candle'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
export const queryBtStockList = (data: any) => {
  const url = baseUrl + '/bt/e/stock'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const btSimulateSingle = (data: any) => {
  const url = baseUrl + '/bt/simulate_single'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const btRunTestEntry = (data: any) => {
  const url = baseUrl + '/bt/runTestEntry'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const queryExecuteStatList = (data: any) => {
  const url = baseUrl + '/tactic/taskStat'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}


export const queryDataRecordKeys = (data: any) => {
  const url = baseUrl + '/data_pool/getRecordKeys'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}


export const queryDataRecords = (data: any) => {
  const url = baseUrl + '/data_pool/getRecords'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}


export const queryContractDetail = (data: any) => {
  const url = baseUrl + '/contract/detail'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const getLastPrice = (data: any) => {
  const url = baseUrl + '/data_pool/getLastPrice'
  return request({
    method: 'post',
    data,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
}