import { Tabs } from 'antd-mobile';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import QualitySidBar from '../QualitySidBar';
import React, { useState } from 'react';

const QualityNumber = ({ data,values,batch,number,create,taskId,onChange,defaultValue }) => {

  const [key,setKey] = useState('0');

  const [value,setValue] = useState( values|| []);

  const [defaval,setDefaval] = useState(values || []);

  const res = (value) => {
    if (value === true) {
      return <>&nbsp;&nbsp;<CheckCircleOutlined /></>;
    } else if (value === false) {
      return <>&nbsp;&nbsp;<ExclamationCircleOutlined /></>;
    } else {
      return <>&nbsp;&nbsp;<ClockCircleOutlined /></>;
    }
  };

  const defa = (val) => {
    const arrs = [];

    value.map((items, index) => {
      return arrs[index] = items;
    });

    arrs[key] = {bind:val.bind,key:val.res,values:val.values};

    setDefaval(arrs);
    setValue(arrs);

    typeof defaultValue === 'function' && defaultValue(arrs);

  }

  const onchange = (val) => {
    const arrs = [];

    value.map((items, index) => {
      return arrs[index] = items;
    });

    arrs[key] = {bind:val.bind,key:val.res,values:val.values};

    setValue(arrs);
    setDefaval(arrs);

    typeof defaultValue === 'function' && defaultValue(arrs);
    if (arrs.length === (batch || number)) {
      const valueNull = arrs.filter((value) => {
        return value != null;
      });
      if (valueNull.length === (batch || number)) {
        typeof onChange === 'function' && onChange(arrs);
      }else {
        return false;
      }
    }else {
      return true;
    }
  }

  const numbers = () => {

    if (data.remaining){
      const value = data.number * (25/100);
      console.log(value > value.toFixed() ? (parseInt(value.toFixed())+1) : parseInt(value.toFixed()));
    }

    const array = new Array(batch || number);
    for (let i = 0; i < array.length; i++) {
      array[i] = data;
    }
    return array.map((items, index) => {
      return <Tabs.TabPane title={<>{index + 1}{res(value[index] && value[index].key)}</>} key={index}>
        {/*质检项*/}
        <QualitySidBar batch={batch} index={index} number={number} create={() => {
          typeof create === 'function' && create();
        }} taskId={taskId} data={items} allValues={defaval} values={defaval[index]} defaultValue={(value) => {
          defa(value);
        }} onChange={(value) => {
          const val = onchange(value);
          if (val) {
            setKey(`${parseInt(key) + 1}`);
          }
        }} />

      </Tabs.TabPane>;
    });
  };

  return <Tabs activeKey={key} onChange={(value) => {
    setKey(value);
  }}>
    {numbers()}
  </Tabs>;
};

export default QualityNumber;
