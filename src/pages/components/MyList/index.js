import React, { useEffect, useImperativeHandle, useState } from 'react';
import { useRequest } from '../../../util/Request';
import { InfiniteScroll } from 'antd-mobile';
import { MyLoading } from '../MyLoading';
import MyEmpty from '../MyEmpty';

let limit = 10;

const MyList = ({ children, getData, data, api, params: paramsData }, ref) => {

  const [hasMore, setHasMore] = useState(true);

  const [pages, setPage] = useState(1);

  const [contents, setContents] = useState([]);

  const [params, setParams] = useState(paramsData);

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
        const array = contents;
        res.map((items) => {
          return array.push(items);
        });
        setContents(array);
        typeof getData === 'function' && getData(array);
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
    setContents([]);
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

  if (!data || data.length === 0) {
    return <MyEmpty />;
  }

  return <>
    {children}
    {error && <InfiniteScroll
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
