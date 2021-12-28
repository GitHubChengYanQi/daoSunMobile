import React, {useEffect} from 'react';
import {Cascader as AntCascader} from 'antd';
import {useRequest} from '@/util/Request';

const getParentValue = (value, data) => {
  if (!Array.isArray(data)) {
    return [];
  }
  for (let i = 0; i < data.length; i++) {
    if (`${data[i].value}` === `${value}`) {
      return [`${value}`];
    }
    if (data[i].children.length > 0) {
      const values = getParentValue(value, data[i].children);
      if (values.length > 0) {
        return [`${data[i].value}`, ...values];
      }
    }
  }
  return [];
};

const Cascader = (props) => {
  const {
    value,width,defaultParams,placeholder,resh,top, api, onChange = () => {
    }, ...other
  } = props;

  if (!api) {
    throw new Error('Table component: api cannot be empty,But now it doesn\'t exist!');
  }
  const {data,refresh} = useRequest(api,{defaultParams});

  useEffect(()=>{
    if (resh){
      refresh();
    }
  },[refresh, resh]);

  const dataSources = top ? [
    {
      value:'0',
      label:'顶级',
      children:data || [],
    }
  ] : (data || []);

  let valueArray = [];
  if ((value || value === 0) && typeof `${value}` === 'string') {
    const $tmpValue = `${value}`;
    if ($tmpValue.indexOf(',') >= 0) {
      const tmpValue = $tmpValue.split(',');
      for (let i = 0; i < tmpValue.length; i++) {
        const item = tmpValue[i];
        if (item) {
          valueArray.push(item);
        }
      }
    } else {
      valueArray = getParentValue($tmpValue, dataSources);
    }
  } else if (Array.isArray(value)) {
    valueArray = value;
  } else {
    valueArray = '';
  }

  const change = (value) => {
    const result = value ? value[value.length - 1] : value;
    onChange(result);
  };


  return (<AntCascader style={{width}} changeOnSelect options={dataSources} value={valueArray} placeholder={placeholder} onChange={change}  {...other} />);


};

export default Cascader;
