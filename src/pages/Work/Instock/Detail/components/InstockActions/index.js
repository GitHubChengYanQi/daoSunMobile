import React from 'react';
import { useRequest } from '../../../../../../util/Request';
import { Button, Dialog, Toast } from 'antd-mobile';
import { history } from 'umi';
import { checkNumberTrue } from '../../../../ProcurementOrder/Url';
import { MyLoading } from '../../../../../components/MyLoading';

const InstockActions = (
  {
    refresh,
    setDetails,
    orderStatus,
    details,
    status,
    id,
  },
) => {

  // 入库
  const { loading: instockLoading, run: instockRun } = useRequest({
    url: '/instockOrder/freeInStockByPositions',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      Dialog.show({
        content: '入库成功！',
        closeOnAction: true,
        onAction: (action) => {
          if (action.key === 'back') {
            history.goBack();
          } else {
            refresh();
            setDetails([]);
          }
        },
        actions: [[
          {
            key: 'back',
            text: '返回入库列表',
          },
          {
            key: 'next',
            text: '继续入库',
          },
        ],
        ],
      });
    },
  });


  const { loading: checkNumberLoading, run: checkNumberRun } = useRequest(checkNumberTrue, {
    manual: true,
    onSuccess: (res) => {
      refresh();
      Toast.show({ content: '提报完成！请继续入库' });
    },
  });

  return <>
    <Button
      disabled={orderStatus().buttonDisabled}
      color='primary'
      onClick={() => {
        switch (status) {
          case 0:
            const errors = details.filter(item => item.number !== item.newNumber);
            if (errors.length > 0) {
              history.push({
                pathname: '/Work/Instock/Errors',
                state: {
                  details,
                  id,
                },
              });
            } else {
              checkNumberRun({
                data: { instockOrderId: id, state: 99 },
              });
            }
            break;
          case 98:
            console.log(details);
            
            break;
          default:
            return {};
        }
      }}>{orderStatus().buttonText}</Button>

    {(instockLoading || checkNumberLoading) && <MyLoading />}
  </>;
};

export default InstockActions;
