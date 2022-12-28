import React, { useEffect, useRef, useState } from 'react';
import SkuShop from '../../../AddShop/components/SkuShop';
import MySearch from '../../../../components/MySearch';
import MyNavBar from '../../../../components/MyNavBar';
import MyList from '../../../../components/MyList';
import SkuItem from '../../../Sku/SkuItem';
import styles from './index.less';
import { Button, Input } from 'antd-mobile';
import MyAntPopup from '../../../../components/MyAntPopup';
import BottomButton from '../../../../components/BottomButton';
import Label from '../../../../components/Label';
import ShopNumber from '../../../AddShop/components/ShopNumber';
import { isArray, ToolUtil } from '../../../../../util/ToolUtil';
import { useModel } from 'umi';
import LinkButton from '../../../../components/LinkButton';
import MyEllipsis from '../../../../components/MyEllipsis';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import MyCard from '../../../../components/MyCard';
import BomVersions from './components/BomVersions';
import History from './components/History';

export const partsList = {
  url: '/parts/list',
  method: 'POST',
  rowKey: 'partsId',
};


export const bomsByskuId = {
  url: '/parts/bomsByskuId',
  method: 'GET',
};

const SelectBom = (
  {
    onClose = () => {
    },
    onSubmit = () => {
    },
  }) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};

  const [skus, setSkus] = useState([]);

  const shopRef = useRef();

  const [list, setList] = useState([]);

  const [open, setOpen] = useState();

  const [bomVersions, setBomVersions] = useState([]);

  const [openHistory, setOpenHistory] = useState();

  const addAfter = (boms) => {
    shopRef.current.jump(() => {
      setSkus([...skus, ...boms]);
    }, null);
  };

  const createBall = (top, left, { boms, skuResult }) => {

    const imgResults = ToolUtil.isArray(skuResult.imgResults)[0] || {};
    const imgUrl = imgResults.thumbUrl || state.imgLogo;

    const shop = document.getElementById('shop');

    if (!shop) {
      addAfter(boms);
      return;
    }
    let i = 0;

    const bar = document.createElement('div');

    bar.style.backgroundImage = `url(${imgUrl})`;
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
      if (i === 2) {
        addAfter(boms);
      }

    };
  };

  const addShopBall = ({ boms, skuResult }) => {
    const skuImg = document.getElementById('skuImg');
    if (skuImg) {
      const top = skuImg.getBoundingClientRect().top;
      const left = skuImg.getBoundingClientRect().left;
      createBall(top, left, { boms, skuResult });
    } else {
      addAfter(boms);
    }
  };


  const { loading: bomsByskuIdLoading, run: bomsByskuIdRun } = useRequest(bomsByskuId, { manual: true });

  useEffect(() => {
    ToolUtil.back({
      key: 'popup',
      onBack: onClose,
    });
  }, []);

  return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <MyNavBar title='选择产品信息' />
    <MyCard
      title='历史信息'
      extra={<LinkButton onClick={() => setOpenHistory(true)}>查看</LinkButton>}
    />
    <div className={styles.space} />
    <MySearch />
    <div style={{ flexGrow: 1, overflow: 'auto' }}>
      <MyList api={partsList} getData={setList} data={list}>
        {
          list.map((item, index) => {
            return <div key={index} className={styles.skuItem}>
              <SkuItem
                skuResult={item.skuResult}
                className={styles.sku}
                otherData={[
                  item.name,
                ]}
              />
              <Button
                color='primary'
                fill='outline'
                onClick={async () => {
                  const boms = await bomsByskuIdRun({ params: { skuId: item.skuId } });
                  setBomVersions(boms);
                  setOpen(item);
                }}
              >
                添加
              </Button>
            </div>;
          })
        }
      </MyList>
    </div>

    {bomsByskuIdLoading && <MyLoading />}

    <SkuShop
      onSubmit={onSubmit}
      buttonWidth={100}
      noRequest
      shopRef={shopRef}
      skus={skus}
      setSkus={setSkus}
      type='bom'
      onClear={() => {
        setSkus([]);
      }}
    />

    <BomVersions
      setBomVersions={setBomVersions}
      open={open}
      bomVersions={bomVersions}
      addShopBall={addShopBall}
      setOpen={setOpen}
    />

    <MyAntPopup zIndex={1002} title='历史信息' visible={openHistory} onClose={() => setOpenHistory(false)}>
      <History />
    </MyAntPopup>

  </div>;
};

export default SelectBom;
