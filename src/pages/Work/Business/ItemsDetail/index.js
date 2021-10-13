import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { Button,List, ListItem, Spin } from 'weui-react-v2';
import { Card, InfiniteScroll } from 'antd-mobile';

let pages = 1;
let limit = 10;
let contents = [];

const ItemsDetail = ({ businessId }) => {


  const [data, setData] = useState();

  const [hasMore, setHasMore] = useState(true);

  const { loading, run } = useRequest({
    url: '/crmBusinessDetailed/list',
    method: 'POST',
    data: {
      businessId: businessId,
    },
    params: {
      limit: limit,
      page: pages,
    },
  }, {
    debounceInterval: 500,
    refreshDeps: [],
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
  }, []);

  if (loading && pages === 1) {
    return (
      <div style={{ margin: 50, textAlign: 'center' }}>
        <Spin spinning={true} size='large' />
      </div>
    );
  }

  if (!businessId) {
    return null;
  }

  return (
    <>
      {data && data.map((items, index) => {
        return (
          <List key={index}>
            <ListItem onClick={() => {
              // router.push('/Work/Business/BusinessDetail');
            }}>
              <Card
                extra={<div>品牌: <Button
                  type='text'> {items.brandResult ? items.brandResult.brandName : null}</Button></div>}
                title={
                  items.itemsResult ? items.itemsResult.name : null
                }>
                <div>销售单价：{items.salePrice}</div>
                <div>数量：{items.quantity}</div>
                <div>小计：{items.totalPrice}</div>
              </Card>
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

export default ItemsDetail;
