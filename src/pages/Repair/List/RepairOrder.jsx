import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../util/Request';
import RepairItem from '../RepairItem';
import { Spin } from 'weui-react-v2';
import { Empty, InfiniteScroll } from 'antd-mobile';

let pages = 1;
let limit = 10;
let contents = [];

const RepairOrder = ({ select }) => {


  const [data, setData] = useState();

  const [hasMore, setHasMore] = useState(true);

  const { loading, run } = useRequest({
    url: '/api/getRepairOrder',
    method: 'POST',
    params: {
      limit: limit,
      page: pages,
    },
  }, {
    debounceInterval: 500,
    refreshDeps: [select],
    onSuccess: (res) => {
      if (res.data && res.data.length > 0) {
        res.data.map((items, index) => {
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
    <div>
      {
        data && data.length > 0 ? data.map((item, index) => {
          return (
            <RepairItem
              key={index}
              compnay={item.customerResult && item.customerResult.customerName}
              items={item.deliveryDetailsResult && item.deliveryDetailsResult.detailesItems && item.deliveryDetailsResult.detailesItems.name}
              brand={item.deliveryDetailsResult && item.deliveryDetailsResult.detailsBrand && item.deliveryDetailsResult.detailsBrand.brandName}
              address={item.regionResult[0] ? item.regionResult[0].province + '-' + item.regionResult[0].city + '-' + item.regionResult[0].area + '-' + item.address : null}
              type={item.serviceType}
              id={item.repairId}
              progress={item.progress}
            />
          );
        }) :  <Empty description='暂无数据' />
      }
      {data && <InfiniteScroll loadMore={() => {
        return run({});
      }} hasMore={hasMore} />}
    </div>
  );
};
export default RepairOrder;
