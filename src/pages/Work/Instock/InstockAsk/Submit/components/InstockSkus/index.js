import React, { useEffect, useState } from 'react';
import style from '../PurchaseOrderInstock/index.less';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import SkuItem from '../../../../../Sku/SkuItem';
import { Divider, Selector, Stepper, TextArea, Toast } from 'antd-mobile';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import BottomButton from '../../../../../../components/BottomButton';
import { useBoolean } from 'ahooks';
import MyEmpty from '../../../../../../components/MyEmpty';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../../../util/Request';
import { instockOrderAdd } from '../../../../Url';
import { MyLoading } from '../../../../../../components/MyLoading';

const InstockSkus = ({ skus = [] }) => {

  const [data, setData] = useState([]);

  const history = useHistory();

  const { loading, run: instock } = useRequest(instockOrderAdd, {
    manual: true,
    onSuccess: () => {
      history.goBack();
      Toast.show({ content: '创建入库申请成功！', position: 'bottom' });
    },
    onError: () => {
      Toast.show({ content: '创建入库申请失败！', position: 'bottom' });
    },
  });


  useEffect(() => {
    setData(skus);
  }, [skus.length]);

  const carefulData = [
    { label: '需要叉车', value: '0' },
    { label: '贵重物资', value: '1' },
    { label: '大件物资', value: '2' },
    { label: '非上班时间到货', value: '3' },
  ];

  const [allSku, { toggle }] = useBoolean();
  const [allCareful, { toggle: carefulToggle }] = useBoolean();
  let countNumber = 0;
  data.map(item => countNumber += item.number);

  return <div style={{ marginBottom: 60 }}>

    <div className={style.skus}>
      <div className={style.skuHead}>
        <div className={style.headTitle}>
          物料明细
        </div>
        <div className={style.extra}>
          合计：<span>{skus.length}</span>类<span>{countNumber}</span>件
        </div>
      </div>
      {data.length === 0 && <MyEmpty description='暂无入库物料' />}
      {
        data.map((item, index) => {
          if (!allSku && index >= 3) {
            return null;
          }
          return <div
            key={index}
            className={ToolUtil.classNames(
              style.skuItem,
              (index !== (allSku ? skus.length - 1 : (skus.length - 1 < 2 ? skus.length - 1 : 2))) && style.skuBorderBottom,
            )}
          >
            <div className={style.item}>
              <SkuItem
                imgSize={60}
                skuResult={item.skuResult}
                extraWidth='124px'
                otherData={item.brandName}
              />
            </div>
            <div>
              <Stepper
                value={item.number}
                onChange={value => {
                  const newData = data.map((dataItem) => {
                    if (dataItem.skuId === item.skuId) {
                      return { ...dataItem, number: value };
                    }
                    return dataItem;
                  });
                  setData(newData);
                }}
              />
            </div>
          </div>;
        })
      }
      {data.length !== 0 && <Divider className={style.allSku}>
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
      leftOnClick={() => {
        history.goBack();
      }}
      rightText='提交'
      rightDisabled={data.length === 0}
      rightOnClick={() => {
        const instockRequest = [];
        data.map(item => {
          if (item.number > 0) {
            instockRequest.push(item);
          }
          return null;
        });
        instock({
          data: {
            instockRequest,
          },
        });
      }}
    />

    {loading && <MyLoading />}

  </div>;
};

export default InstockSkus;
