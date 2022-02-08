import React, { useImperativeHandle, useState } from 'react';
import { List, Popup, SearchBar, Space } from 'antd-mobile';
import { useRequest } from '../../../../../../util/Request';
import { Spin } from 'antd';
import { useDebounceEffect } from 'ahooks';
import BackSkus from '../../../../Sku/components/BackSkus';
import SkuResultSkuJsons from '../../../../Sku/components/SkuResult_skuJsons';

const Search = ({ onChange, ...props }, ref) => {

  const [visible, setVisible] = useState(false);

  const [key, setKey] = useState();

  const [data, setData] = useState([]);

  const [type, setType] = useState();

  const [params, setParams] = useState();

  const { loading: skuLoading, run: skuRun } = useRequest({
    url: '/sku/list?limit=10',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      setData(res);
    },
  });

  const { loading: skuBindLoading, run: skuBindRun } = useRequest({
    url: '/supply/conditionList',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      const array = [];
      const datas = res && res.filter((item) => {
        switch (type) {
          case 'brand':
            if (array.includes(item.brandId)) {
              return false;
            } else {
              array.push(item.brandId);
              return true;
            }
          case 'supply':
            if (array.includes(item.customerId)) {
              return false;
            } else {
              array.push(item.customerId);
              return true;
            }
          default:
            return null;
        }
      });
      setData(datas);
    },
  });

  const { loading: storehouseLoading, run: storehouseRun } = useRequest({
    url: '/storehouse/list?limit=10',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      setData(res);
    },
  });

  const { loading: itemsLoading, run: itemsRun } = useRequest({
    url: '/stockDetails/list?limit=10',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      setData(res);
    },
  });

  const search = ({ type, params, key }) => {
    setVisible(true);
    setType(type);
    setParams(params);
    setKey(key);
  };


  const searchType = (value) => {
    switch (type) {
      case 'sku':
        skuRun({
          data: {
            skuName: value,
          },
        });
        break;
      case 'storehouse':
        storehouseRun({
          data: {
            name: value,
          },
        });
        break;
      case 'items':
        itemsRun({
          data: {
            skuName: value,
          },
        });
        break;
      case 'brand':
      case 'supply':
        skuBindRun({
          data: {
            ...params,
            name: value,
          },
        });
        break;
      default:
        break;
    }
  };

  useDebounceEffect(() => {
    switch (type) {
      case 'sku':
        skuRun();
        break;
      case 'supply':
      case 'brand':
        skuBindRun({
          data: {
            ...params,
          },
        });
        break;
      case 'storehouse':
        storehouseRun();
        break;
      case 'items':
        itemsRun({
          data: {
            ...params,
          },
        });
        break;
      default:
        break;
    }
  }, [type, params], {
    wait: 0,
  });


  useImperativeHandle(ref, () => ({
    search,
  }));

  const getItemResult = (record) => {
    return <BackSkus record={record} />;
  };

  const object = (items) => {
    return <SkuResultSkuJsons skuResult={items} />
  };

  return <div>
    <Popup
      visible={visible}
      destroyOnClose
      onMaskClick={() => {
        setVisible(false);
      }}
      bodyStyle={{ minHeight: '100vh' }}
    >
      <div style={{ padding: 16 }}>
        <Space direction='vertical' style={{ width: '100%' }}>
          <SearchBar
            style={{ height: '10vh' }}
            placeholder='请输入内容'
            showCancelButton={() => true}
            onCancel={() => {
              setVisible(false);
            }}
            onChange={(value) => {
              searchType(value);
            }}
          />
          <List>
            {
              skuLoading || skuBindLoading || storehouseLoading || itemsLoading
                ?
                <div style={{ textAlign: 'center', padding: 16 }}>
                  <Spin />
                </div>
                :
                data.map((items, index) => {
                  switch (type) {
                    case 'sku':
                      return <List.Item
                        key={index}
                        onClick={() => {
                          setVisible(false);
                          onChange({
                            type,
                            label: object(items),
                            value: items.skuId,
                            batch: items.batch === 1,
                            item:items,
                            key,
                          });
                        }}
                      >
                        {object(items)}
                      </List.Item>;
                    case 'brand':
                      return <List.Item
                        key={index}
                        onClick={() => {
                          setVisible(false);
                          onChange({
                            type,
                            label: items.brandResult && items.brandResult.brandName,
                            value: items.brandId,
                            key,
                          });
                        }}
                      >
                        {items.brandResult && items.brandResult.brandName}
                      </List.Item>;
                    case 'storehouse':
                      return <List.Item
                        key={index}
                        onClick={() => {
                          setVisible(false);
                          onChange({
                            type,
                            label: items.name,
                            value: items.storehouseId,
                            key,
                          });
                        }}
                      >
                        {items.name}
                      </List.Item>;
                    case 'supply':
                      return <List.Item
                        key={index}
                        onClick={() => {
                          setVisible(false);
                          onChange({
                            type,
                            label: items.customerResult && items.customerResult.customerName,
                            value: items.customerId,
                            key,
                          });
                        }}
                      >
                        {items.customerResult && items.customerResult.customerName}
                      </List.Item>;
                    case 'items':
                      if (items.number > 0) {
                        return <List.Item
                          key={index}
                          onClick={() => {
                            setVisible(false);
                            onChange({
                              type,
                              label: getItemResult(items),
                              value: items.qrCodeId,
                              number: items.number,
                              key,
                            });
                          }}
                        >
                          {getItemResult(items)}
                          &nbsp;&nbsp;
                          ×
                          {items.number}
                        </List.Item>;
                      } else {
                        return null;
                      }
                    default:
                      return null;
                  }
                })
            }
          </List>
        </Space>
      </div>
    </Popup>
  </div>;
};

export default React.forwardRef(Search);
