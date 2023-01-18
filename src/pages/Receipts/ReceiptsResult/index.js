import React, { useEffect } from 'react';
import MyResult from '../../components/MyResult';
import { useHistory, useLocation } from 'react-router-dom';
import { ReceiptsEnums } from '../index';
import { Button } from 'antd-mobile';
import style from './index.less';
import { connect } from 'dva';

const ReceiptsResult = (
  {
    dispatch = () => {
    },
  }) => {

  const { state } = useLocation();

  const history = useHistory();

  const typeData = () => {
    if (!state) {
      return {};
    }
    switch (state.type) {
      case ReceiptsEnums.outstockOrder:
        return {
          title: '创建出库任务成功！',
        };
      case ReceiptsEnums.instockOrder:
        return {
          title: '创建入库任务成功！',
        };
      case ReceiptsEnums.maintenance:
        return {
          title: '创建养护任务成功！',
        };
      case ReceiptsEnums.stocktaking:
        return {
          title: '创建盘点任务成功！',
        };
      case ReceiptsEnums.allocation:
        return {
          title: '创建调拨任务成功！',
        };
      default:
        return {};
    }
  };

  useEffect(() => {
    if (!state) {
      history.replace('/');
    }
  }, []);

  return <div className={style.box}>
    <div className={style.result}>
      <MyResult
        title={typeData().title}
        description={
          <div className={style.actions}>
            <Button onClick={() => {
              dispatch({
                type: 'processList/tabKeyChange',
                payload: {
                  key:'start'
                },
              });
              history.push('/Work/ProcessTask');
            }}>返回列表</Button>
            <Button color='primary' className={style.view} onClick={() => {
              history.push(`/Receipts/ReceiptsDetail?type=${state.type}&formId=${state.formId}`);
            }}>查看详情</Button>
          </div>
        }
      />
    </div>
  </div>;
};

export default connect(({ processList }) => ({ processList }))(ReceiptsResult);
