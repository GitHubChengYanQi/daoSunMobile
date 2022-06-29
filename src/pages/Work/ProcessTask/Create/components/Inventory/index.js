import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { ActionSheet } from 'antd-mobile';
import MyAntPopup from '../../../../../components/MyAntPopup';
import BottomButton from '../../../../../components/BottomButton';
import Condition from './compoennts/Condition';
import { ERPEnums } from '../../../../Stock/ERPEnums';
import { ReceiptsEnums } from '../../../../../Receipts';

const Inventory = (
  {
    type = ERPEnums.stocktaking,
    open,
    onClose = () => {

    },
  },
) => {
  const [visible, setVisible] = useState();

  const [condition, setCondition] = useState();

  const [data, setData] = useState({});

  const taskType = () => {
    switch (type) {
      case ERPEnums.stocktaking:
        return { title: '盘点条件' };
      case ERPEnums.curing:
        return { title: '养护条件' };
      default:
        return {};
    }
  };

  useEffect(() => {
    if (open) {
      switch (type) {
        case ERPEnums.stocktaking:
          setVisible(true);
          break;
        case ERPEnums.curing:
          setCondition(true);
          break;
        default:
          break;
      }
    }
  }, [open]);

  const disabled = () => {

    let disabled = false;

    switch (type) {
      case ERPEnums.stocktaking:
        disabled = !data.endTime || !data.beginTime;
        break;
      case ERPEnums.curing:
        disabled = !data.type || !data.startTime || !data.endTime;
        break;
      default:
        return true;
    }

    const conditions = data.conditions || [];

    if (conditions.length === 0) {
      disabled = true;
    }

    const newConditions = conditions.filter(item => item.data && item.data.key);
    disabled = newConditions.length !== conditions.length;
    return disabled;
  };

  return <>
    <ActionSheet
      cancelText='取消'
      visible={visible}
      actions={[
        { text: '按物料盘点', key: 'sku' },
        { text: '按条件盘点', key: 'condition' },
      ]}
      onClose={() => {
        setVisible(false);
        onClose();
      }}
      onAction={(action) => {
        switch (action.key) {
          case 'sku':
            history.push(`/Receipts/ReceiptsCreate?type=${ReceiptsEnums.stocktaking}`);
            break;
          case 'condition':
            setCondition(true);
            setData({ ...data, type: action.key });
            break;
          default:
            break;
        }
        onClose();
        setVisible(false);
      }}
    />

    <MyAntPopup destroyOnClose visible={condition} onClose={() => setCondition(false)} title={taskType().title}>
      <Condition type={type} value={data} onChange={setData} />
      <BottomButton
        rightText='确定'
        rightDisabled={disabled()}
        rightOnClick={() => {
          setCondition(false);
          history.push({
            pathname: '/Work/Instock/InstockAsk/Submit',
            query: {
              createType: type,
            },
            state: {
              condition: true,
              data,
            },
          });
          onClose();
        }}
      />
    </MyAntPopup>
  </>;
};

export default Inventory;
