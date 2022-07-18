import React, { useEffect, useState } from 'react';
import { Selector } from 'antd-mobile';
import { useRequest } from '../../../../../../../../../../../../../util/Request';
import { brandList } from '../../../../../../../../../../../Sku/SkuList/components/SkuScreen/components/Url';
import MySearch from '../../../../../../../../../../../../components/MySearch';
import { MyLoading } from '../../../../../../../../../../../../components/MyLoading';
import style from '../../index.less';
import BottomButton from '../../../../../../../../../../../../components/BottomButton';

const Brand = (
  {
    value = [],
    onChange = () => {
    },
  }) => {

  const [brands, setBrands] = useState([]);

  const [searchValue, setSearchValue] = useState();

  const { loading, run } = useRequest(brandList, {
    manual: true,
    onSuccess: (res) => {
      const newArray = Array.isArray(res) ? res.map(item => {
        return {
          label: item.brandName,
          value: item.brandId,
        };
      }) : [];

      setBrands(newArray);
    },
  });

  const Select = (brandName) => {
    run({
      params: { limit: 6, page: 1 },
      data: { brandName },
    });
  };

  useEffect(() => {
    Select();
  }, []);

  const [items, setItems] = useState(value);

  return <div style={{ padding: 12 }}>
    <MySearch
      placeholder='请输入品牌信息'
      onSearch={(value) => {
        Select(value);
      }}
      className={style.filterSearch}
      onChange={setSearchValue}
      value={searchValue}
      onClear={Select}
    />
    {loading ?
      <MyLoading skeleton /> :
      <div style={{ paddingBottom: 60 }}>
        <Selector
          columns={3}
          multiple
          className={style.selector}
          style={{
            '--checked-text-color': 'var(--adm-color-primary)',
            '--checked-color': 'var(--body--background--color)',
            '--padding': '4px 15px',
            '--color': 'transparent',
          }}
          showCheckMark={false}
          options={brands}
          value={items.map(item => item.value)}
          onChange={(v, { items }) => {
            setItems(items);
          }}
        />
        <BottomButton
          leftText='重置'
          svg
          className={style.bottom}
          rightOnClick={() => {
            onChange(items);
          }}
          leftOnClick={() => {
            onChange([]);
          }}
        />
      </div>
    }
  </div>;
};

export default Brand;
