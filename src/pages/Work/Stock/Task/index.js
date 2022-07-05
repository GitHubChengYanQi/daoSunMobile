import React, { useState } from 'react';
import { Tabs } from 'antd-mobile';
import style from './index.less';
import MySearch from '../../../components/MySearch';
import { ReceiptsEnums } from '../../../Receipts';
import MyAudit from '../../ProcessTask/MyAudit';
import { useLocation } from 'umi';
import MyNavBar from '../../../components/MyNavBar';

export const processTask = { url: '/activitiProcessTask/auditList', method: 'POST' };

const Task = (
  {
    activeKey,
    keyChange = () => {
    },
  },
) => {

  const { query } = useLocation();

  const [key, setKey] = useState(query.type || activeKey || ReceiptsEnums.instockOrder);

  const tabs = [
    { title: '调拨任务', key: 'allocation' },
    { title: '出库任务', key: ReceiptsEnums.outstockOrder },
    { title: '入库任务', key: ReceiptsEnums.instockOrder },
    { title: '养护任务', key: ReceiptsEnums.maintenance },
    { title: '盘点任务', key: ReceiptsEnums.stocktaking },
  ];

  return <div>
    {query.type && <MyNavBar title='任务列表' />}
    <MySearch placeholder='请输入物料相关信息' />
    <div hidden={activeKey}>
      <Tabs activeKey={key} onChange={(key) => {
        setKey(key);
        keyChange(key);
      }} className={style.tab}>
        {
          tabs.map((item) => {
            return <Tabs.Tab {...item} />;
          })
        }
      </Tabs>
    </div>

    <MyAudit
      auditType='audit'
      type={key}
      paramsChange={(param = {}) => {
        setKey(param.type);
      }}
    />

  </div>;
};

export default Task;
