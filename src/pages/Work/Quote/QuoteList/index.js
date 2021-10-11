import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { Button,  List, ListItem, Spin } from 'weui-react-v2';
import { Card, InfiniteScroll } from 'antd-mobile';

let pages = 1;
let limit = 10;
let contents = [];

const QuoteList = ({ select }) => {

  const [data, setData] = useState();

  const [hasMore, setHasMore] = useState(true)

  const { loading,run } = useRequest({
    url: '/competitorQuote/list',
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

  if (loading && pages === 1) {
    return (
      <div style={{ margin: 50, textAlign: 'center' }}>
        <Spin spinning={true} size='large' />
      </div>
    );
  }

  return (
    <>
      {!(select && select.businessId) && <List style={{ margin: 0 }} title={<>报价数量 <span style={{ color: 'red' }}>{data && data.length}</span></>} />}
      {data && data.map((items, index) => {
        return (
          <List key={index}>
            <ListItem onClick={() => {
              // router.push('/Work/Business/BusinessDetail');
            }}>
              <Card extra={<div>关联项目: <Button type='link'>{items.crmBusinessResult ? items.crmBusinessResult.businessName : '无'}</Button></div>} title={
                items.competitorResult ? items.competitorResult.name : items.campType === 0 && '我方报价'
              }>
                <div>报价金额：{items.competitorsQuote}</div>
                <div>报价日期：{items.createTime}</div>
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

export default QuoteList;
