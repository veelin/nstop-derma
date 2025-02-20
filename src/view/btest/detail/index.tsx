import React from "react";
import { Button, Table, Col, Row, Pagination, Flex, Layout, Statistic, Collapse, Tooltip, Select } from 'antd';
import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { queryBtCandle, queryBtOrderList, queryBtEDetail,queryBtStockList,btRunTestEntry } from '../../../service/stock'
import { log } from "console";
import Highcharts from 'highcharts';
import Stock from 'highcharts/modules/stock';
import Annotations from "highcharts/modules/annotations";
import './index.css'; // 引入你的 CSS 文件

const { Header, Footer, Sider, Content } = Layout;
const { Column, ColumnGroup } = Table;
const { Panel } = Collapse;
type MenuItem = Required<MenuProps>['items'][number];


Stock(Highcharts);
Annotations(Highcharts);

const leftHeaderStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 60,
    paddingInline: 48,
    lineHeight: '48px',
    backgroundColor: '#F0F0F0',
};
const rihgtHeaderStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 900,
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
    height: 360,
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

interface StockType {
    conId: number;
    symbol: string;
    industry: string;
    pnl: number;
    submitCnt: number;
}

interface StateStruct {
    tacticName: string | any;
    orders: Array<any>;
    detail: Object | any;
    conId: number | any;
    orderQueryConId: number | any;
    eId: string | any;
    stocks: Array<any>,
    orderBy: boolean | any;
    flowNodeType: string | any,
}


export default class BTestDetail extends React.Component<{}, StateStruct> {

    constructor(props: any) {
        super(props);
        let url = new URLSearchParams(window.location.href);
        this.state = {
            tacticName: url.get('tacticName'),
            orders: [],
            detail: {},
            conId: null,
            orderQueryConId: null,
            eId: url.get('eId'),
            stocks:[],
            orderBy: false,
            flowNodeType: 'All',
        };
    }

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
          data: []
        }]
      }

    hcChart: Highcharts.Chart = {} as Highcharts.Chart;

    stockColumns:ColumnsType<StockType> = [
        {
            title: 'conId',
            dataIndex: 'conId',
            fixed: 'left',
            align: 'center',

        },
        {
            title: 'symbol',
            dataIndex: 'symbol',
            fixed: 'left',
            align: 'center',
            render: (_, record) => (
                <a onClick={() => this.onConBtnClick(record.conId)}>
                    {record.symbol}
                </a>
            )
        },
        {
            title: 'industry',
            dataIndex: 'industry',
            fixed: 'left',
            align: 'center',

        },
        {
            title: 'pnl',
            dataIndex: 'pnl',
            fixed: 'left',
            align: 'center',

        },
        {
            title: 'submitCnt',
            dataIndex: 'submitCnt',
            fixed: 'left',
            align: 'center',

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

        },
        {
            title: 'orderType',
            dataIndex: 'orderType',
            align: 'center',

        },

        {
            title: 'lmtPrice',
            dataIndex: 'lmtPrice',
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
                const date = new Date(timestamp * 1000);
                return (
                    <>{new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(date)}</>
                );
            },
        },

    ]


    componentDidMount() {
        this.getTacticDetail();
        this.getOrderList();
        

    }
    componentWillUnmount() {
    }

    getTacticDetail = () => {
        queryBtEDetail({
            eId: this.state.eId,
        }).then((data) => {
            this.setState({ detail: data.data }, () => {
                 this.getStockList();
                this.chartAnimationInit();
            })
        })
    }


    getOrderList = () => {
        queryBtOrderList({
            eId: this.state.eId,
            conId: this.state.orderQueryConId,
            orderBy: this.state.orderBy,
            flowNodeType: this.state.flowNodeType,
        }).then((data) => {
            this.setState({ orders: data.data })
        })
    }

    getStockList = () => {
        queryBtStockList({
            eId: this.state.eId,
        }).then((data) => {
            this.setState({ stocks: data.data })
            this.initChartDate(data.data[0].conId)
        })
    }

    initChartDate = (conId: number) => {
        if (this.hcChart && typeof this.hcChart.update === 'function') {
            this.hcChart.destroy()
        }
        this.hcChart = Highcharts.stockChart('hcChart', this.hcOptions)
        this.hcChart.series[0].setData([]);

        queryBtCandle({
            conId: conId,
            beginDate: this.state.detail.beginDate,
            endDate: this.state.detail.endDate,
            barSize: '5 secs'
        }).then((data) => {
            if (data.data.length > 0) {
                for (let e of data.data) {
                    // this.hcChart.series[0].addPoint([e.time, e.close], false);
                    this.hcChart.series[0].addPoint([e.time, e.open, e.high, e.low, e.close], false)
                    this.hcChart.series[1].addPoint({ x: e.time, y: e.volume, id: 'v_' + e.time }, false)
                }
                this.hcChart.redraw()
                this.chartAnimationInit()
            }
        })
    }

    onConBtnClick = (conId: number) => {
        this.setState({ conId: conId })
        this.setState({ orderQueryConId: conId },()=>this.getOrderList())
        this.initChartDate(conId)
    }
    onAllOrderBtnClick = () => {
        this.setState({ orderQueryConId: null },()=>this.getOrderList())
    }
    onReRun = () => {
        btRunTestEntry({
            eId: this.state.eId,
            runConId: this.state.conId
        }).then((data) => {
            this.getTacticDetail();
        })
    }

    chartAnimationInit = () => {

        if (this.state.conId === undefined) {
            return;
        }
        if (!(this.hcChart && this.hcChart.series && this.hcChart.series.length > 0)) {
            return;
        }
        
            var ePoints = new Array<Object>();
            var pPoints = new Array<Object>();
            var lPoints = new Array<Object>();

            this.state.orders.forEach((e: any) => {
                var text = "";
                if (e.flowNodeType === 'stock_submit_order') {
                    text = "S"
                    var point = {
                        point: {
                            x: e.created * 1000,
                            y: e.avgFillPrice,
                            distance: 50,
                            xAxis: '0', // 根据实际需求填充
                            yAxis: '0'  // 根据实际需求填充

                        },
                        text: text
                    }
                    ePoints.push(point)
                } else if (e.flowNodeType === 'stock_stop_profit') {
                    text = "P"
                    var point = {
                        point: {
                            x: e.created * 1000,
                            y: e.avgFillPrice,
                            distance: 50,
                            xAxis: '0', // 根据实际需求填充
                            yAxis: '0'  // 根据实际需求填充

                        },
                        text: text
                    }
                    pPoints.push(point)
                } else if (e.flowNodeType === 'stock_stop_loss') {
                    text = "L"
                    var point = {
                        point: {
                            x: e.created * 1000,
                            y: e.avgFillPrice,
                            distance: 50,
                            xAxis: '0', // 根据实际需求填充
                            yAxis: '0'  // 根据实际需求填充

                        },
                        text: text
                    }
                    lPoints.push(point)
                } else if (e.flowNodeType === 'c') {
                    text = "C"
                    var point = {
                        point: {
                            x: e.created * 1000,
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
                id: "eA",
                labels: ePoints,
                labelOptions: {
                    align: 'left',
                    // verticalAlign: "top",
                    allowOverlap: true,
                    backgroundColor: "rgba(255, 0, 0, 1)"
                }
            }
            const pAnnotations: any = {
                id: "pA",
                labels: pPoints,
                labelOptions: {
                    align: 'left',
                    // verticalAlign: "top",
                    allowOverlap: true,
                    backgroundColor: "rgba(74, 124, 245, 0.8)"
                }
            }
            const lAnnotations: any = {
                id: "lA",
                labels: lPoints,
                labelOptions: {
                    align: 'left',
                    allowOverlap: true,
                    backgroundColor: "rgba(0, 255, 0, 1)",
                }
            }
            this.hcChart.removeAnnotation("eA")
            this.hcChart.addAnnotation(eAnnotations)
            this.hcChart.removeAnnotation("pA")
            this.hcChart.addAnnotation(pAnnotations)
            this.hcChart.removeAnnotation("lA")
            this.hcChart.addAnnotation(lAnnotations)

    }

    testFun = () => {
        // this.chartAnimationInit(this.state.conId);
    }

    render(): React.ReactNode {
        document.title = '回测详情';

        const onChangeOrderQuery = (orderBy: string, flowNodeType: string)=>{
            this.setState({ 
                orderBy: orderBy,
                flowNodeType: flowNodeType
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
                                    title="Pnl"
                                    value={this.state.detail.pnl}
                                    precision={2}
                                    valueStyle={{ color: this.state.detail.pnl > 0 ? '#3f8600' : '#cf1322' }}
                                />
                            </Col>
                            <Col span={3}>
                                <Statistic
                                    title="Commision"
                                    value={this.state.detail.commision}
                                    precision={2}
                                    valueStyle={{ color: this.state.detail.commision > 0 ? '#3f8600' : '#cf1322' }}
                                />
                            </Col>

                            <Col span={3}>
                                <Statistic
                                    title="OrderCnt"
                                    value={this.state.detail.orderCnt}
                                />
                            </Col>
                            <Col span={3}>
                                <Statistic
                                    title="stopProfitValue"
                                    value={this.state.detail.stopProfitValue}
                                />
                            </Col>
                            <Col span={3}>
                                <Statistic
                                    title="stopLossValue"
                                    value={this.state.detail.stopLossValue}
                                />
                            </Col>
                            <Col span={3}>
                                <Statistic
                                    title="cutoffValue"
                                    value={this.state.detail.cutoffValue}
                                />
                            </Col>
                            <Col span={3}>
                                <Statistic
                                    title="Start Time"
                                    value={this.state.detail.beginStr}
                                    valueStyle={{ fontSize: '15px' }}
                                />
                            </Col>
                        </Row>
                    </Header>
                    <Content style={leftContentStyle}>
                        <div id="hcChart" />
                    </Content>
                    <Footer style={footerStyle}>
                        <Row>
                            <Col span={4}><Button type="primary" onClick={this.onAllOrderBtnClick}>All</Button></Col>
                            <Col span={1}></Col>
                            <Col span={4}><Button type="primary" onClick={this.onReRun}>reRun</Button><a>{this.state.conId}</a></Col>
                            <Col span={4}>
                                <Select defaultValue="false" onChange={e=>onChangeOrderQuery(e,this.state.flowNodeType)}>
                                    <Select.Option value="true" >Desc</Select.Option>
                                    <Select.Option value="false">Aesc</Select.Option>
                                </Select>
                            </Col>
                            <Col span={4}>
                                <Select defaultValue="All" onChange={e=>onChangeOrderQuery(this.state.orderBy,e)}>
                                    <Select.Option value="All" >all</Select.Option>
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
                        {/* <Pagination onChange={this.orderPageOnChange} defaultCurrent={1} total={this.state.orderTotalNum} pageSize={20}/> */}
                    </Footer>
                </Layout>

                <Layout style={rightLayoutStyle}>
                    <Header style={rihgtHeaderStyle}>
                        <Row>
                            <Col span={24}>
                                <Table rowKey="conId" virtual scroll={{ y: 1000 }} bordered columns={this.stockColumns} dataSource={this.state.stocks} pagination={false} size="small">
                                </Table>
                            </Col>
                            {/* <Col span={4}>
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
                                <Button style={{ marginLeft: '10px' }} type="primary" onClick={this.testFun}>
                                    测试
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table rowKey="conId" columns={this.posotionColumns} dataSource={this.state.positions} pagination={false} bordered showHeader={false} size="small">
                                </Table>
                            </Col> */}
                        </Row>
                    </Header>
                    <Content style={rightContentStyle}>
                        <Row>
                            
                            {/* <Col span={20}>
                                <Table rowKey="key" virtual scroll={{ y: 300 }} bordered columns={this.dataPoolColumns} dataSource={this.state.dataPool} pagination={false} size="small">
                                </Table>
                            </Col> */}
                        </Row>

                    </Content>
                    {/* <Content style={rightInstanceStyle}>
                        <Table rowKey="flowInstanceId" virtual scroll={{ y: 100 }} bordered columns={this.flowInstanceColumns} dataSource={this.state.flowInstanceList} pagination={false} size="small" >
                        </Table>
                    </Content>
                    <Footer style={rightFooterStyle}>
                        <Table rowKey="" virtual scroll={{ y: 400 }} bordered columns={this.flowNodeColumns} dataSource={this.state.flowNodeList} pagination={false}>
                        </Table>
                    </Footer> */}
                </Layout>
            </Flex>
        </>
    }
}