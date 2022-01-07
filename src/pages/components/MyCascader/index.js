import React, { useImperativeHandle, useState } from 'react';
import { Cascader } from 'antd-mobile';
import { useRequest } from '../../../util/Request';
import { ListItem } from 'weui-react-v2';
import { Typography } from 'antd';
import style from './index.css';

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

const MyCascader = (
  {
    api,
    value,
    poputTitle,
    arrow = true,
    defaultParams,
    onChange,
    title,
    clear,
    branch,
    branchText,
    onOk,
    textType,
  }, ref) => {

  const { data,run } = useRequest(api, {
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
    setVisible(false);
    const result = value ? value[value.length - 1] : value;
    typeof onChange === 'function' && onChange(result);
  };


  return (
    <>
      <Cascader
        className={style.content}
        style={{height:'100vh'}}
        options={data || []}
        visible={!branch && visible}
        onCancel={() => {
          typeof clear === 'function' && clear();
          setVisible(false);
        }}
        value={valueArray.map((items) => {
          return items.value;
        })}
        onConfirm={(value) => {
          change(value);
        }}
      />
      <ListItem arrow={arrow} style={{ padding: 0, border: 'none' }} onClick={() => {
        setVisible(true);
      }}>
        {!branch ?
          <>
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
          </>
          :
          <>{branchText}</>
        }
      </ListItem>
    </>
  );
};

export default React.forwardRef(MyCascader);
