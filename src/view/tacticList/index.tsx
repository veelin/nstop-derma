import React from "react";
import { Button, Table, Col, Row, Tag, Space, Pagination, Typography, Drawer, Form, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { queryTacticList, openTactic, shutdownTactic, subscribeAll,btSimulateSingle } from '../../service/stock'
import ColorTags from "../components/tacticTags";

const { Text, Link } = Typography;


interface DataType {
    id: number;
    name: string;
    initFund: number;
    enable: number;
    fund: TacticFund;
    flowModuleId: string;
    scannerTags: Array<any>;
    flowTags: Array<any>;


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

interface FieldData {
    name: string | number | (string | number)[];
    value?: any;
    touched?: boolean;
    validating?: boolean;
    errors?: string[];
}


export default class TacticDataList extends React.Component<{}, { tacticListData: Array<DataType>, drawOpen: boolean, fileds: Array<FieldData> }> {

    constructor(props: any) {
        super(props);
        this.state = {
            tacticListData: new Array<DataType>(),
            drawOpen: false,
            fileds : new Array<FieldData>()
        };
    }


    columns: ColumnsType<DataType> = [
        {
            title: 'id',
            dataIndex: 'id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'name',
            dataIndex: 'name',
        },
        {
            title: 'initFund',
            dataIndex: 'initFund',
        },
        {
            title: '启用',
            dataIndex: 'enable',
            render: (_, record) => <>
                <a onClick={() => {
                    if (record.enable === 1) {
                        this.shutdownTacticFun(record.name)
                    } else {
                        this.openTacticFun(record.name)
                    }
                }}>
                    {record.enable === 1 ? "已启用" : "已停用"}
                </a>
            </>,
        },
        {
            title: 'nvdFund',
            dataIndex: 'fund',
            render: (text) => <>{text.nvdFund.toFixed(2)}</>,
        },

        {
            title: 'pnl',
            dataIndex: 'fund',
            render: (text) => <>{text.pnl.toFixed(2)}</>,

        },
        {
            title: 'dayPnl',
            dataIndex: 'dayPnl',
            render: (text) => <>{text?.pnl.toFixed(2)}</>,

        },
        {
            title: 'fluFund',
            dataIndex: 'fund',
            render: (text) => <>{text.fluFund}</>,
        },
        {
            title: 'tags',
            dataIndex: 'scannerTags',
            render: (_, record) => (
                <ColorTags scannerTags={record.scannerTags} flowTags={record.flowTags} />
            ),
        },
        {
            title: '操作',
            render: (_, record) => (
                // http://dev-admin.sunmeta.top/flowEdit?&flowKey=large_market_cap_p30min&flowModuleId=471dfb12-9cdc-11ef-8e49-525400816a80&flowName=large_market_cap_p30min
                <>
                    <Space size="middle">
                        <Link href={"/flowEdit?&flowKey=" + record.name + "&flowModuleId=" + record.flowModuleId + "&flowName=" + record.name} target="_blank">
                            流程
                        </Link>
                    </Space>

                    <Space size="middle">
                        <Link href={"/tacticDetail?&tacticName=" + record.name} target="_blank">
                            _详情
                        </Link>
                    </Space>

                </>

            ),
        },

        {
            title: '回测',
            render: (_, record) => (
                <>
                    <Space wrap>
                        <Button type="primary" onClick={(e)=>this.showDrawer(record.name)}>回测</Button>
                    </Space>
                </>

            ),
        },
    ]

    componentDidMount() {
        this.getTacticList();
    }
    getTacticList = () => {
        var req = {}
        queryTacticList(req).then((data) => {
            this.setState({ tacticListData: data.data })
        });
    }

    subscribeAll = () => {
        var req = {}
        subscribeAll(req).then((data) => {
        });
    }

    openTacticFun = (name: string) => {
        var req = { name: name }
        openTactic(req).then((data) => {
            this.getTacticList();
        });
    }

    shutdownTacticFun = (name: string) => {
        var req = { name: name }
        shutdownTactic(req).then((data) => {
            this.getTacticList();
        });
    }
    openDetail = (name: string) => {

    }
    showDrawer = (name: string) => {

        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1); //

        var fl = new Array<FieldData>();
        fl.push({name:'tacticName', value: name});
        fl.push({name:'beginDate',value: currentDate.toISOString().slice(0, 10)+ " 22:30:00"} );
        fl.push({name:'endDate',value: new Date().toISOString().slice(0, 10)+ " 05:00:00"});
        this.setState({fileds:fl});

        this.setState({ 
             fileds: fl,
             drawOpen: true,
         })
    };

    onClose = () => {
        var fl = new Array<FieldData>();
        fl.push({name:'tacticName', value: null});
        fl.push({name:'beginDate',value: null});
        fl.push({name:'endDate',value: null});
        this.setState({fileds:fl}); 
        this.setState({ drawOpen: false })
    };
    
    onBTestFinish = (values:any) => {
        btSimulateSingle(values).then(() => {
            this.onClose()
        });
    };

    // reSubscribeData = (conId : any) => {
    //     subscribeData(conId).then((data)=>{
    //     });
    // }

    render(): React.ReactNode {
        const pageSize = 100
        document.title = '策略列表';
        
        
       
        return <>
            <Row>
                <Col span={1}>
                    <Button onClick={this.getTacticList}>刷新</Button>
                </Col>
                <Col span={1}>
                    <Button onClick={this.subscribeAll}>订阅</Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>

                    <Table rowKey="conId" columns={this.columns} dataSource={this.state.tacticListData} pagination={false}>
                    </Table>
                </Col>
            </Row>


            <Drawer title="回测" placement="right" onClose={this.onClose} open={this.state.drawOpen}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={this.onBTestFinish }
                    fields={this.state.fileds}
                    // onFinishFailed={}
                    autoComplete="off"
                >
                    <Form.Item
                        label="策略名称"
                        name="tacticName"
                        rules={[{ required: true, message: '策略名称必须填写' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="开始时间"
                        name="beginDate"
                        rules={[{ required: true, message: '开始时间必须填写' }]}

                    >
                        <Input />
                        </Form.Item>
                    <Form.Item
                        label="结束时间"
                        name="endDate"
                        rules={[{ required: true, message: '结束时间必须填写' }]}
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