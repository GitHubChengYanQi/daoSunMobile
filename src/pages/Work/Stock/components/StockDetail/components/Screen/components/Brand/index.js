import React, { useEffect, useState } from 'react';
import { Card, Selector } from 'antd-mobile';
import LinkButton from '../../../../../../../../components/LinkButton';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import MySearch from '../../../../../../../../components/MySearch';
import style from '../../index.less';
import { useRequest } from '../../../../../../../../../util/Request';
import { brandList } from '../Url';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';

const Brand = (
  {
    options = [],
    title,
    value = [],
    onChange = () => {
    },
    refresh,
    overLength,
  }) => {

  const [open, { toggle }] = useBoolean();

  const [brands, setBrands] = useState(options || []);

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

  const Select = (data) => {
    run({
      params: { limit: 10, page: 1 },
      data,
    });
  };

  const like = (value) => {
    setSearchValue(value);
    if (overLength) {
      return Select({ brandName: value });
    }
    const newArrays = options.filter(item => {
      if (value) {
        return ToolUtil.queryString(value, item.label);
      }
      return true;
    });
    setBrands(newArrays);
  };


  useEffect(() => {
    if (refresh && value.length === 0) {
      like(searchValue);
    }
  }, [refresh]);

  if (!overLength && options.length <= 1 && value.length === 0) {
    return <></>;
  }

  return <div>
    <Card
      title={title}
      headerStyle={{ border: 'none' }}
      extra={<LinkButton style={{ fontSize: 12 }} onClick={toggle}>
        {!open
          ?
          <>
            展开 <DownOutline />
          </>
          :
          <>
            收起 <UpOutline />
          </>}
      </LinkButton>}
    >
      <MySearch
        className={style.searchBar}
        onChange={(value) => {
          like(value);
        }}
        onClear={like}
      />
      {loading ? <MyLoading skeleton /> : <Selector
        columns={2}
        style={{
          '--border': 'solid transparent 1px',
          '--checked-border': 'solid var(--adm-color-primary) 1px',
          '--padding': '4px 15px',
        }}
        className={ToolUtil.classNames(style.supply)}
        showCheckMark={false}
        options={brands.filter((item, index) => open || index < 6)}
        multiple
        value={value}
        onChange={(v) => {
          onChange(v);
        }}
      />}
    </Card>
  </div>;
};

export default Brand;
