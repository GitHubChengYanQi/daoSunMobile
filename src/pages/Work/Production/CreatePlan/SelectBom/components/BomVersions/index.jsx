import React from 'react';
import styles from '../../index.less';
import SkuItem from '../../../../../Sku/SkuItem';
import Label from '../../../../../../components/Label';
import ShopNumber from '../../../../../AddShop/components/ShopNumber';
import MyCard from '../../../../../../components/MyCard';
import { Input } from 'antd-mobile';
import BottomButton from '../../../../../../components/BottomButton';
import MyAntPopup from '../../../../../../components/MyAntPopup';

const BomVersions = (
  {
    setOpen,
    open,
    bomVersions = [],
    addShopBall = () => {
    },
    setBomVersions = () => {
    },
  },
) => {

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

  const boms = [];
  bomVersions.forEach(item => {
    if (item.number > 0) {
      boms.push(item);
    }
  });

  return <MyAntPopup zIndex={1002} onClose={() => setOpen(false)} visible={open} title='选择版本'>
    <div className={styles.bomVersion}>
      <SkuItem
        imgId='skuImg'
        className={styles.bomVersionSku}
        skuResult={open?.skuResult}
        otherData={[
          open?.name,
        ]}
      />
      <div style={{ maxHeight: '50vh', overflow: 'auto' }}>
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

                <div>
                  <ShopNumber min={0} value={item.number} onChange={(number) => {
                    updateBomVersions(index, { number });
                  }} />
                </div>

              </div>
              <MyCard hidden={item.number <= 0} className={styles.bomVersionItemCard} title='备注'>
                <Input placeholder='请输入' value={item.remark || ''} onChange={(remark) => {
                  updateBomVersions(index, { remark });
                }} />
              </MyCard>
            </div>;
          })
        }
      </div>

    </div>
    <BottomButton
      leftOnClick={() => {
        setOpen(false);
      }}
      rightDisabled={boms.length === 0}
      rightText='添加'
      rightOnClick={() => {
        setOpen(false);
        addShopBall({
          skuResult: open.skuResult,
          boms,
        });
      }}
    />
  </MyAntPopup>;
};

export default BomVersions;
