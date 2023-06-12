const NstopType = {
  SEQUENCE_FLOW: 'flowline',
  START_EVENT: 'startEvent',
  END_EVENT: 'endEvent',
  USER_TASK: 'userTask',
  // SERVICE_TASK = 5, 暂不支持
  EXCLUSIVE_GATEWAY: 'exclusiveGateway',
}
// const TurboTypeMap = {
//   1: 'bpmn:sequenceFlow',
//   2: 'bpmn:startEvent',
//   3: 'bpmn:endEvent',
//   4: 'bpmn:userTask',
//   6: 'bpmn:exclusiveGateway',
// }
// // 转换Turbo识别的类型
// function getNstopType(type: string) {
//   switch (type) {
//     case 'polyline':
//       return NstopType.SEQUENCE_FLOW;
//     case 'start':
//       return NstopType.START_EVENT;
//     case 'bpmn:endEvent':
//       return NstopType.END_EVENT;
//     case 'bpmn:userTask':
//       return NstopType.USER_TASK;
//     // case 'bpmn:serviceTask':
//     //   return TurboType.SERVICE_TASK;
//     case 'bpmn:exclusiveGateway':
//       return NstopType.EXCLUSIVE_GATEWAY;
//     default:
//       return type;
//   }
// }

interface NstopElement {
  incoming: Array<string>,
  outgoing: Array<string>,
  dockers: Array<string>,
  type: string,
  properties: Object,
  key: string,
}

interface LFlowNode  {
  id: string,
  type: string,
  x: Number,
  y: Number,
  text: string,
  properties: Object,
}

interface LFlowEdge {
  id: string,
  type: string,
  sourceNodeId: string,
  targetNodeId: string,
  text: string,
  properties: Object,
  startPoint: Object,
  endPoint:Object,
  pointsList: Array<Object>,
};

// 将LogicFlow中的Node数据转换为Turbo元素数据
function convertNodeToNstopElement(node: any): NstopElement {
  const {
    id,
    type,
    x,
    y,
    text = '',
    properties,
  } = node;
  return {
    incoming: [],
    outgoing: [],
    dockers: [],
    type: type,
    properties: {
      ...properties,
      name: (text && text.value) || '',
      x,
      y,
      text,
    },
    key: id,
  };
}

// 将LogicFlow中的Edge数据转换为Turbo元素数据
function convertEdgeToNstopElement(edge: any): NstopElement{
  const {
    id,
    type,
    sourceNodeId,
    targetNodeId,
    startPoint,
    endPoint,
    pointsList,
    text = '',
    properties,
  } = edge;
  return {
    incoming: [sourceNodeId],
    outgoing: [targetNodeId],
    type: type,
    dockers: [],
    properties: {
      ...properties,
      name: (text && text.value) || '',
      text,
      startPoint: JSON.stringify(startPoint),
      endPoint: JSON.stringify(endPoint),
      pointsList: JSON.stringify(pointsList),
    },
    key: id,
  };
}

// 将LogicFlow中数据转换为Turbo数据
export function toTurboData(data: any) {
  const nodeMap = new Map();
  const turboData = {
    flowElementList: new Array<NstopElement>(),
  };
  data.nodes.forEach((node: any) => {
    const flowElement = convertNodeToNstopElement(node);
    turboData.flowElementList.push(flowElement);
    nodeMap.set(node.id, flowElement);
  });
  data.edges.forEach((edge: { sourceNodeId: any; targetNodeId: any; }) => {
    const flowElement = convertEdgeToNstopElement(edge);
    const sourceElement = nodeMap.get(edge.sourceNodeId);
    sourceElement.outgoing.push(flowElement.key);
    const targetElement = nodeMap.get(edge.targetNodeId);
    targetElement.incoming.push(flowElement.key);
    turboData.flowElementList.push(flowElement);
  });
  return turboData;
}

// 将Turbo元素数据转换为LogicFlow中的Edge数据
function convertFlowElementToEdge(element: any) {
  const {
    incoming, outgoing, properties, key, type,
  } = element;
  const {
    text,
    name,
    startPoint,
    endPoint,
    pointsList,
  } = properties;
  const edge = {
    id: key,
    type: type,
    sourceNodeId: incoming[0],
    targetNodeId: outgoing[0],
    text: text || name,
    properties: {},
    startPoint: {},
    endPoint:{},
    pointsList: [],
  };
  if (startPoint) {
    edge.startPoint = JSON.parse(startPoint)
  }
  if (endPoint) {
    edge.endPoint = JSON.parse(endPoint)
  }
  if (pointsList) {
    edge.pointsList = JSON.parse(pointsList)
  }
  // 这种转换方式，在自定义属性中不能与excludeProperties中的属性重名，否则将在转换过程中丢失
  const excludeProperties = ['startPoint', 'endPoint', 'pointsList', 'text'];
  Object.keys(element.properties).forEach(property => {
    if (excludeProperties.indexOf(property) === -1) {
      edge.properties[property] = element.properties[property];
    }
  });
  return edge;
}

// 将Turbo元素数据转换为LogicFlow中的Node数据
function convertFlowElementToNode(element: any): LFlowNode {
  const { properties, key, type, bounds } = element;
  let {
    x, y, text,
  } = properties;
  if (x === undefined) {
    const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = bounds;
    x = (x1 + x2) / 2
    y = (y1 + y2) / 2
  }
  const node = {
    id: key,
    type: type,
    x,
    y,
    text,
    properties: {},
  };
  // 这种转换方式，在自定义属性中不能与excludeProperties中的属性重名，否则将在转换过程中丢失
  const excludeProperties = ['x', 'y', 'text'];
  Object.keys(element.properties).forEach(property => {
    if (excludeProperties.indexOf(property) === -1) {
      node.properties[property] = element.properties[property];
    }
  });
  return node;
}

// 将Turbo元素数据转换为LogicFlow数据
export function toLogicflowData(data: any) {
  const lfData = {
    nodes: new Array<LFlowNode>(),
    edges: new Array<LFlowEdge>(),
  };
  const list = data.flowElementList;
  list && list.length > 0 && list.forEach((element: { type: any; }) => {
    if (element.type === NstopType.SEQUENCE_FLOW) {
      const edge = convertFlowElementToEdge(element);
      lfData.edges.push(edge);
    } else {
      const node = convertFlowElementToNode(element);
      lfData.nodes.push(node);
    }
  });
  return lfData;
}

class NstopAdapter {
  static pluginName =  'turboAdapter'
  constructor({ lf }: {lf: any}) {
    lf.adapterIn = this.adapterIn;
    lf.adapterOut = this.adapterOut;
  }
  adapterOut(logicflowData: any) {
    if (logicflowData) {
      return toTurboData(logicflowData);
    }
  }
  adapterIn(turboData: any) {
    if (turboData) {
      let d = toLogicflowData(turboData);
      return d;
    }
  }
};

export default NstopAdapter;
