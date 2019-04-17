import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  Row, 
  Col,
  Input,
} from 'antd';

import './EasyForm.scss';

export default class EasyForm extends Component {
  static propTypes = {
    value: PropTypes.object,
    rows: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      pfxCls: 'easy-form'
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.rows !== this.state.rows) {
      this.setState({rows: nextProps.rows})
    }
  }

  onChange = (event, path = '') => {
    if(typeof path !== 'string' || path.trim().length === 0) {
      return;
    }

    const { target } = event;
    const { value } = this.props;
    
    path = path.trim();
    value[path] = target.value;
  }

  render() {
    const { rows } = this.props;
    const { pfxCls } = this.state;
    return (
      <div className={pfxCls}>
        {
          rows && rows.map((row, index) => (
            <Row key={index}>
              <Col span={8}>{row.name}</Col>
              <Col span={16}>
                <Input defaultValue={row.default} onChange={(e) => this.onChange(e, row.path)}/>
              </Col>
            </Row>
          ))
        }
      </div>
    )
  }
}