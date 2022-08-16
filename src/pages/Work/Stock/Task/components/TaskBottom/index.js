import { useHistory } from 'react-router-dom';
import { ReceiptsEnums } from '../../../../../Receipts';
import { ToolUtil } from '../../../../../components/ToolUtil';
import style from '../../index.less';
import { ScanIcon } from '../../../../../components/Icon';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Message } from '../../../../../components/Message';
import BottomButton from '../../../../../components/BottomButton';

const TaskBottom = ({ taskKey, task, ...props }) => {
  const history = useHistory();

  const qrCode = ToolUtil.isObject(props.qrCode);

  const codeId = qrCode.codeId;

  useEffect(() => {
    if (codeId) {
      const backObject = qrCode.backObject || {};
      props.dispatch({
        type: 'qrCode/clearCode',
      });
      if (backObject.type === 'storehousePositions') {
        const result = ToolUtil.isObject(backObject.result);
        if (result.storehousePositionsId) {
          history.push(`/Work/Inventory/RealTimeInventory/PositionInventory?positionId=${result.storehousePositionsId}`);
        } else {
          Message.errorToast('获取库位码失败!');
        }
      } else {
        Message.errorToast('请扫描库位码!');
      }
    }
  }, [codeId]);

  switch (taskKey) {
    case ReceiptsEnums.stocktaking:
      return task ? <div className={ToolUtil.classNames(style.stocktakingButtom, style.bottom)} onClick={() => {
        props.dispatch({
          type: 'qrCode/wxCpScan',
          payload: {
            action: 'position',
          },
        });
      }}>
        <ScanIcon />
      </div> : <></>;
    case ReceiptsEnums.outstockOrder:
      return task ? <div style={{ height: 60 }}>
        <BottomButton only text='出库确认' onClick={() => {
          history.push('/Work/OutStockConfirm');
        }} />
      </div> : <></>;
    default:
      return <></>;
  }
};
export default connect(({ qrCode }) => ({ qrCode }))(TaskBottom);
