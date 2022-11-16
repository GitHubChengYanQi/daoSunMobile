import React, { useEffect, useState } from 'react';
import { CheckList, Selector } from 'antd-mobile';
import MyAntPopup from '../../../../../components/MyAntPopup';
import LinkButton from '../../../../../components/LinkButton';
import { isArray, isObject, ToolUtil } from '../../../../../components/ToolUtil';
import { useRequest } from '../../../../../../util/Request';
import { supplyList } from '../../../../Sku/SkuList/components/SkuScreen/components/Url';
import MySearch from '../../../../../components/MySearch';
import { MyLoading } from '../../../../../components/MyLoading';
import style from '../../../../Sku/SkuList/components/SkuScreen/index.less';
import { SelectorStyle } from '../../../../../Report/InOutStock';
import MyEmpty from '../../../../../components/MyEmpty';

const Customers = (
  {
    zIndex,
    visible,
    value = [],
    multiple,
    onClose = () => {
    },
    onChange = () => {
    },
  },
) => {

  const [supply, setSupply] = useState([]);

  const [searchValue, setSearchValue] = useState();

  const [customers, setCustomers] = useState([]);

  const { loading, run } = useRequest(supplyList, {
    defaultParams: {
      data: { supply: 1 },
      params: { limit: 10, page: 1 },
    },
    onSuccess: (res) => {
      setSupply(isArray(res));
    },
  });

  const like = (string) => {
    run({
      data: { customerName: string, supply: 1 },
      params: { limit: 10, page: 1 },
    });
  };

  useEffect(() => {
    if (visible) {
      setCustomers(value);
    }
  }, [visible]);


  return <>
    <MyAntPopup
      onClose={() => onClose()}
      zIndex={zIndex}
      title='选择供应商'
      visible={visible}
      leftText={<LinkButton onClick={onClose}>取消</LinkButton>}
      rightText={<LinkButton onClick={() => {
        onChange(customers[0]);
      }}>确定</LinkButton>}
    >
      <div style={{ padding: 12 }}>
        <MySearch
          placeholder=' 请输入供应商信息'
          className={style.searchBar}
          onSearch={(value) => {
            like(value);
          }}
          onChange={setSearchValue}
          value={searchValue}
          onClear={like}
        />
        {supply.length === 0 && <MyEmpty />}
        {loading ? <MyLoading skeleton /> : <CheckList
          style={{
            '--border-inner': 'solid 1px #f5f5f5',
            '--border-top': 'solid 1px #f5f5f5',
            '--border-bottom': 'solid 1px #f5f5f5',
          }}
          className={style.list}
          value={customers.map(item => item.customerId)}
        >
          {
            supply.map((item, index) => {
              const checked = customers.find(customer => customer.customerId === item.customerId);
              return <CheckList.Item
                key={index}
                value={item.customerId}
                onClick={() => {
                  if (multiple) {
                    setCustomers(checked ? customers.filter(customer => customer.customerId !== item.customerId) : [...customers, item]);
                  } else {
                    setCustomers(checked ? [] : [item]);
                  }
                }}
              >
                {item.customerName}
              </CheckList.Item>;
            })
          }
        </CheckList>}
      </div>
    </MyAntPopup>
  </>;
};

export default Customers;
