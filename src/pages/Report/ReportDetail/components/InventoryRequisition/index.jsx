import React, { useState } from 'react';
import styles from '@/pages/Report/ReportDetail/components/CountTimesDetails/index.less';
import MyCheck from '@/pages/components/MyCheck';
import { DownOutline, ExclamationTriangleOutline, UpOutline } from 'antd-mobile-icons';
import style from '@/pages/Work/Sku/SkuItem/index.less';
import { Popup } from 'antd-mobile';
import { useModel } from 'umi';
import { ToolUtil } from '@/pages/components/ToolUtil';

const InventoryRequisition=(
  {
    listRef,
    params = {},
    imgId,
    imgSize = 40,
    hiddenNumber,
    skuResult = {}
  },
)=>{

  const [list,setList] = useState([1,2,3])
  const [open, setOpen] = useState();
  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const imgResults = ToolUtil.isArray(skuResult.imgResults)[0] || {};
  const imgUrl = imgResults.thumbUrl;
  return <>
    {list.map((item, index) => {

      const show = open === index;

      return <div key={index} className={styles.listItem}>
        <div>
          <div className={styles.header}>
            <MyCheck fontSize={17} />
            <div className={styles.label}>张三（生产制造部-装配工）</div>
            {/*<div>共申请<span className='numberBlue'>75</span>次</div>*/}
            <div>共<span className='numberBlue'>75</span>类</div>
            <div onClick={() => {
              setOpen(show ? undefined : index);
              if (show) {
                return;
              }
            }}>{!show ? <DownOutline /> : <UpOutline />}</div>
          </div>
          <div hidden={!(open === index)}>
            {
              list.map((item, index) => {
                return <div key={index} className={styles.skuItem}>
                   {/*<div id={imgId} className={style.img} style={{ maxHeight: imgSize, minWidth: imgSize }}>*/}
                   {/*  <img src={imgUrl || state.imgLogo} width={imgSize} height={imgSize} alt='' />*/}
                   {/*  <div hidden={hiddenNumber} className={style.number}>*/}
                   {/*    {skuResult.lockStockDetailNumber > 0 && <span className={style.error}>*/}
                   {/*  <ExclamationTriangleOutline />*/}
                   {/*  </span>}*/}
                   {/*  </div>*/}
                   {/*</div>*/}
                   {/*<div className={styles.skuItemCenter}>*/}
                   {/*  <div className={styles.ranking}>黑色内扣冷却管</div>*/}
                   {/*  <div className={styles.ranking2}>lqg-700/ 1/2*700mm黑色内螺纹</div>*/}
                   {/*</div>*/}
                   {/*<div style={{ textAlign: 'right' }}>*/}
                   {/*  /!*<div className={styles.date}>8月15日</div>*!/*/}
                   {/*  /!*<LinkButton>正常</LinkButton>*!/*/}
                   {/*</div>*/}
                  <div className={styles.taskDetails}>
                    <div className={styles.monthly}>
                    <div className={styles.ranking}>月度盘点</div>
                    <div className={styles.blueFrame}>执行中</div>
                    </div>
                    <div className={styles.ranking3}>执行人：梁彦欣</div>
                    <div className={styles.ranking3}>执行时间：2022年8月12日-2022年8月30日</div>
                  </div>
                  <div className={styles.taskTime}>
                    <div className={styles.ranking4}>申请时间：8月12日</div>
                  </div>
                </div>;
              })
            }

          </div>
        </div>
      </div>

    })}
  </>

}

export default InventoryRequisition

