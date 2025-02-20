// src/view/component/tacricTags/ColorTags.tsx
import React, { Component } from 'react';
import { Flex, Tag } from 'antd'; // 假设使用的是 Ant Design 的 Flex 和 Tag 组件



interface DataType {
    color: string;  desc: string; code:string; type:string
}
interface ColorTagsProps {
    scannerTags: Array<DataType>;
    flowTags: Array<DataType>;
}
class ColorTags extends Component<ColorTagsProps,{entranceTags:Array<DataType>,pnlTags:Array<DataType>,stopPnlTags:Array<DataType>}> {

    constructor(props: ColorTagsProps) {
        super(props);
        var et = new Array<DataType>();
        var pt = new Array<DataType>();
        var spt = new Array<DataType>();

        if(this.props.flowTags) {
            this.props.flowTags.map((tag) => {
                if (tag.type.includes('e_')) {
                    tag.color = 'blue';
                    et.push(tag);
                }else if (tag.type==='pnl') {
                    tag.color = 'green';
                    pt.push(tag);
                }else if (tag.type ==='stopPnl') {
                    tag.color = 'pink';
                    spt.push(tag);
                }
            })
        }

        this.state = { 
            entranceTags: et,
            pnlTags: pt,
            stopPnlTags: spt
        };

        if(this.props.scannerTags) {
            this.props.scannerTags.map((tag) => {
                if (tag.code.includes('cap')) {
                    tag.color = 'red';
                }
            })
        }
        
    }
    componentDidUpdate(prevProps: ColorTagsProps) {
        if(prevProps.scannerTags !== this.props.scannerTags){

            var et = new Array<DataType>();
            var pt = new Array<DataType>();
            var spt = new Array<DataType>();
            this.props.flowTags.map((tag) => {
                if (tag.type.includes('e_')) {
                    tag.color = 'blue';
                    et.push(tag);
                }else if (tag.type==='pnl') {
                    tag.color = 'green';
                    pt.push(tag);
                }else if (tag.type ==='stopPnl') {
                    tag.color = 'pink';
                    spt.push(tag);
                }
            })

            this.setState({ 
                entranceTags: et,
                pnlTags: pt,
                stopPnlTags: spt
            });
            
        }
    }

    render() {
        const { scannerTags, flowTags } = this.props;
        
        return (
            <>
            <Flex gap="4px 0" wrap>
                {scannerTags&&scannerTags.length > 0 && scannerTags.map((tag, index) => (
                    <Tag key={index} color={tag.color}>
                        {tag.desc}
                    </Tag>
                ))}
            </Flex>
            <Flex gap="4px 0" wrap>
                {this.state.entranceTags&&this.state.entranceTags.length > 0 && this.state.entranceTags.map((tag, index) => (
                    <Tag key={index} color={tag.color}>
                        {tag.desc}
                    </Tag>
                ))}
            </Flex>
            <Flex gap="4px 0" wrap>
                {this.state.pnlTags&&this.state.pnlTags.length > 0 && this.state.pnlTags.map((tag, index) => (
                    <Tag key={index} color={tag.color}>
                        {tag.desc}
                    </Tag>
                ))}
                {this.state.stopPnlTags&&this.state.stopPnlTags.length > 0 && this.state.stopPnlTags.map((tag, index) => (
                    <Tag key={index} color={tag.color}>
                        {tag.desc}
                    </Tag>
                ))}
            </Flex>
            </>

        );
    }
}

export default ColorTags;