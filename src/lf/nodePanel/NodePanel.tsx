import React from 'react';
import LogicFlow from '@logicflow/core';
import { nstopNodes } from '../config/config';
import { HtmlNodeConfig } from '../config/type';

export default function NodePanel(lf: any) {
  // 拖拽创建
  const dragNode = (item: HtmlNodeConfig) => { 
    lf.dnd.startDrag({
      type: item.type,
      text: item.label
    })
  }
  // 节点菜单
  const getNodePanel = (): JSX.Element[]  => { 
    const nodeList: JSX.Element[] = [];
    nstopNodes.forEach((item, key) => { 
      nodeList.push(
        <div
          className={`approve-node node-${item.type}`}
          key={key}
        >
          <div
            className="node-shape"
            style={{ ...item.style }}
            onMouseDown={() => dragNode(item)}
          ></div>
          <div className="node-label">{item.label}</div>
        </div>
      )
    })
    return nodeList;
  }
  return getNodePanel()
}