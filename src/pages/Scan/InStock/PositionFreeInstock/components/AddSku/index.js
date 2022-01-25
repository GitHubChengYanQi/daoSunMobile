import { Dialog, Selector } from 'antd-mobile';
import React, { useState } from 'react';
import Number from '../../../../../components/Number';


const AddSku = ({ visible, data, setVisible, onChange }) => {

  const [keys, setKeys] = useState({});

  const [numberVisible,setNumbeVisible] = useState(false);

  const [number, setNumber] = useState();

  const options = () => {
    const array = [];
    return data && data.filter((item) => {
      if (array.includes(item.skuId)) {
        return false;
      } else {
        array.push(item.skuId);
        return true;
      }
    }).map((item) => {
      return {
        value: item.skuId,
        label: item.skuResult,
        batch: item.batch,
      };
    });
  };

  return <>
    <Dialog
      visible={visible}
      content={
        <div style={{ maxHeight: '50vh' }}>
          <Selector
            value={keys.value}
            columns={1}
            options={options() || []}
            multiple={false}
            onChange={(arr, extend) => {
              setKeys(extend.items[0]);
            }}
          />
        </div>
      }
      onAction={(action) => {
        if (action.key === 'ok') {
          setVisible(false)
          setNumbeVisible(true);
        } else {
          setVisible(false);
        }
      }}
      actions={[[{
        key: 'ok',
        text: '确定',
      }, {
        key: 'close',
        text: '取消',
      }]]}
    />


    <Dialog
      visible={numberVisible}
      title={keys.batch ? '请输入批次' : '请输入数量'}
      content={
        <Number
          placeholder='请输入数量'
          value={number}
          onChange={(value) => {
            setNumber(value);
          }} />
      }
      onAction={(action) => {
        if (action.key === 'ok') {
          onChange({ ...keys,batchNumber:number });
        }
        setNumbeVisible(false);
      }}
      actions={[[{
        key: 'ok',
        text: '确定',
      }, {
        key: 'close',
        text: '取消',
      }]]}
    />
  </>;
};

export default AddSku;
