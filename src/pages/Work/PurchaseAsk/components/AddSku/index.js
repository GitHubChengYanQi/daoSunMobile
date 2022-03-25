import React, { useRef } from 'react';
import { Button, Card, List, Space, TextArea } from 'antd-mobile';
import LinkButton from '../../../../components/LinkButton';
import { DeleteOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import Search from '../../../../Scan/InStock/PositionFreeInstock/components/Search';
import Number from '../../../../components/Number';
import MyDatePicker from '../../../../components/MyDatePicker';
import MyTimePicker from '../../../../components/MyTimePicker';

const AddSku = (
  {
    onChange = () => {
    },
  }) => {

  const now = new Date();

  const ref = useRef();

  const [data, setData] = useSetState({
    items: [
      {
        skuId: null,
        brandId: null,
        applyNumber: 0,
        availableNumber: 666,
        deliveryDate: null,
        deliveryTime: null,
        note: null,
      },
    ],
  });

  const addData = (index, value) => {
    const skuyAarray = data.items;
    skuyAarray[index] = { ...skuyAarray[index], ...value };
    onChange(skuyAarray);
    setData({ items: skuyAarray });
  };


  return <div>
    {
      data.items.map((items, index) => {
        return <div key={index}>
          <Card
            style={{ padding: 0 }}
            title={
              <>
                <LinkButton style={{ width: '100%' }} title={items.skuResult || '选择物料'} onClick={() => {
                  ref.current.search({ type: 'sku', key: index });
                }} />
              </>
            }
            extra={<LinkButton color='danger' title={<DeleteOutlined />} onClick={() => {
              data.items.splice(index, 1);
              setData(data);
            }} />}
            bodyStyle={{ padding: 0 }}
          >
            <List
              style={{
                padding: 0,
                '--border-top': 'none',
                '--border-bottom': 'none',
              }}
            >
              <List.Item>
                品牌：
                <LinkButton title={items.brandResult || '无指定品牌'} onClick={() => {
                  ref.current.search({ type: 'brand', key: index });
                }} />
              </List.Item>
              <List.Item>
                <Space align='center'>数量：<Number
                  value={items.applyNumber}
                  onChange={(value) => {
                    addData(index, { applyNumber: value });
                  }}
                /></Space>
              </List.Item>
              <List.Item>可用数量：{items.availableNumber}</List.Item>
              <List.Item>交货日期：<MyDatePicker width={200} min={now} value={items.deliveryDate} onChange={(value) => {
                addData(index, { deliveryDate: value });
              }} /></List.Item>
              <List.Item>交货时间：<MyTimePicker width={200} value={items.deliveryTime} onChange={(value) => {
                addData(index, { deliveryTime: value });
              }} /></List.Item>
              <List.Item>备注：<TextArea placeholder='请输入备注' value={items.note || ''} onChange={(value) => {
                addData(index, { note: value });
              }} /></List.Item>
            </List>
          </Card>
        </div>;
      })
    }

    <Button
      style={{ width: '100%', padding: 4 }}
      onClick={() => {
        setData({
          items: [
            ...data.items,
            {
              skuId: null,
              brandId: null,
              applyNumber: 0,
              availableNumber: 666,
              deliveryDate: null,
              deliveryTime: null,
              note: null,
            },
          ],
        });
      }}
    >添加物料</Button>


    <Search ref={ref} onChange={(value) => {
      switch (value.type) {
        case 'sku':
          addData(value.key, { skuId: value.value, skuResult: value.label });
          break;
        case 'brand':
          addData(value.key, { brandId: value.value, brandResult: value.label });
          break;
        default:
          break;
      }
    }} />
  </div>;
};

export default AddSku;
