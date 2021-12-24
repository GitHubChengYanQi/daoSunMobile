import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../util/Request';
import { Spin } from 'weui-react-v2';
import { InfiniteScroll } from 'antd-mobile';

let pages = 1;
let limit = 10;
let contents = [];

const MyList = ({children,getData,data,select,api}) => {

  const [hasMore, setHasMore] = useState(true)

  const [error,setError] = useState(true);

  const { loading,run } = useRequest({
    ...api,
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
        typeof getData === 'function' && getData(contents);
        ++pages;
      } else {
        setHasMore(false);
        if (pages === 1) {
          typeof getData === 'function' && getData([]);
        }
      }
    },
    onError:()=>{
      setError(false);
    }
  });

  useEffect(() => {
    pages = 1;
    contents = [];
  }, [select]);

  if (loading && pages === 1) {
    return (
      <div style={{ padding: 50, textAlign: 'center',backgroundColor:'#fff' }}>
        <Spin spinning={true} size='large' />
      </div>
    );
  }

  return <>
    {children}
    {error && data && <InfiniteScroll loadMore={() => {
      return run({});
    }} hasMore={hasMore} />}
  </>
};

export default MyList;
