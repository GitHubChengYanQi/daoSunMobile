import React, { useEffect, useState } from 'react';
import style from '../PurchaseOrderInstock/index.less';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import SkuItem from '../../../../../Sku/SkuItem';
import { Divider, Stepper, Toast } from 'antd-mobile';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import BottomButton from '../../../../../../components/BottomButton';
import { useBoolean } from 'ahooks';
import MyEmpty from '../../../../../../components/MyEmpty';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../../../util/Request';
import { instockOrderAdd, outstockOrderAdd } from '../../../../Url';
import { MyLoading } from '../../../../../../components/MyLoading';
import { Message } from '../../../../../../components/Message';
import MyTextArea from '../../../../../../components/MyTextArea';
import Careful from './components/Careful';
import MyNavBar from '../../../../../../components/MyNavBar';

const InstockSkus = ({ skus = [], createType }) => {

  const [data, setData] = useState([]);

  const [params, setParams] = useState({});

  const history = useHistory();

  const { loading, run: inStock } = useRequest(instockOrderAdd, {
    manual: true,
    onSuccess: () => {
      Message.dialogSuccess({
        title: '创建入库申请成功！',
        rightText: '返回列表',
        only: true,
        next: () => {
          history.goBack();
        },
      });
    },
    onError: () => {
      Toast.show({ content: '创建入库申请失败！', position: 'bottom' });
    },
  });

  const { loading: outLoading, run: outStock } = useRequest(outstockOrderAdd, {
    manual: true,
    onSuccess: () => {
      Message.dialogSuccess({
        title: '创建出库申请成功！',
        rightText: '返回列表',
        only: true,
        next: () => {
          history.goBack();
        },
      });
    },
    onError: () => {
      Toast.show({ content: '创建出库申请失败！', position: 'bottom' });
    },
  });


  useEffect(() => {
    setData(skus);
  }, [skus.length]);


  const [allSku, { toggle }] = useBoolean();

  let countNumber = 0;
  data.map(item => countNumber += item.number);

  const createTypeData = () => {
    switch (createType) {
      case 'outStock':
        return { title: '出库申请', type: '出库' };
      case 'inStock':
        return { title: '入库申请', type: '入库' };
      default:
        return {};
    }
  };

  return <div style={{ marginBottom: 60 }}>
    <MyNavBar title={createTypeData().title} />
    <div className={style.skus}>
      <div className={style.skuHead}>
        <div className={style.headTitle}>
          物料明细
        </div>
        <div className={style.extra}>
          合计：<span>{skus.length}</span>类<span>{countNumber}</span>件
        </div>
      </div>
      {data.length === 0 && <MyEmpty description={`暂无${createTypeData().type}物料`} />}
      {
        data.map((item, index) => {
          if (!allSku && index >= 3) {
            return null;
          }
          return <div
            key={index}
            className={ToolUtil.classNames(
              style.skuItem,
              (index !== (allSku ? skus.length - 1 : 2)) && style.skuBorderBottom,
            )}
          >
            <div className={style.item}>
              <SkuItem
                imgSize={60}
                skuResult={item.skuResult}
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
      <div className={style.title}>注意事项 <span>*</span></div>
      <Careful params={params} setParams={setParams} />
    </div>

    <div className={style.note}>
      <div className={style.title}>添加备注</div>
      <MyTextArea
        className={style.textArea}
        onChange={(remark, userIds) => {
          setParams({ ...params, remark, userIds });
        }}
      />
    </div>

    <div className={style.file}>
      <div className={style.title}>上传附件</div>
      <div className={style.files}>
        <UploadFile
          onChange={(mediaIds) => {
            setParams({ ...params, mediaIds });
          }}
        />
      </div>

    </div>

    <BottomButton
      leftOnClick={() => {
        history.goBack();
      }}
      rightText='提交'
      rightDisabled={data.length === 0}
      rightOnClick={() => {
        switch (createType) {
          case 'outStock':
            const applyDetails = [];
            data.map(item => {
              if (item.number > 0) {
                applyDetails.push(item);
              }
              return null;
            });
            outStock({
              data: {
                applyDetails,
                ...params,
              },
            });
            break;
          case 'inStock':
            const instockRequest = [];
            data.map(item => {
              if (item.number > 0) {
                instockRequest.push(item);
              }
              return null;
            });
            inStock({
              data: {
                instockRequest,
                ...params,
              },
            });
            break;
          default:
            break;
        }
      }}
    />

    {(loading || outLoading) && <MyLoading />}

  </div>;
};

export default InstockSkus;
