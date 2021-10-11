import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { Button, Flex, FlexItem, List, ListItem, Spin } from 'weui-react-v2';
import { Card, Dialog, InfiniteScroll } from 'antd-mobile';
import { EllipsisOutlined, OrderedListOutlined, PhoneOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { router } from 'umi';
import Icon from '../../../components/Icon';
import { notification } from 'antd';
import { outstockApplyEdit } from '../OutstockApplyUrl';

let pages = 1;
let limit = 10;
let contents = [];

const OutstockApplyList = ({ select }) => {

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
      message: type === 'success' ? '已同意！' : '失败！',
    });

    if (type === 'success'){
      pages = 1;
      contents = [];
      run({});
    }
  };
  const { run: runOk } = useRequest(outstockApplyEdit, {
    manual: true, onSuccess: () => {
      openNotificationWithIcon('success');

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

  if (loading && pages === 1) {
    return (
      <div style={{ margin: 50, textAlign: 'center' }}>
        <Spin spinning={true} size='large' />
      </div>
    );
  }

  return (
    <>
      {!(select && select.businessId) &&
      <List style={{ margin: 0 }} title={<>发货申请数量 <span style={{ color: 'red' }}>{data && data.length}</span></>} />}
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
                    router.push(`/Work/Customer/CustomerDetail?${items.customerId}`);
                  }}><EllipsisOutlined />详情</Button></FlexItem>
              </Flex>
            </ListItem>

          </List>
        );
      })}
      {data && <InfiniteScroll loadMore={() => {
        return run({});
      }} hasMore={hasMore} />}
    </>
  );

};

export default OutstockApplyList;
