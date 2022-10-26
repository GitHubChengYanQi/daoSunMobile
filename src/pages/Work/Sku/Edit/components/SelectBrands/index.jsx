import React, { useState } from 'react';
import MyAntPopup from '../../../../../components/MyAntPopup';
import LinkButton from '../../../../../components/LinkButton';
import { useRequest } from '../../../../../../util/Request';
import MySearch from '../../../../../components/MySearch';
import { MyLoading } from '../../../../../components/MyLoading';
import style from '../../../../Sku/SkuList/components/SkuScreen/index.less';
import { brandList } from '../../../SkuList/components/SkuScreen/components/Url';
import { classNames } from '../../../../../components/ToolUtil';

const SelectBrands = (
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

  const [options, setOptions] = useState([]);

  const [searchValue, setSearchValue] = useState();

  const [brands, setBrands] = useState(value);

  const { loading, run } = useRequest(brandList, {
    defaultParams: {
      params: { limit: 10, page: 1 },
    },
    onSuccess: (res) => {
      setOptions(res || []);
    },
  });

  const like = (string) => {
    run({
      data: { brandName: string },
      params: { limit: 10, page: 1 },
    });
  };


  return <>
    <MyAntPopup
      onClose={onClose}
      zIndex={zIndex}
      title='选择品牌'
      visible={visible}
      leftText={<LinkButton onClick={onClose}>取消</LinkButton>}
      rightText={<LinkButton onClick={() => {
        onChange(brands);
      }}>确定</LinkButton>}
    >
      <div style={{ padding: 24 }}>
        <MySearch
          placeholder='请输入品牌名称'
          className={style.searchBar}
          onSearch={(value) => {
            like(value);
          }}
          onChange={setSearchValue}
          value={searchValue}
          onClear={like}
        />
        {loading ? <MyLoading skeleton /> : options.map((item, index) => {
          const checked = brands.find(brandItem => brandItem.brandId === item.brandId);
          return <div
            key={index}
            className={classNames(style.brandItem, checked && style.checked)}
            onClick={() => {
              setBrands(checked ? brands.filter(brandItem => brandItem.brandId !== item.brandId) : [...brands, item]);
            }}
          >
            {item.brandName}
          </div>;
        })
        }
      </div>
    </MyAntPopup>
  </>;
};

export default SelectBrands;
