import React from 'react';
import { Tabs } from 'antd-mobile';
import OutSkuAction from './components/OutSkuAction';

const OutStockOrder = (
  {
    actionNode,
    logIds,
    afertShow,
    actions,
    taskDetail,
    loading,
    data,
    taskId,
    details,
    permissions,
    getAction,
    refresh,
  },
) => {


  return <>
    {/*<Tabs>*/}
    {/*  <Tabs.Tab title='单独备料' key='one'>*/}
        <OutSkuAction
          actionNode={actionNode}
          logIds={logIds}
          afertShow={afertShow}
          nodeActions={actions.map(item => ({ ...item, name: item.action === 'outStock' ? '领料' : item.name }))}
          taskDetail={taskDetail}
          loading={loading}
          order={data}
          taskId={taskId}
          data={details}
          permissions={permissions}
          actionId={getAction('outStock').id}
          action={getAction('outStock').id && permissions}
          pickListsId={data.pickListsId}
          refresh={refresh}
        />
    {/*  </Tabs.Tab>*/}
    {/*  <Tabs.Tab title='一键备料' key='batch'>*/}
    {/*    菠萝*/}
    {/*  </Tabs.Tab>*/}
    {/*</Tabs>*/}
  </>;
};

export default OutStockOrder;
