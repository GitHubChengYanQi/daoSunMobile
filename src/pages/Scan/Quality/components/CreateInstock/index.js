import React, { useEffect, useState } from 'react';
import { Card, CheckList, Dialog, Space, Toast } from 'antd-mobile';
import MyPicker from '../../../../components/MyPicker';
import { codingRulesList, codingRulesListSelect, storeHouseSelect, UserIdSelect } from '../Url';
import {  useRequest } from '../../../../../util/Request';
import { Badge } from 'antd';
import { Config } from '../../../../../../config';

const CreateInstock = ({ show }) => {

  const [visible, setVisible] = useState(false);

  const [inkindIds,setInkindIds] = useState([]);

  const [coding, setCoding] = useState();

  const [storehoust, setStorehoust] = useState();

  const [user, setUser] = useState();

  useEffect(() => {
    setInkindIds([]);
    setStorehoust(null);
    setUser(null);
    setVisible(show);
  }, [show]);

  const { loading, data } = useRequest(codingRulesList, {
    defaultParams: {
      data: {
        module: 1,
        state: 1,
      },
    },
  });

  const { run } = useRequest(
    {
      url: '/instockOrder/addByQuality',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: () => {
        Toast.show({
          content: '创建入库单成功！',
        });
        setVisible(false);
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
        <div style={{ marginLeft:'30%' }}>
          <Space direction='vertical'>
            <Space>
              <div>编码:</div>
              <MyPicker api={codingRulesListSelect} value={coding} onChange={(value) => {
                setCoding(value);
              }} />
            </Space>
            <Space>
              <div>仓库:</div>
              <MyPicker api={storeHouseSelect} value={storehoust} onChange={(value) => {
                setStorehoust(value);
              }} />
            </Space>
            <Space>
              <div>负责人:</div>
              <MyPicker api={UserIdSelect} value={user} onChange={(value) => {
                setUser(value);
              }} />
            </Space>
          </Space>
        </div>
        <Card title='选择入库物料'>
          <div style={{ maxheight: '50vh', overflow: 'auto' }}>
            <CheckList multiple onChange={(value)=>{
              setInkindIds(value);
            }}>
              {visible && visible.map((items, index) => {
                if (items.inkind && items.inkind.sku && items.inkind.inkind && (!items.inkind.inkind.instockOrderId)) {
                  return <CheckList.Item value={items.inkind.inkind.inkindId} key={index}>
                    <div>
                      {items.inkind.sku.skuName}
                      &nbsp;/&nbsp;
                      {items.inkind.sku.spuResult && items.inkind.sku.spuResult.name}
                      &nbsp;&nbsp;
                      <em style={{ color: '#c9c8c8', fontSize: 10 }}>
                        (
                        {
                          items.inkind.sku.skuJsons
                          &&
                          items.inkind.sku.skuJsons.map((items, index) => {
                            return (
                              <span key={index}>{items.attribute.attribute}：{items.values.attributeValues}</span>
                            );
                          })
                        }
                        )
                      </em>
                    </div>
                    <div>
                      {items.inkind.brand && items.inkind.brand.brandName}
                      &nbsp;&nbsp;  &nbsp;&nbsp;
                      × {items.inkind.inkind.number}
                      <div style={{float:'right'}}>
                        {
                          !items.success ?
                            <Badge text='不合格' color='red' />
                            :
                            <Badge text='合格' color='green' />
                        }
                      </div>
                    </div>
                  </CheckList.Item>;
                } else {
                  return null;
                }

              })}
            </CheckList>
          </div>
        </Card>
      </>}
      onAction={async (action) => {
        if (action.key === 'ok') {
          if (!coding) {
            Toast.show({
              content: '编码不能为空！',
            });
          } else if (!storehoust) {
            Toast.show({
              content: '仓库不能为空！',
            });
          } else if (!user) {
            Toast.show({
              content: '负责人不能为空！',
            });
          } else if (inkindIds.length === 0) {
            Toast.show({
              content: '请选择物料！',
            });
          } else {
            await run(
              {
                data: {
                  coding,
                  url: Config().code+'?id=codeId',
                  storeHouseId: storehoust,
                  userId: user,
                  number: 1,
                  inkinds: inkindIds,
                },
              },
            );
          }

        } else {
          setVisible(false);
        }
      }}
      actions={[
        [{
          key: 'ok',
          text: '确定',
        },
          {
            key: 'close',
            text: '取消',
          }],
      ]}
    />
  </>;
};

export default CreateInstock;
