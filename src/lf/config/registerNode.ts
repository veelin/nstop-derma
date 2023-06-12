import LogicFlow, {
  BaseNodeModel,
  ConnectRule,
  CircleNodeModel,
  CircleNode,
  h,
  RectNode,
  RectNodeModel,
  PolygonNode,
  PolygonNodeModel,
} from '@logicflow/core';
import GraphModel from "@logicflow/core/types/model/GraphModel";
import { groovyNodeProperty, javaInvokerNodeProperty } from '../config/type';

export default function RegisteNode(lf: LogicFlow) {
  class StartNodeModel extends CircleNodeModel {
    getConnectedTargetRules(): ConnectRule[] {
      const rules = super.getConnectedTargetRules();
      const geteWayOnlyAsTarget = {
        message: '开始节点只能连出，不能连入！',
        validate: (source:BaseNodeModel, target:BaseNodeModel) => {
          let isValid = true;
          if (target) {
            isValid = false;
          }
          return isValid;
        },
      };
      // @ts-ignore
      rules.push(geteWayOnlyAsTarget);
      return rules;
    }
  }
  lf.register({
    type: 'start',
    view: CircleNode,
    model: StartNodeModel,
  })

  class HttpStartNodeModel extends CircleNodeModel {
    getConnectedTargetRules(): ConnectRule[] {
      const rules = super.getConnectedTargetRules();
      const geteWayOnlyAsTarget = {
        message: '开始节点只能连出，不能连入！',
        validate: (source:BaseNodeModel, target:BaseNodeModel) => {
          let isValid = true;
          if (target) {
            isValid = false;
          }
          return isValid;
        },
      };
      // @ts-ignore
      rules.push(geteWayOnlyAsTarget);
      return rules;
    }

    constructor(data: any, graphModel: GraphModel) {
      super(data, graphModel);
      console.log(data)
      this.properties = {
        labelColor: data.properties.labelColor,
        httpMethod: data.properties.httpMethod,
        params: data.properties.params,
        _requiredList: data.properties._requiredList
      }
    }
    
  }
  lf.register({
    type: 'http_start',
    view: CircleNode,
    model: HttpStartNodeModel,
  })

  class GroovyModel extends RectNodeModel { 
    constructor(data: any, graphModel: GraphModel) {
      super(data, graphModel);
      this.properties = {
        labelColor: data.properties.labelColor,
        script: data.properties.script,
        _joinContext: data.properties._joinContext,
        _contextName: data.properties._contextName
      }
    }
  }

  lf.register({
    type: 'groovy',
    view: RectNode,
    model: GroovyModel,
  })

  class JavaInvokerModel extends RectNodeModel { 
    constructor(data: any, graphModel: GraphModel) {
      super(data, graphModel);
      this.properties = {
        labelColor: data.properties.labelColor,
        bean: data.properties.bean,
        method: data.properties.method,
        params: data.properties.params,
        _contextName: data.properties._contextName
      }
    }
  }

  lf.register({
    type: 'java_invoker',
    view: RectNode,
    model: JavaInvokerModel,
  })

  class RdbModel extends RectNodeModel { 
    constructor(data: any, graphModel: GraphModel) {
      super(data, graphModel);
      this.properties = {
        _dsName: data.properties._dsName,
        _sqlType: data.properties._sqlType,
        _sql_script: data.properties._sql_script,
        _sql_page_index: data.properties._sql_page_index,
        _sql_page_size: data.properties._sql_page_size,
        _contextName: data.properties._contextName
      }
    }
  }

  lf.register({
    type: 'rdb',
    view: RectNode,
    model: RdbModel,
  })

  class ExceptionModel extends RectNodeModel { 
    constructor(data: any, graphModel: GraphModel) {
      super(data, graphModel);
      this.properties = {
        _errorCode: data.properties._errorCode,
        _errorMsg: data.properties._errorMsg,
      }
    }
  }

  lf.register({
    type: 'exc',
    view: RectNode,
    model: ExceptionModel,
  })

  class JugementModel extends PolygonNodeModel { 
    constructor(data: any, graphModel: GraphModel) {
      super(data, graphModel);
      this.points= [
        [35, 0],
        [70, 35],
        [35, 70],
        [0, 35],
      ];
      this.properties = {
        api: data.properties.api
      }
    }
  }
  lf.register({
    type: 'jugement',
    view: PolygonNode,
    model: JugementModel,
  });

  class FinishNodeModel extends CircleNodeModel {
    getConnectedSourceRules(): ConnectRule[] {
      const rules = super.getConnectedSourceRules();
      const geteWayOnlyAsTarget = {
        message: '结束节点只能连入，不能连出！',
        validate: (source:BaseNodeModel) => {
          let isValid = true;
          if (source) {
            isValid = false;
          }
          return isValid;
        },
      };
      // @ts-ignore
      rules.push(geteWayOnlyAsTarget);
      return rules;
    }
  }
  lf.register({
    type: 'finish',
    view: CircleNode,
    model: FinishNodeModel,
  })

  class HttpFinishNodeModel extends CircleNodeModel {
    getConnectedSourceRules(): ConnectRule[] {
      const rules = super.getConnectedSourceRules();
      const geteWayOnlyAsTarget = {
        message: '结束节点只能连入，不能连出！',
        validate: (source:BaseNodeModel) => {
          let isValid = true;
          if (source) {
            isValid = false;
          }
          return isValid;
        },
      };
      // @ts-ignore
      rules.push(geteWayOnlyAsTarget);
      return rules;
    }
    constructor(data: any, graphModel: GraphModel) {
      super(data, graphModel);
      this.properties = {
        _httpRespKeys: data.properties._httpRespKeys,
      }
    }
  }
  lf.register({
    type: 'http_finish',
    view: CircleNode,
    model: HttpFinishNodeModel,
  })
}
