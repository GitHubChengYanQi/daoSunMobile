import React, { useEffect, useRef } from 'react';
import MySearch from '../../../MySearch';
import { ScanIcon } from '../../../Icon';
import MyList from '../../../MyList';
import { Button } from 'antd-mobile';
import style from './index.less';
import { ToolUtil } from '../../../ToolUtil';
import InkindItem from '../InkindItem';
import { Message } from '../../../Message';
import { connect } from 'dva';

const inkindList = { url: '/stockDetails/list', method: 'POST' };

const List = (
  {
    skuInfo = {},
    inkinds = [],
    setInkinds = () => {
    },
    data = [],
    setData = () => {
    },
    addInkind = () => {
    },
    onSuccess = () => {
    },
    add,
    ...props
  },
) => {

  const inkindIds = inkinds.map(item => item.inkindId);

  const ref = useRef();

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

  return <>
    <MySearch
      className={style.search}
      searchIcon={<ScanIcon onClick={() => {
        props.dispatch({
          type: 'qrCode/wxCpScan',
          payload: {
            action: 'getBackObject',
          },
        });
      }} />}
      placeholder='请输入实物码'
      onSearch={(value) => {
        ref.current.submit({ ...skuInfo, inkindId: value });
      }}
      onClear={() => {
        ref.current.submit({ ...skuInfo, inkindId: null });
      }}
    />

    <div className={style.list}>
      <div className={style.flex} style={{ padding: '8px 0' }}>
        <div className={style.flexGrow}>
          库存实物编号只显示后六位！
        </div>
        {add && <Button color='primary' fill='outline' onClick={addInkind}>新增二维码</Button>}
      </div>
      <div className={style.inkindList}>
        <MyList
          ref={ref}
          params={skuInfo}
          api={inkindList}
          data={data}
          getData={(list, newList) => {
            const positionIds = list.map(item => item.storehousePositionsId);
            const newData = data.filter(item => positionIds.includes(item.positionId));
            newList.forEach(item => {
              const newPositionIds = newData.map(item => item.positionId);
              const newPositionIndex = newPositionIds.indexOf(item.storehousePositionsId);
              if (newPositionIndex !== -1) {
                const newPosition = newData[newPositionIndex];
                newData[newPositionIndex] = { ...newPosition, inkindList: [...newPosition.inkindList, item] };
              } else {
                newData.push({
                  positionId: item.storehousePositionsId,
                  name: ToolUtil.isObject(item.storehousePositionsResult).name,
                  storehouseName: ToolUtil.isObject(item.storehouseResult).name,
                  inkindList: [item],
                });
              }
            });
            setData(newData);
          }}
        >
          {
            data.map((item, index) => {
              return <InkindItem
                key={index}
                positionItem={item}
                inkindIds={inkindIds}
                setInkinds={setInkinds}
                inkinds={inkinds}
              />;
            })
          }
        </MyList>
      </div>

    </div>


  </>;
};

export default connect(({ qrCode }) => ({ qrCode }))(List);
