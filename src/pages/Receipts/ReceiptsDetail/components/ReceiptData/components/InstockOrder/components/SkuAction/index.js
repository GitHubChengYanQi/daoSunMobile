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
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import MyCard from '../../../../../../../../components/MyCard';
import Title from '../../../../../../../../components/Title';
import LinkButton from '../../../../../../../../components/LinkButton';
import Details from './components/Details';
import MyAntPopup from '../../../../../../../../components/MyAntPopup';

export const instockHandle = { url: '/instockHandle/listByInstockOrderId', method: 'GET' };

const SkuAction = (
  {
    loading,
    actionId,
    data = [],
    action,
    instockOrderId,
    refresh = () => {
    },
    order,
  },
) => {

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

  const waitShopRef = useRef();
  const errorShopRef = useRef();

  data.map((item) => {
    if (item.status === 0) {
      noAction.push(item);
    } else {
      actions.push(item);
    }
    return null;
  });

  const items = [...noAction, ...actions].map(item => {
    return {
      ...item,
      number: item.realNumber,
      askNumber: item.number,
    };
  });

  const [allSku, { toggle }] = useBoolean();

  let countNumber = 0;
  items.forEach(item => countNumber += item.number);

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
        number: item.number,
        formId: item.instockListId,
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
        <Title>申请明细</Title>
        <LinkButton style={{ marginLeft: 12 }} onClick={() => {
          setShowDetail(true);
        }}>入库详情</LinkButton>
      </div>}
      className={style.cardStyle}
      headerClassName={style.headerStyle}
      bodyClassName={ToolUtil.classNames(style.bodyStyle)}
      extra={<div className={style.extra}>
        合计：<span>{items.length}</span>类<span>{countNumber}</span>件
      </div>}>
      <MyLoading noLoadingTitle title='正在刷新数据，请稍后...' loading={loading}>
        {items.length === 0 && <MyEmpty description={`已全部操作完毕`} />}
        {
          items.map((item, index) => {

            if (!allSku && index >= 3) {
              return null;
            }

            if (!action || item.status !== 0) {
              return <InSkuItem
                index={index}
                item={item}
                dataLength={(items.length > 3 && !allSku) ? 2 : items.length - 1}
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
                  setVisible(item);
                }}
              >
                <InSkuItem
                  index={index}
                  item={item}
                  dataLength={(items.length > 3 && !allSku) ? 2 : items.length - 1}
                  key={index}
                />
              </Viewpager>
            </div>;
          })
        }
        {items.length > 3 && <Divider className={style.allSku}>
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
      title='入库详情'
      onClose={() => {
        setShowDetail(false);
      }}
      visible={showDetail}
      destroyOnClose
    >
      <Details
        instockOrderId={instockOrderId}
      />
    </MyAntPopup>


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
