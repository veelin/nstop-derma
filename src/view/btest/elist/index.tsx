import React from "react";
import { Button, Space, Table, Col, Row, Drawer, Form, Input, Select,Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { staticsBTest, queryBTestSubList, queryBTestList } from '../../../service/stock'
import { Link } from 'react-router-dom'


interface DataType {
    id: number;
    bId: number;
    eid: string;
    tactic: string;
    pnl: number;
    commision: number;
    orderCnt: number;
    submit : number;
    submitCanceled: number;
    stopProfit: number;
    stopProfitCanceled: number;
    stopLoss: number;
    cutoff: number;
    stopProfitValue: number;
    stopLossValue: number;
    cutoffValue: number;
    beginDate: Date;
    endDate: Date;
    
}


export default class BTestList extends React.Component<{}, { listData: Array<DataType>, bId: number}>{

    constructor(props: any) {
        super(props);
        let url = new URLSearchParams(window.location.href);

        this.state = { 
            listData: new Array<DataType>(),
            bId: Number(url.get("bId"))
        };
    }

    componentDidMount() {
        this.getBEList();
    }
    getBEList = () => {
        var req = {"bId": this.state.bId}
        queryBTestSubList(req).then((data) => {
            // let t = new ListType();
            // Object.keys(t).map((key: string) => {
            //     t[key] = data['data']['flowList'][key]
            // })
            this.setState({ listData: data.data })
        });
    }
    
    columns: ColumnsType<DataType> = [
        {
            title: 'id',
            dataIndex: 'id',
            render: (text) => <a>{text}</a>,
        },

        {
            title: 'beginDate',
            dataIndex: 'beginDateStr',
        },
        {
            title: 'pnl',
            dataIndex: 'pnl',
            render: (value: number) => value.toFixed(2),
        },
        {
            title: 'commision',
            dataIndex: 'commision',
            render: (value: number) => value.toFixed(2),
        },
        {
            title: 'orderCnt',
            dataIndex: 'orderCnt',
    
        },
        {
            title: 'submit',
            dataIndex: 'submit',
    
        },{
            title: 'submitCanceled',
            dataIndex: 'submitCanceled',
    
        },{
            title: 'stopProfit',
            dataIndex: 'stopProfit',
    
        },{
            title: 'stopProfitCanceled',
            dataIndex: 'stopProfitCanceled',
    
        },{
            title: 'stopLoss',
            dataIndex: 'stopLoss',
    
        },{
            title: 'cutoff',
            dataIndex: 'cutoff',
    
        },{
            title: 'stopProfitValue',
            dataIndex: 'stopProfitValue',
            render: (value: number) => value.toFixed(2),

    
        },{
            title: 'stopLossValue',
            dataIndex: 'stopLossValue',
            render: (value: number) => value.toFixed(2),

    
        },{
            title: 'cutoffValue',
            dataIndex: 'cutoffValue',
            render: (value: number) => value.toFixed(2),
        },

        
        {
            title: '操作',
            render: (_, record) => <Link target="_blank"
                to={`/bt/eDetail?&eId=${record.eid}`} >
                查看
            </Link>,
        },
    
    ]

    render(): React.ReactNode {
        document.title = '回测日列表';

        return <>
            <Row>
                <Col span={24}>
                    <Table columns={this.columns} dataSource={this.state.listData} pagination={false} />
                </Col>
            </Row>

        </>
    }
}