import React, { useImperativeHandle, useState } from 'react';
import { Button, Card, Popup, TreeSelect } from 'antd-mobile';
import { useRequest } from '../../../util/Request';
import { ListItem } from 'weui-react-v2';
import { Typography } from 'antd';
import { useDebounceEffect } from 'ahooks';

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

const MyTreeSelect = (
  {
    api,
    value,
    poputTitle,
    arrow = true,
    defaultParams,
    onChange,
    title,
    clear,
    onOk,
    branch,
    branchText,
    textType,
    resh,
  }, ref) => {

  const { data, run, refresh } = useRequest(api, {
    defaultParams,
  });

  const [visible, setVisible] = useState();

  const show = () => {
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({
    show,
    run,
  }));

  useDebounceEffect(() => {
    if (resh) {
      refresh();
    }
  }, [resh], {
    wait: 0,
  });

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
      {!branch ?
        <div style={{ padding: 0, border: 'none' }} onClick={() => {
          setVisible(true);
        }}>
          {valueArray.length > 0 ? valueArray.map((items, index) => {
            switch (textType) {
              case 'link':
                return (
                  <Typography.Link underline key={index}>{index !== 0 && '-'}{items && items.label}</Typography.Link>
                );
              default:
                return (
                  <span key={index}>{index !== 0 && '-'}{items && items.label}</span>
                );
            }

          }) : (title || '请选择')}
        </div>
        :
        <>{branchText}</>
      }

      <Popup
        visible={visible}
      >
        <Card
          title={
            <><Button color='primary' fill='none' onClick={() => {
              setVisible(false);
              typeof clear === 'function' && clear();
            }}>取消</Button>
            </>}
          style={{overflow: 'auto'}}
          extra={
            <>
              {poputTitle || title || '选择'}
              <Button color='primary' fill='none' onClick={() => {
                setVisible(false);
                typeof onOk === 'function' && onOk();
              }}>确定</Button>
            </>
          }>
          <TreeSelect
            value={valueArray.map((items) => {
              return items.value;
            })}
            options={data || []}
            onChange={(value) => {
              change(value);
            }}
          />
        </Card>
      </Popup>
    </>
  );
};

export default React.forwardRef(MyTreeSelect);
