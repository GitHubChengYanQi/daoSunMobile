import { useHistory } from 'react-router-dom';
import { ReceiptsEnums } from '../../../../../Receipts';
import { ToolUtil } from '../../../../../components/ToolUtil';
import style from '../../index.less';
import { ScanIcon } from '../../../../../components/Icon';
import { Button } from 'antd-mobile';
import { connect } from 'dva';
import React from 'react';

const TaskBottom = ({ taskKey, task, ...props }) => {
  const history = useHistory();
  switch (taskKey) {
    case ReceiptsEnums.stocktaking:
      return task ? <div className={ToolUtil.classNames(style.bottomButton, style.bottom)}>
        <div className={style.stocktakingButtom} onClick={() => {
          props.dispatch({
            type: 'qrCode/wxCpScan',
          });
        }}>
          <ScanIcon />
        </div>
      </div> : <></>;
    case ReceiptsEnums.maintenance:
      return <div className={ToolUtil.classNames(style.maintenanceButtom, task && style.bottom)}>
        <Button color='primary' onClick={() => {
          history.push('/Work/Maintenance/AllMaintenance');
        }}>开始养护</Button>
      </div>;
    default:
      return <></>;
  }
};
export default connect(({ qrCode }) => ({ qrCode }))(TaskBottom);
