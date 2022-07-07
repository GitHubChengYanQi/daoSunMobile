import React, { useEffect, useState } from 'react';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../../../../../util/Request';
import { instockOrderAdd } from '../../../../../../Url';
import { Message } from '../../../../../../../../components/Message';
import Skus from '../Skus';
import MyNavBar from '../../../../../../../../components/MyNavBar';
import BottomButton from '../../../../../../../../components/BottomButton';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import OtherData from '../OtherData';
import { ReceiptsEnums } from '../../../../../../../../Receipts';

const InstockAsk = ({ skus, judge, createType }) => {

  const [data, setData] = useState([]);

  const [hiddenBottom, setHiddenBottom] = useState(false);

  const [params, setParams] = useState({});

  const history = useHistory();

  const normalSku = [];

  let countNumber = 0;

  const skuList = data.map((item, index) => {
    if (item.number > 0) {
      countNumber += (item.number || 0);
      normalSku.push(item);
    }
    return { ...item, key: index };
  });

  const { loading: instockLoading, run: inStock } = useRequest(instockOrderAdd, {
    manual: true,
    onSuccess: (res) => {
      Message.successDialog({
        content: '创建入库申请成功!',
        confirmText: '查看详情',
        cancelText: '返回列表',
        onCancel: () => history.goBack(),
        onConfirm: () => {
          history.push(`/Receipts/ReceiptsDetail?type=${ReceiptsEnums.instockOrder}&formId=${res.instockOrderId}`);
        },
      });
    },
  });


  const dataChange = (array = []) => {
    if (array.length === 0) {
      if (history.length <= 2) {
        history.push('/');
      } else {
        history.goBack();
      }
    }
    setData(array);
  };


  useEffect(() => {
    dataChange(skus);
  }, []);

  const createTypeData = (item = {}) => {
    return {
      title: '入库申请',
      type: '入库',
      otherData: [item.customerName, item.brandName || '无品牌'],
      more: judge && ToolUtil.isArray(item.positions).map(item => {
        return `${item.name}(${item.number})`;
      }).join('、'),
      careful: '注意事项',
      buttonHidden: judge,
      disabled: ToolUtil.isArray(params.noticeIds).length === 0 || (judge ? false : normalSku.length === 0),
    };
  };

  const inStockRun = (directInStock) => {
    const listParams = [];
    (directInStock ? skuList : normalSku).map(item => {
      if (judge) {
        const positions = item.positions || [];
        positions.map(positionItem => {
          if (positionItem.number > 0) {
            listParams.push({
              ...item,
              storehousePositionsId: positionItem.id,
              number: positionItem.number,
            });
          }
          return null;
        });
      } else {
        listParams.push({ ...item, storehousePositionsId: item.positionId });
      }
      return null;
    });
    inStock({
      data: {
        shopCardType: createType,
        directInStock,
        module: 'createInstock',
        listParams,
        ...params,
      },
    });
  };

  const content = () => {
    return <Skus
      skus={skus}
      createTypeData={createTypeData}
      setHiddenBottom={setHiddenBottom}
      judge={judge}
      skuList={skuList}
      countNumber={countNumber}
      dataChange={dataChange}
    />;
  };

  return <div style={{ marginBottom: 60 }}>
    <MyNavBar title={createTypeData().title} />
    {content()}

    <OtherData createType={createType} careful={createTypeData().careful} params={params} setParams={setParams} />

    {!hiddenBottom && <BottomButton
      leftOnClick={() => {
        history.goBack();
      }}
      rightText='提交'
      rightDisabled={createTypeData().disabled}
      rightOnClick={() => {
        if (judge) {
          return inStockRun(true);
        }
        inStockRun();
      }}
    />}

    {(instockLoading) && <MyLoading />}

  </div>;
};

export default InstockAsk;
