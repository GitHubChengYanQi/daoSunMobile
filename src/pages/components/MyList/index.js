import React, { useImperativeHandle, useState } from 'react';
import { useRequest } from '../../../util/Request';
import { Button, DotLoading, InfiniteScroll } from 'antd-mobile';
import { MyLoading } from '../MyLoading';
import MyEmpty from '../MyEmpty';

let limit = 10;

const MyList = (
  {
    children,
    getData = () => {
    },
    data,
    api,
    params: paramsData,
    response = () => {
    },
  }, ref) => {

  const [hasMore, setHasMore] = useState(false);

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
    response: true,
    onSuccess: (res) => {
      const resData = res.data || [];
      response(res);
      if (resData.length > 0) {
        const array = contents;
        resData.map((items) => {
          return array.push(items);
        });
        setContents(array);
        getData(array.filter(() => true));
        setPage(pages + 1);
        setHasMore(true);
      } else {
        setHasMore(false);
        if (pages === 1) {
          getData([]);
        }
      }
    },
    onError: () => {
      setError(false);
    },
  });

  const submit = async (value) => {
    setHasMore(false);
    setPage(1);
    setContents([]);
    setParams(value);
    await run({
      params: { limit, page: 1 },
      data: value,
    });
  };

  useImperativeHandle(ref, () => ({
    submit,
  }));

  if (loading && pages === 1) {
    return <>
      <MyLoading />
      <MyEmpty height='100%' description='正在加载数据...' />
    </>;
  }

  if (!loading && (!data || data.length === 0)) {
    return <MyEmpty height='100%' />;
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
    >
      <>
        {hasMore ? (
          <>
            <MyLoading imgWidth={20} loaderWidth={40} skeleton downLoading title='努力加载中...' noLoadingTitle />
          </>
        ) : (
          <span>--- 我是有底线的 ---</span>
        )}
      </>
    </InfiniteScroll>}
  </>;
};

export default React.forwardRef(MyList);
