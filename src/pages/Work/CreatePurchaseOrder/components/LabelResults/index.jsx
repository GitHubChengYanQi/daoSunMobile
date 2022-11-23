import React, { useEffect, useState } from 'react';
import MyCard from '../../../../components/MyCard';
import { Input, Space, TextArea } from 'antd-mobile';
import styles from '../../index.less';
import ShopNumber from '../../../AddShop/components/ShopNumber';
import MyDatePicker from '../../../../components/MyDatePicker';
import UploadFile from '../../../../components/Upload/UploadFile';
import MyEllipsis from '../../../../components/MyEllipsis';
import { DownOutline } from 'antd-mobile-icons';
import MyPicker from '../../../../components/MyPicker';

const LabelResults = (
  {
    value: values = [],
    onChange = () => {
    },
    array,
  },
) => {

  const [open, setOpen] = useState();

  useEffect(() => {
    if (array && Array.isArray(array)) {
      const newValues = array.map((item) => {
        const detail = item.detail || [];
        const defaultVal = detail.filter(detailItem => detailItem.isDefault === 1);
        let value = '';
        if (item.isHidden) {
          value = `${item.name}：${defaultVal[0] ? defaultVal[0].name : ''}`;
        } else {
          value = defaultVal[0] ? defaultVal[0].name : '';
        }
        return {
          ...item,
          value,
        };
      });
      onChange(newValues);
    }
  }, []);

  const valuesChange = (name, value, imgUrl) => {
    const newValues = values.map((item) => {
      if (item.name === name) {
        return {
          ...item,
          value: item.isHidden ? `${item.name}：${value || ''}` : value,
          imgUrl,
        };
      }
      return item;
    });
    onChange(newValues);
  };

  if (!array) {
    return <></>;
  }

  return <div>
    {
      values.map((item, index) => {

        const detail = item.detail || [];

        const defaultVal = detail.find(detailItem => detailItem.isDefault === 1) || {};

        const value = item.isHidden ? item.value?.replace(`${item.name}：`, '') : item.value;

        let extra;
        let content;

        switch (item.type) {
          case 'input':
            const options = detail.map((item) => {
              return {
                label: item.name,
                value: item.name,
              };
            });

            content = <div className={styles.selectInput}>
              <Input
                defaultValue={defaultVal.name}
                value={value}
                placeholder={`请输入${item.filedName || ''}`}
                onChange={(value) => {
                  valuesChange(item.name, value);
                }}
              />
              {options.length > 0 && <DownOutline onClick={() => {
                setOpen({ key: item.name, value, options });
              }} />}
            </div>;
            break;
          case 'number':
            extra = <ShopNumber value={value || 0} number onChange={(value) => {
              valuesChange(item.name, value);
            }} />;
            break;
          case 'date':
            extra = <MyDatePicker
              value={value || undefined}
              precision='second'
              onChange={(value) => {
                valuesChange(item.name, value);
              }}
            />;
            break;
          case 'img':
            content = <UploadFile
              uploadId={'uploadId' + index}
              files={value ? [{ mediaId: value, url: item.imgUrl }] : []}
              onChange={(medias = []) => {
                valuesChange(item.name, medias[0]?.mediaId, medias[0]?.url);
              }} />;
            break;
          case 'editor':
            content = <TextArea
              value={value}
              placeholder='请输入'
              onChange={(value) => valuesChange(item.name, value)}
            />;
            break;
          default:
            return <></>;
        }

        return <MyCard key={index} title={<MyEllipsis maxWidth='50vw'>{item.name}</MyEllipsis>} extra={extra}>
          {content}
        </MyCard>;
      })
    }

    <MyPicker
      options={open?.options || []}
      visible={open}
      value={open?.value}
      onChange={(option) => {
        valuesChange(open?.key, option.value);
      }}
      onClose={() => setOpen()}
    />
  </div>;
};

export default LabelResults;
