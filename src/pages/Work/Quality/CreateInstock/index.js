import React, { useEffect, useState } from 'react';
import { Card, CheckList, Dialog, Space, Toast } from 'antd-mobile';
import { codingRulesList, codingRulesListSelect, storeHouseSelect, UserIdSelect } from '../Url';
import { Badge } from 'antd';
import { Config } from '../../../../../config';
import { useRequest } from '../../../../util/Request';
import MyPicker from '../../../components/MyPicker';

const CreateInstock = ({ show, qualityDeatlis }) => {

  const [visible, setVisible] = useState(false);

  const [inkindIds, setInkindIds] = useState([]);

  const [coding, setCoding] = useState();

  const [storehoust, setStorehoust] = useState();

  const [user, setUser] = useState();

  const datas = (values) => {
    if (typeof values === 'object') {
      const array = [];
      values.map((items) => {
        // 找到集合中相同的实物
        const item = array.filter((value) => {
          return items.formId === value.formId;
        });
        // 找到和当前相同实物
        const allItem = values.filter((value) => {
          return items.formId === value.formId;
        });
        // 取出相同实物中不合格的实物
        const getJudge = allItem.filter((value) => {
          const judges = value.values.filter((value) => {
            return value.dataValues.judge === 0;
          });
          return judges.length > 0;
        });
        if (item.length <= 0) {
          return array.push({ ...items, getJudge: getJudge.length === 0 });
        }else {
          return null;
        }
      });
      setVisible(array);
    }
  };

  useEffect(() => {
    setInkindIds([]);
    setStorehoust(null);
    setUser(null);
    datas(show);
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
        <Card title='选择入库物料'>
          <div style={{ maxheight: '50vh', overflow: 'auto' }}>
            <CheckList multiple onChange={(value) => {
              setInkindIds(value);
            }}>
              {typeof visible === 'object' && visible.map((items, index) => {


                const qualityDetail = qualityDeatlis.filter((value) => {
                  const inkindIds = (value.inkindId && value.inkindId !== '') ? value.inkindId.split(',') : [];
                  const codeIds = inkindIds.filter((value) => {
                    return value === items.qrcodeId;
                  });
                  return codeIds.length > 0;
                });

                if (qualityDetail && qualityDetail[0]) {
                  return <CheckList.Item value={items.formId} key={index}>
                    <div>
                      {qualityDetail[0].skuResult && qualityDetail[0].skuResult.skuName}
                      &nbsp;/&nbsp;
                      {qualityDetail[0].skuResult && qualityDetail[0].skuResult.spuResult && qualityDetail[0].skuResult.spuResult.name}
                      &nbsp;&nbsp;
                      {
                        qualityDetail[0].skuResult
                        &&
                        qualityDetail[0].skuResult.list
                        &&
                        qualityDetail[0].skuResult.list.length > 0
                        &&
                        qualityDetail[0].skuResult.list[0].attributeValues
                        &&
                        <em style={{ color: '#c9c8c8', fontSize: 10 }}>
                          (
                          {
                            qualityDetail[0].skuResult.list.map((items, index) => {
                              return <span key={index}>
                {items.itemAttributeResult.attribute}：{items.attributeValues}
                  </span>;
                            })
                          }
                          )
                        </em>}
                    </div>
                    <div>
                      {qualityDetail[0].brand && qualityDetail[0].brand.brandName}
                      &nbsp;&nbsp;  &nbsp;&nbsp;
                      × 1
                      <div style={{ float: 'right' }}>
                        {
                          items.getJudge ?
                            <Badge text='合格' color='green' />
                            :
                            <Badge text='不合格' color='red' />
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
                  url: Config().wxCp + 'OrCode?id=codeId',
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
