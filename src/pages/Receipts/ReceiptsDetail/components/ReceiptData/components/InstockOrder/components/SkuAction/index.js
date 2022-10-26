import React, { useRef, useState } from 'react';
import { Divider, Popup } from 'antd-mobile';
import Viewpager from '../Viewpager';
import style from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import InstockShop from '../InstockShop';
import { useRequest } from '../../../../../../../../../util/Request';
import { shopCartAdd } from '../../../../../../../../Work/Instock/Url';
import Error from '../Error';
import InSkuItem from './components/InSkuItem';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { ReceiptsEnums } from '../../../../../../../index';
import { useModel } from 'umi';
import { isArray, isObject, ToolUtil } from '../../../../../../../../components/ToolUtil';
import MyCard from '../../../../../../../../components/MyCard';
import Title from '../../../../../../../../components/Title';
import LinkButton from '../../../../../../../../components/LinkButton';
import MyAntPopup from '../../../../../../../../components/MyAntPopup';
import { SkuResultSkuJsons } from '../../../../../../../../Scan/Sku/components/SkuResult_skuJsons';
import MySearch from '../../../../../../../../components/MySearch';
import ActionButtons from '../../../../../ActionButtons';
import { useHistory } from 'react-router-dom';
import { InStockRevoke } from '../../../../../Bottom/components/Revoke';

export const instockHandle = { url: '/instockHandle/listByInstockOrderId', method: 'GET' };

const SkuAction = (
  {
    actionNode,
    taskId,
    logIds = [],
    handleResults = [],
    permissions,
    loading,
    actionId,
    data = [],
    action,
    instockOrderId,
    refresh = () => {
    },
    afertShow = () => {
    },
    taskDetail,
    order,
  },
) => {

  const history = useHistory();

  let orderInfo = order || {};

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};

  const { loading: addShopLoading, run: addShop } = useRequest(shopCartAdd, {
    manual: true,
    onError: () => {
      refresh();
    },
  });

  const [visible, setVisible] = useState();

  const [showDetail, setShowDetail] = useState();

  const actions = [];
  const noAction = [];
  const wait = [];
  const error = [];

  const waitShopRef = useRef();
  const errorShopRef = useRef();

  let countNumber = 0;

  data.forEach((item) => {
    countNumber += item.number;
    if (item.realNumber === 0 && item.status !== 0) {
      return;
    }
    if (item.status === 0) {
      actions.push(item);
    } else if (item.status === -1 || item.status === 50) {
      error.push(item);
    } else if (item.status === 1) {
      wait.push(item);
    } else {
      noAction.push(item);
    }
  });

  handleResults.forEach((item) => {
    switch (item.type) {
      case 'inStock':
        noAction.push({ ...item, handle: true });
        break;
      case 'ErrorCanInstock':
      case 'ErrorStopInstock':
      case 'ErrorNumber':
        error.push({ ...item, handle: true });
        break;
      default:
        break;
    }
  });

  const details = [...actions, ...error, ...wait, ...noAction];

  const [seacrchValue, setSearchValue] = useState();

  const [filterData, setFilterData] = useState([]);

  const inStockDetails = seacrchValue ? filterData : details;

  const [allSku, { toggle }] = useBoolean();

  const addShopCart = (
    imgUrl,
    imgId,
    transitionEnd = () => {
    },
    transitionStart = () => {
    },
  ) => {

    const skuImg = document.getElementById(imgId);
    if (!skuImg) {
      return;
    }
    const top = skuImg.getBoundingClientRect().top;
    const left = skuImg.getBoundingClientRect().left;
    ToolUtil.createBall({
      top,
      left,
      imgUrl,
      transitionEnd,
      transitionStart,
      getNodePosition: () => {
        const waitInstock = document.getElementById('waitInstock');
        const parent = waitInstock.offsetParent;
        const translates = document.defaultView.getComputedStyle(parent, null).transform;
        let translateX = parseFloat(translates.substring(6).split(',')[4]);
        let tanslateY = parseFloat(translates.substring(6).split(',')[5]);
        return {
          top: parent.offsetTop + tanslateY,
          left: parent.offsetLeft + translateX,
        };
      },
    });
  };

  const addInstockShop = (formStatus, item, index, type) => {
    const skuResult = item.skuResult || {};
    const imgUrl = ToolUtil.isArray(skuResult.imgThumbUrls || skuResult.imgUrls)[0] || state.homeLogo;
    addShop({
      data: {
        formStatus,
        type,
        instockListId: item.instockListId,
        skuId: item.skuId,
        customerId: item.customerId,
        brandId: item.brandId,
        number: item.realNumber,
        formId: item.instockListId,
        storehouseId: item.storeHouseId,
      },
    }).then(() => {
      addShopCart(imgUrl, `skuImg${index}`, () => {
        waitShopRef.current.jump(() => {
          orderInfo = { ...orderInfo, waitInStockNum: orderInfo.waitInStockNum + 1 };
          refresh();
        });
        // itemChange({ status: 1 }, item.instockListId);
      });
    });
  };

  const [refreshOrder, setRefreshOrder] = useState();

  return <div style={{ backgroundColor: '#fff' }}>
    <MyCard
      titleBom={<div className={style.header}>
        <Title>入库明细</Title>
        <LinkButton style={{ marginLeft: 12 }} onClick={() => {
          setShowDetail(true);
        }}>申请明细</LinkButton>
      </div>}
      className={style.cardStyle}
      headerClassName={style.headerStyle}
      bodyClassName={ToolUtil.classNames(style.bodyStyle)}
      extra={<div className={style.extra}>
        合计：<span>{data.length}</span>类<span>{countNumber}</span>件
      </div>}>
      <MySearch
        placeholder='请输入物料名称查询'
        style={{ padding: '8px 12px' }}
        onClear={() => setFilterData([])}
        onChange={(value) => {
          const newData = details.filter(item => {
            const sku = SkuResultSkuJsons({ skuResult: item.skuResult }) || '';
            return ToolUtil.queryString(value, sku);
          });
          setFilterData(newData);
          setSearchValue(value);
        }}
        value={seacrchValue}
      />
      <MyLoading noLoadingTitle title='正在刷新数据，请稍后...' loading={loading}>
        {inStockDetails.length === 0 && <MyEmpty description={`已全部操作完毕`} />}
        {
          inStockDetails.map((item, index) => {

            if (!allSku && index >= 3) {
              return null;
            }

            if (!action || item.status !== 0 || item.instockHandleId) {
              return <InSkuItem
                ask
                detail={item.handle}
                index={index}
                item={item}
                dataLength={(inStockDetails.length > 3 && !allSku) ? 2 : inStockDetails.length - 1}
                key={index}
              />;
            }

            return <div key={index}>
              <Viewpager
                currentIndex={index}
                onLeft={() => {
                  addInstockShop(1, item, index, 'waitInStock');
                }}
                onRight={() => {
                  setVisible({ ...item, number: item.realNumber });
                }}
              >
                <InSkuItem
                  ask
                  index={index}
                  item={item}
                  dataLength={(inStockDetails.length > 3 && !allSku) ? 2 : inStockDetails.length - 1}
                  key={index}
                />
              </Viewpager>
            </div>;
          })
        }
        {inStockDetails.length > 3 && <Divider className={style.allSku}>
          <div onClick={() => {
            toggle();
          }}>
            {
              allSku ?
                <UpOutline />
                :
                <DownOutline />
            }
          </div>
        </Divider>}
      </MyLoading>

    </MyCard>

    <Popup
      onMaskClick={() => {
        if (refreshOrder) {
          setRefreshOrder(false);
          refresh();
        }
        setVisible(false);
      }}
      visible={visible}
      destroyOnClose
    >
      <Error
        errorShopRef={errorShopRef}
        type={ReceiptsEnums.instockOrder}
        skuItem={visible}
        onClose={() => {
          if (refreshOrder) {
            setRefreshOrder(false);
            refresh();
          }
          setVisible(false);
        }}
        onHidden={() => setVisible(false)}
        refreshOrder={() => setRefreshOrder(true)}
        onSuccess={() => {
          refresh();
          setVisible(false);
        }}
      />
    </Popup>

    <MyAntPopup
      title='入库申请'
      onClose={() => {
        setShowDetail(false);
      }}
      visible={showDetail}
      destroyOnClose
    >
      <div style={{ maxHeight: '80vh', overflow: 'auto', padding: 12 }}>
        {data.map((item, index) => {
          return <div key={index}>
            <InSkuItem item={item} key={index} />
          </div>;
        })}
      </div>
    </MyAntPopup>

    {actionNode && <ActionButtons
      taskDetail={taskDetail}
      statusName={order.statusName}
      refresh={refresh}
      afertShow={afertShow}
      taskId={taskId}
      logIds={logIds}
      createUser={order.createUser}
      permissions={permissions}
      // actions={nodeActions.filter((item) => item.action !== 'performInstock')}
      onClick={(value) => {
        switch (value) {
          case 'revokeAndAsk':
            InStockRevoke(taskDetail);
            break;
          default:
            break;
        }
      }}
    />}

    {action && <InstockShop
      errorShopRef={errorShopRef}
      order={order}
      actionId={actionId}
      id={instockOrderId}
      refresh={refresh}
      waitShopRef={waitShopRef}
    />}

    {(addShopLoading) && <MyLoading />}

  </div>;
};

export default SkuAction;
