import React, { useState } from 'react';
import styles from './index.less';
import MyCheck from '@/pages/components/MyCheck';
import style from '@/pages/Work/Sku/SkuItem/index.less';
import { ExclamationTriangleOutline } from 'antd-mobile-icons';
import ShopNumber from '@/pages/Work/AddShop/components/ShopNumber';
import LinkButton from '@/pages/components/LinkButton';
import { Popup } from 'antd-mobile';
import { ToolUtil } from '@/pages/components/ToolUtil';
import { useModel } from 'umi';

const ExceptionDetails=(
  {
    imgId,
    imgSize = 74,
    hiddenNumber,
    skuResult = {}
  },
)=>{

  const [type,setType] = useState(1)
  const [list, setList] = useState([1,2,3,4]);
  const { initialState } = useModel('@@initialState');
  const [error,setError] = useState(false);
  const state = initialState || {};
  const imgResults = ToolUtil.isArray(skuResult.imgResults)[0] || {};
  const imgUrl = imgResults.thumbUrl;

  const dian = (type)=>{
    setType(type);
  }
  return <>
    <div className={styles.whole}>

      <div className={styles.optionsArea}>
        <div className={styles.option} onClick={()=>{
          dian(1)
        }}>
          <div className={styles.blue}>265</div>
          <div className={type===1?styles.optionText2:styles.optionText}>盘盈数量</div>
        </div>
        <div className={styles.option}>
          <div className={styles.grey}>8216</div>
          <div className={styles.optionText}>盘亏数量</div>
        </div>
        <div className={styles.option} onClick={()=>{
          dian(3)
        }}>
          <div className={styles.orange}>125</div>
          <div className={type===3?styles.optionText2:styles.optionText}>其他异常</div>
        </div>
        <div className={styles.option} onClick={()=>{
          dian(4)
        }}>
          <div className={styles.red}>89</div>
          <div className={type===4?styles.optionText2:styles.optionText}>报损数量</div>
        </div>
      </div>


    {list.map((item, index) => {

      return <div>

        <div className={styles.skuItem} >
            <MyCheck fontSize={17} />
            <div id={imgId} className={style.img} style={{ maxHeight: imgSize, minWidth: imgSize }}>
              <img src={imgUrl || state.imgLogo} width={imgSize} height={imgSize} alt='' />
              <div hidden={hiddenNumber} className={style.number}>
                {skuResult.lockStockDetailNumber > 0 && <span className={style.error}>
              <ExclamationTriangleOutline />
              </span>}
              </div>
            </div>
            <div className={styles.skuItemCenter}>
              <div>中腿通风板</div>
              <div className={styles.textCenter}>V60-75022H</div>
              <div className={styles.text}>丹东汉克</div>
              <div className={styles.text}>零件区</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className={styles.operands} hidden={type !==1}>+&nbsp;150</div>
              <div className={styles.operands} hidden={type ===1}>×&nbsp;150</div>
              <div className={styles.viewExceptions} hidden={type === 1} onClick={()=>{setError(true)}}>查看异常</div>
              <Popup
                visible={error}
                showCloseButton
                onMaskClick={() => {
                  setError(false)
                }}
                onClose={() => {
                  setError(false)
                }}
              >
                {/*<div className={styles.popupTitle}>异常明细</div>*/}
                <div className={styles.popupTitle}>报损明细</div>
                <div className={styles.popupContent}>
                  <div className={styles.popupTop}>
                    <div id={imgId} className={styles.img} style={{ maxHeight: imgSize, minWidth: imgSize }}>
                      <img src={imgUrl || state.imgLogo} width={imgSize} height={imgSize} alt='' />
                      <div hidden={hiddenNumber} className={style.number}>
                        {skuResult.lockStockDetailNumber > 0 && <span className={style.error}>
                            <ExclamationTriangleOutline />
                            </span>}
                      </div>
                    </div>
                    <div className={styles.exceptionName}>
                      <div className={styles.text}>中腿通风板</div>
                      <div className={styles.abnormalModel}>V60-75022H</div>
                      <div className={styles.text2}>丹东汉克</div>
                      <div className={styles.text2}>零件区</div>
                    </div>
                    <div className={styles.exceptionRight}>
                      <div className={styles.exceptionsNumber}>异常数量</div>
                      <div className={styles.number}>×&nbsp;150</div>
                    </div>
                  </div>
                  <div className={styles.information}>
                    <div className={styles.informationTime}>时间：2022年8月16日</div>
                    <div className={styles.worker}>盘点人：张三</div>
                  </div>
                  <div className={styles.frame2}>
                    <div className={styles.frameLeft}>
                      <div className={styles.text}>异常编码：925313 × 20</div>
                      <div className={styles.text}>异常原因：物料损坏</div>
                    </div>
                    <div  hidden={type===3}>
                      处理人：王五
                    </div>
                  </div>
                  <div className={styles.frame2}>
                    <div className={styles.frameLeft}>
                    <div className={styles.text}>异常编码：925313 × 30</div>
                    <div className={styles.text}>异常原因：生锈</div>
                    </div>
                    <div hidden={type===3}>
                      处理人：王五
                    </div>
                  </div>
                </div>
              </Popup>
            </div>
          </div>
        <div className={styles.supplement}>
            <div className={styles.supplementTime}>时间：2022年8月16日</div>
            <div className={styles.text}>盘点人：张三</div>
          </div>



    </div>
    })}

    </div>
  </>
}

export default ExceptionDetails;
