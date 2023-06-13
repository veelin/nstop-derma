import React from "react";
import { Button, Space, Table, Col, Row, Drawer, Form, Input, Select,Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { queryFlowList, createFlow } from '../../service/flow'
import { Link } from 'react-router-dom'

interface DataType {
    flowModuleId: string;
    flowName: string;
    flowKey: string;
    status: number;
    modifyTime: string;
    operator: string
}
class CreateFlowParam {
    flowName: string = '';
    flowKey: string = '';
    operator: string = '';
    flowTyoe: string = '';
    tenant: string = '';
    caller: string = '';
}
class FlowListType {
    current: number = 0;
    size: number = 0;
    records: Array<DataType> = new Array<DataType>();
    total: number = 0;
}

const statusMap = {
    0: '默认',
    1: '草稿',
    2: '编辑中',
    3: '已下线',
    4: '已发布'
}

const columns: ColumnsType<DataType> = [
    {
        title: 'flowModuleId',
        dataIndex: 'flowModuleId',
        render: (text) => <a>{text}</a>,
    },
    {
        title: '名称',
        dataIndex: 'flowName',
    },
    {
        title: 'flowKey',
        dataIndex: 'flowKey',
    },
    {
        title: '流程状态',
        dataIndex: 'status',
        render: (status) => statusMap[status]

    },
    {
        title: '修改时间',
        dataIndex: 'modifyTime',

    },
    {
        title: '修改人',
        dataIndex: 'operator',

    },
    {
        title: '操作',
        render: (_, record) => <Link
            to={`flowEdit?&flowKey=${record.flowKey}&flowModuleId=${record.flowModuleId}&flowName=${record.flowName}`} >
            查看流程
        </Link>,
    },

];

export default class FlowList extends React.Component<{}, { flowListData: Array<DataType>, open: boolean, createFlowParam: CreateFlowParam , baseURL: any, isModalOpen: any}>{

    constructor(props: any) {
        super(props);

        var baseUrl = window.localStorage.getItem('http_base_url');
        if (!baseUrl) {
            baseUrl = "http://frp.sunmeta.top:2004"
        }
        this.state = { flowListData: new Array<DataType>(), open: false, createFlowParam: new CreateFlowParam(), baseURL: baseUrl,isModalOpen : false };
    }

    componentDidMount() {

        this.getFlowList();
    }
    getFlowList = () => {
        var req = {"current": 1,"size":1000}
        queryFlowList(req).then((data) => {
            let t = new FlowListType();
            Object.keys(t).map((key: string) => {
                t[key] = data['data']['flowList'][key]
            })
            this.setState({ flowListData: t.records })
        });
    }
  
    render(): React.ReactNode {

        const showDrawer = () => {
            this.setState({ open: true })
        };

        const onClose = () => {
            this.setState({ open: false })
        };

        const onCreateFlowFinish = (values: CreateFlowParam) => {
            values.tenant = "testTenant"
            values.caller = "testCaller"
            createFlow(values).then((data) => {
                this.getFlowList();
                onClose()
            });
        };

        const onchangeBaseUrl = (e: any) => {
            this.setState({"baseURL": e.target.value})
        }
        const submitBaseUrl = () => {
            window.localStorage.setItem("http_base_url", this.state.baseURL)
        }
        return <>
            <Row>
                <Col span={8}>
                <Space.Compact style={{ width: '80%' }}>
                    <Input defaultValue={this.state.baseURL} onChange={onchangeBaseUrl}/>
                    <Button type="primary" onClick={submitBaseUrl}>Submit</Button>
                </Space.Compact>
                </Col>
                <Col span={8}>
                </Col>
                <Col span={8}>
                    <Space wrap>
                        <Button type="primary" onClick={showDrawer}>新建流程</Button>
                    </Space>
                    
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table columns={columns} dataSource={this.state.flowListData} />
                </Col>
            </Row>

            <Drawer title="新建流程" placement="right" onClose={onClose} open={this.state.open}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onCreateFlowFinish}
                    // onFinishFailed={}
                    autoComplete="off"
                >
                    <Form.Item
                        label="流程名称"
                        name="flowName"
                        rules={[{ required: true, message: '流程名称必须填写' }]}
                    >
                        <Input />
                    </Form.Item>
                    
                    <Form.Item
                        label="类型"
                        name="flowType"
                        initialValue='http'

                    >
                        <Select
                            defaultValue="http"
                            style={{ width: 120 }}
                            options={[{ value: 'http', label: 'http' }]}
                            />
                    </Form.Item>
                    <Form.Item
                        label="flowKey"
                        name="flowKey"
                        rules={[{ required: true, message: 'flowKey必须填写' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="创建人"
                        name="operator"
                        rules={[{ required: true, message: 'operator必须填写' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>

        </>
    }
}