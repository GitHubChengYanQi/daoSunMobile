import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Dialog, List, SearchBar, Space, Tabs, Toast } from 'antd-mobile';
import { storehousePositionsTreeView } from '../../Url';
import { request, useRequest } from '../../../../util/Request';
import { connect } from 'dva';
import { MyLoading } from '../../../components/MyLoading';
import LinkButton from '../../../components/LinkButton';
import { useBoolean, useSetState } from 'ahooks';
import { getHeader } from '../../../components/GetHeader';
import BottomButton from '../../../components/BottomButton';
import IsDev from '../../../../components/IsDev';
import PrintCode from '../../../components/PrintCode';
import { batchBind } from '../components/Url';
import MyEmpty from '../../../components/MyEmpty';
import Search from '../PositionFreeInstock/components/Search';
import TreeSelectSee from '../../../components/TreeSelectSee';
import Number from '../../../components/Number';
import { AddOutline, DeleteOutline } from 'antd-mobile-icons';

const fontSize = 18;


const SkuFreeInstock = ({ scanData }) => {

  const { loading: storehousepostionLoading, data: storehouseposition } = useRequest(storehousePositionsTreeView);

  const [data, setData] = useSetState({
    skus: {},
    positions: [
      // {
      //   positionId: null,
      //   batchNumber: 1,
      //   disabled:false,
      //   skuItems: [
      //     {
      //       inkindId: null,
      //       number: null,
      //     },
      //   ],
      //   stotrhouse: {
      //     value: null,
      //     lebel: null,
      //   },
      // },
    ],
  });

  const getSkuData = (type) => {
    const skus = [];
    data.positions.map((item) => {
      return item.skuItems.map((item) => {
        return skus.push({
          ...item,
          number: data.skus.batch ? item.number : 1,
        });
      });
    });
    switch (type) {
      case 'skus':
        // 当前所有物料
        return skus;
      case 'inkind':
        // 已生成的实物
        return skus.filter((item) => {
          return item.inkindId;
        }).map((item) => {
          return item.inkindId;
        });
      case 'skuItems':
        // 没有生成实物的物料
        return skus.filter((item) => {
          return !item.inkindId && item.number > 0;
        }).map((item) => {
          return {
            source: 'item',
            brandId: data.skus.brandId,
            customerId: data.skus.customerId,
            id: data.skus.skuId,
            number: item.number,
            inkindType: '自由入库',
          };
        });
      case 'successNumber':
        const successNumber = skus.filter((item) => {
          return item.number > 0;
        });
        return successNumber.length > 0;
      default:
        return null;
    }
  };

  const skuReult = (sku) => {
    return {
      batch: sku.batch === 1,
      skuId: sku.skuId,
      name: sku.spuResult.spuClassificationResult && sku.spuResult.spuClassificationResult.name,
      skuName: sku.spuResult.name,
      detail: sku.skuJsons && sku.skuJsons.length > 0 && sku.skuJsons[0].values.attributeValues &&
        <>
          ({
          sku.skuJsons.map((items, index) => {
            return (
              <span key={index}>{items.attribute.attribute}：{items.values.attributeValues}</span>
            );
          })
        })
        </>,
    };
  };

  useEffect(() => {
    if (scanData) {
      setData({
        ...data, skus: skuReult(scanData),
      });
      getPositionsRun({
        data: {
          skuId: scanData.skuId,
        },
      });
    }
  }, [scanData]);

  const ref = useRef();

  const { loading: CodeLoading, run: CodeRun } = useRequest(
    batchBind,
    {
      manual: true,
    },
  );

  const { loading: getPositionsing, run: getPositionsRun } = useRequest(
    {
      url: '/storehousePositionsBind/getPositions',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: (res) => {
        if (res.length === 0) {
          return Dialog.alert({
            content: '此物料没绑定库位！',
          });
        }
        setData({
          ...data,
          positions: res.map((item, index) => {
            return {
              skuItems: [],
              positionId: item.storehousePositionsId,
              batchNumber: data.skus.batch ? 1 : 0,
              name: item.name,
              storehouse: {
                label: item.storehouseResult.name,
                value: item.storehouseResult.storehouseId,
              },
            };
          }),
        });
      },
    },
  );


  const addCanvas = async (inkindIds) => {
    if (IsDev() || !getHeader()) {
      const templete = await request({
        url: '/inkind/details',
        method: 'POST',
        data: {
          inkindIds,
        },
      });
      if (templete && Array.isArray(templete)) {
        PrintCode.print(templete && templete.map((items) => {
          return items.printTemplateResult && items.printTemplateResult.templete;
        }), 0);
      }
    }
  };


  const clear = () => {
    setData({
      skus: {},
      positions: [],
    });
  };

  const next = () => {
    setData({
      ...data,
      positions: data.positions.map((item) => {
        return {
          ...item,
          batchNumber: data.skus.batch ? 1 : 0,
          skuItems: [],
        };
      }),
    });
  };

  const { loading: instockLoading, run: instockRun } = useRequest({
    url: '/instockOrder/freeInStockByPositions',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      Dialog.show({
        title: '入库成功',
        content: '是否继续入库？',
        closeOnAction: true,
        onAction: (action) => {
          if (action.key === 'ok') {
            next();
          } else {
            clear();
          }
        },
        actions: [
          [
            {
              key: 'ok',
              text: '是',
            },
            {
              key: 'no',
              text: '否',
            },
          ],
        ],
      });
    },
    onError: () => {
      Dialog.alert({
        content: '入库失败！',
      });
    },
  });

  const searchComponemts = () => {
    return <Search ref={ref} onChange={async (value) => {
      switch (value.type) {
        case 'sku':
          const item = value.item;
          setData({
              ...data, skus: skuReult(item),
            },
          );
          getPositionsRun({
            data: {
              skuId: value.value,
            },
          });
          break;
        case 'brand':
          setData({
              ...data,
              skus: {
                ...data.skus,
                brandId: value.value,
                brandName: value.label,
              },
            },
          );
          break;
        case 'supply':
          setData({
              ...data,
              skus: {
                ...data.skus,
                customerId: value.value,
                customerName: value.label,
              },
            },
          );
          break;
        default:
          break;
      }
    }}
    />;
  };

  const printAllCode = async () => {
    const inkindIds = getSkuData('inkind');
    const codeRequests = getSkuData('skuItems');

    const res = codeRequests.length > 0 ? await CodeRun({
      data: {
        codeRequests,
      },
    }) : [];

    const printInkinds = res.map((item) => {
      return item.inkindId;
    });

    const printCodes = [...inkindIds, ...printInkinds];

    if (printInkinds.length > 0) {
      let i = 0;
      const array = data.positions.map((item) => {
        return {
          ...item,
          skuItems: item.skuItems.map((value) => {
            const number = data.skus.batch ? value.number : 1;
            if (!value.inkindId && number > 0) {
              i++;
              return {
                ...value,
                inkindId: printInkinds[i - 1],
              };
            } else {
              return value;
            }
          }),
        };
      });
      setData({ ...data, positions: array });
      return { inkindIds: printCodes, positions: array };
    }

    return { inkindIds: printCodes, positions: data.positions };
  };

  const listItems = (batchNumber, skuItems, index,batch) => {
    const arrays = [];
    for (let i = 0; i < batchNumber; i++) {
      const item = skuItems[i] || { number: !data.skus.batch && 1 };
      arrays.push(<List.Item
        key={i}
        extra={
          <LinkButton title={item.inkindId ? '打印二维码' : '生成二维码'} onClick={async () => {
            if (!data.skus.brandId || !data.skus.customerId) {
              return Toast.show({
                content: '请完善物料信息！',
                position: 'bottom',
              });
            }
            if (item.inkindId) {
              if (IsDev() || !getHeader()) {
                addCanvas([item.inkindId]);
              }
              return;
            }
            if (item.number > 0) {
              const res = await CodeRun({
                data: {
                  codeRequests:[{
                    source: 'item',
                    brandId: data.skus.brandId,
                    customerId: data.skus.customerId,
                    id: data.skus.skuId,
                    number: item.number,
                    inkindType: '自由入库',
                  }],
                },
              })
              if (res && res.length > 0){
                if (IsDev() || !getHeader()) {
                  addCanvas([res[0].inkindId]);
                }

                const array = data.positions;
                array[index].skuItems[i] = { ...item, inkindId: res[0].inkindId };
                setData({ ...data, positions: array });
              }

            } else {
              Toast.show({
                content: '数量不能小于0!',
                position: 'bottom',
              });
            }
          }} />
        }
      >
        <Space align='center'>
          {!batch && <LinkButton
            onClick={() => {
              const array = data.positions;
              array[index].batchNumber = array[index].batchNumber - 1;
              array[index].skuItems.splice(i, 1);
              setData({ ...data, positions: array });
            }}
            disabled={item.inkindId}
            title={
              <DeleteOutline />
            } />}
          <div style={{ marginRight: 32 }}>
            第{i + 1}
            {
              data.skus.batch ? '批' : '个'
            }
          </div>
          {data.skus.batch && <Number
            placeholder='入库数量'
            color={item.number > 0 ? 'blue' : 'red'}
            width={100}
            disabled={item.inkindId}
            value={item.number}
            onChange={(value) => {
              const array = data.positions;
              array[index].skuItems[i] = { ...skuItems[i], number: value };
              setData({ ...data, positions: array });
            }} />}
        </Space>
      </List.Item>);
    }
    return arrays;
  };

  const disabled = (id) => {
    let skuItemId = null;
    data.positions.map((item)=>{
      return item.skuItems.map((value)=>{
        if (value.number > 0){
          skuItemId = item.positionId
        }
        return null;
      })
    })
    return skuItemId && skuItemId !== id;
  }


  return <>
    <Card
      title='入库物料'
      extra={<LinkButton title='清除' onClick={() => {
        clear();
      }} />}
    >
      <SearchBar placeholder='搜索物料' onFocus={() => {
        ref.current.search({ type: 'sku' });
      }} />
      <List
        style={{
          '--border-top': 'none',
          '--border-bottom': 'none',
        }}
      >
        <List.Item>
          <div style={{ fontSize }}>名称：{data.skus.name || '无'}</div>
        </List.Item>
        <List.Item>
          <div style={{ fontSize }}>型号：{data.skus.skuName || '无'}</div>
        </List.Item>
        <List.Item>
          <div style={{ fontSize }}>物料描述：{data.skus.detail || '无'}</div>
        </List.Item>
        <List.Item>
          <Space>
            <div style={{ fontSize }}>品牌：</div>
            <LinkButton
              style={{ width: '100vw', fontSize, textAlign: 'left', color: !data.skus.brandName && 'red' }}
              onClick={() => {
                ref.current.search({
                  type: 'brand',
                  params: {
                    skuId: data.skus.skuId,
                    nameSource: '品牌',
                    name: '',
                  },
                });
              }}
              title={
                data.skus.brandName || '选择品牌'
              }
            />
          </Space>
        </List.Item>
        <List.Item>
          <Space>
            <div style={{ fontSize }}>供应商：</div>
            <LinkButton
              style={{ width: '100vw', fontSize, textAlign: 'left', color: !data.skus.customerName && 'red' }}
              onClick={() => {
                ref.current.search({
                  type: 'supply',
                  params: {
                    skuId: data.skus.skuId,
                    brandId: data.skus.brandId,
                    nameSource: '供应商',
                    name: '',
                  },
                });
              }}
              title={
                data.skus.customerName || '选择供应商'
              }
            />
          </Space>

        </List.Item>
      </List>
    </Card>

    <Card
      style={{ marginTop: 16 }}
      title='可入库位'
    >{
      data.positions.length > 0
        ?
        <Tabs

        >
          {data.positions.map((item, index) => {
            return <Tabs.Tab
              title={item.name}
              key={item.positionId}
              disabled={disabled(item.positionId)}
            >
              <List>
                <List.Item title='仓库位置'>
                  <div style={{ fontSize }}>
                    {item.storehouse && item.storehouse.label}
                    &nbsp;&nbsp;/&nbsp;&nbsp;
                    <TreeSelectSee
                      data={storehouseposition}
                      value={item.positionId}
                    />
                  </div>
                </List.Item>
                {!data.skus.batch && <List.Item title='入库数量'>
                  <Number
                    value={item.batchNumber}
                    onChange={(value) => {
                      const items = [];
                      const array = data.positions;
                      for (let i = 0; i < value; i++) {
                        items.push({number:1});
                      }
                      array[index] = { ...item, batchNumber: value,skuItems:items };
                      setData({ ...data, positions: array });
                    }} />
                </List.Item>}
                {listItems(item.batchNumber, item.skuItems, index,data.skus.batch)}
              </List>
            </Tabs.Tab>;
          })}
        </Tabs>
        :
        <MyEmpty description='暂无' />
    }
    </Card>

    {searchComponemts()}

    <div style={{ height: '10vh' }} />

    <BottomButton
      leftText='批量打印'
      leftDisabled={
        !data.skus.skuId
        ||
        !data.skus.brandId
        ||
        !data.skus.customerId
      }
      leftOnClick={async () => {
        const { inkindIds } = await printAllCode();
        if (inkindIds.length === 0) {
          return Toast.show({
            content: '没有可以打印的实物！',
            position: 'bottom',
          });
        }
        addCanvas(inkindIds);
      }}
      rightDisabled={
        !data.skus.skuId
        ||
        !data.skus.brandId
        ||
        !data.skus.customerId
        ||
        !getSkuData('successNumber')
      }
      rightOnClick={async () => {

        const { positions } = await printAllCode();

        const inStocks = [];
        positions.map((item) => {
          return item.skuItems.map(value => {
            if (value.inkindId) {
              inStocks.push({
                inkind: value.inkindId,
                positionsId: item.positionId,
                storeHouseId: item.storehouse && item.storehouse.value,
              });
            }
            return null;
          });
        });

        if (inStocks.length > 0){
          instockRun({
            data: {
              inStocks: inStocks,
            },
          });
        }else {
          Toast.show({
            content:'没有可以入库的实物！'
          });
        }
      }}
      rightText='入库'
    />

    {
      (storehousepostionLoading || instockLoading || CodeLoading || getPositionsing) && <MyLoading />
    }

  </>;
};

export default connect(({ qrCode }) => ({ qrCode }))(SkuFreeInstock);
