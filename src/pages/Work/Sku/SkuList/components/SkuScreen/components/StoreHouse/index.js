import React, { useEffect, useState } from 'react';
import { Card, Divider, Selector } from 'antd-mobile';
import LinkButton from '../../../../../../../components/LinkButton';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import style from '../../index.less';
import { useBoolean } from 'ahooks';
import MySearch from '../../../../../../../components/MySearch';
import { useRequest } from '../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../components/MyLoading';
import { ToolUtil } from '../../../../../../../../util/ToolUtil';
import { storeHouseSelect } from '../../../../../../Quality/Url';
import { SelectorStyle } from '../../../../../../../Report/InOutStock';

const StoreHouse = (
  {
    title,
    onChange = () => {
    },
    value = [],
  }) => {

  const [open, { toggle }] = useBoolean();

  const [supply, setSupply] = useState([]);

  const [searchValue, setSearchValue] = useState();

  const { loading, run } = useRequest(storeHouseSelect, {
    manual: true,
    onSuccess: (res) => {
      setSupply(res);
    },
  });

  const Select = (data) => {
    run({
      params: { limit: 10, page: 1 },
      data: { supply: 1, ...data },
    });
  };

  const like = (string) => {
    return Select({ name: string });
  };


  useEffect(() => {
    if (value.length === 0) {
      like(searchValue);
    }
  }, []);

  return <div className={style.content}>
    <Card
      title={<Divider contentPosition='left' className={style.divider}>{title}</Divider>}
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
        style={SelectorStyle}
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

export default StoreHouse;
