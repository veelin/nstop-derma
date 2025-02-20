import React from 'react';
import { message,Drawer, Card, Input } from 'antd';
import LogicFlow from '@logicflow/core';
import PropertyPanel from '../../lf/config/property';
import DebugBar from '../../lf/config/debugBar';
import NodePanel from '../../lf/nodePanel/NodePanel';
import RegisteNode from '../../lf/config/registerNode';
import RegisteEdge from '../../lf/config/registerEdge';
import { themeApprove } from '../../lf/config/config';
import NstopAdapter from '../../lf/config/dataAdapter'
import './index.css';
import ToolBar from '../../view/toolbar';
import { saveFlow, queryFlow, deployFlow, debugFlow,queryDatasources } from '../../service/flow'
import { render } from '@testing-library/react';

const config = {
  stopScrollGraph: true,
  stopZoomGraph: true,
  grid: {
    size: 10,
    visible: true,
    type: 'mesh',
    config: {
      color: '#DCDCDC',  // 设置网格的颜色
    }
  },
  keyboard: { enabled: true },
  style: themeApprove,
  edgeType: 'flowline',
  plugins: [
    NstopAdapter
  ]
}



export default class FlowEdit extends React.Component<{}, { lf: LogicFlow, nodeData: Object | undefined, graphData: string, open: boolean, flowKey: any, flowName: string | null, flowModuleId: string | null , debugResp: Object| undefined, datasources: Array<string>|undefined}> {

  constructor(props: any, state: any) {
    super(props)

    let url = new URLSearchParams(window.location.href);
    this.state = {
      open: false,
      lf: {} as LogicFlow,
      nodeData: undefined,
      flowKey: url.get('flowKey'),
      flowName: url.get('flowName'),
      flowModuleId: url.get('flowModuleId'),
      graphData: '',
      debugResp: undefined,
      datasources: new Array<string>(),
    }
  }


  componentDidMount(): void {
    this.setState({
      open: false
    })

    const lf = new LogicFlow({
      ...config,
      container: document.querySelector('#graph') as HTMLElement
    });
    this.setState({ lf: lf })
    this.getFlowData()
    this.queryDatasources()
  }


  initEvent = (lf: LogicFlow) => {
    lf.on('node:click', ({ data }) => {
      this.setState({ nodeData: data });
    });
    lf.on('edge:click', ({ data }) => {
      this.setState({ nodeData: data });
    });
    lf.on('connection:not-allowed', (data: any) => {
      message.error(data.msg);
    });
  }
  // 更新属性
  updateProperty = (id: string, data: any) => {
    const node = this.state.lf.graphModel.nodesMap[id];
    const edge = this.state.lf.graphModel.edgesMap[id];
    if (node) {
      node.model.setProperties(Object.assign(node.model.properties, data));
    } else if (edge) {
      edge.model.setProperties(Object.assign(edge.model.properties, data));
    }
  }
  // 隐藏属性面板
  hidePropertyPanel = () => {
    this.setState({ nodeData: undefined });
  }
  hideDebugPanel = () => {
    this.setState({ debugResp: undefined });
  }
  showDrawer = () => {
    let data = JSON.stringify(this.state.lf.getGraphData());
    this.setState({
      graphData: data,
      open: true
    });
  };

  onClose = () => {
    this.setState({ open: false });
  };

  saveFlowData = () => {
    if(!this.protectSysFlow()){
      return;
    }
    let data = JSON.stringify(this.state.lf.getGraphData());
    saveFlow({
      caller: "testCaller",
      flowModel: data,
      flowModuleId: this.state.flowModuleId,
      tenant: "testTenant",
    }).then((data) => {
      console.log(data)
    })
  }
  doDepolyFlow = () => {
     if(!this.protectSysFlow()){
      return;
    }
    deployFlow({
      caller: "testCaller",
      flowModuleId: this.state.flowModuleId,
      tenant: "testTenant",
      operator: "test",
    }).then((data) => {
      console.log(data)
    })
  }
  getFlowData = async () => {
    return new Promise((r) => {
      queryFlow({
        flowModuleId: this.state.flowModuleId,
      }).then((data) => {
        let a = JSON.parse(data['data']['detail']['flowModel'])
        a = a === null ? {} : a;
        let formateStr = JSON.stringify(a, null, 2) ;
        // console.log(formateStr);
        this.setState({ graphData: formateStr})
        RegisteNode(this.state.lf);
        RegisteEdge(this.state.lf);
        this.state.lf.render(a);
        this.initEvent(this.state.lf);
      })
    });
  }
  debugFlow = (data:any) =>{
    var flowKey = this.state.flowKey;
    debugFlow(flowKey, data).then((data) => {
      this.setState({debugResp : data})
    })
  }

  protectSysFlow = () => {
    var flowKey = this.state.flowKey;
    // console.log(flowKey.indexOf("/sys"))
    // if (flowKey.indexOf("/sys")> -1) {
    //   message.info("The system flow just support view")
    //   return false;
    // }
    return true;
  }
  queryDatasources = () => {
    queryDatasources().then((data) => {
      this.setState({"datasources": data.data.dataSourceList})
    })
  }
  jsonFormate = () => {
    var param = this.state.graphData ===''? '{}' : this.state.graphData;
    let ret = JSON.stringify(JSON.parse(param),null,"\t");
    return ret;
  }


  render(): React.ReactNode {
    document.title = '流程编辑';

    return <div className='container'>
      <div className="approve-example-container">
        <div className="node-panel">
          {NodePanel(this.state.lf)}
        </div>
        <div id="graph" className="viewport" />
        {this.state.nodeData ? <div className="property-panel">
          {PropertyPanel(this.state.nodeData, this.updateProperty, this.hidePropertyPanel, this.debugFlow, this.state.datasources)}
        </div> : ''}
        {this.state.debugResp ? <div className="debug-panel">
          {DebugBar(this.state.debugResp, this.hideDebugPanel)}
        </div> : ''}
        
      </div>
      <ToolBar flowName={this.state.flowName} flowKey={this.state.flowKey} showDataDrawer={this.showDrawer} saveFlow={this.saveFlowData} deployFlow={this.doDepolyFlow}></ToolBar>

      <Drawer title="数据json" placement="right" onClose={this.onClose} open={this.state.open} width={900}>
        <Card title="Default size card"  style={{ width: 1000 }}>
          <Input.TextArea  className = "jsonTextarea" autoSize={true} value={this.jsonFormate()}  ></Input.TextArea>
        </Card>
      </Drawer>
    </div>
  }
}
