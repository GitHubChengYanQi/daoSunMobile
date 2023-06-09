import React, { useState } from 'react';
import { Card, Divider, Selector } from 'antd-mobile';
import style from '../../index.less';
import { useBoolean } from 'ahooks';
import { useRequest } from '../../../../../../../../util/Request';
import { ToolUtil } from '../../../../../../../../util/ToolUtil';
import LinkButton from '../../../../../../../components/LinkButton';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import MySearch from '../../../../../../../components/MySearch';
import { MyLoading } from '../../../../../../../components/MyLoading';
import { UserIdSelect } from '../../../../../../Quality/Url';
import { SelectorStyle } from '../../../../../../../Report/InOutStock';

const User = (
  {
    value,
    title,
    multiple,
    onChange = () => {
    },
    placeholder,
  }) => {

  const [open, { toggle }] = useBoolean();

  const [searchValue, setSearchValue] = useState();

  const { loading, run, data } = useRequest(UserIdSelect);

  const like = (name) => {
    run({
      data: { name },
    });
  };


  return <div className={style.content}>
    <Card
      title={<Divider contentPosition='left' className={style.divider}>{title}</Divider>}
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
        placeholder={placeholder}
        className={style.searchBar}
        onSearch={(value) => {
          like(value);
        }}
        onChange={setSearchValue}
        value={searchValue}
        onClear={like}
      />
      {loading ? <MyLoading skeleton /> : <Selector
        columns={2}
        style={SelectorStyle}
        className={ToolUtil.classNames(style.supply)}
        showCheckMark={false}
        multiple={multiple}
        options={ToolUtil.isArray(data).filter((item, index) => open ? index < 10 : index < 6)}
        value={multiple ? value : [value]}
        onChange={(v, { items }) => {
          onChange(multiple ? items.map(item => item.value) : items[0]?.value,multiple ? items.map(item => item.label) : items[0]?.label);
        }}
      />}
    </Card>
  </div>;
};

export default User;
