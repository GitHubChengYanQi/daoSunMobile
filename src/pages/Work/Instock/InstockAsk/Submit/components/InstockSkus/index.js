import React, { useEffect, useState } from 'react';
import style from '../PurchaseOrderInstock/index.less';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import BottomButton from '../../../../../../components/BottomButton';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../../../util/Request';
import { instockOrderAdd, productionPickListAdd } from '../../../../Url';
import { MyLoading } from '../../../../../../components/MyLoading';
import { Message } from '../../../../../../components/Message';
import MyTextArea from '../../../../../../components/MyTextArea';
import Careful from './components/Careful';
import MyNavBar from '../../../../../../components/MyNavBar';
import Stocktaking from './components/Stocktaking';
import Skus from './components/Skus';
import User from './components/User';
import Condition from '../../../../../ProcessTask/Create/components/Inventory/compoennts/Condition';
import { ERPEnums } from '../../../../../Stock/ERPEnums';
import Curing from './components/Curing';
import { useModel } from 'umi';

export const judgeLoginUser = { url: '/instockOrder/judgeLoginUser', method: 'GET' };
export const inventoryAdd = { url: '/inventory/add', method: 'POST' };
export const inventorySelectCondition = { url: '/inventory/selectCondition', method: 'POST' };
export const maintenanceAdd = { url: '/maintenance/add', method: 'POST' };

const InstockSkus = ({ skus = [], createType, judge, state = {} }) => {

  const { initialState } = useModel('@@initialState');
  const userInfo = ToolUtil.isObject(initialState).userInfo || {};

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
    onSuccess: () => {
      Message.toast('创建入库申请成功!');
      history.goBack();
    },
    onError: () => {
      Message.toast('创建入库申请失败!');
    },
  });

  const { loading: inventoryLoading, run: inventory } = useRequest(inventoryAdd, {
    manual: true,
    onSuccess: () => {
      Message.toast('创建盘点单成功!');
      history.goBack();
    },
    onError: () => {
      Message.toast('创建盘点单失败!');
    },
  });


  const { loading: inventoryConditionLoading, run: inventoryCondition } = useRequest(inventorySelectCondition, {
    manual: true,
    onSuccess: () => {
      Message.toast('创建盘点单成功!');
      history.goBack();
    },
    onError: () => {
      Message.toast('创建盘点单失败!');
    },
  });

  const { loading: maintenanceLoading, run: maintenanceRun } = useRequest(maintenanceAdd, {
    manual: true,
    onSuccess: () => {
      Message.toast('创建养护单成功!');
      history.goBack();
    },
    onError: () => {
      Message.toast('创建养护单失败!');
    },
  });

  const { loading: outLoading, run: outStock } = useRequest(productionPickListAdd, {
    manual: true,
    onSuccess: () => {
      Message.toast('创建出库申请成功!');
      history.goBack();
    },
    onError: () => {
      Message.toast('创建出库申请失败!');
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
    switch (createType) {
      case ERPEnums.stocktaking:
        setParams({ method: 'OpenDisc', mode: 'dynamic', ...ToolUtil.isObject(state.data) });
        if (!state.condition) {
          dataChange(skus);
        }
        break;
      case ERPEnums.curing:
        setParams({ ...ToolUtil.isObject(state.data) });
        break;
      case ERPEnums.outStock:
        setParams({ userId: userInfo.id, userName: userInfo.name });
        dataChange(skus);
        break;
      default:
        dataChange(skus);
        break;
    }
  }, []);

  const createTypeData = (item = {}) => {
    switch (createType) {
      case ERPEnums.outStock:
        return {
          title: '出库申请',
          type: '出库',
          otherData: [item.brandName || '任意品牌'],
          careful: '注意事项',
          disabled: ToolUtil.isArray(params.noticeIds).length === 0 || !params.userId || normalSku.length === 0,
        };
      case ERPEnums.inStock:
      case ERPEnums.directInStock:
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
      case ERPEnums.stocktaking:
        const stocktakingDisabled = () => {
          if (!(params.userId && params.beginTime && params.endTime && params.method && params.mode && params.participantsId && ToolUtil.isArray(params.noticeIds).length > 0)) {
            return true;
          }

          if (!state.condition) {
            return false;
          }
          const conditions = params.conditions || [];
          if (conditions.length === 0) {
            return true;
          }

          const newConditions = conditions.filter(item => item.data && item.data.key);
          return newConditions.length !== conditions.length;
        };
        return {
          title: '盘点申请明细',
          type: '盘点',
          careful: '盘点缘由',
          buttonHidden: true,
          disabled: stocktakingDisabled(),
        };
      case ERPEnums.curing:
        const maintenanceDisabled = () => {
          if (!(params.userId && params.startTime && params.endTime && params.nearMaintenance && params.type && ToolUtil.isArray(params.noticeIds).length > 0)) {
            return true;
          }

          const conditions = params.conditions || [];
          if (conditions.length === 0) {
            return true;
          }

          const newConditions = conditions.filter(item => item.data && item.data.key);
          return newConditions.length !== conditions.length;
        };
        return {
          title: '养护申请明细',
          type: '养护',
          careful: '养护缘由',
          buttonHidden: true,
          disabled: maintenanceDisabled(),
        };
      default:
        return {};
    }
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

  const stocktaskingAsk = () => {
    let data = {
      ...params,
      participants: [params.participantsId],
      notice: params.noticeIds,
      enclosure: params.mediaIds,
      userIds: ToolUtil.isArray(params.userIds).toString(),
    };
    if (state.condition) {
      ToolUtil.isArray(params.conditions).map(item => {
        const dataValue = item.data || {};
        switch (item.value) {
          case 'sys':
            data = {
              ...data,
              allSku: dataValue.key === 'all',
              AllBom: dataValue.key === 'bom',
            };
            break;
          case 'material':
            break;
          case 'brand':
            data = {
              ...data,
              brandId: dataValue.key,
            };
            break;
          case 'position':
            data = {
              ...data,
              positionId: dataValue.key,
            };
            break;
          default:
            return [];
        }
        return null;
      });

      inventoryCondition({
        data,
      });
    } else {
      inventory({
        data: {
          ...data,
          detailParams: skuList.map(item => {
            return {
              skuId: item.skuId,
            };
          }),
        },
      });
    }
  };

  const curingAsk = () => {
    let data = {
      ...params,
      notice: params.noticeIds,
      enclosure: params.mediaIds,
      userIds: ToolUtil.isArray(params.userIds).toString(),
      note: params.remark,
    };
    ToolUtil.isArray(params.conditions).map(item => {
      const dataValue = item.data || {};
      switch (item.value) {
        case 'material':
          data = {
            ...data,
            materialId: dataValue.key,
          };
          break;
        case 'brand':
          data = {
            ...data,
            brandId: dataValue.key,
          };
          break;
        case 'position':
          data = {
            ...data,
            storehousePositionsId: dataValue.key,
          };
          break;
        default:
          return [];
      }
      return null;
    });

    maintenanceRun({
      data,
    });
  };

  const content = () => {
    switch (createType) {
      case ERPEnums.curing:
        return <>
          <Curing value={params} onChange={setParams} />
          <Condition noTime type={createType} paddingBottom={8} value={params} onChange={(value) => {
            setParams(value);
          }} />
        </>;
      case ERPEnums.stocktaking:
        return <>
          <Stocktaking value={params} onChange={setParams} />
          {state.condition ?
            <Condition noTime type={createType} paddingBottom={8} value={params} onChange={(value) => {
              setParams(value);
            }} />
            :
            <Skus
              skus={skus}
              createTypeData={createTypeData}
              setHiddenBottom={setHiddenBottom}
              judge={judge}
              skuList={skuList}
              countNumber={countNumber}
              dataChange={dataChange}
            />}
          <User title='参与人' id={params.participantsId} name={params.participantsName} onChange={(id, name) => {
            setParams({ ...params, participantsId: id, participantsName: name });
          }} />
        </>;
      case ERPEnums.outStock:
        return <>
          <Skus
            skus={skus}
            createTypeData={createTypeData}
            setHiddenBottom={setHiddenBottom}
            judge={judge}
            skuList={skuList}
            countNumber={countNumber}
            dataChange={dataChange}
          />
          <User title='领料负责人' id={params.userId} name={params.userName} onChange={(id, name) => {
            setParams({ ...params, userId: id, userName: name });
          }} />

        </>;
      default:
        return <>
          <Skus
            skus={skus}
            createTypeData={createTypeData}
            setHiddenBottom={setHiddenBottom}
            judge={judge}
            skuList={skuList}
            countNumber={countNumber}
            dataChange={dataChange}
          />
        </>;
    }
  };

  return <div style={{ marginBottom: 60 }}>
    <MyNavBar title={createTypeData().title} />
    {content()}

    <div className={style.careful}>
      <div className={style.title}>{createTypeData().careful} <span>*</span></div>
      <Careful
        type={createType}
        value={params.noticeIds}
        onChange={(noticeIds) => {
          setParams({ ...params, noticeIds });
        }}
      />
    </div>

    <div className={style.note}>
      <div className={style.title}>添加备注</div>
      <MyTextArea
        value={params.remark}
        className={style.textArea}
        onChange={(remark, userIds) => {
          setParams({ ...params, remark, userIds: userIds.map(item => item.userId) });
        }}
      />
    </div>

    <div className={style.file}>
      <div className={style.title}>上传附件</div>
      <div className={style.files}>
        <UploadFile
          onChange={(mediaIds) => {
            setParams({ ...params, mediaIds });
          }}
        />
      </div>

    </div>

    {!hiddenBottom && <BottomButton
      leftOnClick={() => {
        history.goBack();
      }}
      rightText='提交'
      rightDisabled={createTypeData().disabled}
      rightOnClick={() => {
        switch (createType) {
          case ERPEnums.outStock:
            const pickListsDetailParams = [];
            normalSku.map(item => {
              pickListsDetailParams.push(item);
              return null;
            });
            outStock({
              data: {
                source: 'outstock',
                pickListsDetailParams,
                enclosure: ToolUtil.isArray(params.mediaIds).toString(),
                remarks: ToolUtil.isArray(params.noticeIds).toString(),
                note: params.remark,
                userIds: ToolUtil.isArray(params.userIds).toString(),
                userId: params.userId,
              },
            });
            break;
          case ERPEnums.inStock:
          case ERPEnums.directInStock:
            if (judge) {
              return inStockRun(true);
            }
            inStockRun();
            break;
          case ERPEnums.stocktaking:
            stocktaskingAsk();
            break;
          case ERPEnums.curing:
            curingAsk();
            break;
          default:
            break;
        }
      }}
    />}

    {(instockLoading || outLoading || inventoryLoading || inventoryConditionLoading || maintenanceLoading) &&
    <MyLoading />}

  </div>;
};

export default InstockSkus;
