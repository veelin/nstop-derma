export const nstopNodes = [
  // {
  //   type: 'start',
  //   label: '开始',
  //   style: {
  //     width: '30px',
  //     height: '30px',
  //     borderRadius: '15px',
  //     border: '2px solid #FF6347',
  //   },
  //   property: {
  //     username: '',
  //     time: '',
  //     startTime: '',
  //     endTime: '',
  //   }
  // },
  {
    type: 'http_start',
    label: 'http开始节点',
    style: {
      width: '50px',
      height: '50px',
      borderRadius: '25px',
      border: '2px solid #FF6347',
    }
  },
  {
    type: 'groovy',
    label: 'groovy脚本',
    style: {
      width: '50px',
      height: '40px',
      borderRadius: '4px',
      border: '2px solid #3CB371',
    }
  },
  {
    type: 'jugement',
    label: '判断',
    style: {
      width: '30px',
      height: '30px',
      border: '2px solid #6495ED',
      transform: 'rotate(45deg)',
    }
  },
  {
    type: 'java_invoker',
    label: 'java调用',
    style: {
      width: '50px',
      height: '40px',
      borderRadius: '4px',
      border: '2px solid #3CB371',
    }
  },
  {
    type: 'rdb',
    label: '数据库',
    style: {
      width: '50px',
      height: '40px',
      borderRadius: '4px',
      border: '2px solid #3CB371',
    }
  },
  {
    type: 'exc',
    label: '异常',
    style: {
      width: '50px',
      height: '40px',
      borderRadius: '4px',
      border: '2px solid #3CB371',
    }
  },
  // {
  //   type: 'finish',
  //   label: '结束',
  //   style: {
  //     width: '30px',
  //     height: '30px',
  //     borderRadius: '15px',
  //     border: '2px solid #FF6347',
  //   }
  // },
  {
    type: 'http_finish',
    label: 'http结束',
    style: {
      width: '50px',
      height: '50px',
      borderRadius: '25px',
      border: '2px solid #FF6347',
    }
  },
];


// 主题
export const themeApprove = {
  rect: { // 矩形样式
    radius: 8,
    stroke: '#3CB371'
  },
  circle: {
    r: 25,
    stroke: '#FF6347'
  },
  polygon: {
    stroke: '#6495ED',
  },
  polyline: {
    strokeWidth: 1,
  },
  edgeText: {
    background: {
      fill: 'white',
    },
  },
}


