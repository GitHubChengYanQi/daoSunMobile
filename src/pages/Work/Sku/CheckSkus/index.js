import React, { useRef, useState } from 'react';
import { skuList } from '../../../Scan/Url';
import MyList from '../../../components/MyList';
import { Button, Divider, Space } from 'antd-mobile';
import MyBottom from '../../../components/MyBottom';
import MySearch from '../../../components/MySearch';
import styles from './index.less';
import MyCheck from '../../../components/MyCheck';
import SkuItem from '../SkuItem';

const CheckSkus = (
  {
    value = [],
    onCheck = () => {
    },
    onChange = () => {
    },
  }) => {

  const ref = useRef();

  const [data, setData] = useState([]);

  const [skus, setSkus] = useState(value);

  const checked = (id) => {
    return skus.map(item => item.skuId).includes(id);
  };

  const click = (item) => {
    if (checked(item.skuId)) {
      const array = skus.filter((checkItem) => {
        return checkItem.skuId !== item.skuId;
      });
      setSkus(array);
    } else {
      setSkus([...skus, item]);
    }
  };
  const [searchValue, setSearchValue] = useState();

  return <div style={{ backgroundColor: '#fff' }}>
    <MyBottom
      leftActuions={<div>已选 {skus.length} 条</div>}
      buttons={<Space>
        <Button onClick={() => {
          onCheck(skus);
        }}>选中</Button>
        <Button color='primary' onClick={() => {
          onChange(skus);
        }}>选中并关闭</Button>
      </Space>}
    >
      <div className={styles.search}>
        <MySearch
          onChange={setSearchValue}
          value={searchValue}
          onSearch={(value) => {
            ref.current.submit({ skuName: value });
          }} />
      </div>

      <div className={styles.list}>
        <MyList
          ref={ref}
          api={skuList}
          data={data}
          getData={(value) => {
            setData(value.filter(item => item));
          }}
        >
          {
            data.map((item, index) => {
              return <div key={index}>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{ width: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => {
                      click(item);
                    }}
                  >
                    <MyCheck fontSize={24} checked={checked(item.skuId)} />
                  </div>
                  <div
                    style={{ flexGrow: 1 }}
                    onClick={() => {
                      click(item);
                    }}>
                    <SkuItem extraWidth='60px' skuResult={item} />
                  </div>
                </div>
                <Divider />
              </div>;
            })
          }

        </MyList>
      </div>
    </MyBottom>

  </div>;
};

export default CheckSkus;
