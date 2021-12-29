import React, { useEffect, useImperativeHandle, useState } from 'react';
import { List, Popup, SearchBar, Space } from 'antd-mobile';
import { useRequest } from '../../../../../../util/Request';
import { Spin } from 'antd';

const Search = ({ onChange,...props }, ref) => {

  const [visible, setVisible] = useState(false);

  const [data,setData] = useState([]);

  const [type, setType] = useState();

  const { loading: skuLoading,run: skuRun } = useRequest({
    url: '/sku/list?limit=10',
    method: 'POST',
  }, {
    manual: true,
    onSuccess:(res)=>{
      setData(res);
    }
  });

  const {loading:brandLoading, run: brandRun } = useRequest({
    url: '/brand/list?limit=10',
    method: 'POST',
  }, {
    manual: true,
    onSuccess:(res)=>{
      setData(res);
    }
  });

  const { loading:storehouseLoading,run: storehouseRun } = useRequest({
    url: '/storehouse/list?limit=10',
    method: 'POST',
  }, {
    manual: true,
    onSuccess:(res)=>{
      setData(res);
    }
  });

  const search = (value) => {
    setVisible(true);
    setType(value);
  };

  const searchType = (value) => {
    switch (type) {
      case 'sku':
        skuRun({
          data:{
            skuName:value,
          }
        });
        break;
      case 'brand':
        brandRun({
          data:{
            brandName:value
          }
        });
        break;
      case 'storehouse':
        storehouseRun({
          data:{
            name:value
          }
        });
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    switch (type) {
      case 'sku':
        skuRun();
        break;
      case 'brand':
        brandRun();
        break;
      case 'storehouse':
        storehouseRun();
        break;
      default:
        break;
    }
  }, [type]);


  useImperativeHandle(ref, () => ({
    search,
  }));

  const object = (items) => {
    let values = '';
    items.skuJsons && items.skuJsons.map((item, index) => {
      if (index === items.skuJsons.length - 1) {
        return values += (item.values && item.values.attributeValues) ? `${item.attribute && item.attribute.attribute}：${item.values && item.values.attributeValues}` : '';
      } else {
        return values += (item.values && item.values.attributeValues) ? `${item.attribute && item.attribute.attribute}：${item.values && item.values.attributeValues}，` : '';
      }
    });
    return items.spuResult && `${items.skuName} / ${items.spuResult.name}   ${(values === '' ? '' : `( ${values} )`)}`
  };

  return <div style={{ padding: 16 }}>
    <Popup
      visible={visible}
      destroyOnClose
      onMaskClick={() => {
        setVisible(false);
      }}
      bodyStyle={{ minHeight: '100vh' }}
    >
      <div style={{ padding: 16 }}>
        <Space direction='vertical' style={{width:'100%'}}>
          <SearchBar
            placeholder='请输入内容'
            showCancelButton={()=>true}
            onCancel={() => {
              setVisible(false);
            }}
            onChange={(value)=>{
              searchType(value);
            }}
          />
          <List>
            {
              skuLoading || brandLoading || storehouseLoading
                ?
                <div style={{textAlign:'center',padding:16}}>
                  <Spin />
                </div>
                :
              data.map((items,index)=>{
                switch (type) {
                  case 'sku':
                    return <List.Item
                      key={index}
                      onClick={()=>{
                        setVisible(false);
                        onChange({
                          type,
                          label:object(items),
                          value:items.skuId,
                          batch:items.batch === 1
                        });
                      }}
                    >
                      {object(items)}
                    </List.Item>
                  case 'brand':
                    return <List.Item
                      key={index}
                      onClick={()=>{
                        setVisible(false);
                        onChange({
                          type,
                          label:items.brandName,
                          value:items.brandId
                        });
                      }}
                    >
                      {items.brandName}
                    </List.Item>
                  case 'storehouse':
                    return <List.Item
                      key={index}
                      onClick={()=>{
                        setVisible(false);
                        onChange({
                          type,
                          label:items.name,
                          value:items.storehouseId
                        });
                      }}
                    >
                      {items.name}
                    </List.Item>
                  default:
                    return null
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
