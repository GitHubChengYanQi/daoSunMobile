import React, { useRef, useState } from 'react';
import { Divider, PageIndicator, Swiper } from 'antd-mobile';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import Data from '../../../../../../../../Work/Allocation/SelectStoreHouse/components/Data';
import style from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import AllocationSkuItem from '../AllocationSkuItem';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import MyCard from '../../../../../../../../components/MyCard';
import { useBoolean } from 'ahooks';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { PositionShow } from '../PositionShow';
import LinkButton from '../../../../../../../../components/LinkButton';
import BottomButton from '../../../../../../../../components/BottomButton';
import { useRequest } from '../../../../../../../../../util/Request';
import { Message } from '../../../../../../../../components/Message';
import { MyLoading } from '../../../../../../../../components/MyLoading';

export const transferInStorehouse = { url: '/allocation/transferInStorehouse', method: 'POST' };

const Detail = (
  {
    carts = [],
    out,
    hopeList = [],
    askList = [],
    carryAllocation,
    skus = [],
    inLibraryList = [],
    noDistributionList = [],
    total,
    refresh = () => {
    },
  },
) => {

  const [key, setKey] = useState(0);

  const [allSku, { toggle }] = useBoolean();

  const swiperRef = useRef();

  const { loading, run } = useRequest(transferInStorehouse, {
    manual: true,
    onSuccess: () => {
      Message.successToast('调拨成功！', () => {
        refresh();
      });
    },
  });

  const askData = (array = []) => {
    return <div className={style.details}>
      {array.length === 0 && <MyEmpty />}
      {
        array.map((item, index) => {
          return <AllocationSkuItem item={item} key={index} />;
        })
      }
    </div>;
  };

  const inLibraryListData = () => {
    return <div className={style.details}>
      {inLibraryList.length === 0 && <MyEmpty />}
      {
        inLibraryList.map((item, index) => {
          return <div key={index} className={style.skuItem}>
            <SkuItem
              className={style.item}
              skuResult={item.skuResult}
              extraWidth='124px'
              otherData={[
                item.brandName,
                <PositionShow inPositionName={item.positionName} outPositionName={item.toPositionName} />,
              ]}
            />
            <div className={style.inLibrary}>
              <LinkButton onClick={() => {
                const oneCart = carts.filter(cartItem => {
                  return cartItem.skuId === item.skuId &&
                    cartItem.brandId === item.brandId &&
                    cartItem.storehousePositionsId === item.posiId &&
                    cartItem.storehouseId === item.storehouseId &&
                    cartItem.type === 'carry';
                });
                if (oneCart.length === 1) {
                  run({
                    data: {
                      skuId: item.skuId,
                      brandId: item.brandId,
                      storehousePositionsId: item.positionId,
                      toStorehousePositionsId: item.toPositionId,
                    },
                  });
                } else {
                  Message.errorToast('调拨失败！');
                }

              }}>调拨</LinkButton>
              <ShopNumber show value={item.number} />
            </div>

          </div>;
        })
      }
    </div>;
  };

  const tabItems = [
    { key: 'inLibrary', title: '库内调拨' },
    { key: 'outData', title: '调出明细' },
    { key: 'inData', title: '调入明细' },
    { key: 'noDistribution', title: '未分配' },
  ];

  const swiperItem = () => {
    switch (key) {
      case 0:
        return inLibraryListData();
      case 1:
        return out ? askData(askList) : <Data show noLink storeHouses={hopeList} />;
      case 2:
        return out ? <Data show noLink storeHouses={hopeList} /> : askData(askList);
      case 3:
        return askData(noDistributionList);
      default:
        return <MyEmpty />;
    }
  };

  const content = () => {
    if (carryAllocation) {
      return <Swiper
        direction='horizontal'
        loop
        indicator={() => null}
        ref={swiperRef}
        defaultIndex={key}
        onIndexChange={index => {
          setKey(index);
        }}
      >
        {
          tabItems.map((item, index) => {
            return <Swiper.Item key={index}>
              {swiperItem()}
            </Swiper.Item>;
          })
        }
      </Swiper>;
    } else {
      return <>
        {
          skus.map((item, index) => {

            if (!allSku && index >= 3) {
              return null;
            }

            return <AllocationSkuItem
              item={item}
              key={index}
              out={out}
            />;
          })
        }
        {skus.length > 3 && <Divider className={style.allSku}>
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
      </>;
    }
  };

  return <>

    <MyCard
      title={<>{carryAllocation ? tabItems[key].title : '任务明细'}
        {carryAllocation && <PageIndicator
          style={{ marginLeft: 16 }}
          total={4}
          current={key}
        />}
      </>}
      className={style.cardStyle}
      headerClassName={style.headerStyle}
      bodyClassName={style.bodyStyle}
      extra={<div className={style.extra}>
        合计：<span className='numberBlue'>{skus.length}</span>类
        <span className='numberBlue' hidden={!total}>{total}</span>件
      </div>}>
      {content()}
    </MyCard>

    {key === 3 && noDistributionList.length > 0 && <BottomButton
      leftDisabled
      leftText='转成需求'
      rightText='继续分配'
      rightOnClick={() => {

      }}
    />}

    {loading && <MyLoading />}
  </>;
};

export default Detail;