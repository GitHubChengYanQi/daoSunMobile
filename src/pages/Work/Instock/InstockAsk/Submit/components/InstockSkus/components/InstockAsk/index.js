import React, { useEffect, useState } from 'react';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../../../../../util/Request';
import { instockOrderAdd } from '../../../../../../Url';
import { Message } from '../../../../../../../../components/Message';
import Skus from '../Skus';
import MyNavBar from '../../../../../../../../components/MyNavBar';
import style from '../../../PurchaseOrderInstock/index.less';
import Careful from '../Careful';
import MyTextArea from '../../../../../../../../components/MyTextArea';
import UploadFile from '../../../../../../../../components/Upload/UploadFile';
import BottomButton from '../../../../../../../../components/BottomButton';
import { MyLoading } from '../../../../../../../../components/MyLoading';

const InstockAsk = ({ skus, judge, createType }) => {

  const [data, setData] = useState([]);

  const [hiddenBottom, setHiddenBottom] = useState(false);

  const [params, setParams] = useState({});

  const history = useHistory();

  const normalSku = [];

  let countNumber = 0;

  const skuList = data.map((item, index) => {
    if (item.number > 0) {
      countNumber += (item.number || 0);
      normalSku.push(item);
    }
    return { ...item, key: index };
  });

  const { loading: instockLoading, run: inStock } = useRequest(instockOrderAdd, {
    manual: true,
    onSuccess: () => {
      Message.toast('创建入库申请成功!');
      history.goBack();
    },
    onError: () => {
      Message.toast('创建入库申请失败!');
    },
  });


  const dataChange = (array = []) => {
    if (array.length === 0) {
      if (history.length <= 2) {
        history.push('/');
      } else {
        history.goBack();
      }
    }
    setData(array);
  };


  useEffect(() => {
    dataChange(skus);
  }, []);

  const createTypeData = (item = {}) => {
    return {
      title: '入库申请',
      type: '入库',
      otherData: [item.customerName, item.brandName || '无品牌'],
      more: judge && ToolUtil.isArray(item.positions).map(item => {
        return `${item.name}(${item.number})`;
      }).join('、'),
      careful: '注意事项',
      buttonHidden: judge,
      disabled: ToolUtil.isArray(params.noticeIds).length === 0 || (judge ? false : normalSku.length === 0),
    };
  };

  const inStockRun = (directInStock) => {
    const listParams = [];
    (directInStock ? skuList : normalSku).map(item => {
      if (judge) {
        const positions = item.positions || [];
        positions.map(positionItem => {
          if (positionItem.number > 0) {
            listParams.push({
              ...item,
              storehousePositionsId: positionItem.id,
              number: positionItem.number,
            });
          }
          return null;
        });
      } else {
        listParams.push({ ...item, storehousePositionsId: item.positionId });
      }
      return null;
    });
    inStock({
      data: {
        shopCardType: createType,
        directInStock,
        module: 'createInstock',
        listParams,
        ...params,
      },
    });
  };

  const content = () => {
    return <Skus
      skus={skus}
      createTypeData={createTypeData}
      setHiddenBottom={setHiddenBottom}
      judge={judge}
      skuList={skuList}
      countNumber={countNumber}
      dataChange={dataChange}
    />;
  };

  return <div style={{ marginBottom: 60 }}>
    <MyNavBar title={createTypeData().title} />
    {content()}

    <div className={style.careful}>
      <div className={style.title}>{createTypeData().careful} <span>*</span></div>
      <Careful
        type={createType}
        value={params.noticeIds}
        onChange={(noticeIds) => {
          setParams({ ...params, noticeIds });
        }}
      />
    </div>

    <div className={style.note}>
      <div className={style.title}>添加备注</div>
      <MyTextArea
        value={params.remark}
        className={style.textArea}
        onChange={(remark, userIds) => {
          setParams({ ...params, remark, userIds: userIds.map(item => item.userId) });
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

    {!hiddenBottom && <BottomButton
      leftOnClick={() => {
        history.goBack();
      }}
      rightText='提交'
      rightDisabled={createTypeData().disabled}
      rightOnClick={() => {
        if (judge) {
          return inStockRun(true);
        }
        inStockRun();
      }}
    />}

    {(instockLoading) && <MyLoading />}

  </div>;
};

export default InstockAsk;
