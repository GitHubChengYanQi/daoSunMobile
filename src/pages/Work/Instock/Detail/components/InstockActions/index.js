import React, { useRef } from 'react';
import { useRequest } from '../../../../../../util/Request';
import { Button, Toast } from 'antd-mobile';
import { history } from 'umi';
import { MyLoading } from '../../../../../components/MyLoading';
import Instock from '../Instock';
import { checkNumberTrue } from '../../../../Order/Url';

const InstockActions = (
  {
    refresh,
    setDetails,
    orderStatus,
    details,
    status,
    id,
    CodeRun,
    CodeLoading,
  },
) => {


  const ref = useRef();

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
          case 1:
            const errors = details.filter(item => item.number !== item.newNumber);
            if (errors.length > 0) {
              history.replace({
                pathname: '/Work/Instock/Errors',
                state: {
                  details,
                  id,
                },
              });
            } else {
              checkNumberRun({
                data: { instockOrderId: id, state: 98 },
              });
            }
            break;
          case 98:
            ref.current.open(false);
            break;
          default:
            return {};
        }
      }}>{orderStatus().buttonText}</Button>

    <Instock
      CodeLoading={CodeLoading}
      details={details}
      ref={ref}
      setDetails={setDetails}
      refresh={refresh}
      CodeRun={CodeRun}
    />

    {checkNumberLoading && <MyLoading />}
  </>;
};

export default InstockActions;
