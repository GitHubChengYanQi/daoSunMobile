import React, { useState } from 'react';
import { Button, Card, Checkbox, List, Space } from 'antd-mobile';
import Icon from '../../../../components/Icon';
import style from '../../../../Work/Quality/DispatchTask/index.css';
import TreeSelectSee from '../../../../components/TreeSelectSee';
import { Input } from 'weui-react-v2';
import { Col, Row } from 'antd';

const PositionsInventory = (
    {
      data,
      storehouseposition,
    },
  ) => {

    const [stockNumber, setStockNumber] = useState(data.detailsResults ? data.detailsResults.map((items) => {
      return {
        id: items.inkindId,
        number: items.number,
      };
    }) : []);
    console.log(stockNumber);

    const getNumber = (id) => {
      return `${
        stockNumber.filter((items) => {
          return items.id === id;
        })[0].number}`;
    };

    const getSku = (skuResult) => {
      if (!skuResult) {
        return null;
      }
      return <>
        {skuResult.skuName}
        &nbsp;/&nbsp;
        {skuResult.spuResult && skuResult.spuResult.name}
        &nbsp;&nbsp;
        {
          skuResult.skuJsons
          &&
          skuResult.skuJsons.length > 0
          &&
          skuResult.skuJsons[0].values.attributeValues
          &&
          <em style={{ color: '#c9c8c8', fontSize: 10 }}>
            (
            {
              skuResult.skuJsons.map((items, index) => {
                return (
                  <span key={index}>{items.attribute.attribute}：{items.values.attributeValues}</span>
                );
              })
            }
            )
          </em>
        }
      </>;
    };


    return <Card title={
      <>
        {data.storehouseResult && data.storehouseResult.name}
        -
        <TreeSelectSee
          data={storehouseposition}
          value={data.storehousePositionsId} />
      </>
    }>
      <Checkbox.Group

      >
        <Space direction='vertical' style={{ width: '100%' }}>
          {
            data.detailsResults && data.detailsResults.map((items, index) => {
              return <Space key={index} align='center'>
                <div style={{ width: '70vw' }}>
                  <Checkbox
                    icon={(check) => {
                      // return <Icon type='icon-fangxingxuanzhongfill' style={{ color: '#dcdcdc' }} />;
                      if (check) {
                        return <Icon type='icon-duoxuanxuanzhong1' />;
                      } else {
                        return <Icon type='icon-a-44-110' style={{ color: '#666' }} />;
                      }
                    }}
                    className={style.checkBox}
                    style={{ width: '100%', padding: 8 }}>
                    <List.Item
                      description={
                        <>
                          {items.inkindResult && items.inkindResult.brandResult && items.inkindResult.brandResult.brandName}
                        </>
                      }
                    >
                      {getSku(items.inkindResult && items.inkindResult.skuResult)}
                    </List.Item>
                  </Checkbox>
                </div>
                <div style={{ width: '20vw', textAlign: 'center' }}>
                  <div style={{
                    color: '#1845b5',
                    border: 'solid #999999 1px',
                    borderRadius: 10,
                    display: 'inline-block',
                    padding: '0 8px',
                  }}>
                    <Space align='center'>
                      ×
                      <Input
                        style={{ width: 50, color: getNumber(items.inkindId) >= 0 ? '#1677ff' : 'red' }}
                        type='number'
                        value={getNumber(items.inkindId)}
                        onChange={(value) => {
                          const ids = stockNumber.filter((value) => {
                            return value.id !== items.inkindId;
                          });
                          setStockNumber([...ids, { id: items.inkindId, number: value }]);
                        }} />
                    </Space>
                  </div>
                </div>
              </Space>;
            })
          }
        </Space>
      </Checkbox.Group>
    </Card>;
  }
;

export default PositionsInventory;
