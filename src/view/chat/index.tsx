import React from 'react';
import { Input, Button, List, Avatar, Select, Layout, Flex } from 'antd';
import type { CSSProperties } from 'react';

const { Header, Footer, Content } = Layout;
const { TextArea } = Input;

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  model?: string;
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  inputMessage: string;
  selectedModel: string;
}

const chatHeaderStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 60,
  backgroundColor: '#F0F0F0',
  padding: '10px 20px'
};

const chatContentStyle: CSSProperties = {
  padding: '20px',
  height: 'calc(100vh - 160px)',
  overflowY: 'auto',
  backgroundColor: '#fff'
};

const inputAreaStyle: CSSProperties = {
  padding: '20px',
  backgroundColor: '#F0F0F0'
};

const modelOptions = [
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'gpt-4o', label: 'ChatGPT-4o' },
  { value: 'lingma', label: '通义灵码' }
];

export default class ChatInterface extends React.Component<{}, ChatState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      messages: [],
      inputMessage: '',
      selectedModel: 'deepseek'
    };
  }

  handleSend = async () => {
    const { inputMessage, selectedModel } = this.state;
    if (!inputMessage.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: Date.now()
    };

    this.setState(prev => ({
      messages: [...prev.messages, userMessage],
      inputMessage: ''
    }));

    try {
      // 调用对应模型的API
      const response = await this.fetchAIResponse(inputMessage, selectedModel);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        model: selectedModel,
        timestamp: Date.now()
      };

      this.setState(prev => ({
        messages: [...prev.messages, aiMessage]
      }));
    } catch (error) {
      console.error('API调用失败:', error);
    }
  };

  fetchAIResponse = async (message: string, model: string) => {
    // 这里替换为实际的API调用逻辑
    return `这是${model}的模拟响应：${message}`;
  };

  render() {
    return (
      <Flex vertical style={{ height: '100vh' }}>
        <Layout>
          <Header style={chatHeaderStyle}>
            <Select
              defaultValue="deepseek"
              style={{ width: 200 }}
              options={modelOptions}
              onChange={value => this.setState({ selectedModel: value })}
            />
          </Header>
          
          <Content style={chatContentStyle}>
            <List
              itemLayout="horizontal"
              dataSource={this.state.messages}
              renderItem={item => (
                <List.Item
                  style={{ 
                    justifyContent: item.isUser ? 'flex-end' : 'flex-start',
                    padding: '10px 0'
                  }}
                >
                  <List.Item.Meta
                    avatar={!item.isUser && (
                      <Avatar src={`/${item.model}.png`} />
                    )}
                    title={item.isUser ? '您' : item.model}
                    description={item.content}
                    style={{
                      backgroundColor: item.isUser ? '#e6f7ff' : '#f5f5f5',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      maxWidth: '70%'
                    }}
                  />
                </List.Item>
              )}
            />
          </Content>
          
          <Footer style={inputAreaStyle}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <TextArea
                autoSize={{ minRows: 2, maxRows: 6 }}
                value={this.state.inputMessage}
                onChange={e => this.setState({ inputMessage: e.target.value })}
                onPressEnter={this.handleSend}
                placeholder="输入消息..."
              />
              <Button 
                type="primary" 
                onClick={this.handleSend}
                style={{ height: 'auto' }}
              >
                发送
              </Button>
            </div>
          </Footer>
        </Layout>
      </Flex>
    );
  }
}