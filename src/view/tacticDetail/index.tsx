import React from "react";
import { Button,Table, Col, Row, Pagination, Flex, Tag, Layout, Statistic, Collapse, Tooltip, Select } from 'antd';
import type { MenuProps } from 'antd';
import {Typography} from 'antd';

import type { ColumnsType } from 'antd/es/table';
import { queryTacticDetail, queryTacticStocks, queryDataByKey,removeBankCache, queryExecutionRecord, queryExecutionDetail,openTactic, 
    shutdownTactic,queryChartInitData,queryChartModifiedData,subscribeTacticData, todayOrder,queryTacticDayPnl,queryOrderList,
    queryDataRecordKeys,queryDataRecords } from '../../service/stock'
import { log } from "console";
import Highcharts from 'highcharts';
import Stock from 'highcharts/modules/stock';
import Annotations  from "highcharts/modules/annotations";
import './index.css'; // 引入你的 CSS 文件
import ConDesc from "../components/conDesc";
import ColorTags from "../components/tacticTags";

const { Header, Footer, Sider, Content } = Layout;
const { Column, ColumnGroup } = Table;
const { Panel } = Collapse;
type MenuItem = Required<MenuProps>['items'][number];
const { Text, Link } = Typography;


Stock(Highcharts);
Annotations(Highcharts);
const leftHeaderStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 250,
    paddingInline: 48,
    lineHeight: '48px',
    backgroundColor: '#F0F0F0',
};
const rihgtHeaderStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 550,
    paddingInline: 0,
    lineHeight: '64px',
    backgroundColor: '#F0F0F0',
};

const leftContentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 400,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#0958d9',
};
const rightContentStyle: React.CSSProperties = {
    textAlign: 'center',
    height: 560,
    lineHeight: '60px',
    color: '#fff',
    backgroundColor: '#F0F0F0',
};

const rightInstanceStyle: React.CSSProperties = {
    textAlign: 'center',
    height: 150,
    lineHeight: '60px',
    color: '#fff',
    backgroundColor: '#0958d9',
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#fff',
    height: 1000,
    padding: 10,
};

const rightFooterStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#F0F0F0',
    height: 300,
    padding: 10,
};

const leftLayoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: 'calc(70% - 8px)',
    maxWidth: 'calc(70% - 8px)',
    height: '100%',
};

const rightLayoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: 'calc(30% - 8px)',
    maxWidth: 'calc(30% - 8px)',
    height: '100%',
};


interface TacticFundType {
    id: number;
    name: string;
    initFund: number;
    enable: number;
    fund: TacticFund;
}

interface PositionType {
    conId: number;
    symbol: string;
    count: number;
}

interface DataPoolType {
    key: string;
    than: number;
    value: string;
    nowValue: string;
}

interface FlowInstanceType {
    flowInstanceId: string;
    status: string;
    createTime: string;
    doneTime: string;
}

interface FlowNodeType {
    nodeInstanceId: string;
    nodeType: string;
    startTime: string;
    data: string;
}

interface TacticFund {
    nvdFund: number;
    fluFund: number;
    preSubmitFund: number;
    filledSubmitFund: number;
    pnl: number;
    commission: number;
    isEntrance: boolean;
}

interface OrderType {
    orderId: number;
    act: string;
    orderType: string;
    lmtPrice: number;
    totalQuantity: number;
    filledQuantity: number;
    cashQty: number;
    contract: Object;
    status: string;
    avgFillPrice: number;
    commission: number;
    created: number;
}


interface StateStruct {
    tacticName: string | any;
    orderCurPage: number | any;
    orderPageSize: number | any;
    fund: Object | any;
    positions: Array<any>;
    stockNames: Array<any>;
    orders: Array<any>;
    enable: boolean | any;
    detail: Object | any;
    entranceConfigList: Array<any>;
    dataPool: Array<any>;
    flowInstanceList: Array<any>;
    flowNodeList: Array<any>;
    conId: number|any;
    orderQueryConId: number | any;
    chartLastTime: number | any;
    orderTotalNum: number | any;
    dayPnl: Object | any;
    lastPrice: number | any;
    orderQueryOrderBy: boolean | any;
    orderQueryFlowNodeType: string | any;
    dataKeys : Array<any>;
    preTime: number | any;
}


export default class SubscribeDataList extends React.Component<{}, StateStruct> {

    constructor(props: any) {
        super(props);
        let url = new URLSearchParams(window.location.href);
        this.state = {
            tacticName: url.get('tacticName'),
            orderCurPage: 1,
            orderPageSize: 20,
            fund: {},
            positions: [],
            stockNames: [],
            orders: [],
            enable: false,
            detail: {},
            entranceConfigList: [],
            dataPool: [],
            flowInstanceList: [],
            flowNodeList:[],
            conId: null,
            chartLastTime: null,
            orderTotalNum: 1,
            orderQueryConId: null,
            dayPnl: {},
            lastPrice: 0,
            orderQueryOrderBy: true,
            orderQueryFlowNodeType: 'All',
            dataKeys: [],
            preTime: 86400000 * 3
        };
    }

    // hcOptions: Highcharts.Options = {
    //     time: {
    //         timezone: 'Asia/Shanghai'
    //     },
    //     rangeSelector: {
    //         selected: 1,
    //         allButtonsEnabled: true,
    //         inputDateFormat: '%Y-%m-%d',
    //         buttons: [
    //           {
    //             type: 'hour',
    //             count: 1,
    //             text: '1 h'
    //           },
    //           {
    //             type: 'day',
    //             count: 1,
    //             text: '1 d'
    //           },
    //           {
    //             type: 'month',
    //             count: 1,
    //             text: '1m'
    //           }, {
    //             type: 'month',
    //             count: 3,
    //             text: '3m'
    //           }, {
    //             type: 'month',
    //             count: 6,
    //             text: '6m'
    //           }, {
    //             type: 'ytd',
    //             text: 'YTD'
    //           }, {
    //             type: 'year',
    //             count: 1,
    //             text: '1y'
    //           }, {
    //             type: 'all',
    //             text: 'All'
    //           }]
    //       },
    //       title: {
    //         text: '股价'
    //       },
    //       annotations: [],
    //       xAxis: {
    //         dateTimeLabelFormats: {
    //           millisecond: '%H:%M:%S.%L',
    //           second: '%H:%M:%S',
    //           minute: '%H:%M',
    //           hour: '%H:%M',
    //           day: '%m-%d',
    //           week: '%m-%d',
    //           month: '%y-%m',
    //           year: '%Y'
    //         },
    //       },
    //       plotOptions: {
    //         series: {
    //           showInLegend: true
    //         }
    //       },
    //       tooltip: {
    //         split: false,
    //         shared: true
    //       },
    //       yAxis: [{
    //         labels: {
    //           align: 'right',
    //         },
    //         title: {
    //           text: '股价'
    //         },
    //         height: '100%',
    //         resize: {
    //           enabled: true
    //         },
    //         lineWidth: 2
    //       }],
    //       series: [{
    //         name: 'LastPrice',
    //         color: 'green',
    //         tooltip: {
    //         },
    //         data: [],
    //         id: 'LastPrice',
    //         type: 'line'
    //       },
    //       ]
    //   }

    hcOptions: Highcharts.Options = {
        time: {
            timezone: 'Asia/Shanghai'
        },
        chart: {
          height: 600,
        },
        rangeSelector: {
          selected: 1,
          allButtonsEnabled: true,
          inputDateFormat: '%Y-%m-%d',
          buttons: [
            {
              type: 'hour',
              count: 1,
              text: '1 h'
            },
            {
              type: 'day',
              count: 1,
              text: '1 d'
            },
            {
              type: 'month',
              count: 1,
              text: '1m'
            }, {
              type: 'month',
              count: 3,
              text: '3m'
            }, {
              type: 'month',
              count: 6,
              text: '6m'
            }, {
              type: 'ytd',
              text: 'YTD'
            }, {
              type: 'year',
              count: 1,
              text: '1y'
            }, {
              type: 'all',
              text: 'All'
            }]
        },
        title: {
          text: "tttt"
        },
        // labels: {
        //   style: {
        //     color: '#ff0000'
        //   },
        //   items: [{
        //     html: 'open :',
        //     style: {
        //       left: '50px',
        //       top: '100px'
        //     }
        //   }, {
        //     html: 'Labels 2 : <a href="http://www.hcharts.cn" target="_blank">HCharts.cn</a>',
        //     style: {
        //       left: '50px',
        //       top: '200px',
        //       color: '#006cee',
        //       fontSize: '20px',
        //       fontWeight: 'bold',
        //       fontFamily: '微软雅黑'
        //     }
        //   }]
        // },
        xAxis: {
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%m-%d',
            week: '%m-%d',
            month: '%y-%m',
            year: '%Y'
          },
  
        },
        plotOptions: {
          series: {
            showInLegend: true
          }
        },
        tooltip: {
          split: false,
          shared: true,
        //   formatter: function() {
        //     var tip = '<b>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S %A', this.x) + '</b><br/>'
        //     tip += 'open:<span>' + this.points[0].point.open + ' </span><br/>'
        //     tip += 'high:<span>' + this.points[0].point.high + ' </span><br/>'
        //     tip += 'low:<span>' + this.points[0].point.low + ' </span><br/>'
        //     tip += 'close:<span>' + this.points[0].point.close + ' </span><br/>'
        //     tip += 'volume:<span>' + this.points[1].y + ' </span><br/>'
        //     return tip
        //   }
        },
        yAxis: [{
          labels: {
            align: 'left',
            y: 6,
            x: 10
          },
          title: {
            text: '股价'
          },
          height: '75%',
          resize: {
            enabled: true
          },
          lineWidth: 2,
          crosshair: {
            label: {
              enabled: true,
              format: '{value:.2f}'
            },
            snap: false
          },
          scrollbar: {
            enabled: true,
            showFull: false
          }
        }, {
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: '成交量'
          },
          top: '76%',
          height: '24%',
          offset: 0,
          lineWidth: 1
        },{
            title: {
                text: 'line'
            },
            opposite: false
          }],
        series: [{
          type: 'candlestick',
          color: 'green',
          lineColor: 'green',
          upColor: 'red',
          upLineColor: 'red',
          tooltip: {
          },
          data: [],
          id: 'sz'
        }, {
          type: 'column',
          data: [],
          yAxis: 1
        },
        {
          type: 'line',
          data: [],
          yAxis: 2
        }]
      }

      hcChart: Highcharts.Chart = {} as Highcharts.Chart;

    // getFlowData = async () => {
    //     return new Promise((r) => {
    //       queryFlow({
    //         flowModuleId: this.state.flowModuleId,
    //       }).then((data) => {
    //         let a = JSON.parse(data['data']['detail']['flowModel'])
    //         a = a === null ? {} : a;
    //         let formateStr = JSON.stringify(a, null, 2) ;
    //         // console.log(formateStr);
    //         this.setState({ graphData: formateStr})
    //         RegisteNode(this.state.lf);
    //         RegisteEdge(this.state.lf);
    //         this.state.lf.render(a);
    //         this.initEvent(this.state.lf);
    //       })
    //     });
    //   }

    posotionColumns: ColumnsType<PositionType> = [
        {
            title: 'conId',
            dataIndex: 'conId',
        },
        {
            title: 'symbol',
            dataIndex: 'symbol',
            render: (_, record) => (
                <a onClick={() => this.onConBtnClick(record.conId)}>
                    {record.symbol}
                </a>
            ),
        },
        {
            title: 'lastPrice',
            dataIndex: 'lastPrice',
            render: (val) => (
                <>
                {val?val.toFixed(2):0}
                </>
                
            ), 
        },
        {
            title: 'count',
            dataIndex: 'position',
            render: (val) => (
                <>
                {val?val.count:0}
                </>
                
            ), 
        },
        {
            title: 'pnl',
            dataIndex: 'position', 
            render: (val) => (
                <>
                    {val?val.singlePnl.toFixed(2):0}
                </>

            ), 
        },
        {
            title: 'dayPnl',
            dataIndex: 'dayPnl', 
            render: (val) => (
                <>
                    {val?val.toFixed(2):0}
                </>
            )
        },
    ]

    stockColumns: ColumnsType = [
        
        {
            title: 'symbol',
            dataIndex: 'conId',
            render: (_, record) => (
                <a onClick={() => this.onConBtnClick(record.conId)}>
                    {record.symbol}
                </a>
            ),
        }
    ]

    dataPoolColumns: ColumnsType<DataPoolType> = [
        {
            title: 'key',
            dataIndex: 'key',
            width: 200,
        },
        {
            title: 'nowValue',
            dataIndex: 'nowValue',
        },
        // {
        //     title: 'value',
        //     dataIndex: 'than',
        //     render: (_, record) => (
        //         <>
        //             {record.than === 1 ? '>' : '<'}{record.value}
        //         </>
        //     ),
        // },
    ]

    flowInstanceColumns: ColumnsType<FlowInstanceType> = [
        {
            title: 'instanceId',
            dataIndex: 'flowInstanceId',
            ellipsis: true,
            width: 100,
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>
                    <a onClick={()=>{this.getFlowNode(text)}}>{text}</a>
                </Tooltip>
            ),

        },
        {
            title: 'status',
            dataIndex: 'status',
            width: 120,
        },
        {
            title: 'start',
            dataIndex: 'createTime',
        },
        {
            title: 'done',
            dataIndex: 'doneTime',
        },
    ]

    flowNodeColumns: ColumnsType<FlowNodeType> = [
        
        {
            title: 'nodeType',
            dataIndex: 'nodeType',
            width: 130,
            ellipsis: true,
            render: (_, record) => (
                <Tooltip placement="topLeft" title={record.nodeType}>
                <span style={{ fontSize: '12px' }}>{record.nodeType}</span>
                </Tooltip>
            ),
            
        },
        {
            title: 'start',
            dataIndex: 'startTime',
            width: 150,
            render: (_, record) => (
                <span style={{ fontSize: '12px' }}>{record.startTime}</span>
            ),
        },
        {
            title: 'status',
            dataIndex: 'status',
            width: 100
        },
        {
            title: 'data',
            dataIndex: 'data',
        },
        {
            title: 'nodeId',
            dataIndex: 'nodeInstanceId',
            ellipsis: true,
            width: 100,
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>
                    {text}
                </Tooltip>
            ),
        },
        
    ]

    orderColumns: ColumnsType<OrderType> = [
        {
            title: 'orderId',
            dataIndex: 'orderId',
            fixed: 'left',
            align: 'center',

        },
        {
            title: 'contract',
            dataIndex: 'contract',
            fixed: 'left',
            align: 'center',
            // render: (contract) => (
            //     <>
            //         {contract.contract.symbol}
            //     </>
            // ),
            render: (contract) => (
                <a onClick={() => this.onConBtnClick(contract.contract.conId)}>
                    {contract.contract.symbol}
                </a>
            ),
        },
        {
            title: 'act',
            dataIndex: 'act',
            align: 'center',

        },
        {
            title: 'status',
            dataIndex: 'status',
            align: 'center',

        },
     
        {
            title: 'optType',
            dataIndex: 'abbrFlowNodeType',
            align: 'center',

        },
        {
            title: 'pnl',
            dataIndex: 'strPnl',
            align: 'center',

        },
        {
            title: 'trigger',
            dataIndex: 'strTrigger',
            align: 'center',
            width: 220,
            ellipsis: true,
            render: (text) => (
                <span style={{ fontSize: '10px' }}>{text}</span> 

            ),
            
        },
        {
            title: 'filled',
            dataIndex: 'filledQuantity',
            align: 'center',

        },
        {
            title: 'avgFillPrice',
            dataIndex: 'avgFillPrice', 
            align: 'center',
            render: (text: number) => text.toFixed(2),


        },
        {
            title: 'quantity',
            dataIndex: 'totalQuantityDouble',
            align: 'center',
            

        },
        {
            title: 'commission',
            dataIndex: 'commission',
            align: 'center',
            render: (text: number) => text.toFixed(2),

        },
        {
            title: 'orderType',
            dataIndex: 'orderType',
            align: 'center',

        },
       
        {
            title: 'lmtPrice',
            dataIndex: 'lmtPrice',
            render: (text: number) => text.toFixed(2),

        },
        // {
        //     title: 'cashQty',
        //     dataIndex: 'cashQty',
        // },
       
        {
            title: 'created',
            dataIndex: 'created',
            width: 200,
            align: 'center',

            render: (timestamp) => {
                const date = new Date(timestamp*1000);
                return (
                    <>{new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(date)}</>
                );
            },
        },

    ]


    intervalId :any
    intervalId_2s :any
    intervalId_chart :any
    intervalId_animation:any

    componentDidMount() {
        this.getTacticDetail();
        this.getTacticStocks();
        this.chartAnimationInit();
        this.intervalId = setInterval(() => {
            this.getTacticDetail();
            this.getDayPnl();
            this.getOrderList();
          }, 5000); // 每5秒执行一次
          this.intervalId_2s = setInterval(() => {
            if (this.state.conId != null) {
                this.viewStockDataFun(this.state.conId);
                this.getFlowInstance();
            }
          }, 2000); // 每2秒执行一次



    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
        clearInterval(this.intervalId_2s);
        clearInterval(this.intervalId_chart);
        clearInterval(this.intervalId_animation)
    }

    getTacticDetail = () => {
        queryTacticDetail({
            name: this.state.tacticName,
            curPage: this.state.orderCurPage,
            pageSize: this.state.orderPageSize,
            conId: this.state.orderQueryConId,
        }).then((data) => {
            this.setState({ fund: data.data.bank.tacticFund })
            this.setState({ positions: data.data.bank.positionList })
            this.setState({ stockNames: data.data.stockNames })
            this.setState({ enable: data.data.enable })
            this.setState({ detail: data.data }, () => {
                this.getFlowInstance();
            })
        })
    }

    getOrderList = () => {
        queryOrderList({
            name: this.state.tacticName,
            curPage: this.state.orderCurPage,
            pageSize: this.state.orderPageSize,
            conId: this.state.orderQueryConId,
            orderBy: this.state.orderQueryOrderBy,
            flowNodeType: this.state.orderQueryFlowNodeType,
        }).then((data) => {
            this.setState({ orders: data.data.resultList })
            this.setState({ orderTotalNum: data.data.totalItem })
        })
    }

    getDayPnl = () => {
        queryTacticDayPnl({
            name: this.state.tacticName
        }).then((data) => {
            this.setState({ dayPnl: data.data })
        })
    }
    getTacticStocks = () => {
        queryTacticStocks({
            name: this.state.tacticName,
        }).then((data) => {
            if (!this.state.conId) {
                var conId = data.data[0].conId;
                this.setState({chartLastTime: null})
                this.initChartDate(conId)
                this.fetchRealtimeData(conId)
            }
            this.setState({ entranceConfigList: data.data });
        })
    }

    getFlowInstance = () => {
        queryExecutionRecord({
            flowModuleId: this.state.detail.flowModuleId,
        }).then((data) => {
            this.setState({ flowInstanceList: data.data })
        })
    }

    getFlowNode = (flowInstanceId: string) => {
        queryExecutionDetail({
            flowInstanceId: flowInstanceId,
        }).then((data) => {
            this.setState({ flowNodeList: data.data.execution })
        })
    }

    openTacticFun = () => {
        var req = { name: this.state.tacticName }
        openTactic(req).then((data) => {
            this.getTacticDetail();
        });
    }

    initChartDate = (conId: number) => {
        if (this.hcChart && typeof this.hcChart.update === 'function') {
            this.hcChart.destroy()
        }
        if (this.intervalId_chart) {
            clearInterval(this.intervalId_chart);
        }
        this.hcChart =  Highcharts.stockChart('hcChart', this.hcOptions)
        this.hcChart.series[0].setData([]);
        
        queryChartInitData({
            conId: conId,
            preTime: this.state.preTime
        }).then((data) => {
            // if (data.data.length > 0) {
            //     let lastTime = 0;
            //     for (let e of data.data) {
            //         this.hcChart.series[0].addPoint([e.time, e.close], false);
            //         if (e.time > lastTime) {
            //             lastTime = e.time;
            //         }
            //     }
            //     this.hcChart.redraw()
            //     if (lastTime > this.state.chartLastTime){
            //         this.setState({chartLastTime: lastTime})
            //     }
            // }
            
            if (data.data.length > 0) {
                let lastTime = 0;
                for (let e of data.data) {
                    // this.hcChart.series[0].addPoint([e.time, e.close], false);
                    this.hcChart.series[0].addPoint([e.time, e.open, e.high, e.low, e.close], false)
                    this.hcChart.series[1].addPoint({ x: e.time, y: e.volume, id: 'v_' + e.time }, false)
                }
                this.hcChart.redraw()
                if (lastTime > this.state.chartLastTime){
                    this.setState({chartLastTime: lastTime})
                }
            }

        })
    }
    fetchRealtimeData = (conId : number ) => {

        this.intervalId_chart = setInterval(() => {

            if (this.hcChart && this.hcChart.series && this.hcChart.series.length > 0) {
                // 已初始化且有数据
                queryChartModifiedData({
                    conId: conId,
                    begin: this.state.chartLastTime,
                }).then((data) => {
                    let lastTime = 0;
                    let lastPrice = 0;
                    for (let e of data.data) {
                        // this.hcChart.series[0].addPoint([e.time, e.close],false);
                        this.hcChart.series[0].addPoint([e.time, e.open, e.high, e.low, e.close], false)
                        this.hcChart.series[1].addPoint({ x: e.time, y: e.volume, id: 'v_' + e.time }, false)
                        if (e.time > lastTime) {
                            lastTime = e.time;
                            lastPrice = e.close;
                        }
                    }
                    if (lastTime > this.state.chartLastTime){
                        this.setState({chartLastTime: lastTime})
                        this.setState({lastPrice: lastPrice})
                    }
                    this.hcChart.redraw()
                });
            } else {
                return;
                // 未初始化或没有数据
            }
            
        }, 5000); 
      }

    shutdownTacticFun = () => {
        var req = { name: this.state.tacticName }
        shutdownTactic(req).then((data) => {
            this.getTacticDetail();
        });
    }
    subscribeDataFun = () => {
        var req = { name: this.state.tacticName }
        subscribeTacticData(req).then((data) => {
        });
    }

    queryDataRecordKeysFun = (conId : number) => {
        var req = { conId: conId }
        queryDataRecordKeys(req).then((data) => {
            this.setState({ dataKeys: data.data })
        });
    }
    queryDataRecordsFun = (key: string) => {
        var req = { key: key, conId: this.state.conId }
        this.hcChart.series[2].setData([]);
        queryDataRecords(req).then((data) => {
            if (data.data.length > 0) {
                for (let e of data.data) {
                    // this.hcChart.series[0].addPoint([e.time, e.close], false);
                    this.hcChart.series[2].addPoint([e.time, e.val], false)
                }
                this.hcChart.redraw()
            }
        })
    }

    onConBtnClick = (conId: number) => {
        this.setState({
            chartLastTime: null,
            conId: conId,
            orderQueryConId: conId
        },()=>this.getOrderList())
        this.initChartDate(conId)
        this.fetchRealtimeData(conId)
        this.queryDataRecordKeysFun(conId)
    }

    onAllOrderBtnClick = () => {
        this.setState({orderQueryConId: null},()=>this.getOrderList())
    }

    onRemoveBankCacheBtnClick = () => {
        var req = { name: this.state.tacticName }
        removeBankCache(req).then((data) => {
            this.getTacticStocks();
        });
    }

    viewStockDataFun = (conId: number) => {
        var datas = new Array<DataPoolType>();
        var optConditions = new Array<any>();
        this.setState({conId: conId})
        //查找数据
        this.state.entranceConfigList.find((item) => {
            if (item.conId === conId) {
                optConditions = item.optConditions;
            }
        })


        var keys = optConditions.map((item) => {
            if (item){
                return item.dataKey
            }else{
                return null;
            }
        })
        var req = {
            conId: conId,
            keys: keys
        }

        queryDataByKey(req).then((data) => {
            optConditions.forEach((item) => {
                var o = {
                    key: item.dataKey + (item.than == 1 ? '>' : '<')+ item.val,
                    than: item.than,
                    value: item.val,
                    nowValue: data.data[item.dataKey],
                }
                datas.push(o)
            })
            this.setState({ dataPool: datas })
        })
    }
    orderPageOnChange = (page: number, pageSize: number) => {
        this.setState({
            orderCurPage: page,
        },()=>this.getOrderList())
    }

    chartAnimationInit = () => {

        this.intervalId_animation = setInterval(() => {
            if (this.state.conId === undefined) {
                return;
            }
            if (!(this.hcChart && this.hcChart.series && this.hcChart.series.length > 0)) {
                return;
            } 
            todayOrder({
                conId: this.state.conId,
                tactic: this.state.tacticName,
                preTime: this.state.preTime
            }).then((data) => {
                var ePoints = new Array<Object>();
                var pPoints = new Array<Object>();
                var lPoints = new Array<Object>();

                data.data.forEach((e: any) => {
                    var text = "";
                    if (e.flowNodeType === 'stock_submit_order') {
                        text = "S"
                        var point = {
                            point:{
                                x: e.created*1000,
                                y: e.avgFillPrice,
                                distance: 50,
                                xAxis: '0', // 根据实际需求填充
                                yAxis: '0'  // 根据实际需求填充
                                
                            },
                            text: text
                        }
                        ePoints.push(point)
                    }else if (e.flowNodeType === 'stock_stop_profit') {
                        text = "P"
                        var point = {
                            point:{
                                x: e.created*1000,
                                y: e.avgFillPrice,
                                distance: 50,
                                xAxis: '0', // 根据实际需求填充
                                yAxis: '0'  // 根据实际需求填充
                                
                            },
                            text: text
                        }
                        pPoints.push(point)
                    }else if (e.flowNodeType === 'stock_stop_loss') {
                        text = "L"
                        var point = {
                            point:{
                                x: e.created*1000,
                                y: e.avgFillPrice,
                                distance: 50,
                                xAxis: '0', // 根据实际需求填充
                                yAxis: '0'  // 根据实际需求填充
                                
                            },
                            text: text
                        }
                        lPoints.push(point)
                    }
                   
                });
                const eAnnotations: any = {
                    id:"eA",
                    labels: ePoints,
                    labelOptions: {
                        align: 'left',
                        // verticalAlign: "top",
                        allowOverlap: true,
                        backgroundColor: "rgba(255, 0, 0, 1)"
                    }
                }
                const pAnnotations: any = {
                    id:"pA",
                    labels: pPoints,
                    labelOptions: {
                        align: 'left',
                        // verticalAlign: "top",
                        allowOverlap: true,
                        backgroundColor: "rgba(74, 124, 245, 0.8)"
                    }
                }
                const lAnnotations: any = {
                    id:"lA",
                    labels: lPoints,
                    labelOptions: {
                        align: 'left',
                        allowOverlap: true,
                        backgroundColor: "rgba(0, 255, 0, 1)"
                    }
                }
                this.hcChart.removeAnnotation("eA")
                this.hcChart.addAnnotation(eAnnotations)
                this.hcChart.removeAnnotation("pA")
                this.hcChart.addAnnotation(pAnnotations)
                this.hcChart.removeAnnotation("lA")
                this.hcChart.addAnnotation(lAnnotations)
            });

        }, 5000); 
    }

    testFun = () => {
        // this.chartAnimationInit(this.state.conId);
    }

    render(): React.ReactNode {
        document.title = '策略详情';


        const onChangeOrderQuery = (orderBy: string, flowNodeType: string)=>{
            this.setState({ 
                orderQueryOrderBy: orderBy,
                orderQueryFlowNodeType: flowNodeType
                },()=>this.getOrderList())
        };

        return <>
            <Flex gap="middle" wrap>
                <Layout style={leftLayoutStyle}>
                    <Header style={leftHeaderStyle}>
                        <Row gutter={16}>
                            <Col span={3}>
                                <Statistic
                                    title="InitFund"
                                    value={this.state.detail.initFund}
                                    valueStyle={{ color: '#3f8600' }}
                                />
                            </Col>
                            <Col span={3}>
                                <Statistic
                                    title="NvdFund"
                                    value={this.state.fund.nvdFund}
                                    precision={2}
                                    valueStyle={{ color: this.state.fund.pnl > 0 ? '#3f8600' : '#cf1322' }}
                                />
                            </Col>
                            <Col span={3}>
                                <Statistic
                                    title="Pnl"
                                    value={this.state.fund.pnl}
                                    precision={2}
                                    valueStyle={{ color: this.state.fund.pnl > 0 ? '#3f8600' : '#cf1322' }}
                                />
                            </Col>
                           
                            <Col span={3}>
                                <Statistic
                                    title="Commission"
                                    value={this.state.fund.commission}
                                    precision={2}
                                    valueStyle={{ color: this.state.fund.pnl > 0 ? '#3f8600' : '#cf1322' }}
                                />
                            </Col>
                            <Col span={2}>
                                <Statistic
                                    title="DayPnl"
                                    value={this.state.dayPnl.pnl}
                                    precision={2}
                                    valueStyle={{ color: this.state.fund.pnl > 0 ? '#3f8600' : '#cf1322' }}
                                />
                            </Col>
                            <Col span={3}>
                                <Statistic
                                    title="DayCommission"
                                    value={this.state.dayPnl.commission}
                                    precision={2}
                                    valueStyle={{ color: this.state.fund.pnl > 0 ? '#3f8600' : '#cf1322' }}
                                />
                            </Col>
                            <Col span={3} style={{ display: 'flex' }}>
                                <Statistic
                                    title="Status"
                                    value={this.state.enable === 1 ? '已启用' : '已停用'}
                                />
                            </Col>
                            <Col span={3}>
                                <Statistic
                                    title="Start Time"
                                    value={this.state.detail.createdTime}
                                    valueStyle={{ fontSize: '15px' }}
                                />
                            </Col>
                        </Row>
                        <Row>
                        <Col span={10}>
                            <ColorTags scannerTags={this.state.detail.scannerTags} flowTags={this.state.detail.flowTags} />
                        </Col>
                        <Col span={14}><ConDesc conId={this.state.conId}></ConDesc></Col>

                        </Row>
                        <Row>
                            <Col span={24}>
                            <Flex gap="4px 0" wrap>
                                {this.state.dataKeys&&this.state.dataKeys.length > 0 && this.state.dataKeys.map((tag, index) => (
                                    <Tag key={index} onClick={() => this.queryDataRecordsFun(tag)} color="green">
                                        {tag}
                                    </Tag>
                                ))}
                            </Flex>
                            </Col>
                        </Row>

                    </Header>
                    <Content style={leftContentStyle}>
                       
                        <div id = "hcChart" />
                        </Content>
                    <Footer style={footerStyle}>
                        <Row>
                            <Button type="primary" onClick={this.onAllOrderBtnClick}>All</Button>

                            <Col span={4}>
                                <Select defaultValue="false" onChange={e=>onChangeOrderQuery(e,this.state.orderQueryFlowNodeType)}>
                                    <Select.Option value="true" >Desc</Select.Option>
                                    <Select.Option value="false">Aesc</Select.Option>
                                </Select>
                            </Col>
                            <Col span={4}>
                                <Select defaultValue="All" onChange={e=>onChangeOrderQuery(this.state.orderQueryOrderBy,e)}>
                                    <Select.Option value="All" >All</Select.Option>
                                    <Select.Option value="stock_submit_order" >stock_submit_order</Select.Option>
                                    <Select.Option value="stock_stop_profit">stock_stop_profit</Select.Option>
                                    <Select.Option value="stock_stop_loss">stock_stop_loss</Select.Option>
                                    <Select.Option value="c">c</Select.Option>
                                    <Select.Option value="sp_c">sp_c</Select.Option>
                                    <Select.Option value="sp_c">day_clear</Select.Option>
                                </Select>
                            </Col>
                        </Row>
                        <Table rowKey="orderId" virtual scroll={{ x: 600, y: 800 }} size="small" bordered columns={this.orderColumns} dataSource={this.state.orders} pagination={false} rowClassName="custom-row-height ">
                        </Table>
                        <Pagination onChange={this.orderPageOnChange} defaultCurrent={1} total={this.state.orderTotalNum} pageSize={20}/>
                    </Footer>
                </Layout>

                <Layout style={rightLayoutStyle}>
                    <Header style={rihgtHeaderStyle}>
                        <Row>
                            <Col span={4}>
                                <Button style={{  marginLeft: '10px' }} type="primary" onClick={this.state.enable === 1 ? this.shutdownTacticFun : this.openTacticFun}>
                                    开关
                                </Button>
                            </Col>
                            <Col span={4}>
                                <Button style={{ marginLeft: '10px' }} type="primary" onClick={this.subscribeDataFun}>
                                    订阅
                                </Button>
                            </Col>
                            <Col span={4}>
                                <Button style={{ marginLeft: '10px' }} type="primary" onClick={this.onRemoveBankCacheBtnClick}>
                                    DCache
                                </Button>
                            </Col>
                            <Col span={4}>
                                <Button style={{ marginLeft: '10px' }} type="primary" onClick={this.testFun}>
                                    测试
                                </Button>
                            </Col>
                            <Col span={4}>
                            <Link href={"/tactic/taskStat?&tacticName="+this.state.tacticName} target="_blank">
                                任务统计
                            </Link>
                               
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table rowKey="conId" columns={this.posotionColumns} virtual scroll={{y: 500 }} dataSource={this.state.entranceConfigList} pagination={false} bordered showHeader={false} size="small">
                                </Table>
                            </Col>
                        </Row>
                    </Header>
                    <Content style={rightContentStyle}>
                        <Row>
                            <Col span={8}>
                                <Table rowKey="conId" virtual scroll={{ y: 500 }} bordered columns={this.stockColumns} dataSource={this.state.entranceConfigList} pagination={false} size="small">
                                </Table>
                            </Col>
                            <Col span={16}>
                                <Table rowKey="key" virtual scroll={{ y: 500 }} bordered columns={this.dataPoolColumns} dataSource={this.state.dataPool} pagination={false} size="small">
                                </Table>
                            </Col>
                        </Row>

                    </Content>
                    <Content style={rightInstanceStyle}>
                        {/* <Table rowKey="flowInstanceId" virtual scroll={{ y: 100 }} bordered columns={this.flowInstanceColumns} dataSource={this.state.flowInstanceList} pagination={false} size="small" >
                        </Table> */}
                    </Content>
                    <Footer style={rightFooterStyle}>
                        {/* <Table rowKey="" virtual scroll={{ y: 400 }} bordered columns={this.flowNodeColumns} dataSource={this.state.flowNodeList} pagination={false}>
                        </Table> */}
                    </Footer>
                </Layout>
            </Flex>
        </>
    }
}