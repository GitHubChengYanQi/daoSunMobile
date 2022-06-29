import React, { useEffect, useState } from 'react';
import MySearch from '../../../../../../../../../../components/MySearch';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import BottomButton from '../../../../../../../../../../components/BottomButton';
import CheckPosition
  from '../../../../../../../../../../Work/Sku/SkuList/components/SkuScreen/components/Position/components/CheckPosition';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import Icon from '../../../../../../../../../../components/Icon';
import { connect } from 'dva';
import { Message } from '../../../../../../../../../../components/Message';

const positions = { url: '/storehousePositions/treeViewByName', method: 'POST' };

const Positions = (
  {
    single,
    ids = [],
    onClose = () => {
    },
    onSuccess = () => {
    },
    showAll,
    autoFocus,
    ...props
  },
) => {

  const codeId = ToolUtil.isObject(props.qrCode).codeId;
  const backObject = ToolUtil.isObject(props.qrCode).backObject || {};

  const [focus, setFocus] = useState(autoFocus);

  const { loading, data, run } = useRequest(positions, {
    onSuccess: () => {
      if (focus) {
        const positionSearch = document.querySelector('#positionSearch input');
        if (positionSearch) {
          positionSearch.focus();
          setFocus(false);
        }
      }
    },
  });

  const [value, onChange] = useState(ids);

  const [name, setName] = useState();

  useEffect(() => {
    if (codeId) {
      props.dispatch({ type: 'qrCode/clearCode' });
      const position = backObject.result || {};
      if (ids.map(item => item.id).includes(position.storehousePositionsId)) {
        return Message.toast('已添加此库位!');
      }
      if (backObject.type === 'storehousePositions') {
        onSuccess([...ids, { id: position.storehousePositionsId, name: position.name }]);
      } else {
        Message.toast('请扫描正确库位码!');
      }
    }
  }, [codeId]);

  return <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', paddingBottom: 60 }}>

    <MySearch
      id='positionSearch'
      searchIcon={<Icon type='icon-dibudaohang-saoma' />}
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
        run({ data: { name } });
      }}
      onClear={() => {
        run();
      }} />

    <div style={{ padding: 12, overflow: 'auto', flexGrow: 1 }}>
      <CheckPosition
        single={single}
        value={value}
        onChange={(value) => {
          onChange(value);
        }}
        data={data}
        refresh={data}
        checkShow={(item) => {
          return showAll || ToolUtil.isArray(item.loops).length === 0;
        }}
      />
    </div>

    {loading && <MyLoading skeleton />}

    <BottomButton
      rightText='确定'
      leftOnClick={() => {
        onClose();
      }}
      rightDisabled={value.length === 0}
      rightOnClick={() => {
        onSuccess(value);
      }}
    />

  </div>;
};

export default connect(({ qrCode }) => ({ qrCode }))(Positions);
