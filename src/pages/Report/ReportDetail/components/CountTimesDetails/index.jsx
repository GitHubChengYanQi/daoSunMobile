import React, { useState } from 'react';
import styles from './index.less';
import MyCheck from '@/pages/components/MyCheck';
import ShopNumber from '@/pages/Work/AddShop/components/ShopNumber';
import LinkButton from '@/pages/components/LinkButton';
import style from '@/pages/Work/Sku/SkuItem/index.less';
import { DownOutline, ExclamationTriangleOutline, UpOutline } from 'antd-mobile-icons';
import { ToolUtil } from '@/pages/components/ToolUtil';
import { useModel } from 'umi';
import { Popup } from 'antd-mobile';

const CountTimesDetails=(
  {
    listRef,
    params = {},
    imgId,
    imgSize = 74,
    hiddenNumber,
    skuResult = {}
  },
  )=>{
  const [list, setList] = useState([1,2,3,4]);
  const [open, setOpen] = useState();
  const [dian,setDian] = useState(false);
  const [error,setError] = useState(false);
  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const imgResults = ToolUtil.isArray(skuResult.imgResults)[0] || {};
  const imgUrl = imgResults.thumbUrl;

  return <>
    {list.map((item, index) => {

      const show = open === index;

      return <div key={index} className={styles.listItem}>
        <div className={styles.skuItem} hidden>
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
            <div className={styles.textBottom}>异常<div className={styles.redText}>×&nbsp;10</div><div className={styles.blackText}>&nbsp;(10%)</div></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>盘点次数</div>
            <ShopNumber show value={item.number} />
            <LinkButton onClick={()=>{setDian(true)}}>查看异常</LinkButton>
            <Popup
              visible={dian}
              showCloseButton
              onMaskClick={() => {
                setDian(false)
              }}
              onClose={() => {
                setDian(false)
              }}
            >
              <div className={styles.popupTitle}>异常明细</div>
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
                </div>
                <div className={styles.exceptionRight}>
                  <div className={styles.exceptionsNumber}>异常次数</div>
                  <div className={styles.number}>×  2</div>
                </div>
              </div>
              <div className={styles.popupBottom}>
                <div className={styles.detailsTop}>
                  <div className={styles.detailsLeft}>
                    <div className={styles.text}>2022年8月15日</div>
                    <div className={styles.text}>品牌：丹东汉克</div>
                    <div className={styles.text}>盘点数量：无差异</div>
                  </div>
                  <div className={styles.popupRight}>
                    <div className={styles.text}>盘点人：张三</div>
                    <div className={styles.text}>库位：零件区</div>
                    <div className={styles.text}>异常件数：×5</div>
                  </div>
                </div>
                <div className={styles.exceptionDetails}>
                  <div className={styles.exception1}>
                    <div className={styles.text}>异常编码：925313 × 2&nbsp;<div className={styles.red}> · 报损</div></div>
                    <div className={styles.text}>异常原因：物料损坏</div>
                  </div>
                  <div className={styles.exception1}>
                    <div className={styles.text}>异常编码：925313 × 3&nbsp;<div className={styles.blue}> · 继续使用</div></div>
                    <div className={styles.text}>异常原因：生锈</div>
                  </div>
                </div>
              </div>
              </div>
            </Popup>
          </div>
        </div>

        {/*人员*/}
        <div>
          <div className={styles.header}>
            <MyCheck fontSize={17} />
            <div className={styles.label}>李四（仓库管理-库房保管员）</div>
              <div>共盘点<span className='numberBlue'>75</span>次
              </div>
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
                    <div className={styles.textBottom}>丹东汉克</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={styles.date}>8月15日</div>
                    {/*<LinkButton>正常</LinkButton>*/}
                    <div className={styles.viewExceptions} onClick={()=>{setError(true)}}>查看异常</div>
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
                      <div className={styles.popupTitle}>异常明细</div>
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
                          </div>
                        </div>
                        <div className={styles.information}>
                        <div className={styles.informationTime}>时间：2022年8月16日</div>
                        <div className={styles.worker}>盘点人：张三</div>
                      </div>
                        <div className={styles.frame}>
                          <div className={styles.text}>库存数量：157</div>
                          <div className={styles.text}>盘点数量：150</div>
                          <div className={styles.text}>盘点结果：盘盈2件</div>
                        </div>
                        <div className={styles.frame2}>
                          <div className={styles.text}>异常编码：925313 × 2&nbsp;<div className={styles.red}> · 报损</div></div>
                          <div className={styles.text}>异常原因：物料损坏</div>
                        </div>
                        <div className={styles.frame2}>
                          <div className={styles.text}>异常编码：925313 × 3&nbsp;<div className={styles.blue}> · 继续使用</div></div>
                          <div className={styles.text}>异常原因：生锈</div>
                        </div>
                      </div>
                    </Popup>
                  </div>
                </div>;
              })
            }

        </div>
        </div>
      </div>
    })}
    </>
  };

export default CountTimesDetails;
