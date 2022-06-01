import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Card, Dialog, List, Loading, Space, Stepper, Toast } from 'antd-mobile';
import { codingRulesList, storeHouseSelect } from '../Url';
import { useRequest } from '../../../../util/Request';
import SkuResultSkuJsons from '../../../Scan/Sku/components/SkuResult_skuJsons';
import MyCoding from '../../../components/MyCoding';
import SelectUser from '../../Production/CreateTask/components/SelectUser';
import MyAntPicker from '../../../components/MyAntPicker';

const CreateInstock = ({ show, qualityDeatlis, onSuccess }, ref) => {

  const [visible, setVisible] = useState(false);

  // const [inkindIds, setInkindIds] = useState([]);

  const [skus, setSkus] = useState([]);

  const [coding, setCoding] = useState();

  const [storehoust, setStorehoust] = useState();

  const [user, setUser] = useState();

  useImperativeHandle(ref, () => ({
    setVisible,
  }));


  useEffect(() => {
    // setInkindIds([]);
    setStorehoust(null);
    setUser(null);
  }, [visible]);

  const { loading, data } = useRequest(codingRulesList, {
    defaultParams: {
      data: {
        module: 1,
        state: 1,
      },
    },
  });

  const { loading: instockLoading, run } = useRequest(
    {
      url: '/qualityTask/qualityDetailInstock',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: () => {
        Toast.show({
          content: '创建入库单成功！',
          position: 'bottom',
        });
        typeof onSuccess === 'function' && onSuccess();
      },
    });

  useEffect(() => {
    if (data && data.length > 0) {
      setCoding(data[0].codingRulesId);
    }
  }, [data]);

  if (loading) {
    return null;
  }


  return <>
    <Dialog
      visible={visible}
      title='创建入库单'
      content={<>
        <div>
          <Space direction='vertical'>
            <Space>
              <div>编码:</div>
              <MyCoding module={1} onChange={setCoding} value={coding} />
            </Space>
            <Space>
              <div>仓库:</div>
              <MyAntPicker api={storeHouseSelect} value={storehoust} onChange={(value) => {
                setStorehoust(value);
              }} />
            </Space>
            <Space>
              <div>负责人:</div>
              <SelectUser value={user} onChange={(value) => {
                setUser(value);
              }} />
            </Space>
          </Space>
        </div>
        <Card title={<div>入库物料</div>}>
          <div style={{ maxheight: '50vh', overflow: 'auto' }}>
            <List>
              {
                qualityDeatlis && qualityDeatlis.map((items, index) => {
                  if ((items.number - items.instockNumber) > 0)
                    return <List.Item
                      key={index}
                      extra={
                        <Stepper
                          digits={0}
                          min={0}
                          max={items.number - items.instockNumber}
                          defaultValue={0}
                          onChange={value => {
                            const array = skus.filter((value) => {
                              return value.qualityTaskDetailId !== items.qualityTaskDetailId;
                            });
                            if (value) {
                              setSkus([
                                ...array,
                                {
                                  ...items,
                                  number: value,
                                },
                              ]);
                            } else {
                              setSkus([...array]);
                            }
                          }}
                        />
                      }
                    >
                      <SkuResultSkuJsons skuResult={items.skuResult} />
                    </List.Item>;
                  else
                    return null;
                })
              }

            </List>
          </div>
        </Card>
      </>}
      onAction={async (action) => {
        if (action.key === 'ok') {
          if (!coding)
            Toast.show({
              content: '编码不能为空！',
              position: 'bottom',
            });
          else if (!storehoust)
            Toast.show({
              content: '仓库不能为空！',
              position: 'bottom',
            });
          else if (!user || !user.id)
            Toast.show({
              content: '负责人不能为空！',
              position: 'bottom',
            });
          else if (skus.length === 0)
            Toast.show({
              content: '入库物料不能为空！',
              position: 'bottom',
            });
          else {
            run({
              data: {
                coding,
                storeHouseId: storehoust,
                userId: user.id,
                instockRequest: skus,
                url: process.env.wxCp + 'OrCode?id=codeId',
              },
            });
          }

        } else {
          setVisible(false);
        }
      }}
      actions={[
        [{
          key: 'ok',
          text: instockLoading ? <Loading /> : '确定',
        },
          {
            key: 'close',
            text: '取消',
          }],
      ]}
    />
  </>;
};

export default React.forwardRef(CreateInstock);
