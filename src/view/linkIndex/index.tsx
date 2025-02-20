import React from "react";
import { Space, Typography ,Image} from 'antd';
const { Text, Link } = Typography;

export default class SubscribeDataList extends React.Component<{}, {}> {
    render(): React.ReactNode {
        document.title = '导航-桑尼';
        return <>
            <Space direction="vertical">
                <Text>阳光-桑尼号</Text>
                <Link href="/subscribeDataList" target="_blank">
                    subscribeDataList
                </Link>
                <Link href="/tacticList" target="_blank">
                    tacticList
                </Link>
                <Link href="/bt/mlist" target="_blank">
                    btestList
                </Link>
                <Link href="/" target="_blank">
                    flow
                </Link>
            </Space>
            <Image
    width={1000} preview={false}
    src="https://5b0988e595225.cdn.sohucs.com/images/20181014/e4a45950dfd84de294477a0c1be044be.jpeg"
  />
<Image
    width={500} preview={false}
    src="https://img.puchedu.cn/uploads/1/253/3156718137/3822428059.jpg"
  />

        </>
    }
}
