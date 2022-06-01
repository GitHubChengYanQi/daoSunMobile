import React, { useImperativeHandle, useRef, useState } from 'react';
import MyPopup from '../../../../../components/MyPopup';
import { Card, Dialog, List, TextArea } from 'antd-mobile';
import MyAntList from '../../../../../components/MyAntList';
import {SkuResultSkuJsons} from '../../../../../Scan/Sku/components/SkuResult_skuJsons';
import MyDatePicker from '../../../../../components/MyDatePicker';
import { useRequest } from '../../../../../../util/Request';
import { history } from 'umi';
import BottomButton from '../../../../../components/BottomButton';
import { MyLoading } from '../../../../../components/MyLoading';
import MyEmpty from '../../../../../components/MyEmpty';

const Instock = ({ refresh, CodeRun, CodeLoading, setDetail, instockOrderId, processRefresh }, ref) => {

  const [data, setData] = useState({});

  const [details, setDetails] = useState([]);

  const [actionId, setActionId] = useState();

  const refPopup = useRef();

  const instock = ({ details, actionId }) => {
    setActionId(actionId);
    setDetails(details);
    refPopup.current.open(false);
  };

  useImperativeHandle(ref, () => ({ instock }));

  // 入库
  const { loading: instockLoading, run: instockRun } = useRequest({
    url: '/instockOrder/inStockByOrder',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      Dialog.show({
        content: '入库成功！',
        closeOnAction: true,
        onAction: (action) => {
          if (action.key === 'back') {
            history.goBack();
          } else {
            refresh();
            setDetail([]);
            if (res) {
              processRefresh();
            }
          }
        },
        actions: [[
          {
            key: 'back',
            text: '返回',
          },
          {
            key: 'next',
            text: '继续入库',
          },
        ],
        ],
      });
    },
  });

  const skuDetails = details.filter(item => {
    return !(item.positions && item.positions.length === 1 && (!item.positions[0] || !item.positions[0].positionId));
  });

  return <>
    <MyPopup position='bottom' title='入库确认' ref={refPopup}>
      <Card title={<div style={{ fontWeight: 400 }}>入库明细</div>}>
        <MyAntList>
          {skuDetails.length === 0 && <MyEmpty />}
          {
            skuDetails.map((item, index) => {
              if (item.positions && item.positions.length === 1 && (!item.positions[0] || !item.positions[0].positionId)) {
                return null;
              }
              return <List.Item key={index}>
                {SkuResultSkuJsons({skuResult:item.skuResult})}
                <MyAntList>
                  {
                    item.positions && item.positions.map((item, index) => {
                      if (item.positionId) {
                        return <List.Item extra={<div>× {item.instockNumber}</div>} key={index}>
                          {item.positionName}
                        </List.Item>;
                      } else {
                        return null;
                      }

                    })
                  }
                </MyAntList>

              </List.Item>;
            })
          }
        </MyAntList>
      </Card>
      <Card style={{ paddingBottom: 70 }} title={<div style={{ fontWeight: 400 }}>入库确认</div>}>
        <MyAntList>
          <List.Item
            extra={<MyDatePicker
              onChange={value => setData({ ...data, instockTime: value })}
              value={data.instockTime} />}>
            入库时间
          </List.Item>
          <List.Item>
            库管意见
            <div>
              <TextArea
                placeholder='请输入意见...'
                value={data.remark}
                onChange={value => setData({ ...data, remark: value })} />
            </div>
          </List.Item>
        </MyAntList>
      </Card>
      <BottomButton
        leftOnClick={() => {
          ref.current.close();
        }}
        rightOnClick={async () => {
          const codeRequests = [];
          const positions = [];

          details.map((skuItem) => {
            return skuItem.positions && skuItem.positions.map((item) => {

              const codeRequest = {
                source: 'item',
                id: skuItem.skuId,
                number: skuItem.skuResult.batch ? item.instockNumber : 1,
                inkindType: '入库',
              };

              if (!item.positionId) {
                return null;
              }
              if (skuItem.skuResult && skuItem.skuResult.batch) {
                positions.push({
                  positionId: item.positionId,
                  skuId: skuItem.skuId,
                  inStockListId: skuItem.instockListId,
                  stockNumber: item.stockNumber,
                });
                return codeRequests.push(codeRequest);
              }
              for (let i = 0; i < item.instockNumber; i++) {
                positions.push({
                  positionId: item.positionId,
                  skuId: skuItem.skuId,
                  inStockListId: skuItem.instockListId,
                  stockNumber: item.skockNumber,
                });
                codeRequests.push(codeRequest);
              }
              return null;
            });
          });
          const codes = await CodeRun({
            data: {
              codeRequests,
            },
          });

          const inStocks = positions.map((item, index) => {
            return {
              ...item,
              inkind: codes[index].inkindId,
            };
          });

          let skuParams = [];

          inStocks.map((item) => {

            let sname = false;

            const newSkus = skuParams.map((skuItem) => {
              if (skuItem.inStockListId === item.inStockListId && skuItem.positionId === item.positionId) {
                sname = true;
                return {
                  ...skuItem,
                  inkindIds: [...skuItem.inkindIds, item.inkind],
                };
              }
              return skuItem;
            });

            if (sname) {
              skuParams = newSkus;
            } else {
              skuParams.push({
                skuId: item.skuId,
                inkindIds: [item.inkind],
                positionId: item.positionId,
                stockNumber: item.stockNumber,
                inStockListId: item.inStockListId,
              });
            }
            return null;
          });

          instockRun({
            data: {
              instockOrderId,
              actionId,
              ...data,
              skuParams,
            },
          });
        }}
        rightDisabled={skuDetails.length === 0}
        leftText='取消'
        rightText='确认'
      />

      {(instockLoading || CodeLoading) && <MyLoading />}
    </MyPopup>
  </>;
};

export default React.forwardRef(Instock);
