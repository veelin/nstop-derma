import React from "react";
import { Button, Space, Table, Col, Row, Drawer, Form, Input, Select,Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {queryExecuteStatList } from '../../service/stock'
import { Link } from 'react-router-dom'


interface DataType {
    tactic: string;
    finishedTask: number;
    entranceTask: number;
    submitTask: number;
    pnlTask: number;
    stopProfitTask: number;
    stopLossTask: number;
}


export default class ExecuteList extends React.Component<{}, { listData: Array<DataType>, tacticName: string|any }>{

    constructor(props: any) {
        super(props);
        let url = new URLSearchParams(window.location.href);
        console.log(url.get("tacticName"))
        this.state = { 
            listData: new Array<DataType>(),
            tacticName: url.get("tacticName")
        };
    }

    componentDidMount() {
        this.getBTestList();
    }
    getBTestList = () => {
        var req = {"name": this.state.tacticName}
        queryExecuteStatList(req).then((data) => {
            this.setState({ listData: data.data })
        });
    }
  
    columns: ColumnsType<DataType> = [
        {
            title: 'tactic',
            dataIndex: 'tactic',
            render: (text) => <a>{text}</a>,
        },

        {
            title: 'finishedTask',
            dataIndex: 'stat',
            render: (text) => <a>{text.finishedTask}</a>,
        },
        {
            title: 'entranceTask',
            dataIndex: 'stat',
            render: (text) => <a>{text.entranceTask}</a>,
        },
        {
            title: 'submitTask',
            dataIndex: 'stat',
            render: (text) => <a>{text.submitTask}</a>,

        },
        {
            title: 'pnlTask',
            dataIndex: 'stat',
            render: (text) => <a>{text.pnlTask}</a>,

        },
        {
            title: 'stopProfitTask',
            dataIndex: 'stat',
            render: (text) => <a>{text.stopProfitTask}</a>,
    
        },
        {
            title: 'stopLossTask',
            dataIndex: 'stat',
            render: (text) => <a>{text.stopLossTask}</a>,
        },
    
    ]

    render(): React.ReactNode {
        document.title = '策略任务统计列表';

        return <>
            <Row>
                <Col span={24}>
                    <Table columns={this.columns} dataSource={this.state.listData} pagination={false} />
                </Col>
            </Row>

        </>
    }
}