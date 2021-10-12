import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { Button, Flex, FlexItem, List, ListItem, Spin } from 'weui-react-v2';
import { EllipsisOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { Card, InfiniteScroll } from 'antd-mobile';
import { Col, Row } from 'antd';

let pages = 1;
let limit = 10;
let contents = [];

const OutstockDetails = ({ select }) => {

  const [data, setData] = useState();

  const [hasMore, setHasMore] = useState(true);

  const { loading, run } = useRequest({
    url: '/applyDetails/list',
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
    <div style={{padding:16}}>
      <Row gutter={24}>
        <Col span={8}>
          产品
        </Col>
        <Col span={8}>
          品牌
        </Col>
        <Col span={8}>
          数量
        </Col>
      </Row>
      {data && data.map((items, index) => {
        return (
          <List key={index}>
            <Row gutter={24}>
              <Col span={8}>
                {items.itemsResult &&  items.itemsResult.name}
              </Col>
              <Col span={8}>
                {items.brandResult && items.brandResult.brandName}
              </Col>
              <Col span={8}>
                {items.number}
              </Col>
            </Row>
          </List>
        );
      })}
      {data && <InfiniteScroll loadMore={() => {
        return run({});
      }} hasMore={hasMore} />}
    </div>
  );

};

export default OutstockDetails;
