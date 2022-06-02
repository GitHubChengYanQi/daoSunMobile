import React from 'react';
import style from '../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import MyEmpty from '../../../../../../components/MyEmpty';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import SkuItem from '../../../../../../Work/Sku/SkuItem';
import { Divider, Stepper } from 'antd-mobile';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import { Upload } from 'antd';

const InstockOrder = ({ data = {} }) => {

  const details = data.instockListResults || [];

  console.log(data);

  let countNumber = 0;
  details.map(item => countNumber += item.number);

  const [allSku, { toggle }] = useBoolean();

  return <>
    <div className={style.skus}>
      <div className={style.skuHead}>
        <div className={style.headTitle}>
          申请明细
        </div>
        <div className={style.extra}>
          合计：<span>{details.length}</span>类<span>{countNumber}</span>件
        </div>
      </div>
      {details.length === 0 && <MyEmpty description={`暂无入库物料`} />}
      {
        details.map((item, index) => {
          const skuResult = item.skuResult || {};
          const spuResult = item.spuResult || {};

          if (!allSku && index >= 3) {
            return null;
          }
          return <div
            key={index}
            className={ToolUtil.classNames(
              style.skuItem,
              (index !== (allSku ? details.length - 1 : 2)) && style.skuBorderBottom,
            )}
          >
            <div className={style.item}>
              <SkuItem
                imgSize={60}
                skuResult={{ ...skuResult, spuResult }}
                extraWidth='124px'
                otherData={item.customerName}
              />
            </div>
            <div>
              <Stepper
                style={{
                  '--button-text-color': '#000',
                }}
                value={item.number}
                onChange={value => {

                }}
              />
            </div>
          </div>;
        })
      }
      {data.length > 3 && <Divider className={style.allSku}>
        <div onClick={() => {
          toggle();
        }}>
          {
            allSku ?
              <UpOutline />
              :
              <DownOutline />
          }
        </div>
      </Divider>}
    </div>

    <div className={style.careful}>
      <div className={style.title}>注意事项</div>

    </div>

    <div className={style.note}>
      <div className={style.title}>备注说明</div>
      {data.remark || '-'}
    </div>

    <div className={style.file}>
      <div className={style.title}>附件</div>
      <div className={style.files}>
        <Upload
          showUploadList={{
            showRemoveIcon:false
          }}
          className='avatar-uploader'
          fileList={ToolUtil.isArray(data.url).map(item => {
            return {
              url: item,
            };
          })}
          listType='picture'
        />
      </div>

    </div>
  </>;
};

export default InstockOrder;
