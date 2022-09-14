import React, { useImperativeHandle, useState } from 'react';
import style from './index.less';
import { useModel } from 'umi';
import { useLocation } from 'react-router-dom';
import Add from './components/Add';
import MyAntPopup from '../../../../../../../components/MyAntPopup';
import { ERPEnums } from '../../../../../../Stock/ERPEnums';
import AllocationAdd from './components/AllocationAdd';
import { useRequest } from '../../../../../../../../util/Request';
import { shopCartAdd, shopCartEdit } from '../../../../../Url';
import { MyLoading } from '../../../../../../../components/MyLoading';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import { SkuResultSkuJsons } from '../../../../../../../Scan/Sku/components/SkuResult_skuJsons';

const AddSku = (
  {
    onChange = () => {
    },
    type: defaultType,
    skus = [],
    onClose = () => {
    },
    defaultAction,
    setSkus = () => {
    },
  }, ref) => {

  const [type, setType] = useState(defaultType);

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};

  const { query } = useLocation();

  const [sku, setSku] = useState({});

  const [other, setOther] = useState({});

  const [visible, setVisible] = useState();

  const close = () => {
    setVisible(false);
    onClose();
    setOver(false);
  };

  const [data, setData] = useState({});
  const skuResult = data.skuResult || {};
  const imgResults = ToolUtil.isArray(skuResult.imgResults)[0] || {};
  const imgUrl = imgResults.thumbUrl;

  const [title, setTitle] = useState();

  const [over, setOver] = useState(false);

  const [oneAdd, setOneAdd] = useState();

  const createBall = (top, left, cartId, newData = {}, type) => {

    const shop = document.getElementById('shop');

    if (!shop) {
      onChange({ ...newData, cartId }, type);
      return;
    }
    let i = 0;

    const bar = document.createElement('div');

    bar.style.backgroundImage = `url(${newData.imgUrl})`;
    bar.style.backgroundColor = '#e1e1e1';
    bar.style.backgroundSize = 'cover';
    bar.style.border = 'solid #F1F1F1 1px';
    bar.style.borderRadius = '4px';
    bar.style.zIndex = '1001';
    bar.style.position = 'fixed';
    bar.style.display = 'block';
    bar.style.left = left + 'px';
    bar.style.top = top + 'px';
    bar.style.width = '50px';
    bar.style.height = '50px';
    bar.style.transition = 'left .6s linear, top .6s cubic-bezier(0.5, -0.5, 1, 1)';

    document.body.appendChild(bar);
    // 添加动画属性
    setTimeout(() => {
      bar.style.left = (shop.offsetLeft + 36) + 'px';
      bar.style.top = (shop.offsetTop) + 'px';
    }, 0);

    /**
     * 动画结束后，删除
     */
    bar.ontransitionend = () => {
      bar.remove();
      i++;
      if (i === 2 && cartId) {
        onChange({ ...newData, cartId }, type);
      }

    };
  };

  const addShopBall = (cartId) => {
    const skuImg = document.getElementById(data.imgId || 'skuImg');
    if (skuImg) {
      const top = skuImg.getBoundingClientRect().top;
      const left = skuImg.getBoundingClientRect().left;
      close();
      createBall(top, left, cartId, data, type);
    } else {
      onChange({ ...data, cartId }, type);
    }
  };

  const getParams = () => {
    const positionNums = [];
    if (type === ERPEnums.allocation) {
      positionNums.push({
        positionId: ToolUtil.isObject(data.outPosition).id,
        toPositionId: ToolUtil.isObject(data.inPosition).id,
        storehouseId: query.storeHouseId,
      });
    } else {
      ToolUtil.isArray(data.positions).map(item => {
        if (item.number) {
          return positionNums.push({ positionId: item.id, num: item.number });
        }
        return null;
      });
    }

    return {
      type,
      skuId: data.skuId,
      brandId: data.brandId,
      customerId: data.customerId,
      number: data.number,
      storehousePositionsId: data.positionId,
      positionNums,
      storehouseId: data.storehouseId,
    };
  };

  const { loading: addLoading, run: addShop } = useRequest(shopCartAdd, {
    manual: true,
    onSuccess: (res) => {
      addShopBall(res);
    },
  });

  const { loading: editloading, run: shopEdit } = useRequest(shopCartEdit, {
    manual: true,
    onSuccess: (res) => {
      const newSkus = skus.map(item => {
        if (item.cartId === res) {
          return { ...item, ...getParams() };
        }
        return item;
      });
      setSkus(newSkus);
      addShopBall();
      close();
    },
  });

  const openSkuAdd = async (sku = {}, initType, other = {}) => {
    const type = initType || defaultType;
    setType(type);
    setSku(sku);
    setOther(other);
    const imgUrl = Array.isArray(sku.imgUrls) && sku.imgUrls[0] || state.homeLogo;
    const newData = {
      imgUrl,
      imgId: sku.imgId,
      skuId: sku.skuId,
      skuResult: sku,
    };
    setData(newData);
    switch (type) {
      case ERPEnums.allocation:
        setTitle(query.storeHouse + (query.askType === 'moveLibrary' ? '移库' : (query.allocationType === 'out' ? '调出' : '调入')));
        setOneAdd(false);
        break;
      case ERPEnums.outStock:
        setTitle('添加出库物料');
        setOneAdd(true);
        break;
      case ERPEnums.inStock:
      case ERPEnums.directInStock:
        setTitle('添加入库物料');
        setOneAdd(true);
        break;
      default:
        break;
    }
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({
    openSkuAdd,
  }));

  return <>
    <MyAntPopup
      title={over ? <div className={style.skuShow} style={{ boxShadow: over && '0 4px 5px 0 rgb(0 0 0 / 10%)' }}>
        <img src={imgUrl || state.imgLogo} width='30' height='30' alt='' />
        {SkuResultSkuJsons({ skuResult, spu: true })} / {SkuResultSkuJsons({ skuResult, sku: true })}
      </div> : title}
      onClose={() => {
        close(false);
      }}
      destroyOnClose
      className={style.addSkuPopup}
      visible={visible}
    >
      {visible && <>
        {oneAdd ? <Add
          params={getParams()}
          addShop={addShop}
          shopEdit={shopEdit}
          setData={setData}
          data={data}
          onChange={onChange}
          skus={skus}
          other={other}
          type={type}
          query={query}
          state={state}
          defaultAction={defaultAction}
          sku={sku}
          onClose={() => {
            close(false);
          }}
        /> : <AllocationAdd
          setOver={setOver}
          query={query}
          sku={sku}
          onClose={() => {
            close(false);
          }}
          addShop={(data) => {
            addShop({ data: { ...data, type } });
          }}
        />}
      </>}

    </MyAntPopup>

    {(addLoading || editloading) && <MyLoading />}
  </>;
};

export default React.forwardRef(AddSku);
