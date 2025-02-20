import React from "react";
import { Button, Space, Table, Col, Row, Drawer, Form, Input, Select,Modal,FloatButton } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { staticsBTest, queryBTestSubList, queryBTestList } from '../../../service/stock'
import { Link } from 'react-router-dom'
import ColorTags from "../../components/tacticTags";
import type { TableColumnsType } from 'antd';


interface DataType {
    id: number;
    tactic: string;
    scannerSecId: string;
    pnl: number;
    commision: number;
    orderCnt: number;
    beginDate: Date;
    endDate: Date;
    scannerTags: Array<any>;
    flowTags: Array<any>;
}
class ListType {
    current: number = 0;
    size: number = 0;
    records: Array<DataType> = new Array<DataType>();
    total: number = 0;
}





export default class BTestList extends React.Component<{}, { listData: Array<DataType>, sId: string|any}>{

    constructor(props: any) {
        super(props);
        let url = new URLSearchParams(window.location.href);

        this.state = { 
            listData: new Array<DataType>(),
            sId: url.get("sId")
        };
    }

    componentDidMount() {
        this.getBTestList();
    }
    getBTestList = () => {
        var req = {"current": 1,"size":100, "sId": this.state.sId}
        queryBTestList(req).then((data) => {
            // let t = new ListType();
            // Object.keys(t).map((key: string) => {
            //     t[key] = data['data']['flowList'][key]
            // })
            this.setState({ listData: data.data })
        });
    }
  

    statBtest = (id: number) => {
        var req = {"bId": id}
        staticsBTest(req).then((data) => {
            this.getBTestList();
        });
    }

    columns: ColumnsType<DataType> = [
        {
            title: 'id',
            dataIndex: 'id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'tactic',
            dataIndex: 'tactic',
        },
        {
            title: 'scannerSecId',
            dataIndex: 'scannerSecId',
        },
        {
            title: 'tags',
            dataIndex: 'scannerTags',
            render: (_, record) => (
                <ColorTags scannerTags={record.scannerTags} flowTags={record.flowTags} />
            ),
        },
        {
            title: 'pnl',
            dataIndex: 'pnl',
            sorter: (a, b) => a.pnl - b.pnl,
            sortDirections: [ 'descend','ascend'],
            defaultSortOrder: 'descend',
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
            title: 'beginDate',
            dataIndex: 'beginDateStr',
    
        },
        {
            title: 'endDate',
            dataIndex: 'endDateStr',
    
        },
        {
            title: '操作',
            render: (_, record) => (
                <a onClick={() => this.statBtest(record.id)}>
                    统计
                </a>
                )
                
        },
        {
            title: '操作',
            render: (_, record) => <Link 
                to={`elist?&bId=${record.id}` } target="_blank">
                查看
            </Link>,
        },
    
    ]

    render(): React.ReactNode {
        document.title = '回测列表';

        return <>
            <Row>
                <Col span={24}>
                    <Table columns={this.columns} dataSource={this.state.listData} pagination={false}     showSorterTooltip={{ target: 'full-header' }} />
                </Col>
            </Row>
            <Row>      <FloatButton.BackTop />
            </Row>

        </>
    }
}