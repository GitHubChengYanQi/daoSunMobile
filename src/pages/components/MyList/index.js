import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../util/Request';
import { Spin } from 'weui-react-v2';
import { InfiniteScroll } from 'antd-mobile';
import { useScroll } from 'ahooks';

let page = 1;
let limit = 10;
let contents = [];

const MyList = ({ select, api, children, conent }) => {

  const [hasMore, setHasMore] = useState(true);

  const scroll = useScroll();

  const { loading, run } = useRequest(api, {
    manual: true,
    debounceInterval: 500,
    onSuccess: async (res) => {
      if (res && res.length > 0) {
        await res.map((items, index) => {
          contents.push(items);
        });
        ++page;
        await typeof conent === 'function' && conent(contents);
      } else {
        setHasMore(false);
      }
    },
  });


  const refresh = async (page) => {
    await run({
      data: {
        ...select,
      },
      params: {
        limit: limit,
        page: page,
      },
    });
  };

  useEffect(() => {
    page = 1;
    contents = [];
    refresh(page);
  }, [select]);

  if (loading && page === 1) {
    return (
      <>
        <div style={{ margin: 50, textAlign: 'center' }}>
          <Spin spinning={true} size='large' />
        </div>
      </>
    );
  }


  return (
    <>
      {children}
      <InfiniteScroll loadMore={() => {
        refresh(page);
      }} hasMore={hasMore} />
    </>
  );
};

export default MyList;
