import React, { useEffect } from 'react';
import style from './index.less';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import SkuItem from '../../../../../Sku/SkuItem';
import { Divider, Selector, Stepper, TextArea } from 'antd-mobile';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import { useRequest } from '../../../../../../../util/Request';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import MyNavBar from '../../../../../../components/MyNavBar';
import BottomButton from '../../../../../../components/BottomButton';

export const contractDetail = { url: '/contract/detail', method: 'POST' };

const PurchaseOrderInstock = ({ data = {} }) => {

  const details = ToolUtil.isArray(data.detailResults);

  const { data: contract, run } = useRequest(contractDetail, { manual: true });

  useEffect(() => {
    if (data.contractId) {
      run({ data: { contractId: data.contractId } });
    }
  }, [data.contractId]);

  const carefulData = [
    { label: '需要叉车', value: '0' },
    { label: '贵重物资', value: '1' },
    { label: '大件物资', value: '2' },
    { label: '非上班时间到货', value: '3' },
  ];

  const [allSku, { toggle }] = useBoolean();
  const [allCareful, { toggle: carefulToggle }] = useBoolean();

  return <div style={{marginBottom:60}}>
    <MyNavBar title='入库申请' />
    <div className={style.data}>
      <div className={style.label}>供应商</div>
      <div className={style.value}>{ToolUtil.isObject(data.bcustomer).customerName}</div>
    </div>
    <div className={style.data}>
      <div className={style.label}>合同号</div>
      <div className={style.value}>{ToolUtil.isObject(contract).coding || '--'}</div>
    </div>

    <div className={style.skus}>
      <div className={style.skuHead}>
        <div className={style.headTitle}>
          物料明细
        </div>
        <div className={style.extra}>
          合计：<span>5000</span>
        </div>
      </div>
      {
        details.map((item, index) => {
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
                skuResult={item.skuResult}
                extraWidth={124}
                otherData={ToolUtil.isObject(item.brandResult).brandName}
              />
            </div>
            <div>
              <Stepper
                defaultValue={item.purchaseNumber}
                onChange={value => {

                }}
              />
            </div>
          </div>;
        })
      }
      <Divider className={style.allSku}>
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
      </Divider>
    </div>

    <div className={style.careful}>
      <div className={style.title}>注意事项 <span>*</span></div>
      <div className={style.carefulData}>
        <Selector
          className={style.selector}
          options={carefulData}
          multiple={true}
          onChange={(arr, extend) => console.log(arr, extend.items)}
        />
      </div>
      <Divider className={style.allSku}>
        <div onClick={() => {
          carefulToggle();
        }}>
          {
            allCareful ?
              <UpOutline />
              :
              <DownOutline />
          }
        </div>
      </Divider>
    </div>

    <div className={style.note}>
      <div className={style.title}>添加备注</div>
      <TextArea className={style.textArea} placeholder='可@相关人员' rows={1} />
    </div>

    <div className={style.file}>
      <div className={style.title}>上传附件</div>
      <div className={style.files}>
        <UploadFile />
      </div>

    </div>

    <BottomButton
      rightText='提交'
    />
  </div>;
};

export default PurchaseOrderInstock;
