import React, { useState } from 'react';
import FlowEdit from './view/flowEdit'
import FlowList from './view/flowList'
import SubscribeDataList from './view/subscribeList'
import TacticList from './view/tacticList'
import LinkIndex from './view/linkIndex'
import TacticDetail from './view/tacticDetail'
import BTestList from './view/btest/list'
import BMainTestList from './view/btest/mlist'
import EBTestList from './view/btest/elist'
import EBTestDetail from './view/btest/detail'
import ExecuteList from './view/executeList'


import './App.css'
import '@logicflow/core/dist/style/index.css'
import { Routes, Route, } from "react-router-dom";

function App() {

  return (
      <Routes>
        <Route path="/" element={<FlowList />} />
        <Route path="/flowEdit" element={<FlowEdit />} />
        <Route path="/subscribeDataList" element={<SubscribeDataList />} />
        <Route path="/tacticList" element={<TacticList />} />
        <Route path="/index" element={<LinkIndex />} />
        <Route path="/tacticDetail" element={<TacticDetail />} />
        <Route path="/bt" element={<BTestList />} />
        <Route path="/bt/mlist" element={<BMainTestList />} />
        <Route path="/bt/elist" element={<EBTestList />} />
        <Route path="/bt/eDetail" element={<EBTestDetail />} />
        <Route path="/tactic/taskStat" element={<ExecuteList />} />

      </Routes>
  );
}

export default App;
