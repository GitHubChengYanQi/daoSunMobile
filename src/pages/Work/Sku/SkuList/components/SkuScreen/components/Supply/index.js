import React, { useEffect, useState } from 'react';
import { Card, Selector } from 'antd-mobile';
import LinkButton from '../../../../../../../components/LinkButton';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import style from '../../index.less';
import { useBoolean } from 'ahooks';
import MySearch from '../../../../../../../components/MySearch';
import { useRequest } from '../../../../../../../../util/Request';
import { supplyList } from '../Url';
import { MyLoading } from '../../../../../../../components/MyLoading';
import { ToolUtil } from '../../../../../../../components/ToolUtil';

const Supply = (
  {
    options = [],
    title,
    onChange = () => {
    },
    value = [],
    refresh,
    overLength,
  }) => {

  const [open, { toggle }] = useBoolean();

  const [supply, setSupply] = useState(options);

  const [searchValue, setSearchValue] = useState();

  const { loading, run } = useRequest(supplyList, {
    manual: true,
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

  const Select = (data) => {
    run({
      params: { limit: 10, page: 1 },
      data: { supply: 1, ...data },
    });
  };

  const like = (string) => {
    if (overLength) {
      return Select({ customerName: string });
    }
    const newArrays = options.filter(item => {
      if (string) {
        const patt = new RegExp(string, 'i');
        return patt.test(item.label);
      }
      return true;
    });
    setSupply(newArrays);
  };


  useEffect(() => {
    if (refresh && value.length === 0) {
      like(searchValue);
    }
  }, [refresh]);


  if (!overLength && options.length <= 1 && value.length === 0) {
    return <></>;
  }

  return <div className={style.content}>
    <Card
      title={title}
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
        placeholder='请输入供应商信息'
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
        options={supply.filter((item, index) => open || index < 3)}
        multiple
        value={value}
        onChange={(v) => {
          onChange(v);
        }}
      />}
    </Card>
  </div>;
};

export default Supply;
