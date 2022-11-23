import React, { useState } from 'react';
import { isArray } from '../../../components/ToolUtil';
import MyNavBar from '../../../components/MyNavBar';
import FormLayout from '../../../components/FormLayout';
import { ReceiptsEnums } from '../../../Receipts';
import MyCard from '../../../components/MyCard';
import Title from '../../../components/Title';
import styles from '../../CreatePurchaseOrder/index.less';
import { Divider, Input, Space, TextArea } from 'antd-mobile';
import StartEndDate from '../CreateTask/components/StartEndDate';
import User from '../../CreateTask/components/User';
import SkuItem from '../../Sku/SkuItem';
import ShopNumber from '../../AddShop/components/ShopNumber';
import { useRequest } from '../../../../util/Request';
import { Message } from '../../../components/Message';
import MyRemoveButton from '../../../components/MyRemoveButton';
import { useHistory } from 'react-router-dom';
import LinkButton from '../../../components/LinkButton';
import { AddOutline } from 'antd-mobile-icons';
import CheckSpu from '../../Sku/CheckSpu';
import { AddButton } from '../../../components/MyButton';

export const createProductionPlan = {
  url: '/productionPlan/add',
  method: 'POST',
};


const CreatePlan = () => {

  const history = useHistory();

  const [data, setData] = useState({});

  const [visible, setVisible] = useState(false);

  const { loading, run } = useRequest(createProductionPlan, { manual: true });

  const [contracts, setContracts] = useState([{}]);

  const [cardCoding, setCardCoding] = useState({});

  const contractsChange = (data = {}, key) => {
    const newContracts = contracts.map((item, index) => {
      if (index === key) {
        return { ...item, ...data };
      }
      return item;
    });
    if (data.coding && !contracts[key + 1]) {
      setContracts([...newContracts, {}]);
    } else {
      setContracts(newContracts);
    }
  };

  return <>
    <MyNavBar title='创建计划' />
    <FormLayout
      data={{
        ...data,
        cardCoding: cardCoding.fixedCoding && cardCoding.total && cardCoding.startNum,
        orderDetailParams: contracts,
      }}
      loading={loading}
      onSave={async (complete) => {

        const orderDetailParams = [];
        contracts.forEach(contractsItem => {
          const details = contractsItem.details || [];
          details.forEach(item => {
            orderDetailParams.push({
              contractCoding: contractsItem.coding, ...item,
              purchaseNumber: item.purchaseNumber || 1,
            });
          });
        });

        let success;
        await run({
          data: {
            ...data,
            cardCoding,
            executionTime: data.time && data.time[0],
            endTime: data.time && data.time[1],
            orderDetailParams,
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
              placeholder={`请输入${item.filedName}`}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'theme':
            extra = <Input
              value={data[item.key]}
              className={styles.input}
              placeholder={`请输入${item.filedName}`}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'time':
            extra = <StartEndDate
              placeholder={`请选择${item.filedName}`}
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
              placeholder={`请输入${item.filedName}`}
              value={data[item.key]}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'cardCoding':
            content = <Space>
              <Input
                value={cardCoding.fixedCoding || ''}
                className={styles.coding}
                placeholder='固定编号'
                onChange={(value) => {
                  setCardCoding({ ...cardCoding, fixedCoding: value });
                }}
              />
              <ShopNumber
                value={cardCoding.total}
                number
                placeholder='流水号位数'
                onChange={(value) => {
                  setCardCoding({ ...cardCoding, total: value });
                }} />
              <ShopNumber
                number
                value={cardCoding.startNum}
                placeholder='起始值'
                onChange={(value) => {
                  setCardCoding({ ...cardCoding, startNum: value });
                }} />
            </Space>;
            break;
          case 'orderDetailParams':
            return <MyCard
              titleBom={required && <Title className={styles.title}>{item.filedName}<span>*</span></Title>}
              title={item.filedName}
              bodyClassName={styles.contractContent}
            >
              {
                contracts.map((item, index) => {
                  const details = item.details || [];
                  return <MyCard
                    className={styles.contract}
                    key={index}
                    headerClassName={styles.contractHeader}
                    titleBom={`合同${index + 1}`}
                    bodyClassName={styles.contractBody}
                    extra={<Input
                      className={styles.input}
                      value={item.coding || ''}
                      placeholder='请输入合同编码'
                      onChange={(value) => {
                        contractsChange({ coding: value }, index);
                      }} />}
                  >
                    {item.coding && <div>
                      {
                        details.map((detailItem, detailIndex) => {
                          return <div key={detailIndex} className={styles.skuItem}>
                            <SkuItem
                              noView
                              extraWidth='140px'
                              className={styles.sku}
                              skuResult={detailItem}
                            />
                            <ShopNumber
                              min={1}
                              value={detailItem.purchaseNumber || 1}
                              onChange={(purchaseNumber) => {
                                const details = isArray(contracts[index]?.details);
                                contractsChange({
                                  details: details.map((item, index) => {
                                    if (index === detailIndex) {
                                      return { ...item, purchaseNumber };
                                    }
                                    return item;
                                  }),
                                }, index);
                              }}
                            />
                            <MyRemoveButton
                              style={{ width: 30, textAlign: 'right', marginRight: -12 }}
                              onRemove={() => {
                                const details = isArray(contracts[index]?.details);
                                contractsChange({
                                  details: details.filter((skuItem, skuIndex) => skuIndex !== detailIndex),
                                }, index);
                              }} />
                          </div>;
                        })
                      }
                      <div style={{ textAlign: 'center', paddingTop: 8 }}>
                        <AddButton onClick={() => {
                          setVisible({ index });
                        }} />
                      </div>
                    </div>}
                  </MyCard>;
                })
              }
            </MyCard>;
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


    <CheckSpu
      open={visible}
      close={() => setVisible(false)}
      onChange={(sku) => {
        const details = isArray(contracts[visible?.index]?.details);
        contractsChange({ details: [...details, sku] }, visible?.index);
        setVisible(false);
      }}
    />

  </>;
};

export default CreatePlan;
