import React, { useImperativeHandle, useState } from 'react';
import { useRequest } from '../../../util/Request';
import { InfiniteScroll } from 'antd-mobile';
import { MyLoading } from '../MyLoading';

let limit = 10;

const MyList = ({ children, getData, data, api, params: paramsData }, ref) => {

  const [hasMore, setHasMore] = useState(true);

  const [pages, setPage] = useState(1);

  const [params, setParams] = useState(paramsData);
  console.log(params);

  const [error, setError] = useState(true);

  const { loading, run } = useRequest({
    ...api,
    params: {
      limit: limit,
      page: pages,
    },
    data: {
      ...params,
    },
  }, {
    // debounceInterval: 300,
    onSuccess: (res) => {
      if (res && res.length > 0) {
        typeof getData === 'function' && getData(res);
        setPage(pages + 1);
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

  const submit = (value) => {
    setPage(1);
    setParams(value);
    run({
      data: value,
    });
  };

  useImperativeHandle(ref, () => ({
    submit,
  }));

  if (loading && pages === 1) {
    return <MyLoading />;
  }

  return <>
    {children}
    {error && data && <InfiniteScroll
      threshold={0}
      loadMore={async () => {
        return await run({
          data: {
            ...params,
          },
        });
      }}
      hasMore={hasMore}
    />}
  </>;
};

export default React.forwardRef(MyList);
