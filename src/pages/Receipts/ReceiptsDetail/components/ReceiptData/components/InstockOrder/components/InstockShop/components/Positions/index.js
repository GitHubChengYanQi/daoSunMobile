import React, { useEffect, useState } from 'react';
import MySearch from '../../../../../../../../../../components/MySearch';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import BottomButton from '../../../../../../../../../../components/BottomButton';
import CheckPosition
  from '../../../../../../../../../../Work/Sku/SkuList/components/SkuScreen/components/Position/components/CheckPosition';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import { ScanIcon } from '../../../../../../../../../../components/Icon';
import { connect } from 'dva';
import { Message } from '../../../../../../../../../../components/Message';

export const positions = { url: '/storehousePositions/treeViewByName', method: 'POST' };

const Positions = (
  {
    single,
    ids = [],
    showPositionIds = [],
    onClose = () => {
    },
    onSuccess = () => {
    },
    checkShow,
    showAll,
    autoFocus,
    maxNumber,
    verification,
    storehouseId,
    skuId,
    extra,
    empty,
    hiddenButton,
    height,
    ...props
  },
) => {

  const codeId = ToolUtil.isObject(props.qrCode).codeId;
  const backObject = ToolUtil.isObject(props.qrCode).backObject || {};

  const [value, onChange] = useState(ids);

  const disabled = verification && value.length >= maxNumber;

  const { loading, data, run } = useRequest(positions, {
    manual: true,
  });

  const [name, setName] = useState();

  const submit = (data = {}) => {
    run({ data: { storehouseId, skuId, ...data } });
  };

  useEffect(() => {
    submit();
  }, []);

  useEffect(() => {
    if (codeId) {
      props.dispatch({ type: 'qrCode/clearCode' });
      const position = backObject.result || {};
      if (ids.map(item => item.id).includes(position.storehousePositionsId)) {
        return Message.toast('已添加此库位!');
      }
      if (backObject.type === 'storehousePositions') {
        const newPositions = [...ids, { id: position.storehousePositionsId, name: position.name }];
        if (verification && newPositions.length > maxNumber) {
          return Message.toast('不能超过剩余数量！');
        }
        onSuccess(newPositions);
      } else {
        Message.toast('请扫描正确库位码!');
      }
    }
  }, [codeId]);

  return <div style={{ height: height || '90vh', display: 'flex', flexDirection: 'column', paddingBottom: 60 }}>

    <MySearch
      id='positionSearch'
      searchIcon={<ScanIcon />}
      placeholder='搜索库位'
      onChange={setName}
      searchIconClick={() => {
        props.dispatch({
          type: 'qrCode/wxCpScan',
          payload: {
            action: 'position',
          },
        });
      }}
      onSearch={() => {
        submit({ name });
      }}
      onClear={() => {
        submit();
      }} />

    <div style={{ padding: 12, overflow: 'auto', flexGrow: 1 }}>
      <CheckPosition
        showPositionIds={showPositionIds}
        extra={extra}
        skuId={skuId}
        disabled={disabled}
        single={single}
        value={value}
        onChange={(value) => {
          onChange(value);
        }}
        data={data}
        refresh={data}
        checkShow={(item) => {
          if (typeof checkShow === 'function'){
            return checkShow(item);
          }
          return showAll || ToolUtil.isArray(item.loops).length === 0;
        }}
      />
    </div>

    {loading && <MyLoading skeleton />}

    {!hiddenButton && <BottomButton
      rightText='确定'
      leftOnClick={() => {
        onClose();
      }}
      rightDisabled={!empty && value.length === 0}
      rightOnClick={() => {
        onSuccess(value);
      }}
    />}

  </div>;
};

export default connect(({ qrCode }) => ({ qrCode }))(Positions);
