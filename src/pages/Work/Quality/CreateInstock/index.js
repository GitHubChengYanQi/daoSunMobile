import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Card,  Dialog, List, Loading, Space, Stepper, Toast } from 'antd-mobile';
import { codingRulesList, codingRulesListSelect, storeHouseSelect, UserIdSelect } from '../Url';
import { useRequest } from '../../../../util/Request';
import MyPicker from '../../../components/MyPicker';

const CreateInstock = ({ show, qualityDeatlis,onSuccess }, ref) => {

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

  const { loading:instockLoading,run } = useRequest(
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
        <div style={{ marginLeft: '30%' }}>
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
        <Card title='入库物料'>
          <div style={{ maxheight: '50vh', overflow: 'auto' }}>
            <List>
              {
                qualityDeatlis && qualityDeatlis.map((items, index) => {
                  if ((items.number - items.instockNumber) > 0)
                    return <List.Item
                      key={index}
                      description={
                        items.skuResult
                        &&
                        items.skuResult.list
                        &&
                        items.skuResult.list.length > 0
                        &&
                        items.skuResult.list[0].attributeValues
                        &&
                        <em style={{ color: '#c9c8c8', fontSize: 10 }}>
                          (
                          {
                            items.skuResult.list.map((items, index) => {
                              return <span key={index}>
                {items.itemAttributeResult.attribute}：{items.attributeValues}
                  </span>;
                            })
                          }
                          )
                        </em>}
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
                      items.skuResult.spuResult && items.skuResult.spuResult.spuClassificationResult && items.skuResult.spuResult.spuClassificationResult.name
                      &nbsp;/&nbsp;
                      {items.skuResult && items.skuResult.spuResult && items.skuResult.spuResult.name}
                    </List.Item>;
                  else
                    return null;
                })
              }

            </List>


            {/*<CheckList multiple onChange={(value) => {*/}
            {/*  setInkindIds(value);*/}
            {/*}}>*/}
            {/*  {typeof visible === 'object' && visible.map((items, index) => {*/}


            {/*    const qualityDetail = qualityDeatlis.filter((value) => {*/}
            {/*      const inkindIds = (value.inkindId && value.inkindId !== '') ? value.inkindId.split(',') : [];*/}
            {/*      const codeIds = inkindIds.filter((value) => {*/}
            {/*        return value === items.qrcodeId;*/}
            {/*      });*/}
            {/*      return codeIds.length > 0;*/}
            {/*    });*/}

            {/*    if (qualityDetail && qualityDetail[0]) {*/}
            {/*      return <CheckList.Item value={items.formId} key={index}>*/}
            {/*        <div>*/}
            {/*          {qualityDetail[0].skuResult && qualityDetail[0].skuResult.skuName}*/}
            {/*          &nbsp;/&nbsp;*/}
            {/*          {qualityDetail[0].skuResult && qualityDetail[0].skuResult.spuResult && qualityDetail[0].skuResult.spuResult.name}*/}
            {/*          &nbsp;&nbsp;*/}
            {/*          {*/}
            {/*            qualityDetail[0].skuResult*/}
            {/*            &&*/}
            {/*            qualityDetail[0].skuResult.list*/}
            {/*            &&*/}
            {/*            qualityDetail[0].skuResult.list.length > 0*/}
            {/*            &&*/}
            {/*            qualityDetail[0].skuResult.list[0].attributeValues*/}
            {/*            &&*/}
            {/*            <em style={{ color: '#c9c8c8', fontSize: 10 }}>*/}
            {/*              (*/}
            {/*              {*/}
            {/*                qualityDetail[0].skuResult.list.map((items, index) => {*/}
            {/*                  return <span key={index}>*/}
            {/*    {items.itemAttributeResult.attribute}：{items.attributeValues}*/}
            {/*      </span>;*/}
            {/*                })*/}
            {/*              }*/}
            {/*              )*/}
            {/*            </em>}*/}
            {/*        </div>*/}
            {/*        <div>*/}
            {/*          {qualityDetail[0].brand && qualityDetail[0].brand.brandName}*/}
            {/*          &nbsp;&nbsp;  &nbsp;&nbsp;*/}
            {/*          × {qualityDetail[0].batch ? qualityDetail[0].number : 1}*/}
            {/*          <div style={{ float: 'right' }}>*/}
            {/*            {*/}
            {/*              items.getJudge ?*/}
            {/*                <Badge text='合格' color='green' />*/}
            {/*                :*/}
            {/*                <Badge text='不合格' color='red' />*/}
            {/*            }*/}
            {/*          </div>*/}
            {/*        </div>*/}
            {/*      </CheckList.Item>;*/}
            {/*    } else {*/}
            {/*      return null;*/}
            {/*    }*/}
            {/*  })}*/}
            {/*</CheckList>*/}
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
          else if (!user)
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
              data:{
                coding,
                storeHouseId: storehoust,
                userId: user,
                instockRequest:skus,
                url:process.env.wxCp + 'OrCode?id=codeId'
              }
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
