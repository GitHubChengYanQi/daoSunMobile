import React, { useState } from 'react';
import { Card, Selector } from 'antd-mobile';
import style from '../../index.less';
import { useBoolean } from 'ahooks';
import { useRequest } from '../../../../../../../../util/Request';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import LinkButton from '../../../../../../../components/LinkButton';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import MySearch from '../../../../../../../components/MySearch';
import { MyLoading } from '../../../../../../../components/MyLoading';
import { UserIdSelect } from '../../../../../../Quality/Url';

const User = (
  {
    value,
    title,
    onChange = () => {
    },
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
        onSearch={(value) => {
          like(value);
        }}
        onChange={setSearchValue}
        value={searchValue}
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
        options={ToolUtil.isArray(data).filter((item, index) => open ? index < 10 : index < 6)}
        value={[value]}
        onChange={(v, extend) => {
          onChange(v[0]);
        }}
      />}
    </Card>
  </div>;
};

export default User;
