import React, { useState } from 'react';
import FlowEdit from './view/flowEdit'
import FlowList from './view/flowList'
import './App.css'
import '@logicflow/core/dist/style/index.css'
import { Routes, Route, } from "react-router-dom";

function App() {

  return (
      <Routes>
        <Route path="/" element={<FlowList />} />
        <Route path="/flowEdit" element={<FlowEdit />} />
      </Routes>
  );
}

export default App;
