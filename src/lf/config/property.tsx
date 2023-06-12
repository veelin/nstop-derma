import { Form, Select, Input, Button, Switch} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

const { Option } = Select;

// @ts-ignore
export default function PropertyPanel(nodeData, updateproperty, hidePropertyPanel, debugFlow, datasources) {

  const getApiUrl = () => {
    const Api = <Form.Item label="API" name="api">
      <Input />
    </Form.Item>
    return Api;
  }
  const getGroovyInput = () => {
    const { TextArea } = Input;
    let tmp = nodeData.properties._joinContext;
    return <div>
      <Form.Item name='script' label="Script" ><TextArea  rows={4} /></Form.Item>
      <Form.Item valuePropName="checked" name='_joinContext' label="是否加入环境变量" >
        <Switch defaultChecked={tmp} onChange={(e) =>{tmp=e}}/>
      </Form.Item>
      <Form.Item name='_contextName' label="是否加入环境变量" >
        <Input />
      </Form.Item>
      
    </div>
    
  }

  const getHttpStart = () => {
    const { TextArea } = Input;
    return <div>
      <Form.Item name="httpMethod" label="HttpMethod" rules={[{ required: true }]}>
          <Select defaultValue="post">
            <Select.Option value="post" >POST</Select.Option>
            <Select.Option value="get">GET</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="params" label="参数" >
          <TextArea rows={4} defaultValue="{}"></TextArea>
        </Form.Item>
        <Form.Item name="header" label="请求头" >
          <TextArea rows={4} defaultValue="{}"></TextArea>
        </Form.Item>
        <Form.Item name="_requiredList" label="必填参数列表" >
          <TextArea rows={4} defaultValue="[]" placeholder='[a,b,c]'></TextArea>
        </Form.Item>
        <Button onClick={debug}>调试</Button>
    </div>
    
  }
  const getFlowline = () => {
    const { TextArea } = Input;
    return <div>
      <Form.Item name="conditionsequenceflow" label="条件" >
        <TextArea  rows={4} placeholder='可以不填'/>
      </Form.Item>
        <Form.Item valuePropName="checked" name="defaultConditions" label="默认条件" rules={[{ required: true }]} >
        <Switch defaultChecked={nodeData.properties.defaultConditions}/>
        </Form.Item>
    </div>
    
  }

  const getJavaInvoker = () => {
    const { TextArea } = Input;
    return <div>
      <Form.Item name='bean' label="bean" ><Input /></Form.Item>
      <Form.Item name='method' label="method" ><Input /></Form.Item>
      <Form.Item name="params" label="参数" >
          <TextArea rows={4} defaultValue="{}"></TextArea>
        </Form.Item>
      <Form.Item name='_contextName' label="环境变量名称" >
        <Input />
      </Form.Item>
    </div>
  }

  const getRDB = () => {
    const { TextArea } = Input;

    var dsList = new Array<Object>();
    for (const e of datasources) {
      dsList.push({lable: e, value: e})
    }
    return <div>
      <Form.Item name="_dsName" label="数据库" >
          <Select options={dsList}>
          </Select>
      </Form.Item>
      <Form.Item name="_sqlType" label="操作类型" >
          <Select>
            <Select.Option value="selectOne" >selectOne</Select.Option>
            <Select.Option value="selectList">selectList</Select.Option>
            <Select.Option value="insert">save</Select.Option>
            <Select.Option value="page">page</Select.Option>
          </Select>
      </Form.Item>
      <Form.Item name="_sql_script" label="脚本，支持mybatis" >
          <TextArea rows={4} placeholder="select * from a where id = #{id}" defaultValue=""></TextArea>
        </Form.Item>
        <Form.Item name='_sql_page_index' label="页码（分页时填写）" >
        <Input />
      </Form.Item>
      <Form.Item name='_sql_page_size' label="页量（分页时填写）" >
        <Input />
      </Form.Item>
        <Form.Item name='_contextName' label="环境变量名称" >
        <Input />
      </Form.Item>
    </div>
  }

  const getExc = () => {
    return <div>
      <Form.Item name="_errorCode" label="异常码（可不填）" >
          <Input />
      </Form.Item>
      <Form.Item name="_errorMsg" label="异常描述" >
        <Input />
      </Form.Item>
    </div>
  }


  const getHttpFinish = () => {
    const { TextArea } = Input;
    return <div>
      <Form.Item name="_httpRespKeys" label="返回key列表" >
          <TextArea rows={4} placeholder="param1,param2,param3" defaultValue=""></TextArea>
        </Form.Item>
    </div>
  }


  const onFormLayoutChange = (value: any, all: any) => {
    updateproperty(nodeData.id, value,);
    Object.assign(nodeData.properties, value);

  }
  const debug = () => {
    debugFlow(nodeData.properties.params)
  }
  return (
    <div>
      <h2>属性面板</h2>
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        key={nodeData.id}
        initialValues={nodeData.properties}
        onValuesChange={onFormLayoutChange}
      >
        <Form.Item label="类型">
              <Input defaultValue={nodeData.type} disabled/>
        </Form.Item>
        <Form.Item label="id">
              <Input defaultValue={nodeData.id} disabled/>
        </Form.Item>
        <Form.Item label="文案" >
              <Input defaultValue={nodeData.text?.value} />
        </Form.Item>
        {nodeData.type==="groovy" ? getGroovyInput() : ''}
        {nodeData.type === "jugement" ? getApiUrl() : ''}
        {nodeData.type === "http_start" ? getHttpStart() : ''}
        {nodeData.type === "flowline" ? getFlowline() : ''}
        {nodeData.type === "java_invoker" ? getJavaInvoker() : ''}
        {nodeData.type === "http_finish" ? getHttpFinish() : ''}
        {nodeData.type === "rdb" ? getRDB() : ''}
        {nodeData.type === "exc" ? getExc() : ''}

      </Form>
      <div>
        <h3>......</h3>
        <h3>业务属性可根据需要进行自定义扩展</h3>
      </div>
      <div className="property-panel-footer">
        <Button
          className="property-panel-footer-hide"
          type="primary"
          icon={<DownOutlined/>}
          onClick={hidePropertyPanel}>
          收起
        </Button>
      </div>
    </div>
  )
}