import React, { useState } from 'react';
import { isArray } from '../../../components/ToolUtil';
import MyNavBar from '../../../components/MyNavBar';
import FormLayout from '../../../components/FormLayout';
import { ReceiptsEnums } from '../../../Receipts';
import MyCard from '../../../components/MyCard';
import Title from '../../../components/Title';
import styles from '../../PurchaseAsk/index.less';
import { Divider, Input, Space, TextArea } from 'antd-mobile';
import StartEndDate from '../CreateTask/components/StartEndDate';
import User from '../../CreateTask/components/User';
import { AddButton } from '../../../components/MyButton';
import MyAntPopup from '../../../components/MyAntPopup';
import CheckSkus from '../../Sku/CheckSkus';
import SkuItem from '../../Sku/SkuItem';
import ShopNumber from '../../AddShop/components/ShopNumber';
import { useRequest } from '../../../../util/Request';
import { Message } from '../../../components/Message';
import MyRemoveButton from '../../../components/MyRemoveButton';
import { useHistory } from 'react-router-dom';

export const createProductionPlan = {
  url: '/productionPlan/add',
  method: 'POST',
};


const CreatePlan = () => {

  const history = useHistory();

  const [data, setData] = useState({});

  const [visible, setVisible] = useState(false);

  const { loading, run } = useRequest(createProductionPlan, { manual: true });

  return <>
    <MyNavBar title='创建计划' />
    <FormLayout
      data={data}
      loading={loading}
      onSave={async (complete) => {
        let success;
        await run({
          data: {
            ...data,
            executionTime: data.time && data.time[0],
            endTime: data.time && data.time[1],
            orderDetailParams: isArray(data.orderDetailParams).map(item => ({
              ...item,
              purchaseNumber: item.purchaseNumber || 1,
            })),
          },
        }).then(() => {
          success = true;
          if (complete) {
            Message.successDialog({
              content: '创建计划成功！',
              only: true,
              onConfirm: () => history.goBack(),
            });
          }
        }).catch(() => {
          Message.errorToast('保存失败！');
          success = false;
        });
        return success;
      }}
      formType={ReceiptsEnums.production}
      fieldRender={(item) => {
        const required = item.required;
        let extra;
        let content;
        switch (item.key) {
          case 'coding':
            extra = <Input
              value={data[item.key]}
              className={styles.input}
              placeholder='请输入编码'
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'theme':
            extra = <Input
              value={data[item.key]}
              className={styles.input}
              placeholder='请输入主题'
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'time':
            extra = <StartEndDate
              value={data[item.key]}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'userId':
            return <User
              noRequired={!required}
              value={data.userId ? [{
                id: data.userId,
                name: data.userName,
                avatar: data.avatar,
              }] : []}
              onChange={(users) => {
                const { id, name, avatar } = users[0] || {};
                setData({ ...data, userId: id, userName: name, avatar });
              }}
              title={item.filedName}
            />;
          case 'remark':
            content = <TextArea
              rows={3}
              autoSize
              style={{ '--font-size': '14px' }}
              placeholder='请输入备注'
              value={data[item.key]}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'orderDetailParams':
            content = <>
              {
                isArray(data.orderDetailParams).map((item, index) => {
                  return <div key={index} className={styles.skuItem}>
                    <SkuItem
                      noView
                      extraWidth='200px'
                      className={styles.sku}
                      skuResult={item}
                    />
                    <div className={styles.skuInfo}>
                      <div>
                        数量
                        <ShopNumber
                          min={1}
                          value={item.purchaseNumber || 1}
                          onChange={(purchaseNumber) => {
                            const orderDetailParams = isArray(data.orderDetailParams).map((skuItem, skuIndex) => {
                              if (skuIndex === index) {
                                return { ...skuItem, purchaseNumber };
                              }
                              return skuItem;
                            });
                            setData({ ...data, orderDetailParams });
                          }}
                        />
                      </div>
                      <div>
                        交货期(天)
                        <ShopNumber
                          min={1}
                          value={item.deliveryDate || 1}
                          onChange={(deliveryDate) => {
                            const orderDetailParams = isArray(data.orderDetailParams).map((skuItem, skuIndex) => {
                              if (skuIndex === index) {
                                return { ...skuItem, deliveryDate };
                              }
                              return skuItem;
                            });
                            setData({ ...data, orderDetailParams });
                          }}
                        />
                      </div>

                    </div>
                    <MyRemoveButton style={{ width: 30, textAlign: 'right', marginRight: -12 }} onRemove={() => {
                      const orderDetailParams = isArray(data.orderDetailParams).filter((skuItem, skuIndex) => skuIndex !== index);
                      setData({ ...data, orderDetailParams });
                    }} />
                  </div>;
                })
              }
              <Divider style={{ margin: 0 }}>
                <AddButton onClick={() => {
                  setVisible({});
                }} />
              </Divider>
            </>;
            break;
          default:
            break;
        }
        return <MyCard
          titleBom={required && <Title className={styles.title}>{item.filedName}<span>*</span></Title>}
          title={item.filedName}
          extra={extra}
        >
          {content}
        </MyCard>;
      }}
    />


    <MyAntPopup position='right' onClose={() => setVisible(false)} visible={visible} title='选择物料'>
      <CheckSkus
        value={data.orderDetailParams || []}
        onChange={(skus = []) => {
          setData({ ...data, orderDetailParams: skus });
          setVisible(false);
        }}
      />
    </MyAntPopup>
  </>;
};

export default CreatePlan;
