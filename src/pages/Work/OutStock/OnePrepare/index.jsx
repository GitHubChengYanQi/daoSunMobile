import React, { useImperativeHandle, useState } from 'react';
import { InfiniteScroll, Popup } from 'antd-mobile';
import { isArray, ToolUtil } from '../../../../util/ToolUtil';
import { useRequest } from '../../../../util/Request';
import MySearch from '../../../components/MySearch';
import Icon from '../../../components/Icon';
import { SkuResultSkuJsons } from '../../../Scan/Sku/components/SkuResult_skuJsons';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import OutSkuItem
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/OutSkuAction/compoennts/OutSkuItem';
import Viewpager
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/Viewpager';
import MyPositions from '../../../components/MyPositions';
import Prepare
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/Prepare';

export const checkCode = { url: '/productionPickLists/checkCode', method: 'GET' };
export const outDetailList = { url: '/productionPickListsDetail/noPageList', method: 'POST' };
export const mediaGetMediaUrls = { url: '/media/getMediaUrls', method: 'POST' };

const OnePrepare = (
  {
    action,
    pickListsId,
    taskId,
    positionIds,
    shopRef,
  }, ref) => {

  const format = (list = []) => {
    let countNumber = 0;
    const actions = [];
    const noAction = [];
    const other = [];

    list.map(item => {
      let perpareNumber = 0;
      ToolUtil.isArray(item.cartResults).map(item => perpareNumber += item.number);

      const received = Number(item.receivedNumber) || 0;
      const collectable = Number(perpareNumber) || 0;
      const notPrepared = Number(item.number - collectable - received) || 0;


      if (item.number > received) {
        if (item.number === (received + collectable) || !item.stockNumber) {
          if (notPrepared > 0) {
            other.push({ ...item, perpareNumber, received, collectable, notPrepared });
          } else {
            noAction.push({ ...item, perpareNumber, received, collectable, notPrepared });
          }
        } else {
          actions.push({ ...item, perpareNumber, received, collectable, notPrepared, action: true });
        }
      }
      return countNumber += (item.number || 0);
    });
    return {
      countNumber,
      array: [
        ...actions,
        ...other.sort((a, b) => {
          return a.notPrepared - b.notPrepared;
        }),
        ...noAction,
      ],
    };
  };

  const [data, setData] = useState([]);

  const [showCount, setShowCount] = useState(0);

  const [hasMore, setHasMore] = useState(true);

  const [defaultData, setDefaultData] = useState([]);

  const [params, setParams] = useState({ pickListsId });

  const { run: getMediaUrls } = useRequest(mediaGetMediaUrls, { manual: true });

  const getImgs = async (startIndex, count, skus) => {
    const skuMediaIds = skus.filter((item, index) => index >= startIndex && index < startIndex + count);
    const urls = await getMediaUrls({
      data: {
        mediaIds: skuMediaIds.map(item => item.skuResult?.images?.split(',')[0]),
        option: 'image/resize,m_fill,h_74,w_74',
      },
    });
    const newDefaultData = skus.map((item, index) => {
      if (index >= startIndex && index < (startIndex + count) && item.skuResult?.images?.split(',')[0]) {
        const media = isArray(urls).find(urlItem => urlItem.mediaId === item.skuResult?.images?.split(',')[0]);
        return {
          ...item,
          imgUrl: media && media.thumbUrl,
        };
      }
      return item;
    });
    setDefaultData(newDefaultData);
  };

  const { loading, run: getOutDetail } = useRequest({
    ...outDetailList,
    data: params,
  }, {
    onSuccess: (res) => {
      const { array } = format(ToolUtil.isArray(res));
      setShowCount(10);
      setDefaultData(array);
      getImgs(0, 20, array);
    },
  });

  const [visible, setVisible] = useState();

  const [positionVisible, setPositionVisible] = useState();

  const [seacrchValue, setSearchValue] = useState();

  const refresh = (returnSkus) => {
    const newData = defaultData.map((item) => {
      const sku = isArray(returnSkus).find(returnSku => returnSku.pickListsDetailId === item.pickListsDetailId);
      if (sku) {
        const received = Number(item.receivedNumber) || 0;
        const collectable = item.collectable - sku.number;
        const notPrepared = item.notPrepared + sku.number;
        const action = !(item.number === (received + collectable) || !item.stockNumber);
        return {
          ...item,
          action,
          perpareNumber: item.number - notPrepared - received - collectable,
          notPrepared,
          collectable,
        };
      } else {
        return item;
      }
    });
    setDefaultData(newData);
  };

  useImperativeHandle(ref, () => ({
    refresh,
  }));

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (defaultData.length === 0) {
    return <MyEmpty description={`物料全部出库完成`} image={<Icon style={{ fontSize: 45 }} type='icon-chukuchenggong' />} />;
  }

  return <div style={{ backgroundColor: '#fff', padding: '12px 0' }}>
    <MySearch
      extraIcon={<Icon
        style={{ fontSize: 20 }}
        type='icon-pandiankuwei1'
        onClick={() => {
          setPositionVisible(true);
        }} />}
      placeholder='请输入物料名称查询'
      style={{ padding: '8px 12px' }}
      onChange={(value) => {
        const newData = defaultData.filter(item => {

        });
        setData(newData);
        setSearchValue(value);
      }}
      value={seacrchValue}
    />

    {
      defaultData.filter((item, index) => {
        const itemSku = item.skuResult || {};
        const skuResult = {
          spuResult: {
            name: itemSku.spuName,
          },
          skuName: itemSku.skuName,
          specifications: itemSku.specifications,
          imgResults: item.imgUrl ? [{ thumbUrl: item.imgUrl }] : [],
        };
        const sku = SkuResultSkuJsons({ skuResult }) || '';
        return index < showCount && ToolUtil.queryString(seacrchValue, sku);
      }).map((item, index) => {
        const sku = item.skuResult || {};
        const skuResult = {
          spuResult: {
            name: sku.spuName,
          },
          skuName: sku.skuName,
          specifications: sku.specifications,
          imgResults: item.imgUrl ? [{ thumbUrl: item.imgUrl }] : [],
        };
        if (!action || !item.action) {
          return <OutSkuItem
            item={{ ...item, skuResult }}
            index={index}
            dataLength={data.length - 1}
            key={index}
          />;
        }

        return <div key={index}>
          <Viewpager
            currentIndex={index}
            onLeft={() => {
              setVisible(item);
            }}
            onRight={() => {
              setVisible(item);
            }}
          >
            <OutSkuItem
              item={{ ...item, skuResult }}
              index={index}
              dataLength={data.length - 1}
              key={index}
            />
          </Viewpager>
        </div>;
      })
    }

    <InfiniteScroll loadMore={() => {
      const newData = defaultData.filter((item, index) => index >= (showCount + 10) && index < (showCount + 20));
      setShowCount(showCount + 10);
      setHasMore(newData.length === 10);
      getImgs(showCount + 10, 10, defaultData);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 2000);
      });

    }} hasMore={hasMore} />

    <Popup
      getContainer={null}
      onMaskClick={() => setVisible(false)}
      visible={visible}
      destroyOnClose
    >
      <Prepare
        taskId={taskId}
        id={pickListsId}
        skuItem={visible}
        dimension='order'
        onSuccess={(detail) => {
          shopRef.current.jump(() => {
            const newData = defaultData.map((item) => {
              if (item.pickListsDetailId === detail.pickListsDetailId) {
                const received = Number(item.receivedNumber) || 0;
                const collectable = item.collectable + detail.number;
                const notPrepared = item.notPrepared - detail.number;
                const action = !(item.number === (received + collectable) || !item.stockNumber);
                return {
                  ...item,
                  action,
                  perpareNumber: collectable,
                  notPrepared,
                  collectable,
                };
              } else {
                return item;
              }
            });
            setDefaultData(newData);
          });
        }}
        onClose={() => {
          setVisible(false);
        }}
      />
    </Popup>

    <MyPositions
      title='相关库位'
      showPositionIds={positionIds}
      showAll
      empty
      visible={positionVisible}
      single
      autoFocus
      value={params.positionId ? [{ id: params.positionId }] : []}
      onClose={() => setPositionVisible(false)}
      onSuccess={(value = []) => {
        const positions = value[0] || {};
        setParams({ ...params, positionId: positions.id });
        getOutDetail({ data: { ...params, storehousePositionsId: positions.id } });
        setPositionVisible(false);
      }} />

  </div>;
};

export default React.forwardRef(OnePrepare);
