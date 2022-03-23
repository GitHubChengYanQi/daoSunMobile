import React, { useRef, useState } from 'react';
import { useRequest } from '../../../../../../util/Request';
import { skuList } from '../../../../Url';
import { Card, Ellipsis, List, SearchBar, Space } from 'antd-mobile';
import { MyLoading } from '../../../../../components/MyLoading';
import MyEmpty from '../../../../../components/MyEmpty';
import MyPopup from '../../../../../components/MyPopup';
import SkuStockDetail from './components/SkuStockDetail';
import Label from '../../../../../components/Label';

const Sku = () => {

  const ref = useRef();

  const [searchValue, setSearchValue] = useState();

  const { loading, data, run } = useRequest(skuList, {
      manual: false,
      debounceInterval: 300,
      defaultParams: {
        params: { page: 1, limit: 5 },
      },
    },
  );

  return <div style={{ backgroundColor: '#fff' }}>
    <SearchBar
      placeholder='请输入内容'
      value={searchValue}
      showCancelButton={() => true}
      onCancel={() => {

      }}
      onChange={(value) => {
        setSearchValue(value);
        run({
          data: { skuName: value },
          params: { page: 1, limit: 5 },
        });
      }}
    />

    <Card title='物料列表'>
      <List
        style={{
          '--border-top': 'none',
          '--border-bottom': 'none',
        }}
      >
        {
          (!loading && data && data.length > 0) ? data.map((item, index) => {

              const content = <Space direction='vertical'>
                <Space>
                  <Label>物料编码:</Label>{item.standard}
                </Space>
                <Space>
                  <Label>物料名称:</Label>{item.spuResult && item.spuResult.name}
                </Space>
                <Space>
                  <Label>型号 / 规格:</Label>{item.specifications || '无'}
                </Space>
                <Space>
                  <Label>描述:</Label><Ellipsis
                      style={{ maxWidth: '50vw' }}
                      direction='end'
                      content={item.skuJsons
                      &&
                      item.skuJsons.length > 0
                      &&
                      item.skuJsons[0].values.attributeValues
                        ?
                        item.skuJsons.map((items) => {
                          return `${items.attribute.attribute} : ${items.values.attributeValues}`;
                        }).toString()
                        :
                        '无'
                      } />
                </Space>
              </Space>;

              return <List.Item
                arrow
                key={index}
                onClick={() => {
                  ref.current.open({ content, skuId: item.skuId });
                }}
              >
                {content}
              </List.Item>;
            })
            :
            <MyEmpty />
        }
      </List>
    </Card>

    {
      loading && <MyLoading />
    }


    <MyPopup
      title='物料库存信息'
      position='bottom'
      component={SkuStockDetail}
      ref={ref}
      onSuccess={() => {
        setSearchValue('');
        ref.current.close();
        run({
          params: { page: 1, limit: 5 },
        });
      }}
    />

  </div>;
};

export default Sku;
