import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import { 
  Layout, 
  Menu, 
} from 'antd';


const { Header, Content, Footer } = Layout;

const routesConfig = [
  {
    text: 'Service',
    path: '/service',
    key: '1',
  },
  {
    text: 'Owner',
    path: '/owner',
    key: '2',
  },
  {
    text: 'Pet',
    path: '/pet',
    key: '3',
  },
];

class Container extends Component {
  constructor(props) {
    super(props);
    const { pathname } = this.props.location;
    let defaultSelectedKeys = '1';
    if(pathname !== '/') {
      for(let item of routesConfig) {
        if(pathname.startsWith(item.path)) {
          defaultSelectedKeys = item.key;
          break;
        }
      }
    }

    this.state = { 
      defaultSelectedKeys: [defaultSelectedKeys]
    };
  } 

  render() {
    const { defaultSelectedKeys } = this.state; 

    return (
      <Layout className="layout">
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={defaultSelectedKeys}
            style={{ lineHeight: '64px' }}
          >
            {
              routesConfig.map(item => (
                <Menu.Item key={item.key}>
                  <Link to={item.path}>{item.text}</Link>
                </Menu.Item>
              ))
            }
          </Menu>
        </Header>
        <Content style={{ padding: '50px 50px 0' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 'calc(100vh - 64px - 50px)' }}>
            {this.props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          杨明 ©2019 Created by AntD
        </Footer>
      </Layout>
    )
  }
}

export default withRouter(Container);