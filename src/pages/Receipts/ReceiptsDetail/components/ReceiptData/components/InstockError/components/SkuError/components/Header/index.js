import React, { useRef, useState } from 'react';
import style from '../../../../../InstockOrder/components/Error/index.less';
import { SkuResultSkuJsons } from '../../../../../../../../../../Scan/Sku/components/SkuResult_skuJsons';
import { CloseOutline } from 'antd-mobile-icons';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import ShopNumber
  from '../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { PaperClipOutlined } from '@ant-design/icons';
import UploadFile from '../../../../../../../../../../components/Upload/UploadFile';
import { Button, Space, TextArea } from 'antd-mobile';
import MyCard from '../../../../../../../../../../components/MyCard';

const Header = (
  {
    forward,
    over,
    initialState,
    onClose = () => {
    },
    sku,
    setSku = () => {
    },
    saveRun = () => {
    },
    anomalyId,
    userInfo,
  },
) => {

  const [mediaIds, setMediaIds] = useState([]);
  const [note, setNote] = useState();

  const skuResult = sku.skuResult || {};
  const spuResult = skuResult.spuResult || {};
  const unitName = ToolUtil.isObject(spuResult.unitResult).unitName;

  const checkUsers = ToolUtil.isArray(sku.checkUsers);
  const checkUser = checkUsers[checkUsers.length - 1];

  const addFileRef = useRef();

  const state = initialState || {};
  const imgUrl = Array.isArray(skuResult.imgUrls) && skuResult.imgUrls[0];

  return <>
    <MyCard noHeader className={style.cardStyle} bodyClassName={style.bodyStyle}>
      <div className={style.header} hidden={forward}>

        {
          over ?
            <div className={style.skuShow}>
              <img src={imgUrl || state.imgLogo} width={30} height={30} alt='' />
              <div>
                <div className={style.smallSku} style={{ maxWidth: 210 }}>
                  {SkuResultSkuJsons({ skuResult, spu: true })}
                </div>
                <div className={style.smallSku} style={{ maxWidth: 210 }}>
                  {SkuResultSkuJsons({ skuResult, sku: true })}
                </div>
              </div>
            </div>
            :
            <div className={style.title}>异常处理</div>
        }
        <span onClick={() => {
          onClose();
        }}><CloseOutline /></span>
      </div>

      <div className={style.skuItem} style={{ border: 'none' }}>
        <SkuItem
          skuResult={sku.skuResult}
          className={style.sku}
          extraWidth='64px'
          otherData={[
            ToolUtil.isObject(sku.customerResult).customerName,
            ToolUtil.isObject(sku.brandResult).brandName || '无品牌',
          ]}
        />
        <div className={style.showNumber}>
          <span
            className={style.through}
            hidden={(sku.confirm ? sku.checkNumber : sku.realNumber) === sku.needNumber}>× {sku.needNumber}</span>
          <span>× {sku.confirm ? sku.checkNumber : sku.realNumber}</span>
        </div>
      </div>

      <div className={style.verify} hidden={forward}>
        <div className={style.checkNumber}>
          <div className={style.title}>到货数：</div>
          <ShopNumber show value={sku.realNumber} /> {unitName}
          <div style={{ padding: '0 8px' }}>({ToolUtil.isObject(sku.user).name || '-'})</div>
        </div>

        {checkUser && <div className={style.checkUser}>
          <div className={style.checkNumber}>
            <div className={style.title}>复核数：</div>
           <ShopNumber show value={checkUser.number} /> {unitName}
            <div style={{ padding: '0 8px' }}>({checkUser.name || ''})</div>
          </div>
          <div>
            附件： <div style={{paddingTop:8}}>
            <UploadFile show value={ToolUtil.isArray(checkUser.mediaUrls).map(item => {
              return { url: item };
            })} />
          </div>
          </div>
          <div>
            备注说明： {checkUser.note}
          </div>
        </div>}

        <div hidden={sku.hidden} className={style.verifyAction}>
          <div className={style.checkNumber}>
            <div className={style.title}>复核数：</div>
            <Space align='center'>
              <ShopNumber
                value={sku.checkNumber}
                onChange={(checkNumber) => {
                  setSku({ ...sku, checkNumber });
                }} />
              {unitName}
            </Space>
          </div>
          <div className={style.checkNumber}>
            <div className={style.title}>上传附件：</div>
            <div>
              <PaperClipOutlined onClick={() => {
                addFileRef.current.addFile();
              }} />
            </div>
          </div>
          <div hidden={mediaIds.length === 0}>
            <UploadFile
              uploadId='verifyImg'
              noAddButton
              ref={addFileRef}
              onChange={(mediaIds) => {
                setMediaIds(mediaIds);
              }}
            />
          </div>
          <div className={style.checkNumber}>
            <div className={style.title}>添加备注：</div>
            <TextArea
              rows={1}
              value={note}
              className={style.textArea}
              placeholder=''
              onChange={(value) => {
                setNote(value);
              }}
            />
          </div>
          <div className={style.checkNumber}>
            <div className={style.title} />
            <Button color='primary' fill='outline' onClick={() => {
              const param = {
                data: {
                  anomalyId,
                  checkNumber: JSON.stringify([...checkUsers, {
                    number: sku.checkNumber,
                    name: userInfo.name,
                    userId: userInfo.id,
                    mediaIds,
                    note,
                  }]),
                },
              };

              saveRun(param);
            }}>确认</Button>
          </div>
        </div>


      </div>
    </MyCard>
  </>;
};

export default Header;
