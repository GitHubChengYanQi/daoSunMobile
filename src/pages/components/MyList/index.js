import React, { useImperativeHandle, useRef, useState } from 'react';
import { useRequest } from '../../../util/Request';
import { FloatingBubble, InfiniteScroll, PullToRefresh } from 'antd-mobile';
import { MyLoading } from '../MyLoading';
import MyEmpty from '../MyEmpty';
import style from './index.less';
import { VerticalAlignTopOutlined } from '@ant-design/icons';

let limit = 10;

const MyList = (
  {
    children,
    getData = () => {
    },
    data,
    api,
    onLoading = () => {
    },
    params: paramsData,
    response = () => {
    },
    sorter: defaultSorter,
    noEmpty,
    manual,
    options = {},
    noTips,
    pullDisabled,
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
    ...options,
    manual,
    response: true,
    onSuccess: (res) => {
      onLoading(false);
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
        setHasMore(resData.length === 10);
      } else {
        setHasMore(false);
        if (pages === 1) {
          getData([], []);
        }
      }
    },
    onError: () => {
      onLoading(false);
      setError(false);
    },
  });

  const submit = async (value, sorter, pull) => {
    setHasMore(false);
    setPage(1);
    setContents([]);
    setParams(value);
    setSorter(sorter);
    !pull && getData([], []);
    onLoading(true);
    await run({
      params: { limit, page: 1, sorter },
      data: value,
    });
  };

  useImperativeHandle(ref, () => ({
    submit,
  }));

  // if (loading && pages === 1) {
  //   return <>
  //     <MyLoading skeleton title='正在加载数据...' />
  //   </>;
  // }

  if (!loading && (!data || data.length === 0) && !noEmpty) {
    return <MyEmpty height='100%' />;
  }

  const statusRecord = {
    pulling: '用力拉',
    canRelease: '松开吧',
    refreshing: <MyLoading
      imgWidth={20}
      loaderWidth={40}
      skeleton
      downLoading
      title='努力加载中...'
      noLoadingTitle
    />,
    complete: '好啦',
  };

  const top = document.getElementById('list') ? document.getElementById('list').getBoundingClientRect().top : 0;

  return <div id='list' className={style.list}>
    <PullToRefresh
      disabled={pullDisabled}
      onRefresh={async () => {
        await submit(params, sorter, true);
      }}
      renderText={status => {
        return <div>{statusRecord[status]}</div>;
      }}
    >
      {children}
    </PullToRefresh>

    {error && <InfiniteScroll
      style={{ padding: (noEmpty || noTips) && 0 }}
      threshold={0}
      loadMore={async () => {
        onLoading(true);
        return await run({
          data: {
            ...params,
          },
        });
      }}
      hasMore={hasMore}
    >
      <>
        {
          loading ? <MyLoading
            imgWidth={20}
            loaderWidth={40}
            skeleton
            downLoading
            title='努力加载中...'
            noLoadingTitle
          /> : <span hidden={noEmpty || noTips}>--- 我是有底线的 ---</span>
        }
      </>
    </InfiniteScroll>}

    {top < 0 && <FloatingBubble
      axis='xy'
      magnetic='x'
      style={{
        '--initial-position-bottom': '84px',
        '--initial-position-right': '24px',
        '--edge-distance': '24px',
        '--size': '40px',
      }}
      className={style.top}
    >
      <VerticalAlignTopOutlined style={{ fontSize: 24 }} onClick={() => {
        submit(params, sorter);
      }} />
    </FloatingBubble>}
  </div>;
};

export default React.forwardRef(MyList);
