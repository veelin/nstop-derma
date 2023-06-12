import LogicFlow, { PolylineEdgeModel,PolylineEdge, GraphModel } from "@logicflow/core";


export default function RegisteNode(lf: LogicFlow) {
    class FlowlineModel extends PolylineEdgeModel {
        constructor(data: any, graphModel: GraphModel){
            super(data, graphModel);

            let dc = data.properties.defaultConditions;
            let dscrtpt = data.properties.conditionsequenceflow;

            dc = dc === undefined ? true : dc;
            this.properties={
                defaultConditions: dc,
                conditionsequenceflow:dscrtpt
            }
        }
        
    }
    
    lf.register({
      type: "flowline",
      view: PolylineEdge,
      model: FlowlineModel,
    })
}