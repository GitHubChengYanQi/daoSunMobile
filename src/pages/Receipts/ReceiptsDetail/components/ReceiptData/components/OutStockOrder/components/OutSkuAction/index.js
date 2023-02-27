import React, { useState } from 'react';
import { Dialog } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../../util/ToolUtil';
import style from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { CheckCircleFill } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import MyCard from '../../../../../../../../components/MyCard';
import { useModel } from 'umi';
import MyAntPopup from '../../../../../../../../components/MyAntPopup';
import MyPicking from './compoennts/MyPicking';
import { Clock } from '../../../../../../../../components/MyDate';
import PrintCode from '../../../../../../../../components/PrintCode';
import jrQrcode from 'jr-qrcode';
import { useRequest } from '../../../../../../../../../util/Request';
import LinkButton from '../../../../../../../../components/LinkButton';
import ActionButtons from '../../../../../ActionButtons';
import { useHistory } from 'react-router-dom';
import { OutStockRevoke } from '../../../../../Bottom/components/Revoke';

export const checkCode = { url: '/productionPickLists/checkCode', method: 'GET' };
export const outDetailList = { url: '/productionPickListsDetail/pageList', method: 'POST' };

export const outPickListFormat = (list = []) => {
  let countNumber = 0;
  const array = list.map(item => {
    let perpareNumber = 0;
    ToolUtil.isArray(item.cartResults).map(item => perpareNumber += item.number);

    const received = Number(item.receivedNumber) || 0;
    const collectable = Number(perpareNumber) || 0;
    const notPrepared = Number(item.number - collectable - received) || 0;

    countNumber += (item.number || 0);
    return {
      ...item,
      perpareNumber,
      received,
      collectable,
      notPrepared,
      action: !(item.number === received || item.number === (received + collectable) || !item.stockNumber),
    };
  });
  return {
    countNumber,
    array,
  };
};

const OutSkuAction = (
  {
    taskDetail,
    actionNode,
    nodeActions = [],
    logIds = [],
    order = {},
    pickListsId,
    action,
    afertShow = () => {
    },
    taskId,
    refresh: orderRefresh,
  },
) => {

  const history = useHistory();

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const userInfo = state.userInfo || {};

  const [picking, setPicking] = useState();

  const [code, setCode] = useState('');
  const imgSrc = jrQrcode.getQrBase64(`${process.env.wxCp}Work/OutStockConfirm?code=${code}`);

  const [success, { setTrue, setFalse }] = useBoolean();

  const { run, cancel } = useRequest(checkCode, {
    manual: true,
    pollingInterval: 2000,
    onSuccess: (res) => {
      if (res === false) {
        setTrue();
      }
    },
  });

  return <div>
    <MyCard
      title='出库明细'
      extra={<LinkButton style={{ marginLeft: 12 }} onClick={() => {
        history.push({
          pathname: '/Work/OutStock/Prepare',
          search: `pickListsId=${pickListsId}&taskId=${taskId}&theme=${taskDetail.theme}&action=${(action || false) + ''}&source=${order.source}`,
        });
      }}>更多</LinkButton>}
    />

    {actionNode && <ActionButtons
      taskDetail={taskDetail}
      statusName={order.statusName}
      // refresh={refresh}
      afertShow={afertShow}
      taskId={taskId}
      logIds={logIds}
      createUser={taskDetail.createUser}
      permissions
      actions={nodeActions.filter((item) => item.action === 'outStock' ? userInfo.id === order.userId : true)}
      onClick={(value) => {
        switch (value) {
          case 'outStock':
            setPicking(true);
            break;
          case 'revokeAndAsk':
            OutStockRevoke(taskDetail,history);
            break;
          default:
            break;
        }
      }}
    />}

    <MyAntPopup
      title='领料'
      onClose={() => setPicking(false)}
      visible={picking}
      destroyOnClose
    >
      <MyPicking
        pickListsId={pickListsId}
        onSuccess={(res, checkSku) => {
          setPicking(false);
          setCode(res);
        }}
      />
    </MyAntPopup>

    <Dialog
      afterClose={cancel}
      afterShow={() => {
        run({ params: { code } });
        setFalse();
      }}
      visible={code}
      className={style.codeDialog}
      content={<div style={{ textAlign: 'center' }}>
        <div className={style.codeTitle}>领料码</div>
        <div style={{ position: 'relative', paddingTop: 19 }}>
          <div className={style.code}>{code}</div>
          {code && !success && <div className={style.time}>失效剩余时间：<Clock seconds={600} /></div>}
          <img src={imgSrc} alt='' width={187} />
          <div hidden={!success} className={style.getCodeSuccess}>
            <CheckCircleFill />
            领取成功！
          </div>
        </div>
      </div>}
      actions={[[
        { text: '关闭', key: 'close' },
      ]]}
      onAction={(action) => {
        switch (action.key) {
          case 'close':
            if (success) {
              orderRefresh();
            }
            setCode('');
            return;
          case 'print':
            PrintCode.print([`<img src={${imgSrc}} alt='' />`], 0);
            return;
          default:
            return;
        }
      }}
    />

  </div>;
};

export default OutSkuAction;
