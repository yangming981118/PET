import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import {
  Button,
  Modal,
  Pagination,
  Spin,
  Divider,
  Table,
} from 'antd';

import EasyForm from './../common/EasyForm';

const { confirm } = Modal;

export class Pet extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    const { match } = this.props;
    window.localStorage.setItem('ownerId', match.params.id || '');
    this.state = {
      pfxCls: 'home-pet',
      services: [],
      addModalVisible: false,
      changeModalVisible: false,
      formData: {},
      formConfig: [],
      selectedIndex: -1,
      pagination: {
        current: 1,
        pageSize: 9,
        total: 1
      },
      loading: false,
      columns: [
        {
          title: '宠物名',
          dataIndex: 'name',
          key: 'name',
          render: text => <b>{text}</b>,
        }, 
        {
          title: '宠物信息',
          dataIndex: 'description',
          key: 'description',
        }, 
        {
          title: '操作',
          key: 'action',
          render: (text, record, index) => {
            return (
              <span>
                <a href="javascript:;" onClick={() => this.showFormModal('change', index)}>
                  修改
                </a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={() => this.showDeleteModal(index)}>
                  移除
                </a>
              </span>
            )
          },
        },
      ],
    };
  }

  componentDidMount() {
    this.getService(1);
  }

  showFormModal = (type, index = -1) => {
    const target = this.state.services[index];
    const formConfig = [
      {
        name: '宠物名',
        default: type === 'add' ? '' : target.name,
        path: 'name',
      },
      {
        name: '宠物信息',
        default: type === 'add' ? '' : target.description,
        path: 'description',
      },
    ];

    this.setState({
      formConfig,
      [`${type}ModalVisible`]: true,
      selectedIndex: index,
    });
  }

  showDeleteModal = (index) => {
    const { actions } = this.props;
    const { services } = this.state;
    const target = services[index];
    const that = this;
    confirm({
      title: '您确定移除这个Service吗？',
      content: '此操作不可回退',
      onOk() {
        actions.deleteService(target, 'Pet')
          .then(res => {
            that.setState(prevState => ({
              services: services.filter(item => item.id !== target.id),
              pagination: {
                ...prevState.pagination,
                total: prevState.pagination.total - 1,
              }
            }))
          })
      },
      onCancel() {},
    });
  }

  getService = (page, limit = 9) => {
    this.setState({loading: true});
    const { actions } = this.props;
    // 是为了让缓冲效果更明显, 用性能换体验
    setTimeout(() => {
      Promise.all([
        actions.countService('Pet'),
        actions.getService(page, limit, 'Pet')
      ]).then(posts => {
        const [ total, services ] = posts;
        this.setState(prevState => ({
          services,
          loading: false,
          pagination: {
            ...prevState.pagination,
            total,
            current: page,
          }
        }));
      }).catch(error => this.setState({loading: false}))
    }, 300);
  }

  addService = () => {
    const { actions } = this.props;
    const { formData, services } = this.state;
    actions.addService({...formData}, 'Pet')
      .then(res => {
        services.splice(0, 0, {
          id: res,
          ...formData
        });
      })
      .catch(error => console.log(error.message))
      .finally(() => this.setState(prevState => ({
        addModalVisible: false,
        pagination: {
          ...prevState.pagination,
          total: prevState.pagination.total + 1,
        }
      })))
  }

  changeService = () => {
    const { actions } = this.props;
    const { selectedIndex, formData, services } = this.state;
    const newFormData = {
      ...services[selectedIndex],
      ...formData
    };
    
    actions.changeService(newFormData, 'Pet')
      .then(res => {
        services.splice(selectedIndex, 1, res)
      })
      .catch(error => console.log(error.message))
      .finally(() => this.setState({changeModalVisible: false}))
  }

  render() {
    const { 
      pfxCls, 
      services, 
      addModalVisible, 
      formData, 
      formConfig, 
      changeModalVisible, 
      pagination,
      loading,
      columns,
    } = this.state;

    return (
      <Spin spinning={loading}>
        <div className={pfxCls}>
          <div className={`${pfxCls}-head`}>
            <Button type="primary" shape="circle" icon="plus" size="large" onClick={() => this.showFormModal('add')}/>
          </div>
          <div className={`${pfxCls}-main`}>
            <Table rowKey="id" columns={columns} dataSource={services} pagination={false}/>
          </div>
          <div className={`${pfxCls}-footer`}>
            <Pagination {...pagination} showQuickJumper onChange={(page) => this.getService(page)}></Pagination>
          </div>
          <Modal
            title="添加新宠物"
            visible={addModalVisible}
            onCancel={() => this.setState({addModalVisible: false})}
            onOk={this.addService}
          >
            <EasyForm value={formData} rows={formConfig} />
          </Modal>
          <Modal
            title="修改信息"
            visible={changeModalVisible}
            onCancel={() => this.setState({changeModalVisible: false})}
            onOk={this.changeService}
          >
            {changeModalVisible && <EasyForm value={formData} rows={formConfig} />}
          </Modal>
        </div>
      </Spin>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pet);
