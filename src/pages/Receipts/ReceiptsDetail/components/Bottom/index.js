import React, { useState } from 'react';
import style from './index.less';
import { MoreOutline } from 'antd-mobile-icons';
import Audit from '../../../components/Audit';
import { ReceiptsEnums } from '../../../index';
import InStockErrorBottom from './components/InStockErrorBottom';
import Note from '../../../components/Comments/components/Note';
import MyActionSheet from '../../../../components/MyActionSheet';

const Bottom = (
  {
    currentNode = [],
    detail = {},
    refresh = () => {
    },
  }) => {

  const [visible, setVisible] = useState();

  const [params, setParams] = useState({});

  const [loading, setLoading] = useState();

  const actions = [];
  currentNode.map((item) => {
    if (item.logResult && Array.isArray(item.logResult.actionResults)) {
      return item.logResult.actionResults.map((item) => {
        return actions.push({ action: item.action, id: item.documentsActionId });
      });
    }
    return null;
  });

  if (!detail.permissions) {
    return <></>;
  }

  if (actions.length > 0) {
    switch (detail.type) {
      case ReceiptsEnums.error:
        return <InStockErrorBottom detail={detail} actions={actions} refresh={refresh} />;
      default:
        return <></>;
    }
  }

  return <div hidden={currentNode.filter(item => item.stepType === 'audit').length === 0} className={style.bottom}>
    <Note
      textAreaId='auditTextArea'
      autoFocus={false}
      noAdd
      className={style.note}
      value={params}
      uploadId='auditImg'
      onChange={setParams}
      loading={setLoading}
    />
    <div className={style.actions}>
      <div className={style.all} onClick={() => {
        setVisible(true);
      }}>
        更多
        <MoreOutline style={{ fontSize: 15 }} />
      </div>
      <Audit loading={loading} {...params} id={detail.processTaskId} refresh={refresh} currentNode={currentNode} />
    </div>

    <MyActionSheet onAction={() => setVisible(false)} visible={visible} actions={[
      { text: '转审', key: 'outStock', disabled: true },
      { text: '加签', key: 'inStock', disabled: true },
      { text: '退回', key: 'allocation', disabled: true },
    ]} onClose={() => setVisible(false)} />

  </div>;
};

export default Bottom;
