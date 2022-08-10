import React from 'react';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import MyEmpty from '../../../../../../../../../../components/MyEmpty';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import MyCard from '../../../../../../../../../../components/MyCard';
import { UserName } from '../../../../../../../../../../components/User';

export const log = { url: '/instockLogDetail/list', method: 'POST' };

const StocktaskLog = ({ data }) => {

  const { loading, data: logList } = useRequest({ ...log, data });

  console.log(logList);

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (ToolUtil.isArray(logList).length === 0) {
    return <MyEmpty description='暂无记录' />;
  }

  return <>
    {
      logList.map((item, index) => {
        return <MyCard
          key={index}
          title={<UserName user={item.user} />}
          extra={ToolUtil.timeDifference(item.createTime)}
        >
          盘点物料为{item.type === 'error' ? '异常' : '正常'}件
        </MyCard>
      })
    }
  </>;
};

export default StocktaskLog;
