import React, { useState } from 'react';
import { Selector } from 'antd-mobile';
import MyAntPopup from '../../../../../components/MyAntPopup';
import LinkButton from '../../../../../components/LinkButton';
import { isObject, ToolUtil } from '../../../../../components/ToolUtil';
import { useRequest } from '../../../../../../util/Request';
import { supplyList } from '../../../../Sku/SkuList/components/SkuScreen/components/Url';
import MySearch from '../../../../../components/MySearch';
import { MyLoading } from '../../../../../components/MyLoading';
import style from '../../../../Sku/SkuList/components/SkuScreen/index.less';

const Customers = (
  {
    zIndex,
    visible,
    value,
    onClose = () => {
    },
    onChange = () => {
    },
  },
) => {

  const [supply, setSupply] = useState([]);

  const [searchValue, setSearchValue] = useState();

  const [customers, setCustomers] = useState(value ? [{ value }] : []);

  const { loading, run } = useRequest(supplyList, {
    defaultParams: {
      data: { supply: 1 },
      params: { limit: 10, page: 1 },
    },
    onSuccess: (res) => {
      const newArray = Array.isArray(res) ? res.map(item => {
        return {
          label: item.customerName,
          value: item.customerId,
        };
      }) : [];

      setSupply(newArray);
    },
  });

  const like = (string) => {
    run({
      data: { customerName: string,supply: 1 },
      params: { limit: 10, page: 1 },
    });
  };


  return <>
    <MyAntPopup
      onClose={onClose}
      zIndex={zIndex}
      title='选择供应商'
      visible={visible}
      leftText={<LinkButton onClick={onClose}>取消</LinkButton>}
      rightText={<LinkButton onClick={() => {
        onChange(customers[0]);
      }}>确定</LinkButton>}
    >
      <div style={{ padding: 24 }}>
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
        {loading ? <MyLoading skeleton /> : <Selector
          columns={1}
          style={{
            '--border': 'solid transparent 1px',
            '--checked-border': 'solid var(--adm-color-primary) 1px',
            '--padding': '4px 15px',
          }}
          className={ToolUtil.classNames(style.supply, style.left)}
          showCheckMark={false}
          options={supply}
          value={customers.map(item => item.value)}
          onChange={(v, { items }) => {
            setCustomers(items);
          }}
        />}
      </div>
    </MyAntPopup>
  </>;
};

export default Customers;
