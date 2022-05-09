import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { checkNumberTrue, instockOrderDetail } from '../../ProcurementOrder/Url';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import { history } from 'umi';
import { batchBind } from '../../../Scan/InStock/components/Url';
import { Message } from '../../../components/Message';
import InstockDetails from './components/InstockDetails';
import ListByInstockOrder from './components/ListByInstockOrder';
import Show from './components/Show';
import Instock from './components/Instock';
import { ReceiptsEnums } from '../../../Receipts';

const Detail = ({ id, setModuleObject, moduleObject, currentNode = [], processRefresh }, ref) => {

  const instockRef = useRef();

  const [skus, setSkus] = useState([]);

  const actions = [];
  currentNode.map((item) => {
    if (item.logResult && Array.isArray(item.logResult.actionResults)) {
      return item.logResult.actionResults.map((item) => {
        return actions.push({ action: item.action, actionId: item.documentsActionId });
      });
    }
    return null;
  });

  const [key, setKey] = useState('detail');

  const [details, setDetails] = useState([]);

  const [positions, setPositions] = useState({});

  const getPosition = (data, skuId, position = {}) => {
    if (!Array.isArray(data)) {
      return position;
    }

    data.map((item) => {
      const skus = item.skuResults.filter(item => item.skuId === skuId);
      if (skus.length > 0) {
        return position = getPosition(item.storehousePositionsResults, skuId, {
          positionId: item.storehousePositionsId,
          positionName: item.name,
          stockNumber: skus[0].stockNumber,
        });
      }
      return null;
    });

    return position;
  };

  const getChildren = (data, details = [], top, positionId = []) => {

    if (!Array.isArray(data)) {
      return null;
    }

    const skuResults = [];
    const option = [];

    data.map((item) => {
      if (positionId.includes(item.storehousePositionsId)) {
        return null;
      }
      positionId.push(item.storehousePositionsId);
      let detailSkus = [];
      item.skuIds && item.skuIds.map((skuId) => {
        const array = details.filter(item => skuId === item.skuId);
        return array.map((skuItem) => {
          const sku = {
            ...skuItem,
            skuId: skuItem.skuId,
            instockListId: skuItem.instockListId,
            number: skuItem.realNumber,
            skuResult: skuItem.skuResult,
            spuResult: skuItem.spuResult,
            ...getPosition(data, skuItem.skuId),
          };
          if (!skuResults.map(item => item.instockListId).includes(skuItem.instockListId)) {
            skuResults.push(sku);
            detailSkus.push(sku);
          }
          return null;
        });
      });
      return option.push({
        title: `${item.name} (${detailSkus.length})`,
        key: item.storehousePositionsId,
        skus: detailSkus,
        children: !top && getChildren(item.storehousePositionsResults, details),
      });
    });

    if (top) {

      details.map((item) => {
        if (!skuResults.map(item => item.instockListId).includes(item.instockListId)) {
          const sku = {
            skuId: item.skuId,
            instockListId: item.instockListId,
            number: item.realNumber,
            ...item,
            skuResult: item.skuResult,
            spuResult: item.spuResult,
          };
          return skuResults.push(sku);
        }
        return null;
      });

      return [{
        title: `全部 (${skuResults.length})`,
        key: 'all',
        skus: skuResults,
        children: getChildren(data, details),
      }];
    }
    if (data.length === 0) {
      return null;
    }
    return option;
  };

  const getSkus = (extend) => {
    if (extend && Array.isArray(extend.skus)) {
      setSkus(extend.skus);
    }
  };

  const getChecked = (data, key) => {
    if (Array.isArray(data)) {
      const array = data.filter((item) => {
        return item.key = key;
      });
      if (array.length === 1) {
        return array[0];
      } else {
        return getChecked(data.children, key);
      }
    } else {
      return null;
    }
  };

  const detailsChange = (array) => {
    let number = 0;
    let newNumber = 0;
    array.map((item) => {
      number += (item.number || 0);
      newNumber += (item.newNumber || 0);
      return null;
    });
    setDetails(array);
    setModuleObject({ ...moduleObject, number, newNumber });
  };

  const { loading, data, run, refresh } = useRequest(instockOrderDetail, {
    manual: true,
    onSuccess: (res) => {
      if (Array.isArray(res && res.instockListResults)) {
        const instockList = res.instockListResults.map((item) => {
          const positions = getPosition(res && res.bindTreeView, item.skuId);
          const detail = details.filter(skuItem => skuItem.instockListId === item.instockListId);
          const number = item.realNumber;
          return detail[0] || {
            skuId: item.skuId,
            skuResult: { ...item.skuResult, spuResult: item.spuResult },
            number,
            newNumber: number,
            instockNumber: item.instockNumber,
            instockListId: item.instockListId,
            positions: [{
              ...positions,
              instockNumber: number,
            }],
          };
        });
        detailsChange(instockList);
      }
      const allSku = getChildren(res && res.bindTreeView, res && res.instockListResults, true) || [];
      if (positions.key) {
        const checked = getChecked(allSku, positions.key) || {};
        setPositions(checked);
        getSkus(checked);
      } else {
        setPositions(allSku[0]);
        getSkus(allSku[allSku.length - 1]);
      }
    },
  });

  const { loading: CodeLoading, run: CodeRun } = useRequest(
    batchBind,
    {
      manual: true,
    },
  );

  const { loading: checkNumberLoading, run: checkNumberRun } = useRequest(checkNumberTrue, {
    manual: true,
    onSuccess: () => {
      refresh();
      processRefresh();
      Message.toast('提报完成,请继续入库!');
    },
  });

  useEffect(() => {
    if (id) {
      run({ data: { instockOrderId: id } });
    }
  }, [id]);

  const errorAction = (actionId) => {
    const errors = details.filter(item => item.number !== item.newNumber);
    if (errors.length > 0) {
      history.push({
        pathname: `/ReceiptsCreate?type=${ReceiptsEnums.instockError}`,
        // pathname: '/Work/Stock/DtockDetails',
        state: {
          details,
          id,
        },
      });
    } else {
      checkNumberRun({
        data: { instockOrderId: id, state: 98, actionId },
      });
    }
  };

  const instockAction = ({ array, actionId }) => {
    instockRef.current.instock({ details: array || details, actionId });
  };

  useImperativeHandle(ref, () => ({
    errorAction,
    instockAction,
  }));


  if (loading) {
    return <MyLoading />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  const options = getChildren(data.bindTreeView, data.instockListResults, true) || [];

  const type = () => {
    switch (key) {
      case 'detail':
        return <InstockDetails
          CodeLoading={CodeLoading}
          CodeRun={CodeRun}
          details={details}
          setDetails={detailsChange}
          getSkus={getSkus}
          positions={positions}
          setPositions={setPositions}
          skus={skus}
          setSkus={setSkus}
          options={options}
          refresh={refresh}
          instockAction={instockAction}
          data={data}
          actions={actions}
        />;
      case 'record':
        return <ListByInstockOrder id={id} />;
      case 'log':
        return <MyEmpty />;
      default:
        return <MyEmpty />;
    }
  };


  return <>

    <Show data={data} type={type()} typeKey={key} setKey={setKey} />

    <Instock
      instockOrderId={id}
      CodeLoading={CodeLoading}
      ref={instockRef}
      refresh={refresh}
      CodeRun={CodeRun}
      setDetail={detailsChange}
      processRefresh={processRefresh}
    />

    {checkNumberLoading && <MyLoading />}
  </>;

};

export default React.forwardRef(Detail);
