import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { ReceiptsEnums } from '../../../../../Receipts';
import { useRequest } from '../../../../../../util/Request';
import { judgeLoginUser } from '../../../../CreateTask';
import { MyLoading } from '../../../../../components/MyLoading';
import MyActionSheet from '../../../../../components/MyActionSheet';

const CreateInStock = (
  {
    open,
    onClose = () => {

    },
    submit = () => {
    },
    directInStock = () => {
    },
  },
) => {

  const [visible, setVisible] = useState();

  const { loading, run: judgeRun } = useRequest(judgeLoginUser, {
    manual: true,
    onSuccess: (res) => {
      if (res) {
        setVisible(true);
      } else {
        if (!submit()) {
          history.push(`/Receipts/ReceiptsCreate?type=${ReceiptsEnums.instockOrder}`);
        }
      }
    },
  });

  useEffect(() => {
    if (open) {
      judgeRun();
    }
  }, [open]);

  return <>
    <MyActionSheet
      visible={visible}
      actions={[
        { text: '提交申请', key: 'submit' },
        { text: '直接入库', key: 'directInStock' },
      ]}
      onClose={() => {
        setVisible(false);
        onClose();
      }}
      onAction={(action) => {
        switch (action.key) {
          case 'submit':
            if (!submit()) {
              history.push(`/Receipts/ReceiptsCreate?type=${ReceiptsEnums.instockOrder}`);
            }
            break;
          case 'directInStock':
            if (!directInStock()) {
              history.push(`/Receipts/ReceiptsCreate?type=${ReceiptsEnums.instockOrder}&directInStock`);
            }
            break;
          default:
            break;
        }
        onClose();
        setVisible(false);
      }}
    />

    {loading && <MyLoading />}
  </>;
};

export default CreateInStock;
