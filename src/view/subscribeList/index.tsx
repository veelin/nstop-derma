import React from "react";
import {Button, Table, Col, Row,Tag ,Space, Pagination} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { querySubscribeDataList, subscribeData} from '../../service/stock'
const { Column, ColumnGroup } = Table;


interface DataType {
    conId: number;
    symbol: string;
    status: string;
    subTopMktData: boolean;
    subHistoryData: boolean;
    subRealBarData: boolean;
    topMktGap: number;
    historyGap: number;
    realTimeBarGap: number;

}


interface StaticsDataType {
    total: number;
    subCnt: number;
}


export default class SubscribeDataList extends React.Component<{}, { subcribeListData: Array<DataType>, statics: StaticsDataType}>{

    constructor(props: any) {
        super(props);
        this.state = { subcribeListData: new Array<DataType>(), 
            
            statics: {
                subCnt : 0,
                total : 0
            }
        
        };
    }


columns: ColumnsType<DataType> = [
    {
        title: 'conId',
        dataIndex: 'conId',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'symbol',
        dataIndex: 'symbol',
    },
    {
        title: 'status',
        dataIndex: 'status',
        filters: [
            {
              text: 'subscribed',
              value: 'subscribed',
            },
            {
              text: 'wait',
              value: 'wait',
            },
          ],
          onFilter: (value, record) => record.status.indexOf(value as string) === 0,
    },
    {
        title: 'realTime数据',
        dataIndex: 'subRealBarData',
        render: (_, { subRealBarData,realTimeBarGap }) => (
            <>
                  <Tag color={subRealBarData ? 'green' : 'volcano'} >
                     {realTimeBarGap}
                  </Tag>
            </>
          ),

    },
    {
        title: 'mkt数据',
        dataIndex: 'subTopMktData',
        render: (_, { subTopMktData,topMktGap }) => (
            <>
                  <Tag color={subTopMktData ? 'green' : 'volcano'} >
                     {topMktGap}
                  </Tag>
            </>
          ),

    },
    {
        title: '历史数据',
        dataIndex: 'subHistoryData',
        sorter: (a, b) => a.historyGap-b.historyGap,
        sortDirections: ['descend'],
        defaultSortOrder: 'descend',

        render: (_, { subHistoryData,historyGap }) => (
            <>
                  <Tag color={subHistoryData ? 'green' : 'volcano'} >
                    {historyGap}
                  </Tag>
            </>
          ),

    },
    {
        title: 'realTime',
        dataIndex: 'updateRealTime',
    },
    {
        title: 'updateTime',
        dataIndex: 'updateTime',
    },
    {
        title: 'updateHistoryTime',
        dataIndex: 'updateHistoryTime',
        defaultSortOrder: 'descend',

    },
   
    {
        title: '操作',
        dataIndex: 'conId',
        render: (_, { conId }) => (
            <>
            <Space size="middle">
                            <Button onClick={()=>subscribeData(conId)}>重新订阅</Button>
                            </Space>
            </>
          ),

    },
    
]
    intervalId :any
    componentDidMount() {
        this.getSubscribeDataList();
        this.intervalId = setInterval(() => {
            this.getSubscribeDataList();
          }, 3000); // 每5秒执行一次
    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }
    getSubscribeDataList = () => {
        var req = {}
        querySubscribeDataList(req).then((data) => {
            this.setState({ subcribeListData: data.data })

            var statis = {
                subCnt : 0,
                total : 0
            }
            var subCnt = 0
            var total = 0
            data.data.forEach((item : any) => {
                statis.total++
                if (item.status = 'subscribed') {
                    statis.subCnt++
                }
            });

            this.setState({ statics: statis })

        });
    }
  
    reSubscribeData = (conId : any) => {
        subscribeData(conId).then((data)=>{
        });
    }

    render(): React.ReactNode {
        document.title = '订阅列表';

        return <>
            <Row>
                <Col span={24}>
                    <Button onClick={this.getSubscribeDataList}>刷新</Button>
                </Col>
            </Row>
            <Row>
                <a>total:{this.state.statics.total}, subscribed:{this.state.statics.subCnt}</a>
            </Row>
            <Row>
                <Col span={24}>
                    
                    <Table rowKey="conId" columns={this.columns}  dataSource={this.state.subcribeListData} pagination={false}>
                    </Table>
                </Col>
            </Row>
        </>
    }
}