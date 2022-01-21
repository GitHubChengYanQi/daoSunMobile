import { Dialog, Selector } from 'antd-mobile';
import React, { useState } from 'react';


const AddSku = ({ visible, data, setVisible, onChange }) => {

  const [keys, setKeys] = useState([]);

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
        <div style={{maxHeight:'50vh'}}>
          <Selector
            value={keys.map((item) => {
              return item.value;
            })}
            columns={1}
            options={options() || []}
            multiple={true}
            onChange={(arr, extend) => {
              setKeys(extend.items);
            }}
          />
        </div>
      }
      onAction={(action) => {
        if (action.key === 'ok') {
          onChange(keys);
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
  </>;
};

export default AddSku;
