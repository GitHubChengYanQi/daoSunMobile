import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { Button, Flex, FlexItem, List, ListItem, Spin, Input } from 'weui-react-v2';
import { Card, Dialog, Form, InfiniteScroll, Popup } from 'antd-mobile';
import { EllipsisOutlined } from '@ant-design/icons';
import Icon from '../../../components/Icon';
import { notification } from 'antd';
import { OutBound, outstockApplyEdit, StoreHouse } from '../OutstockApplyUrl';
import MyPicker from '../../../components/MyPicker';
import style from './index.css';
import OutstockDetails from '../OutstockDetails';

let pages = 1;
let limit = 10;
let contents = [];

const OutstockApplyList = ({ select }) => {

  const refFrom = useRef();

  const { run: outstockApply } = useRequest(OutBound,
    {
      manual: true,
      onSuccess: () => {
        setVisible(false);
        openNotificationWithIcon('success');
      },
      onError: () => {
        openNotificationWithIcon('error');
      },
    });

  const [data, setData] = useState();

  const [hasMore, setHasMore] = useState(true);

  const { loading, run } = useRequest({
    url: '/outstockApply/list',
    method: 'POST',
    data: {
      ...select,
    },
    params: {
      limit: limit,
      page: pages,
    },
  }, {
    debounceInterval: 500,
    refreshDeps: [select],
    onSuccess: (res) => {
      if (res && res.length > 0) {
        res.map((items, index) => {
          return contents.push(items);
        });
        setData(contents);
        ++pages;
      } else {
        setHasMore(false);
        if (pages === 1) {
          setData([]);
        }
      }
    },
  });


  useEffect(() => {
    pages = 1;
    contents = [];
  }, [select]);


  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: type === 'success' ? '操作成功！' : '操作失败！',
    });

    pages = 1;
    contents = [];
    run({});
  };
  const { run: runOk } = useRequest(outstockApplyEdit, {
    manual: true,
    onSuccess: () => {
      openNotificationWithIcon('success');
    },
    onError: () => {
      openNotificationWithIcon('error');
    },
  });


  const confirmOk = (record) => {

    Dialog.confirm({
      content: '请确认是否同意发货申请操作!注意：同意之后不可恢复。',
      style: { margin: 'auto' },
      onConfirm: async () => {
        await runOk(
          {
            data: { ...record, applyState: 2 },
          },
        );
      },
    });
  };

  const [visible, setVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  const [type, setType] = useState();

  const Type = () => {
    switch (type) {
      case 0:
        return (
          <>
            <Form.Item label='物流公司' name='logisticsCompany' rules={[{ required: true, message: '该字段是必填字段！' }]}>
              <MyPicker
                option={[{ label: '京东', value: '0' }, { label: '顺丰', value: '1' }]} />
            </Form.Item>
            <Form.Item label='物流单号' name='logisticsNumber' rules={[{ required: true, message: '该字段是必填字段！' }]}>
              <Input placeholder='请输入物流单号' />
            </Form.Item>
          </>
        );
      case 1:
        return (
          <>
            <Form.Item label='司机姓名' name='driverName' rules={[{ required: true, message: '该字段是必填字段！' }]}>
              <Input placeholder='请输入司机姓名' />
            </Form.Item>
            <Form.Item label='电话' name='driverPhone' rules={[{ required: true, message: '该字段是必填字段！' }]}>
              <Input placeholder='请输入电话' />
            </Form.Item>
            <Form.Item label='车牌号' name='licensePlate' rules={[{ required: true, message: '该字段是必填字段！' }]}>
              <Input placeholder='请输入车牌号' />
            </Form.Item>
          </>
        );
      default:
        break;
    }
  };

  if (loading && pages === 1) {
    return (
      <div style={{ margin: 50, textAlign: 'center' }}>
        <Spin spinning={true} size='large' />
      </div>
    );
  }

  return (
    <>
      <List style={{ margin: 0 }} title={<>发货申请数量 <span style={{ color: 'red' }}>{data && data.length}</span></>} />
      {data && data.map((items, index) => {
        return (
          <List key={index}>
            <ListItem onClick={() => {
              // router.push('/Work/Business/BusinessDetail');
            }}>
              <Card
                extra={<div>负责人: <Button
                  type='link'> {items.userResult && items.userResult.name}</Button></div>}
                title={
                  items.outstockApplyId
                }>
                <div>客户： {items.customerResult && items.customerResult.customerName}</div>
                <div>地址：{items.adressResult && items.adressResult.location}</div>
                <div>联系人： {items.contactsResult && items.contactsResult.contactsName}</div>
                <div>电话： {items.phoneResult && items.phoneResult.phoneNumber}</div>
              </Card>
            </ListItem>

            <ListItem>
              <Flex type='flex' justify='space-around'>
                <FlexItem>
                  <Button
                    type='link' style={{ padding: 0 }}
                    onClick={() => {
                      switch (items.applyState) {
                        case 1:
                          confirmOk(items);
                          break;
                        case 2:
                          setVisible(items);
                          break;
                        default:
                          break;
                      }
                    }}><Icon
                    type='icon-chuhuo' /> {items.applyState === 1 && '同意'}{items.applyState === 2 && '一键发货'}{items.applyState === 3 && '已发货'}
                  </Button>
                </FlexItem>
                <FlexItem>
                  <Button type='link' style={{ padding: 0 }} onClick={() => {
                    setPopupVisible(items.outstockApplyId);
                  }}><EllipsisOutlined />详情</Button></FlexItem>
              </Flex>
            </ListItem>

          </List>
        );
      })}
      {data && <InfiniteScroll loadMore={() => {
        return run({});
      }} hasMore={hasMore} />}

      <Dialog
        title='发货信息'
        bodyClassName={style.dialogBody}
        visible={visible}
        content={
          <Form
            ref={refFrom}
            onValuesChange={(value) => {
              if (value.deliveryWay !== undefined) {
                setType(value.deliveryWay);
              }
            }}
            onFinish={async (value) => {
              await outstockApply({
                data: {
                  ...visible,
                  ...value,
                },
              });
            }}
            layout='horizontal'
          >
            <Form.Item label='仓库' name='stockId' rules={[{ required: true, message: '该字段是必填字段！' }]}>
              <MyPicker api={StoreHouse} />
            </Form.Item>
            <Form.Item label='发货方式' name='deliveryWay' rules={[{ required: true, message: '该字段是必填字段！' }]}>
              <MyPicker option={[{ label: '物流', value: 0 }, { label: '配送', value: 1 }]} />
            </Form.Item>

            {Type()}

          </Form>
        }
        onAction={(action) => {
          switch (action.key) {
            case '0':
              setVisible(false);
              break;
            case '1':
              refFrom.current.submit();
              break;
            default:
              break;
          }
        }}
        actions={[
          {
            key: '0',
            text: '取消',
          },
          {
            key: '1',
            text: '确认',
          },
        ]}
      />

      <Popup
        visible={popupVisible}
        onMaskClick={() => {
          setPopupVisible(false)
        }}
        position='bottom'
        bodyStyle={{ minHeight: '40vh' }}
      >
        <OutstockDetails select={{outstockApplyId:popupVisible || '000'}} />
      </Popup>

    </>
  );

};

export default OutstockApplyList;
