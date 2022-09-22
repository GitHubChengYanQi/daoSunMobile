import React, { useRef } from 'react';
import { Button, Card, Input, List, Space, Toast } from 'antd-mobile';
import MyEllipsis from '../../../../components/MyEllipsis';
import Label from '../../../../components/Label';
import LinkButton from '../../../../components/LinkButton';
import Number from '../../../../components/Number';
import Search from '../../../../Scan/InStock/PositionFreeInstock/components/Search';
import { CloseCircleOutline } from 'antd-mobile-icons';
import style from '../../../../components/Number/index.css';
import MyDatePicker from '../../../../components/MyDatePicker';

const AddSkus = (
  {
    skus,
    setSkus = () => {
    },
  }) => {

  const ref = useRef();

  const detailRef = useRef();

  if (!Array.isArray(skus) || skus.length === 0) {
    return <></>;
  }

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

  const setDetailValue = (data, index, detailIndex) => {
    const array = skus.map((item, skuIdnex) => {
      if (skuIdnex === index) {
        return {
          ...item,
          details: item.details.map((item, index) => {
            if (index === detailIndex) {
              return {
                ...item,
                ...data,
              };
            }
            return item;
          }),
        };
      } else {
        return item;
      }
    });
    setSkus(array);
  };

  return <>
    {
      skus.map((item, index) => {
        const skuResult = item.skuResult || {};
        const spuResult = skuResult.spuResult || {};
        const details = item.details || [];
        let countNumber = 0;
        details.map((item) => {
          return countNumber += (item.number || 0);
        });
        return <div key={index} style={{ margin: 8 }}>
          <Card
            style={{ padding: 8, borderRadius: 0 }}
            key={index}
            extra={<LinkButton onClick={() => {
              detailRef.current.open(item.skuId);
            }}>详情</LinkButton>}
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
                    <div style={{ minWidth: 110 }}>
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

            <List style={{ '--border-top': 'none', '--border-bottom': 'none', '--border-inner': 'none' }}>
              <div style={{ backgroundColor: '#f9f9f9' }}>
                <List.Item
                  extra={<div>{spuResult.unitResult && spuResult.unitResult.unitName}</div>}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Label style={{ minWidth: 150 }}>计划入库总数：</Label>
                    <Number
                      value={item.number}
                      buttonStyle={{ border: 'solid 1px  rgb(190 184 184)', backgroundColor: '#fff' }}
                      onChange={(value) => {
                        setValue({ number: value }, index);
                      }}
                    />
                  </div>
                </List.Item>
                <List.Item
                  onClick={() => {
                    ref.current.search({
                      key: index,
                      type: 'brand',
                      params: {
                        skuId: item.skuId,
                        customerId: item.customerId,
                        nameSource: '品牌',
                        name: '',
                      },
                    });
                  }}
                  extra={<div style={{ display: 'flex', alignItems: 'center' }}>
                    <MyEllipsis width='45vw' style={{ color: item.brandName && '#000', textAlign: 'right' }}>
                      {item.brandName || '选择品牌'}
                    </MyEllipsis>
                  </div>}
                >
                  <Label>关联品牌：</Label>
                </List.Item>
                <List.Item
                  onClick={() => {
                    ref.current.search({
                      key: index,
                      type: 'supply',
                      params: {
                        skuId: item.skuId,
                        brandId: item.brandId,
                        nameSource: '供应商',
                        name: '',
                      },
                    });
                  }}
                  extra={<div style={{ display: 'flex', alignItems: 'center' }}>
                    <MyEllipsis width='45vw' style={{ color: item.customerName && '#000', textAlign: 'right' }}>
                      {item.customerName || '选择供应商'}
                    </MyEllipsis>
                  </div>}
                >
                  <Label>关联供应商：</Label>
                </List.Item>
              </div>
              {details.length > 0 && <div>
                <List.Item
                  extra={<div>已编辑添加：{countNumber}</div>}
                >
                  物料明细
                </List.Item>
                {
                  details.map((detailsItem, detailIndex) => {
                    return <div
                      key={detailIndex}
                      style={{ backgroundColor: '#f9f9f9', marginTop: detailIndex !== 0 && 16 }}>
                      <List.Item
                        extra={<div>
                          {spuResult.unitResult && spuResult.unitResult.unitName}
                          <Button
                            fill='none'
                            color='danger'
                            onClick={() => {
                              const array = details.filter((item, index) => {
                                return index !== detailIndex;
                              });
                              setValue({ details: array }, index);
                            }}
                          >
                            <CloseCircleOutline />
                          </Button>
                        </div>}
                      >
                        <div style={{ display: 'flex' }}>
                          <Label style={{ minWidth: 150 }}>入库数量：</Label>
                          <Number
                            inputRight
                            value={detailsItem.number}
                            buttonStyle={{ border: 'solid 1px  rgb(190 184 184)', backgroundColor: '#fff' }}
                            onChange={(value) => {
                              let number = 0;
                              details.map((item, index) => {
                                if (index === detailIndex) {
                                  return number += value;
                                } else {
                                  return number += item.number;
                                }
                              });
                              if (number > item.number) {
                                Toast.show({
                                  content: '不能超过计划数！',
                                  position: 'bottom',
                                });
                              } else {
                                setDetailValue({ number: value }, index, detailIndex);
                              }
                            }}
                          />
                        </div>
                      </List.Item>
                      <List.Item>
                        <div style={{ display: 'flex' }}>
                          <Label style={{ minWidth: 150 }}>物料批号：</Label>
                          <Input
                            placeholder='请输入物料批号'
                            className={style.inputRight}
                            value={detailsItem.lotNumber}
                            style={{
                              border: 'solid 1px  rgb(190 184 184)',
                              backgroundColor: '#fff',
                              padding: '4px 8px',
                            }}
                            onChange={(value) => {
                              setDetailValue({ lotNumber: value }, index, detailIndex);
                            }}
                          />
                        </div>
                      </List.Item>
                      <List.Item>
                        <div style={{ display: 'flex' }}>
                          <Label style={{ minWidth: 150 }}>序列号：</Label>
                          <Input
                            placeholder='请输入序列号'
                            className={style.inputRight}
                            value={detailsItem.serialNumber}
                            style={{
                              border: 'solid 1px  rgb(190 184 184)',
                              backgroundColor: '#fff',
                              padding: '4px 8px',
                            }}
                            onChange={(value) => {
                              setDetailValue({ serialNumber: value }, index, detailIndex);
                            }}
                          />
                        </div>
                      </List.Item>
                      <List.Item
                        extra={<MyDatePicker
                          value={detailsItem.manufactureDate}
                          precision='second'
                          onChange={(value) => {
                            setDetailValue({ manufactureDate: value }, index, detailIndex);
                          }} />}
                      >
                        <div style={{ display: 'flex' }}>
                          <Label style={{ minWidth: 150 }}>生产日期：</Label>
                        </div>
                      </List.Item>
                      <List.Item
                        extra={<MyDatePicker
                          value={detailsItem.effectiveDate}
                          precision='second'
                          onChange={(value) => {
                            setDetailValue({ effectiveDate: value }, index, detailIndex);
                          }} />}
                      >
                        <div style={{ display: 'flex' }}>
                          <Label style={{ minWidth: 150 }}>有效日期：</Label>
                        </div>
                      </List.Item>
                      <List.Item
                        extra={<MyDatePicker
                          value={detailsItem.receivedDate}
                          precision='second'
                          onChange={(value) => {
                            setDetailValue({ receivedDate: value }, index, detailIndex);
                          }} />}
                      >
                        <div style={{ display: 'flex' }}>
                          <Label style={{ minWidth: 150 }}>到货日期：</Label>
                        </div>
                      </List.Item>
                    </div>;
                  })
                }
              </div>}

            </List>

          </Card>
          <div>
            <Button
              onClick={() => {
                const array = skus.filter((item, skuIdnex) => skuIdnex !== index);
                setSkus(array);
              }}
              color='primary'
              style={{
                width: '50%',
                // color: 'var(--adm-color-primary)',
                '--border-radius': '0px',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottomLeftRadius: 10,
              }}
            >
              删除当前物料
            </Button>
            <Button
              onClick={() => {
                setValue({
                  details: [...details, {
                    number: null,
                  }],
                }, index);
              }}
              color='primary'
              style={{
                width: '50%',
                // color: 'var(--adm-color-primary)',
                '--border-radius': '0px',
                borderBottomRightRadius: 10,
                borderRight: 'none',
                borderLeft: 'none',
              }}
            >
              添加物料描述
            </Button>
          </div>
        </div>;
      })
    }

    <Search ref={ref} onChange={async (value) => {
      switch (value.type) {
        case 'brand':
          setValue({
            brandId: value.value,
            brandName: value.label,
          }, value.key);
          break;
        case 'supply':
          setValue({
            customerId: value.value,
            customerName: value.label,
          }, value.key);
          break;
        default:
          break;
      }
    }}
    />
  </>;
};

export default AddSkus;
