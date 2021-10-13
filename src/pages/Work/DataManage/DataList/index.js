import { useRequest } from '../../../../util/Request';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  FlexItem,
  List,
  ListItem,
  Panel,
  PanelItem,
  Preview,
  PreviewButton,
  PreviewItem, Spin,
} from 'weui-react-v2';

import pares from 'html-react-parser'
import { Card, Space, Tag } from 'antd-mobile';
import { AntOutline } from 'antd-mobile-icons'


let pages = 1;
let limit = 10;
let contents = [];
const DataList = ({ select }) => {

  const [data, setData] = useState();

  const [hasMore, setHasMore] = useState(true);

  const { loading, run } = useRequest({
    url: '/data/list',
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

  useEffect(()=>{
    pages = 1;
    contents = [];
  },[select])

  if (loading && pages === 1) {
    return (
      <div style={{ margin: 50, textAlign: 'center' }}>
        <Spin spinning={true} size='large' />
      </div>
    );
  }

  return (
    <div>

      <Card style={{padding:'5px'}}>
         数量：<span style={{color:'red'}}> {data && data[0].count}</span>
      </Card>
      {data && data.map((items, index) => {
        return (
              <Panel key={index} style={{padding:'20px'}}>
              <Card title={
              <div style={{ fontWeight: 'bolder',marginRight: '4px' }}>
                <h1>
                  资料名称：
                </h1>
                <p style={{"font-size":'15px'}}>
                   {items.name}
                </p>
                <p>分类：<span style={{color:'red'}}>{items.dataClassificationResult.title}</span></p>
                </div>
              }>
                <div style={{}}>
                  <h1>内容：</h1>

                  {pares(items.content)}
                </div>
                <div style={{"padding-top":'11px',
                "border-top":'1px solid #e5e5e5',
                  "display":'flex',

                }} >
                  <h1>
                    产品：
                  </h1>
                  <Space  direction={'horizontal'} wrap={false}>
                    {items.itemId.length > 0 && items.itemId.map((li,index)=>{
                        return (<Tag key={index} color='primary'>{li.name}</Tag>)
                      }
                    )}
                  </Space>
                </div>

              </Card>
            </Panel>
        );
      })}
    </div>
  );
};
export default DataList;
