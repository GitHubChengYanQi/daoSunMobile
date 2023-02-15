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

  const [hasMore, setHasMore] = useState(false);

  const [defaultData, setDefaultData] = useState([]);

  const [params, setParams] = useState({ pickListsId });

  const [seacrchValue, setSearchValue] = useState();

  const { run: getMediaUrls } = useRequest(mediaGetMediaUrls, { manual: true });

  const getImgs = async (startIndex, count, skus) => {
    const skuMediaIds = skus.filter((item, index) => index >= startIndex && index < startIndex + count);
    const urls = await getMediaUrls({
      data: {
        mediaIds: skuMediaIds.map(item => item.skuResult?.images?.split(',')[0]),
        option: 'image/resize,m_fill,h_74,w_74',
      },
    });
    const newData = skus.map((item, index) => {
      if (index >= startIndex && index < (startIndex + count) && item.skuResult?.images?.split(',')[0]) {
        const media = isArray(urls).find(urlItem => urlItem.mediaId === item.skuResult?.images?.split(',')[0]);
        return {
          ...item,
          imgUrl: media && media.thumbUrl,
        };
      }
      return item;
    });
    setData(newData);
  };

  const searchSkuName = (value, item) => {
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
    return ToolUtil.queryString(value, sku);
  };

  const { loading, run: getOutDetail } = useRequest({
    ...outDetailList,
    data: params,
  }, {
    onSuccess: (res) => {
      const { array } = format(ToolUtil.isArray(res));
      setShowCount(10);
      const newData = array.filter(item => {
        return searchSkuName(seacrchValue, item);
      });
      setData(newData);
      setDefaultData(array);
      getImgs(0, 20, array);
      setHasMore(newData.length > 10);
    },
  });

  const [visible, setVisible] = useState();

  const [positionVisible, setPositionVisible] = useState();

  const refresh = (returnSkus) => {
    const format = (item) => {
      let number = 0;
      const skus = isArray(returnSkus).filter(returnSku => {
        const equal = returnSku.pickListsDetailId === item.pickListsDetailId;
        if (equal) {
          number += returnSku.number;
        }
        return equal;
      });
      if (skus.length > 0) {
        const received = Number(item.receivedNumber) || 0;
        const collectable = item.collectable - number;
        const notPrepared = item.notPrepared + number;
        const stockNumber = item.stockNumber + number;
        const action = !(item.number === (received + collectable) || !(stockNumber));
        return {
          ...item,
          action,
          stockNumber,
          perpareNumber: collectable,
          notPrepared,
          collectable,
        };
      } else {
        return item;
      }
    };
    const newData = data.map(format);
    const newDefaultData = defaultData.map(format);
    setData(newData);
    setDefaultData(newDefaultData);
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
        setSearchValue(value);
      }}
      onSearch={(value) => {
        const newData = defaultData.filter(item => {
          return searchSkuName(value, item);
        });
        setData(newData);
        setShowCount(10);
        getImgs(0, 20, newData);
        setHasMore(newData.length > 10);
      }}
      value={seacrchValue}
    />

    {
      data.filter((item, index) => {
        return index < showCount;
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
      const newData = data.filter((item, index) => index >= (showCount + 10) && index < (showCount + 20));
      setShowCount(showCount + 10);
      setHasMore(newData.length === 10);
      getImgs(showCount + 10, 10, data);
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
          const format = (item) => {
            if (item.pickListsDetailId === detail.pickListsDetailId) {
              const received = Number(item.receivedNumber) || 0;
              const collectable = item.collectable + detail.number;
              const notPrepared = item.notPrepared - detail.number;
              const stockNumber = item.stockNumber - detail.number;
              const action = !(item.number === (received + collectable) || !(stockNumber));
              return {
                ...item,
                action,
                stockNumber,
                perpareNumber: collectable,
                notPrepared,
                collectable,
              };
            } else {
              return item;
            }
          };
          shopRef.current.jump(() => {
            const newDefaultData = defaultData.map(format);
            const newData = data.map(format);
            setDefaultData(newDefaultData);
            setData(newData);
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
