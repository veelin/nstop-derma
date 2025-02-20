// src/view/component/tacricTags/ColorTags.tsx
import React, { Component } from 'react';
import { Descriptions } from 'antd'; // 假设使用的是 Ant Design 的 Flex 和 Tag 组件
import type { DescriptionsProps } from 'antd';

import { queryContractDetail, getLastPrice} from '../../../service/stock'
interface ContractProps {
    conId: number;
}

interface Contract {
    symbol : string;
    conId: number;
    longName : string;
    industry : string;
    category : string;
    subcategory: string;
    lastPrice: number | undefined;

}


class ConDesc extends Component<ContractProps,{con:Contract}> {

    constructor(props: ContractProps) {
        super(props);

        this.state = {
            con: {
                symbol: '',
                conId: 0,
                longName: '',
                industry: '',
                category: '',
                subcategory: '',
                lastPrice: 0
            }
        };
    }
    intervalId :any

    componentDidMount() {
        this.intervalId = setInterval(() => {
            getLastPrice({"conId": this.state.con.conId}).then((data) => {
                this.setState({
                    con: {
                        ...this.state.con,
                        lastPrice: data.data
                    }
                });
          })}, 5000); // 每5秒执行一次
    }
    
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    componentDidUpdate(prevProps: ContractProps) {
        if (prevProps.conId !== this.props.conId) {
            // conId has changed, perform necessary actions
            // You can fetch new data or update the state here
            var req = {"conId": this.props.conId}
            queryContractDetail(req).then((data) => {
                this.setState({
                    con: data.data
                });
            });
        }



    }
    render() {
        const items: DescriptionsProps['items'] = [
            {
              key: '1',
              label: 'symbol',
              children: this.state.con.symbol,
            },
            {
              key: '2',
              label: 'longName',
              children: this.state.con.longName,
            },
            {
              key: '3',
              label: 'industry',
              children: this.state.con.industry,
            },
            {
              key: '4',
              label: 'category',
              children: this.state.con.category,
            },
            {
              key: '5',
              label: 'subcategory',
              children: this.state.con.subcategory,
            },
            {
                key: '6',
                label: 'lastPrice',
                children: this.state.con.lastPrice,
              },
          ];
        return (
            <>
            <Descriptions column={3}  items={items} />
            </>

        );
    }
}

export default ConDesc;