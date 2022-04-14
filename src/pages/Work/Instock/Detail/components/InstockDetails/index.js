import React, { useRef, useState } from 'react';
import MyTree from '../../../../../components/MyTree';
import MyEmpty from '../../../../../components/MyEmpty';
import { Button, Card, Cascader, Space, SwipeAction, Toast } from 'antd-mobile';
import MyEllipsis from '../../../../../components/MyEllipsis';
import Label from '../../../../../components/Label';
import MySearchBar from '../../../../../components/MySearchBar';
import LinkButton from '../../../../../components/LinkButton';
import Detail from '../../../../Sku/Detail';
import MyPopup from '../../../../../components/MyPopup';
import Number from '../../../../../components/Number';
import MySelector from '../../../../../components/MySelector';
import { storeHouseSelect } from '../../../../Quality/Url';
import MyCascader from '../../../../../components/MyCascader';
import { useRequest } from '../../../../../../util/Request';
import { storehousePositionsTreeView } from '../../../../../Scan/Url';
import { MyLoading } from '../../../../../components/MyLoading';

const InstockDetails = (
  {
    CodeRun,
    status,
    details,
    setDetails = () => {
    },
    options = [],
    skus,
    getSkus,
    positions,
    setPositions,
  }) => {

  const detailRef = useRef();

  const storeHouseRef = useRef();

  const [item, setItem] = useState({});

  const dataSourcedChildren = (data) => {
    if ((!Array.isArray(data) || data.length === 0)) {
      return null;
    }

    return data.map((item) => {
      return {
        ...item,
        children: dataSourcedChildren(item.children),
      };
    });
  };

  const getPositionsName = (data, id, name) => {
    if (!Array.isArray(data)) {
      return '';
    }

    data.map((item) => {
      if (item.key === id) {
        return name = item.title;
      }
      return getPositionsName(item.children, id, name);
    });

    return name;
  };

  const { loading, run: positionsRun } = useRequest(storehousePositionsTreeView, {
    manual: true,
    onSuccess: async (res) => {
      storeHouseRef.current.close();

      const value = await Cascader.prompt({
        options: dataSourcedChildren(res) || [],
        placeholder: '请选择',
      });

      if (value && value.length > 0) {
        const result = value[value.length - 1];
        setValue({
          positions: [...item.positions, { positionId: result, positionName: getPositionsName(res, result) }],
        }, item.instockListId);
      }
    },
  });

  const getDetails = (id) => {
    const array = details.filter(item => item.instockListId === id);
    return array[0] || {};
  };

  const setValue = (data, id) => {
    const array = details.map((item) => {
      if (item.instockListId === id) {
        return {
          ...item,
          ...data,
        };
      } else {
        return item;
      }
    });
    setDetails(array);
  };

  const setOptionsValue = (data, id, positionsIndex, newDetails) => {

    const detailsOptions = newDetails || details;

    const array = detailsOptions.map((detailItem) => {
      if (detailItem.instockListId === id) {

        let instockNumber = 0;

        const positions = detailItem.positions.map((item, index) => {
          if (index === positionsIndex) {
            return {
              ...item,
              ...data,
            };
          }
          return item;
        });

        positions.map((item, index) => {
          if (index !== 0) {
            instockNumber += (item.instockNumber || 0);
          }
          return null;
        });

        if ((detailItem.number - instockNumber) < 0) {
          Toast.show({ content: '不能超过入库数量!', position: 'bottom' });
          return detailItem;
        }

        return {
          ...detailItem,
          positions: positions.map((item, index) => {
            if (index === 0) {
              return { ...item, instockNumber: detailItem.number - instockNumber };
            } else {
              return item;
            }
          }),
        };
      } else {
        return detailItem;
      }
    });

    setDetails(array);
  };

  const skuPosition = (detail, positionsItem, index) => {
    return <div key={index} style={{ backgroundColor: '#f9f9f9', padding: 8 }}>
      <Space direction='vertical' style={{ width: '100%' }}>
        <div style={{ display: 'flex' }}>
          <Label>
            {
              index === 0
                ?
                '绑定库位：'
                :
                '其他库位：'
            }
          </Label>
          <div>
            {positionsItem.positionName || '无库位'}
          </div>

        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ flexGrow: 1, display: 'flex' }}>
            <Label>{status === 98 ? '入库：' : '计划：'}</Label>
            <Number
              width={70}
              disabled={index === 0}
              value={status === 98 ? positionsItem.instockNumber : detail.number}
              buttonStyle={{ border: 'solid 1px  rgb(190 184 184)', backgroundColor: '#fff' }}
              onChange={(value) => {
                setOptionsValue({ instockNumber: value || 0 }, item.instockListId, index);
              }}
            />
          </div>
          <div style={{ flexGrow: 1, display: 'flex', padding: '0 4px' }}>
            <Label>{status === 98 ? '库存：' : '实际：'}</Label>
            <Number
              width={70}
              color={detail.newNumber === detail.number ? 'blue' : 'red'}
              value={status === 98 ? positionsItem.stockNumber : detail.newNumber}
              buttonStyle={{ border: 'solid 1px  rgb(190 184 184)', backgroundColor: '#fff' }}
              onChange={(value) => {
                if (status === 98) {
                  setOptionsValue({ stockNumber: value }, item.instockListId, index);
                  return;
                }
                setValue({ newNumber: value }, item.instockListId);
              }}
            />
          </div>

        </div>
      </Space>
    </div>;
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
            padding: 8,
          }}>
          <MySearchBar extra />
          <MyTree options={options} value={positions.key} onNode={(value) => {
            setPositions(value);
            getSkus(value);
          }}>
            {positions.title && positions.title.split('(')[0] || '请选择库位'}
          </MyTree>
        </div>}
      <div style={{ backgroundColor: '#eee', padding: '16px 0', paddingBottom: 100 }}>
        {
          skus.length === 0
            ?
            <MyEmpty description='全部领料完成' />
            :
            skus.map((item, index) => {
              const skuResult = item.skuResult || {};
              const spuResult = item.spuResult || {};
              const detail = getDetails(item.instockListId);
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
                      <Space direction='vertical' style={{ maxWidth: '65vw' }}>
                        <MyEllipsis>
                          {skuResult.standard} / {spuResult.name}
                        </MyEllipsis>
                        <MyEllipsis>
                          <Label>型号 / 规格 ：</Label>
                          {skuResult.skuName} / {skuResult.specifications || '无'}
                        </MyEllipsis>
                      </Space>
                    </div>
                  }
                >
                  <Space direction='vertical' style={{ width: '100%' }}>
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
                    {
                      detail.positions.map((positionsItem, index) => {
                        if (index === 0) {
                          if (!positionsItem.positionId && detail.positions.length === 1) {
                            return <Button
                              key={index}
                              onClick={async () => {
                                await setItem(detail);
                                await storeHouseRef.current.open(false);
                              }}
                              fill='none'
                              style={{
                                color: 'var(--adm-color-primary)',
                                width: '100%',
                              }}
                            >
                              其他库位暂存
                            </Button>;
                          }
                          return <div key={index}>
                            {positionsItem.positionId && skuPosition(detail, positionsItem, index)}
                          </div>;
                        } else {
                          return <SwipeAction
                            key={index}
                            rightActions={[
                              {
                                key: 'delete',
                                text: '删除',
                                color: 'danger',
                                onClick: () => {
                                  const newDetails = details.map((detailItem) => {
                                    if (detailItem.instockListId === item.instockListId) {
                                      return {
                                        ...detailItem,
                                        positions: detailItem.positions.filter((item, positionIndex) => {
                                          return positionIndex !== index;
                                        }),
                                      };
                                    }
                                    return detailItem;
                                  });
                                  setOptionsValue({}, item.instockListId, index, newDetails);
                                },
                              },
                            ]}
                          >
                            {skuPosition(detail, positionsItem, index)}
                          </SwipeAction>;
                        }

                      })
                    }
                  </Space>
                </Card>
                {
                  status === 98
                    ?
                    <div
                      style={{
                        display: 'flex',
                        backgroundColor: '#fff',
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                      }}
                    >
                      {
                        !(
                          detail.positions.length === 1
                          &&
                          !detail.positions[0].positionId
                        )
                        &&
                        <Button
                          onClick={async () => {
                            await setItem(detail);
                            await storeHouseRef.current.open(false);
                          }}
                          fill='none'
                          style={{
                            color: 'var(--adm-color-primary)',
                            flexGrow: 1,
                          }}
                        >
                          其他库位暂存
                        </Button>}
                      <Button
                        onClick={() => {

                        }}
                        fill='none'
                        style={{
                          color: 'var(--adm-color-primary)',
                          flexGrow: 1,
                        }}
                      >
                        查看二维码
                      </Button>
                      <Button
                        onClick={() => {

                        }}
                        fill='none'
                        style={{
                          color: 'var(--adm-color-primary)',
                          flexGrow: 1,
                        }}
                      >
                        单独入库
                      </Button>
                    </div>
                    :
                    <div>
                      {
                        detail.newNumber !== detail.number
                          ?
                          <Button
                            onClick={() => {

                            }}
                            color='danger'
                            fill='none'
                            style={{
                              width: '100%',
                              '--border-radius': '0px',
                              borderLeft: 'none',
                              backgroundColor: '#fff',
                              borderBottomLeftRadius: 10,
                              borderBottomRightRadius: 10,
                              borderRight: 'none',
                            }}
                          >
                            核实异常
                          </Button>
                          :
                          <Button
                            onClick={() => {

                            }}
                            style={{
                              width: '100%',
                              color: 'var(--adm-color-primary)',
                              '--border-radius': '0px',
                              borderLeft: 'none',
                              backgroundColor: '#fff',
                              borderBottomLeftRadius: 10,
                              borderBottomRightRadius: 10,
                              borderRight: 'none',
                            }}
                          >
                            核实正常
                          </Button>
                      }
                    </div>
                }
              </div>;
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

    <MyPopup title='选择仓库' position='bottom' ref={storeHouseRef}>
      <MySelector
        api={storeHouseSelect}
        onChange={(value) => {
          positionsRun({
            params: {
              ids: value,
            },
          });
        }}
      />
    </MyPopup>

    {loading && <MyLoading />}

  </>;
};

export default InstockDetails;
