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
import Label from '../../../../../../../../../../components/Label';

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
    loading,
  },
) => {

  const [mediaIds, setMediaIds] = useState([]);
  const [note, setNote] = useState();

  const skuResult = sku.skuResult || {};
  const spuResult = skuResult.spuResult || {};
  const unitName = ToolUtil.isObject(spuResult.unitResult).unitName;

  const checkUsers = ToolUtil.isArray(sku.checkUsers);


  const addFileRef = useRef();

  const state = initialState || {};
  const imgUrl = Array.isArray(skuResult.imgUrls) && skuResult.imgUrls[0];

  return <>
    <MyCard noHeader className={style.cardStyle} bodyClassName={style.bodyStyle}>
      <div className={style.header} hidden={forward} style={over ? { boxShadow: '0 1px 5px 0 rgb(0 0 0 / 30%)' } : {}}>

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
          <Label className={style.title}>到货数：</Label>
          <ShopNumber show value={sku.realNumber} /> {unitName}
          <div style={{ padding: '0 8px' }}>({ToolUtil.isObject(sku.user).name || '-'})</div>
        </div>

        {checkUsers.map((item, index) => {
          const urls = ToolUtil.isArray(item && item.mediaUrls);
          return <div key={index} className={style.checkUser}>
            <div className={style.checkNumber}>
              <Label className={style.title}>复核数：</Label>
              <ShopNumber show value={item.number} /> {unitName}
              <div style={{ padding: '0 8px' }}>({item.name || ''})</div>
            </div>
            <div className={style.checkNumber} style={{ display: 'block' }}>
              <Label className={style.title}>附件： </Label>{urls.length === 0 && '无'}
              <div hidden={urls.length === 0} style={{ paddingTop: 4 }}>
                <UploadFile refresh={loading} show value={urls.map(item => {
                  return { url: item };
                })} />
              </div>
            </div>
            <div className={style.checkNumber}>
              <Label className={style.title}>备注说明：</Label> {item.note || '无'}
            </div>
          </div>;
        })}

        <div hidden={sku.hidden} className={style.verifyAction}>
          <div className={style.checkNumber}>
            <Label className={style.title}>复核数：</Label>
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
            <Label className={style.title}>上传附件：</Label>
            <div>
              <PaperClipOutlined onClick={() => {
                addFileRef.current.addFile();
              }} />
            </div>
          </div>
          <div hidden={mediaIds.length === 0}>
            {!loading && <UploadFile
              uploadId='verifyImg'
              noAddButton
              ref={addFileRef}
              onChange={(mediaIds) => {
                setMediaIds(mediaIds);
              }}
            />}
          </div>
          <div className={style.checkNumber}>
            <Label className={style.title}>添加备注：</Label>
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
              setMediaIds([]);
              setNote('');
              saveRun(param);
            }}>确认</Button>
          </div>
        </div>


      </div>
    </MyCard>
  </>;
};

export default Header;
