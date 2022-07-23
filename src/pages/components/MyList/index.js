import React, { useImperativeHandle, useState } from 'react';
import { useRequest } from '../../../util/Request';
import { InfiniteScroll } from 'antd-mobile';
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
    sorter: defaultSorter,
  }, ref) => {

  const [hasMore, setHasMore] = useState(false);

  const [pages, setPage] = useState(1);

  const [contents, setContents] = useState([]);

  const [params, setParams] = useState(paramsData || {});

  const [sorter, setSorter] = useState(defaultSorter || {});

  const [error, setError] = useState(true);

  const { loading, run } = useRequest({
    ...api,
    params: {
      limit: limit,
      page: pages,
      sorter,
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
        getData(array.filter(() => true), resData);
        setPage(pages + 1);
        setHasMore(resData.length === 10);
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

  const submit = async (value, sorter) => {
    setHasMore(false);
    setPage(1);
    setContents([]);
    setParams(value);
    setSorter(sorter);
    getData([]);
    await run({
      params: { limit, page: 1, sorter },
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

  return <div id='list'>

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
        {loading ? (
          <>
            <MyLoading imgWidth={20} loaderWidth={40} skeleton downLoading title='努力加载中...' noLoadingTitle />
          </>
        ) : (
          <span>--- 我是有底线的 ---</span>
        )}
      </>
    </InfiniteScroll>}
  </div>;
};

export default React.forwardRef(MyList);
