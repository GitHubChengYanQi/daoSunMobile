import React, { useEffect, useRef, useState } from 'react';
import SkuShop from '../../../AddShop/components/SkuShop';
import MySearch from '../../../../components/MySearch';
import MyNavBar from '../../../../components/MyNavBar';
import MyList from '../../../../components/MyList';
import SkuItem from '../../../Sku/SkuItem';
import styles from './index.less';
import { Button } from 'antd-mobile';
import MyAntPopup from '../../../../components/MyAntPopup';
import BottomButton from '../../../../components/BottomButton';
import Label from '../../../../components/Label';
import ShopNumber from '../../../AddShop/components/ShopNumber';
import { isArray, ToolUtil } from '../../../../components/ToolUtil';
import { useModel } from 'umi';
import LinkButton from '../../../../components/LinkButton';
import MyEllipsis from '../../../../components/MyEllipsis';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';

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
    value = [],
    contractType,
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

  const boms = [];
  bomVersions.forEach(item => {
    if (contractType) {
      const details = item.details || [];
      let number = 0;
      const newDetails = details.filter((item) => {
        if (item.number > 0) {
          number += item.number;
          return true;
        }
        return false;
      });
      if (newDetails.length > 0) {
        boms.push({ ...item, number, details: newDetails });
      }
    } else {
      if (item.number > 0) {
        boms.push(item);
      }
    }
  });

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

  const updateBomVersions = (key, newItem) => {
    const newBomVersions = bomVersions.map((item, bomIndex) => {
      if (bomIndex === key) {
        return { ...item, ...newItem };
      } else {
        return item;
      }
    });
    setBomVersions(newBomVersions);
  };


  const { loading: bomsByskuIdLoading, run: bomsByskuIdRun } = useRequest(bomsByskuId, {manual: true});

  useEffect(() => {
    ToolUtil.back({
      key: 'popup',
      onBack: onClose,
    });
  }, []);

  return <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 45px)' }}>
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
      onUpdate={(item) => {
        setBomVersions([item]);
        setOpen({ ...item, update: true });
      }}
      update={contractType}
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

    <MyAntPopup zIndex={1002} onClose={() => setOpen(false)} visible={open} title='选择版本'>
      <div className={styles.bomVersion}>
        <SkuItem
          imgId='skuImg'
          className={styles.bomVersionSku}
          skuResult={open?.skuResult}
          otherData={[
            open?.name,
          ]}
        />
        {
          bomVersions.map((item, index) => {
            return <div key={index}>
              <div className={styles.bomVersionItem}>
                <div className={styles.bomVersionInfo}>
                  <div>
                    <Label width={70}>备注</Label>：{item?.note}
                  </div>
                  <div>
                    <Label width={70}>版本号</Label>：{item?.name}
                  </div>
                  <div>
                    <Label width={70}>创建日期</Label>：{item?.createTime}
                  </div>
                </div>

                {contractType ? !item.add && <LinkButton onClick={() => {
                  updateBomVersions(index, { add: true, details: value });
                }}>添加</LinkButton> : <div>
                  <ShopNumber value={item.number} onChange={(number) => {
                    updateBomVersions(index, { number });
                  }} />
                </div>}

              </div>

              <div hidden={!item.add}>
                {
                  isArray(item.details).map((detailItem, detailIndex) => {
                    return <div key={detailIndex} className={styles.bomVersionItem}>
                      <div className={styles.bomVersionInfo}>
                        <MyEllipsis maxWidth='70vw'>客户 /
                          合同：{detailItem.customerName} / {detailItem.contractCoding}</MyEllipsis>
                      </div>
                      <ShopNumber value={detailItem.number} onChange={(number) => {
                        const details = item.details.map((item, key) => {
                          if (detailIndex === key) {
                            return { ...item, number };
                          } else {
                            return item;
                          }
                        });
                        updateBomVersions(index, { details });
                      }} />
                    </div>;
                  })
                }
              </div>
            </div>;
          })
        }
      </div>
      <BottomButton
        leftOnClick={() => {
          setOpen(false);
        }}
        rightDisabled={boms.length === 0}
        rightText={open?.update ? '修改' : '添加'}
        rightOnClick={() => {
          setOpen(false);
          if (open?.update) {
            const newSkus = skus.map((item, index) => {
              if (index === open?.key) {
                return { ...item, ...boms[0] };
              }
              return item;
            });
            setSkus(newSkus);
            return;
          }
          addShopBall({
            skuResult: open.skuResult,
            boms,
          });
        }}
      />
    </MyAntPopup>

  </div>;
};

export default SelectBom;
