import React, { useRef, useState } from 'react';
import MyTree from '../../../../../components/MyTree';
import MyEmpty from '../../../../../components/MyEmpty';
import { Button, Card, Space } from 'antd-mobile';
import MyEllipsis from '../../../../../components/MyEllipsis';
import Label from '../../../../../components/Label';
import MySearchBar from '../../../../../components/MySearchBar';
import LinkButton from '../../../../../components/LinkButton';
import Detail from '../../../../Sku/Detail';
import MyPopup from '../../../../../components/MyPopup';
import Number from '../../../../../components/Number';

const InstockDetails = (
  {
    options = [],
    skus,
    setSkus = () => {
    },
  }) => {

  const detailRef = useRef();

  const [positions, setPositions] = useState({});

  const setValue = (data, index) => {
    const array = skus.map((item, skuIdnex) => {
      if (skuIdnex === index) {
        return {
          ...item,
          ...data,
        };
      } else {
        return item;
      }
    });
    setSkus(array);
  };

  return <>
    <div>
      {options.length !== 0 &&
        <div
          style={{
            position: 'sticky',
            top: 0,
            backgroundColor: '#fff',
            zIndex: 999,
            textAlign: 'center',
            marginBottom: 16,
          }}>
          <MySearchBar />
          <MyTree options={options} value={positions.key} onNode={(value) => {
            setPositions(value);
            // getSkus(value);
          }}>
            {positions.title && positions.title.split('(')[0] || '请选择库位'}
          </MyTree>
        </div>}
      <div style={{ backgroundColor: '#eee', padding: '16px 0', paddingBottom: 60 }}>
        {
          skus.length === 0
            ?
            <MyEmpty description='全部领料完成' />
            :
            skus.map((item, index) => {
              const skuResult = item.skuResult || {};
              const spuResult = item.spuResult || {};
              return <div key={index} style={{ margin: 8 }}>
                <Card
                  extra={<LinkButton onClick={() => {
                    detailRef.current.open(item.skuId);
                  }}>详情</LinkButton>}
                  style={{ borderRadius: 0 }}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          marginRight: 8,
                          backgroundColor: 'var(--adm-color-primary)',
                          borderRadius: '100%',
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                        }}>
                        {index + 1}
                      </div>
                      <Space direction='vertical' style={{ maxWidth: '70vw' }}>
                        <MyEllipsis>
                          {skuResult.standard} / {spuResult.name}
                        </MyEllipsis>
                        <div style={{ display: 'flex' }}>
                          <div style={{ minWidth: 150 }}>
                            <Label>型号 / 规格 ：</Label>
                          </div>

                          <MyEllipsis width='47%'>
                            {skuResult.skuName} / {skuResult.specifications || '无'}
                          </MyEllipsis>
                        </div>
                      </Space>
                    </div>
                  }
                >
                  <div style={{ display: 'flex' }}>
                    <div style={{ flexGrow: 1 }}>
                      <Label>批号：</Label>123
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <Label>序列号：</Label>123
                    </div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div style={{ flexGrow: 1 }}>
                      <Label>生产日期：</Label>123
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <Label>有效日期：</Label>123
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#f9f9f9', padding: '8px 0' }}>
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: '20vw' }}>
                        <MyEllipsis>
                          库位
                        </MyEllipsis>
                      </div>
                      <div style={{ flexGrow: 1, display: 'flex', padding: '0 4px' }}>
                        <Label>计划：</Label>
                        <Number
                          width={70}
                          disabled
                          value={item.number}
                          buttonStyle={{ border: 'solid 1px  rgb(190 184 184)', backgroundColor: '#fff' }}
                          onChange={(value) => {
                            // setValue({ number: value }, index);
                          }}
                        />
                      </div>
                      <div style={{ flexGrow: 1, display: 'flex', padding: '0 4px' }}>
                        <Label>实际：</Label>
                        <Number
                          width={70}
                          color={item.newNumber === item.number ? 'blue' : 'red'}
                          value={item.newNumber}
                          buttonStyle={{ border: 'solid 1px  rgb(190 184 184)', backgroundColor: '#fff' }}
                          onChange={(value) => {
                            setValue({ newNumber: value }, index);
                          }}
                        />
                      </div>

                    </div>
                  </div>
                </Card>
                <div>
                  <Button
                    disabled={item.cart}
                    onClick={() => {

                    }}
                    color='danger'
                    fill='none'
                    style={{
                      width: '50%',
                      '--border-radius': '0px',
                      borderLeft: 'none',
                      backgroundColor: '#fff',
                      borderBottomLeftRadius: 10,
                    }}
                  >
                    数量异常
                  </Button>
                  <Button
                    onClick={() => {

                    }}
                    style={{
                      width: '50%',
                      color: 'var(--adm-color-primary)',
                      '--border-radius': '0px',
                      borderBottomRightRadius: 10,
                      borderRight: 'none',
                    }}
                  >
                    数量核实
                  </Button>
                </div>
              </div>;
              ;
            })
        }
      </div>
    </div>

    <MyPopup
      title='物料信息'
      position='bottom'
      height='80vh'
      ref={detailRef}
      component={Detail}
    />
  </>;
};

export default InstockDetails;
