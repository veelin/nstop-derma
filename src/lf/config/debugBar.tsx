import { Form, Select, Input, Button, Switch} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { Tabs, Card } from 'antd';
import type { TabsProps } from 'antd';

// @ts-ignore
export default function DegugBar(resp, hideDebugPanel) {


  const responseTab = function(){
    let data = {
      code: resp.code,
      message: resp.message,
      data: resp.variables.data
    }
    return {
      label: `返回结果`,
      key: 'result',
      children: <Card  style={{ width: 1000 , height: 100}}>
      <Input.TextArea  className = "jsonTextarea" autoSize={true} value={JSON.stringify(data,null,"\t")}  ></Input.TextArea>
    </Card>
    }
  }

  const exceptionTab = function(){
    let data = {
      activeInstance: resp.activeTaskInstance,
      exception: resp.exception
    }
    
    return {
      label: `异常信息`,
      key: 'exception',
      children: <Card  style={{ width: 1000 ,height: 100}}>
      <Input.TextArea  className = "jsonTextarea" autoSize={true} value={JSON.stringify(data,null,"\t")}  ></Input.TextArea>
    </Card>
    }
  }

  const contextTab = function(){
    
    return {
      label: `上下文变量`,
      key: 'context',
      children: <Card  style={{ width: 1000,height: 100}}>
      <Input.TextArea  className = "jsonTextarea" autoSize={true} value={JSON.stringify(resp.variables,null,"\t")}  ></Input.TextArea>
    </Card>
    }
  }
  return (
    <div>
      <h2>调试面板</h2>
      <div>
      <Tabs
        defaultActiveKey="1"
        centered
        items={new Array(3).fill(null).map((_, i) => {
          if (i === 0) {
            return responseTab()
          }else if (i === 1) {
            return exceptionTab()
          }
          return contextTab()
        })}
      />
      </div>
      <div className="property-panel-footer">
        <Button
          className="property-panel-footer-hide"
          type="primary"
          icon={<DownOutlined/>}
          onClick={hideDebugPanel}
          >
          收起
        </Button>
      </div>
    </div>
  )
}