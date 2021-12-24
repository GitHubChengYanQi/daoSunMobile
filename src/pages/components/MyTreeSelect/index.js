import React, { useEffect, useState } from 'react';
import { Button, Card, Popup, TreeSelect } from 'antd-mobile';
import { useRequest } from '../../../util/Request';
import { ListItem } from 'weui-react-v2';

const getParentValue = (value, data) => {
  if (!Array.isArray(data)) {
    return [];
  }
  for (let i = 0; i < data.length; i++) {
    if (`${data[i].value}` === `${value}`) {
      return [{ label: data[i].label, value: `${value}` }];
    }
    if (data[i].children.length > 0) {
      const values = getParentValue(value, data[i].children);
      if (values.length > 0) {
        return [{ label: `${data[i].label}`, value: `${data[i].value}` }, ...values];
      }
    }
  }
  return [];
};

const MyTreeSelect = ({ api, value, poputTitle, defaultParams, onChange, show, title, clear, onOk }) => {

  const { data } = useRequest(api, {
    defaultParams,
  });

  const [visible, setVisible] = useState();

  useEffect(() => {
    setVisible(show);
  }, [show]);


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
      valueArray = getParentValue($tmpValue, data);
    }
  } else if (Array.isArray(value)) {
    valueArray = value;
  } else {
    valueArray = [];
  }


  const change = (value) => {
    const result = value ? value[value.length - 1] : value;
    typeof onChange === 'function' && onChange(result);
  };


  return (
    <>
      <ListItem arrow={true} style={{ padding: 0, border: 'none' }} onClick={() => {
        setVisible(true);
      }}>
        {valueArray.length > 0 ? valueArray.map((items, index) => {
          return (
            <span key={index}>{index !== 0 && '-'}{items && items.label}</span>
          );
        }) : (title || '请选择')}
      </ListItem>

      <Popup
        visible={visible}
      >
        <Card title={
          <><Button color='primary' fill='none' onClick={() => {
            setVisible(false)
            typeof clear === 'function' && clear();
          }}>取消</Button>
          </>} style={{ maxHeight: '30vh', overflow: 'auto' }} extra={
          <>
            {poputTitle || title || '选择'}
            <Button color='primary' fill='none' onClick={() => {
              setVisible(false)
              typeof onOk === 'function' && onOk();
            }}>确定</Button>
          </>
        }>
          <TreeSelect
            value={valueArray.map((items) => {
              return items.value;
            })}
            options={data || []}
            onChange={(value, object) => {
              change(value);
            }}
          />
        </Card>
      </Popup>
    </>
  );
};

export default MyTreeSelect;
