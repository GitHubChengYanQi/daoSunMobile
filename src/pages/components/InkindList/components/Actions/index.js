import React, { useEffect } from 'react';
import MyActionSheet from '../../../MyActionSheet';
import { connect } from 'dva';
import { ToolUtil } from '../../../ToolUtil';
import { Message } from '../../../Message';

const Actions = (
  {
    visible,
    setVisible = () => {
    },
    search = () => {
    },
    skuInfo,
    onSuccess = () => {
    },
    searchDisabled,
    ...props
  }) => {

  const qrCode = ToolUtil.isObject(props.qrCode);
  const codeId = qrCode.codeId;
  const action = qrCode.action;
  const backObject = qrCode.backObject || {};

  useEffect(() => {
    if (codeId && action === 'getBackObject') {
      props.dispatch({
        type: 'qrCode/clearCode',
      });
      if (backObject.type === 'item') {
        const inkind = backObject.inkindResult || {};
        const details = ToolUtil.isObject(inkind.inkindDetail).stockDetails || {};
        let exist = true;
        if (skuInfo.brandId && details.brandId !== skuInfo.brandId) {
          exist = false;
        } else if (skuInfo.skuId && details.skuId !== skuInfo.skuId) {
          exist = false;
        } else if (skuInfo.storehousePositionsId && details.storehousePositionsId !== skuInfo.storehousePositionsId) {
          exist = false;
        }
        if (!exist) {
          Message.errorToast('请扫描正确的实物码！');
        } else {
          onSuccess([{
            inkind: inkind.inkindId,
            codeId,
            ...details,
          }]);
        }
      } else {
        Message.errorToast('请扫描实物码！');
      }
    }
  }, [codeId]);

  useEffect(() => {
    props.dispatch({
      type: 'qrCode/scanCodeState',
      payload: {
        action: 'getBackObject',
      },
    });
  }, []);
  return <MyActionSheet
    onClose={() => setVisible(false)}
    visible={visible}
    actions={[{ text: '扫码', key: 'scan' }, { text: '搜索实物', key: 'search', disabled: searchDisabled }]}
    onAction={(action) => {
      if (action.key === 'scan') {
        props.dispatch({
          type: 'qrCode/wxCpScan',
          payload: {
            action: 'getBackObject',
          },
        });
      } else {
        setVisible(false);
        search();
      }
    }}
  />;
};

export default connect(({ qrCode }) => ({ qrCode }))(Actions);
