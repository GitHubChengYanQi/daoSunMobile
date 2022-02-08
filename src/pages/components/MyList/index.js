import React, { useEffect, useImperativeHandle, useState } from 'react';
import { useRequest } from '../../../util/Request';
import { Spin } from 'weui-react-v2';
import { InfiniteScroll } from 'antd-mobile';

let pages = 1;
let limit = 10;
let contents = [];

const MyList = ({ children, getData, data, api, select }, ref) => {

  const [hasMore, setHasMore] = useState(true);

  const [error, setError] = useState(true);

  const { loading, run } = useRequest({
    ...api,
    params: {
      limit: limit,
      page: pages,
    },
  }, {
    debounceInterval: 1000,
    onSuccess: (res) => {
      if (res && res.length > 0) {
        res.map((items) => {
          return contents.push(items);
        });
        typeof getData === 'function' && getData(contents);
        ++pages;
      } else {
        setHasMore(false);
        if (pages === 1) {
          typeof getData === 'function' && getData([]);
        }
      }
    },
    onError: () => {
      setError(false);
    },
  });

  const refresh = () => {
    pages = 1;
    contents = [];
    typeof getData === 'function' && getData([]);
  };

  useImperativeHandle(ref, () => ({
    refresh,
  }));

  useEffect(() => {
    pages = 1;
    contents = [];
  }, []);

  if (loading && pages === 1) {
    return (
      <div style={{ padding: 50, textAlign: 'center', backgroundColor: '#fff' }}>
        <Spin spinning={true} size='large' />
      </div>
    );
  }
  return <>
    {children}
    {error && data && <InfiniteScroll
      threshold={0}
      loadMore={async () => {
        return await run({
          data: {
            ...select,
          },
        });
      }}
      hasMore={hasMore}
    />}
  </>;
};

export default React.forwardRef(MyList);
