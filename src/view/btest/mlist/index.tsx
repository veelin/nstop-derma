import React from "react";
import { Button, Space, Table, Col, Row, Drawer, Form, Input, Select,Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { staticsBTest, queryBTestSubList, queryBMainTestList } from '../../../service/stock'
import { Link } from 'react-router-dom'

interface DataType {
    id: number;
    tactic: string;
    beginDate: Date;
    endDate: Date;
    sid: string;
}
class ListType {
    current: number = 0;
    size: number = 0;
    records: Array<DataType> = new Array<DataType>();
    total: number = 0;
}





export default class BTestList extends React.Component<{}, { listData: Array<DataType>}>{

    constructor(props: any) {
        super(props);
        
        this.state = { 
            listData: new Array<DataType>()
        };
    }

    componentDidMount() {
        this.getBTestList();
    }
    getBTestList = () => {
        var req = {"current": 1,"size":100}
        queryBMainTestList(req).then((data) => {
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
            title: 'tactic',
            dataIndex: 'tactic',
        },
        {
            title: 'created',
            dataIndex: 'createdStr',
    
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
            render: (_, record) => <Link 
                to={`/bt?&sId=${record.sid}` } target="_blank">
                查看
            </Link>,
        },
    
    ]

    render(): React.ReactNode {
        document.title = '回测主列表';
        return <>
            <Row>
                <Col span={24}>
                    <Table columns={this.columns} dataSource={this.state.listData} pagination={false} />
                </Col>
            </Row>

        </>
    }
}