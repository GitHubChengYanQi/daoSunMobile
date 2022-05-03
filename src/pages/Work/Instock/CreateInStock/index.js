import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { skuResults } from '../../../Scan/Url';
import MyNavBar from '../../../components/MyNavBar';
import { Button, Card, Divider, Input, List, Radio, Space, TextArea, Toast } from 'antd-mobile';
import MyCoding from '../../../components/MyCoding';
import UpLoadImg from '../../../components/Upload';
import LinkButton from '../../../components/LinkButton';
import MyPopup from '../../../components/MyPopup';
import Type from './Type';
import MyDatePicker from '../../../components/MyDatePicker';
import MyTimePicker from '../../../components/MyTimePicker';
import CheckSkus from '../../Sku/CheckSkus';
import AddSkus from './AddSkus';
import MyBottom from '../../../components/MyBottom';
import SelectUser from '../../Production/CreateTask/components/SelectUser';
import { instockOrderAdd } from '../Url';
import { MyLoading } from '../../../components/MyLoading';
import { history } from 'umi';
import style from '../../../components/Number/index.css';
import Process from '../../PurchaseAsk/components/Process';
import { DownFill } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';

const CreateInStock = ({paramsSkus,source,sourceId}) => {

  const typeRef = useRef();

  const checkSkuRef = useRef();

  const [skus, setSkus] = useState([]);

  const [data, setData] = useState({ source, sourceId });

  const [state, { toggle }] = useBoolean();

  const { loading: skusLoading, run: getSkus } = useRequest(skuResults, {
    manual: true,
    onSuccess: (res) => {
      const array = [];
      res.map((item) => {
        const sku = paramsSkus.filter((skuItem) => skuItem.skuId === item.skuId);
        return sku.map(skuItem => array.push({ ...skuItem, skuResult: item }));
      });
      setSkus(array);
    },
  });

  const { loading, run: instock } = useRequest(instockOrderAdd, {
    manual: true,
    onSuccess: (res) => {
      history.goBack();
      Toast.show({ content: '创建入库申请成功！', position: 'bottom' });
    },
    onError: () => {
      Toast.show({ content: '创建入库申请失败！', position: 'bottom' });
    },
  });

  useEffect(() => {
    if (Array.isArray(paramsSkus)) {
      getSkus({ data: { skuIds: paramsSkus.map(item => item.skuId) } });
    }
  }, []);

  const module = (value) => {
    switch (value) {
      case 'procurementOrder':
        return '采购单';
      default:
        return '请选择';
    }
  };

  const onCheck = (value) => {
    const array = value.map((item) => {
      const sku = skus.filter(skuItem => skuItem.skuId === item.skuId);
      return sku[0] || { skuId: item.skuId, skuResult: item };
    });
    setSkus(array);
  };

  return <>
    <MyBottom
      leftActuions={<div>合计：{skus.length}</div>}
      buttons={<Space>
        <Button>扫码添加物料</Button>
        <Button
          disabled={skus.length === 0 || skus.filter(item => item.number > 0).length !== skus.length}
          color='primary' onClick={() => {
          const instockRequest = [];
          skus.map((item) => {
            if (item.details && item.details.length > 0) {
              item.details.map((detailItem) => {
                if (detailItem.number > 0) {
                  instockRequest.push({
                    skuId: item.skuId,
                    brandId: item.brandId,
                    customerId: item.customerId,
                    ...detailItem,
                  });
                }
                return null;
              });
            } else {
              instockRequest.push({
                skuId: item.skuId,
                brandId: item.brandId,
                customerId: item.customerId,
                number: item.number,
              });
            }
            return null;
          });
          instock({
            data: {
              ...data,
              userId: data.user && data.user.id,
              stockUserId: data.stockUser && data.stockUser.id,
              instockRequest,
              enclosure: data.enclosure && data.enclosure.map(item => item.id),
              registerTime: data.date && `${data.date} ${data.time}`,
              time: null,
            },
          });
        }}>提交申请</Button>
      </Space>}
    >
      <MyNavBar title='新建入库申请' />

      <Card
        title={<div>基本信息</div>}
        style={{ padding: 0 }}
        headerStyle={{ background: '#eee', paddingLeft: 8 }}
        extra={<div style={{ paddingRight: 16 }} onClick={() => {
          toggle();
        }}><DownFill /></div>}
      >
        <List style={{ '--border-top': 'none', '--border-bottom': 'none', '--border-inner': 'none' }}>
          <List.Item extra={
            <MyCoding hidden module={1} inputRight onChange={(coding) => {
              setData({ ...data, coding });
            }} value={data.coding} />
          }>
            入库编码
          </List.Item>
          <List.Item extra={
            <Input className={style.inputRight} placeholder='请输入，不输入将自动生成' value={data.theme} onChange={(val) => {
              setData({ ...data, theme: val });
            }} />
          }>
            单据主题
          </List.Item>
          <List.Item
            onClick={() => {
              // history.push(`/Word/Instock/CreateInStock/AssociatedTasks?id=${}`);
            }}
            extra={<div style={{ color: data.module && '#000' }}>{module(data.source)}</div>}
          >
            关联任务
          </List.Item>
          <List.Item
            onClick={() => {
              typeRef.current.open(data.type);
            }}
            extra={<div style={{ color: data.type && '#000' }}>{data.type || '请选择'}</div>}
          >
            入库类型
          </List.Item>
          <Divider />
          <div hidden={!state}>
            <List.Item
              extra={<div><SelectUser value={data.user} onChange={(user) => {
                setData({ ...data, user });
              }} /></div>}
            >
              送料负责
            </List.Item>
            <List.Item
              extra={
                <div style={{ paddingRight: 8 }}>
                  <MyDatePicker value={data.date} precision='day' onChange={(value) => {
                    setData({ ...data, date: value });
                  }} />
                </div>
              }
            >
              送料日期
            </List.Item>
            <List.Item
              extra={
                <div style={{ paddingRight: 8 }}>
                  <MyTimePicker value={data.time} onChange={(value) => {
                    setData({ ...data, time: value });
                  }} />
                </div>

              }
            >
              具体时间
            </List.Item>
            <List.Item
              extra={<div><SelectUser value={data.stockUser} onChange={(user) => {
                setData({ ...data, stockUser: user });
              }} /></div>}
            >
              库管人员
            </List.Item>
            <List.Item extra={
              <Radio.Group
                defaultValue={0}
                value={data.urgent}
                onChange={val => {
                  setData({ ...data, urgent: val });
                }}
              >
                <Space>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Space>
              </Radio.Group>
            }>
              是否紧急
            </List.Item>
            <List.Item>
              <UpLoadImg
                maxCount={5}
                showUploadList
                type='text'
                button={
                  <div style={{ display: 'flex', width: '90vw' }}>
                    <div style={{ flexGrow: 1 }}>
                      附件 {data.enclosure && data.enclosure.length || 0} / 5 格式：JPG.PDF
                    </div>
                    <div>
                      <LinkButton>上传附件</LinkButton>
                    </div>
                  </div>
                }
                onChange={(url, id, name) => {
                  const enclosure = data.enclosure || [];
                  setData({ ...data, enclosure: [...enclosure, { url, id, name }] });
                }}
                onRemove={(name) => {
                  const enclosure = data.enclosure && data.enclosure.filter((item) => {
                    return item.name !== name;
                  });
                  setData({ ...data, enclosure });
                }}
              />
            </List.Item>
            <List.Item>
              备注说明
              <TextArea placeholder='请输入' value={data.note} onChange={(val) => {
                setData({ ...data, note: val });
              }} />
            </List.Item>
          </div>

        </List>
      </Card>

      <Card title={<div>入库明细</div>} style={{ margin: '16px 0' }} extra={<LinkButton onClick={() => {
        setSkus([]);
      }}>全部清除</LinkButton>}>
        <Button color='primary' fill='outline' style={{ width: '100%' }} onClick={() => {
          checkSkuRef.current.open(skus);
        }}>查找并添加物料</Button>
      </Card>

      <AddSkus skus={skus} setSkus={setSkus} />

      <Process type='createInstock' card />
    </MyBottom>

    <MyPopup
      onSuccess={(value) => {
        setData({ ...data, type: value });
        typeRef.current.close();
      }}
      position='bottom'
      title='入库类型选择'
      component={Type}
      ref={typeRef}
    />

    <MyPopup
      width='100vw'
      height='100vh'
      title='选择物料'
      component={CheckSkus}
      ref={checkSkuRef}
      onCheck={(value) => {
        onCheck(value);
      }}
      onChange={(value) => {
        onCheck(value);
        checkSkuRef.current.close();
      }}
    />

    {(loading || skusLoading) && <MyLoading />}
  </>;
};

export default CreateInStock;
