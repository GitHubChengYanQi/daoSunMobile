import React, { useRef, useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import FormLayout from '../../components/FormLayout';
import { ReceiptsEnums } from '../../Receipts';
import MyCard from '../../components/MyCard';
import { Divider, Input, Space, TextArea } from 'antd-mobile';
import styles from './index.less';
import Title from '../../components/Title';
import MyDatePicker from '../../components/MyDatePicker';
import Currency from './components/Currency';
import Customers from '../ProcessTask/MyAudit/components/Customers';
import LinkButton from '../../components/LinkButton';
import { useRequest } from '../../../util/Request';
import MyPicker from '../../components/MyPicker';
import { ArrayDuplicate, isArray } from '../../components/ToolUtil';
import AddSku from './components/AddSku';
import { MyLoading } from '../../components/MyLoading';
import ShopNumber from '../AddShop/components/ShopNumber';
import { request } from '../../../util/Service';
import PaymentDetail from './components/PaymentDetail';
import moment from 'moment';
import { PaperClipOutlined } from '@ant-design/icons';
import UploadFile from '../../components/Upload/UploadFile';
import MyCheckList from '../../components/MyCheckList';
import LabelResults from './components/LabelResults';
import { Message } from '../../components/Message';
import { useHistory } from 'react-router-dom';

export const orderAdd = {
  url: '/order/v1.1/add',
  method: 'POST',
};

export const selfEnterpriseDetail = {
  url: '/selfEnterprise/detail',
  method: 'POST',
  rowKey: 'customerId',
};

export const customerDetail = {
  url: '/customer/detail',
  method: 'POST',
  rowKey: 'customerId',
};

export const contactsDetail = {
  url: '/contacts/detail',
  method: 'POST',
  rowKey: 'contactsId',
};

export const taxRateListSelect = {
  url: '/taxRate/listSelect',
  method: 'POST',
  rowKey: 'taxRateId',
};

export const paymentTemplateListSelect = {
  url: '/paymentTemplate/listSelect',
  method: 'POST',
  rowKey: 'templateId',
};

export const paymentTemplateDetail = {
  url: '/paymentTemplate/detail',
  method: 'POST',
  rowKey: 'templateId',
};

export const templateList = {
  url: '/template/list',
  method: 'POST',
  rowKey: 'templateId',
};

export const templateGetLabel = {
  url: '/contract/getLabel',
  method: 'GET',
  rowKey: 'templateId',
};


const CreatePurchaseOrder = () => {

  const history = useHistory()

  const file = useRef();

  const [data, setData] = useState({ payPlan: 3, payPlanName: '按动作分期付款', currency:'人民币' });
  console.log('data=>', data);
  const [visible, setVisible] = useState('');

  const [aContactsData, setAContactsData] = useState({});
  const [bContactsData, setBContactsData] = useState({});

  const { loading: orderAddLoading, run: orderAddRun } = useRequest(orderAdd, { manual: true });

  const { loading: taxLoading, data: taxData } = useRequest(taxRateListSelect);

  const {
    loading: templateGetLabelLoading,
    data: templateGetLabeData,
    run: templateGetLabelRun,
  } = useRequest(templateGetLabel, { manual: true });

  const { loading: templateLoading, data: paymentTemplate } = useRequest({
    ...paymentTemplateListSelect,
    data: { oftenUser: 1 },
  });

  const {
    loading: contactsLoading,
    run: contactsRun,
  } = useRequest(contactsDetail, { manual: true });

  const {
    loading: selfEnterpriseLoading,
    data: selfEnterpriseData = {},
    run: selfEnterpriseRun,
  } = useRequest(selfEnterpriseDetail, {
    onSuccess: async (res) => {
      let info = {
        buyerId: res.customerId,
        buyerName: res.customerName,
        partyAAdressId: res.defaultAddress,
        partyAAdressName: res.address?.detailLocation || res.address?.location,
        partyAContactsId: res.defaultContacts,
        partyAContactsName: res.contact?.contactsName,
        partyABankId: res.invoiceResult?.bankId,
        partyABankName: res.invoiceResult?.bankResult?.bankName,
        partyABankAccount: res.invoiceResult?.invoiceId,
        partyABankAccountName: res.invoiceResult?.bankAccount,
        partyABankNo: res.invoiceResult?.bankNo,
      };

      if (res.defaultContacts) {
        const contact = await contactsRun({ data: { contactsId: res.defaultContacts } });
        setAContactsData(contact);
        info = {
          ...info,
          partyAPhone: contact?.phoneParams[0]?.phoneId,
          partyAPhoneName: contact?.phoneParams[0]?.phone,
        };
      }
      setData({ ...data, ...info });
    },
  });

  const {
    loading: customerLoading,
    data: customerData = {},
    run: customerRun,
  } = useRequest(customerDetail, {
    manual: true,
    onSuccess: async (res) => {
      let info = {
        partyBAdressId: res.defaultAddress,
        partyBAdressName: res.address?.detailLocation || res.address?.location,
        partyBContactsId: res.defaultContacts,
        partyBContactsName: res.contact?.contactsName,
        partyBBankId: res.invoiceResult?.bankId,
        partyBBankName: res.invoiceResult?.bankResult?.bankName,
        partyBBankAccount: res.invoiceResult?.invoiceId,
        partyBBankAccountName: res.invoiceResult?.bankAccount,
        partyBBankNo: res.invoiceResult?.bankNo,
      };

      if (res.defaultContacts) {
        const contact = await contactsRun({ data: { contactsId: res.defaultContacts } });
        setBContactsData(contact);
        info = {
          ...info,
          partyBPhone: contact?.phoneParams[0]?.phoneId,
          partyBPhoneName: contact?.phoneParams[0]?.phone,
        };
        setData({ ...data, ...info });
      }
    },
  });

  return <>
    <MyNavBar title='创建采购单' />
    <FormLayout
      data={data}
      onSave={async (complete) => {
        let value = data;
        if (value.paymentDetail) {
          let percentum = 0;
          value.paymentDetail.map((item) => {
            return percentum += item.percentum;
          });
          if (percentum !== 100) {
            Message.warningDialog({
              content: '请检查付款批次!',
            });
            return false;
          }
        }

        if (value.detailParams) {
          const detailParams = value.detailParams.filter((item) => {
            return item.skuId && item.brandId && item.purchaseNumber && item.onePrice;
          });
          if (detailParams.length !== value.detailParams.length) {
            Message.warningDialog({
              content: '请检查物料清单信息！，品牌、数量、单价为必填信息!',
            });
            return false;
          }
        }

        value = {
          ...value,
          type: 1,
          paymentParam: {
            money: value.money,
            detailParams: value.paymentDetail,
            payMethod: value.payMethod,
            freight: value.freight,
            deliveryWay: value.deliveryWay,
            adressId: value.adressId,
            payPlan: value.payPlan,
            remark: value.remark,
            floatingAmount: value.floatingAmount,
            totalAmount: value.totalAmount,
            paperType: value.paperType,
            rate: value.rate,
          },
          contractParam: {
            templateId: value.templateId,
            coding: value.contractCoding,
            labelResults: value.labelResults,
          },
        };

        let success;
        await orderAddRun({
          data: value,
        }).then(() => {
          success = true;
          if (complete) {
            Message.successDialog({
              content: '创建订单成功！',
              only: true,
              onConfirm: () => history.goBack(),
            });
          }
        }).catch(() => {
          Message.errorToast('创建订单失败！');
          success = false;
        });
        return success;
      }}
      formType={ReceiptsEnums.purchaseOrder}
      fieldRender={(item) => {
        let extra;
        let content;
        switch (item.key) {
          case 'date':
            extra = <MyDatePicker
              value={data[item.key]}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'currency':
            extra = <Currency
              value={data[item.key]}
              onChange={(value) => setData({ ...data, [item.key]: value })}
              placeholder={`请选择${item.filedName || ''}`}
            />;
            break;
          case 'remark':
            content = <TextArea
              style={{ '--font-size': '14px' }}
              placeholder={`请输入${item.filedName || ''}`}
              value={data[item.key]}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'buyerId':
            extra = <div onClick={() => setVisible('buyerId')}>
              {data[item.key] ? data.buyerName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'partyAAdressId':
            extra = <div onClick={() => setVisible('partyAAdressId')}>
              {data[item.key] ? data.partyAAdressName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'partyAContactsId':
            extra = <div onClick={() => setVisible('partyAContactsId')}>
              {data[item.key] ? data.partyAContactsName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'partyAPhone':
            extra = <div onClick={() => setVisible('partyAPhone')}>
              {data[item.key] ? data.partyAPhoneName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'partyABankId':
            extra = <div onClick={() => setVisible('partyABankId')}>
              {data[item.key] ? data.partyABankName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'partyABankAccount':
            extra = <div onClick={() => setVisible('partyABankAccount')}>
              {data[item.key] ? data.partyABankAccountName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'partyALegalPerson':
            extra = selfEnterpriseData.legal || '暂无';
            break;
          case 'partyABankNo':
            extra = data.partyABankNo || '暂无';
            break;
          case 'partyACompanyPhone':
            extra = selfEnterpriseData.telephone || '暂无';
            break;
          case 'partyAFax':
            extra = selfEnterpriseData.fax || '暂无';
            break;
          case 'partyAZipCode':
            extra = selfEnterpriseData.zipCode || '暂无';
            break;
          case 'sellerId':
            extra = <div onClick={() => setVisible('sellerId')}>
              {data[item.key] ? data.sellerName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'partyBAdressId':
            extra = <div onClick={() => setVisible('partyBAdressId')}>
              {data[item.key] ? data.partyBAdressName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'partyBContactsId':
            extra = <div onClick={() => setVisible('partyBContactsId')}>
              {data[item.key] ? data.partyBContactsName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'partyBPhone':
            extra = <div onClick={() => setVisible('partyBPhone')}>
              {data[item.key] ? data.partyBPhoneName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'partyBBankId':
            extra = <div onClick={() => setVisible('partyBBankId')}>
              {data[item.key] ? data.partyBBankName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'partyBBankAccount':
            extra = <div onClick={() => setVisible('partyBBankAccount')}>
              {data[item.key] ? data.partyBBankAccountName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'partyBLegalPerson':
            extra = customerData.legal || '暂无';
            break;
          case 'partyBBankNo':
            extra = data.partyBBankNo || '暂无';
            break;
          case 'partyBCompanyPhone':
            extra = customerData.telephone || '暂无';
            break;
          case 'partyBFax':
            extra = customerData.fax || '暂无';
            break;
          case 'partyBZipCode':
            extra = customerData.zipCode || '暂无';
            break;
          case 'detailParams':
            content = <AddSku
              customerId={data.sellerId}
              onChange={(skus) => {
                let money = 0;
                skus.map((item) => {
                  if (item && item.totalPrice) {
                    money += item.totalPrice;
                  }
                  return null;
                });
                setData({ ...data, [item.key]: skus, money, floatingAmount: 0, totalAmount: money });
              }}
            />;
            break;
          case 'paperType':
            extra = <div onClick={() => setVisible('paperType')}>
              {data[item.key] !== undefined ? data.paperTypeName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'rate':
            extra = <div onClick={() => setVisible('rate')}>
              {data[item.key] !== undefined ? data.rateName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'money':
            extra = data[item.key] || 0;
            break;
          case 'floatingAmount':
            extra = <ShopNumber
              decimal={2}
              min={null}
              value={data[item.key]}
              getContainer={document.body}
              onChange={(value) => setData({
                ...data,
                [item.key]: value,
                totalAmount: (data.money || 0) + (value || 0),
              })}
            />;
            break;
          case 'totalAmount':
            extra = <ShopNumber
              decimal={2}
              value={data[item.key]}
              getContainer={document.body}
              onChange={(value) => setData({
                ...data,
                [item.key]: value,
                floatingAmount: (value || 0) - (data.money || 0),
                paymentDetail: isArray(data.paymentDetail).map((item) => {
                  if (item) {
                    return {
                      ...item,
                      money: (((item.percentum || 0) / 100) * (value || 0)).toFixed(2),
                    };
                  }
                  return item;
                }),
              })}
            />;
            break;
          case 'freight':
            extra = <div onClick={() => setVisible('freight')}>
              {data[item.key] !== undefined ? data.freightName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'payPlan':
            extra = <div onClick={() => setVisible('payPlan')}>
              {data[item.key] !== undefined ? data.payPlanName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'paymentDetail':
            content = <PaymentDetail
              money={data.totalAmount || 0}
              value={isArray(data.paymentDetail)}
              payPlan={data.payPlan}
              onChange={(paymentDetail) => setData({ ...data, paymentDetail })}
            />;
            break;
          case 'paymentRemark':
            content = <TextArea
              placeholder={`请输入${item.filedName || ''}`}
              value={data[item.key]}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'adressId':
            extra = <div onClick={() => setVisible('adressId')}>
              {data[item.key] ? data.adressName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'userId':
            extra = <div onClick={() => setVisible('userId')}>
              {data[item.key] ? data.userName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'leadTime':
            extra = <div className={styles.flexCenter}>
              <ShopNumber getContainer={document.body} number value={data[item.key]} onChange={(value) => {
                setData({
                  ...data,
                  [item.key]: value,
                  deliveryDate: moment(new Date()).add(value, 'day').format('YYYY/MM/DD HH:mm:ss'),
                });
              }} />
              <div>天</div>
            </div>;
            break;
          case 'deliveryDate':
            extra = <MyDatePicker
              precision='second'
              value={data[item.key]}
              onChange={(value) => setData({
                ...data,
                [item.key]: value,
                leadTime: moment(value).diff(new Date(), 'day'),
              })}
            />;
            break;
          case 'generateContract':
            extra = <div onClick={() => setVisible('generateContract')}>
              {data[item.key] !== undefined ? data.generateContractName : <LinkButton
                title={`请选择${item.filedName || ''}`}
              />}
            </div>;
            break;
          case 'fileId':
            if (data.generateContract !== 2) {
              return;
            }
            extra = !data[item.key] && <LinkButton onClick={() => {
              file.current.addFile();
            }}>
              <PaperClipOutlined />
            </LinkButton>;
            content = <UploadFile
              file
              uploadId='contractFile'
              ref={file}
              files={data[item.key] ? [{ mediaId: data[item.key], filedName: data.filedName, url: data.filedUrl }] : []}
              onChange={(medias = []) => {
                setData({
                  ...data,
                  [item.key]: medias[0]?.mediaId,
                  filedName: medias[0]?.filedName,
                  filedUrl: medias[0]?.url,
                });
              }} />;
            break;
          case 'templateId':
            if (data.generateContract !== 1) {
              return;
            }
            extra = <div onClick={() => setVisible('templateId')}>
              {data[item.key] !== undefined ? data.templateName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          case 'contractCoding':
            if (data.generateContract !== 1) {
              return;
            }
            extra = <Input
              value={data[item.key] || ''}
              className={styles.input}
              placeholder={`请输入${item.filedName || ''}`}
              onChange={(value) => {
                setData({ ...data, [item.key]: value });
              }}
            />;
            break;
          case 'labelResults':
            if (data.generateContract !== 1) {
              return;
            }
            return <div hidden={isArray(templateGetLabeData).length === 0 && !templateGetLabelLoading
            }>
              <Divider>{item.filedName}</Divider>
              {templateGetLabelLoading ? <MyLoading skeleton /> : <LabelResults
                array={templateGetLabeData}
                value={data[item.key]}
                onChange={(value) => setData({ ...data, [item.key]: value })}
              />}
              <Divider />
            </div>;
          case 'note':
            content = <TextArea
              value={data[item.key] || ''}
              className={styles.input}
              placeholder={`请输入${item.filedName || ''}`}
              onChange={(value) => {
                setData({ ...data, [item.key]: value });
              }}
            />;
            break;
          default:
            extra = <Input
              value={data[item.key] || ''}
              className={styles.input}
              placeholder={`请输入${item.filedName || ''}`}
              onChange={(value) => {
                setData({ ...data, [item.key]: value });
              }}
            />;
            break;
        }
        const required = item.required;
        return <MyCard
          titleBom={required && <Title className={styles.title}>{item.filedName}<span>*</span></Title>}
          title={item.filedName}
          extraClassName={styles.extra}
          extra={extra}
        >
          {content}
        </MyCard>;
      }}
    />

    <MyPicker
      onClose={() => setVisible('')}
      value={data[visible]}
      visible={['partyAAdressId', 'partyBAdressId', 'adressId'].includes(visible)}
      options={isArray((['partyAAdressId', 'adressId'].includes(visible) ? selfEnterpriseData : customerData)?.adressParams).map((item) => {
        return {
          label: item.detailLocation || item.location,
          value: item.adressId,
        };
      })}
      onChange={(option) => {
        if (visible === 'partyAAdressId') {
          setData({ ...data, partyAAdressId: option.value, partyAAdressName: option.label });
        } else if (visible === 'adressId') {
          setData({ ...data, adressId: option.value, adressName: option.label });
        } else {
          setData({ ...data, partyBAdressId: option.value, partyBAdressName: option.label });
        }
      }}
    />

    <MyPicker
      onClose={() => setVisible('')}
      value={data[visible]}
      visible={['partyAContactsId', 'partyBContactsId', 'userId'].includes(visible)}
      options={isArray((['partyAContactsId', 'userId'].includes(visible) ? selfEnterpriseData : customerData)?.contactsParams).map((item) => {
        return {
          label: item.contactsName,
          value: item.contactsId,
        };
      })}
      onChange={async (option) => {

        if (visible === 'userId') {
          setData({ ...data, userId: option.value, userName: option.label });
          return;
        }
        let infoContact;
        let contact = {};
        if (option.value) {
          contact = await contactsRun({ data: { contactsId: option.value } });
        }
        if (visible === 'partyAContactsId') {
          setAContactsData(contact);
          infoContact = {
            partyAContactsId: option.value,
            partyAContactsName: option.label,
            partyAPhone: contact?.phoneParams[0]?.phoneId,
            partyAPhoneName: contact?.phoneParams[0]?.phone,
          };
        } else {
          setBContactsData(contact);
          infoContact = {
            partyBContactsId: option.value,
            partyBContactsName: option.label,
            partyBPhone: contact?.phoneParams[0]?.phoneId,
            partyBPhoneName: contact?.phoneParams[0]?.phone,
          };
        }

        setData({ ...data, ...infoContact });
      }}
    />

    <MyPicker
      onClose={() => setVisible('')}
      value={data.partyAPhone}
      visible={['partyAPhone', 'partyBPhone'].includes(visible)}
      options={isArray((visible === 'partyAPhone' ? aContactsData : bContactsData).phoneParams).map((item) => {
        return {
          label: item.phone,
          value: item.phoneId,
        };
      })}
      onChange={(option) => {
        setData({ ...data, partyAPhone: option.value, partyAPhoneName: option.label });
      }}
    />

    <MyPicker
      options={ArrayDuplicate((visible === 'partyABankId' ? selfEnterpriseData : customerData).invoiceResults, 'bankId').map(item => ({
        value: item.bankId,
        label: item.bankResult?.bankName,
      }))}
      onClose={() => setVisible('')}
      value={visible === 'partyABankId' ? data.partyABankId : data.partyBBankId}
      visible={['partyABankId', 'partyBBankId'].includes(visible)}
      onChange={(option) => {
        if (visible === 'partyABankId') {
          setData({ ...data, partyABankId: option.value, partyABankName: option.label });
        } else {
          setData({ ...data, partyBBankId: option.value, partyBBankName: option.label });
        }
      }}
    />

    <MyPicker
      options={isArray((visible === 'partyABankAccount' ? selfEnterpriseData : customerData).invoiceResults)
        .filter(item => item.bankId === (visible === 'partyABankAccount' ? data.partyABankId : data.partyBBankId))
        .map((item) => {
          return {
            label: item.bankAccount,
            value: item.invoiceId,
            bankNo: item.bankNo,
          };
        })}
      onClose={() => setVisible('')}
      value={visible === 'partyABankAccount' ? data.partyABankAccount : data.partyBBankAccount}
      visible={['partyABankAccount', 'partyBBankAccount'].includes(visible)}
      onChange={(option) => {
        if (visible === 'partyABankAccount') {
          setData({
            ...data,
            partyABankAccount: option.value,
            partyABankAccountName: option.label,
            partyABankNo: option.bankNo,
          });
        } else {
          setData({
            ...data,
            partyBBankAccount: option.value,
            partyBBankAccountName: option.label,
            partyBBankNo: option.bankNo,
          });
        }
      }}
    />

    <MyPicker
      onClose={() => setVisible()}
      visible={visible === 'paperType'}
      value={data.paperType}
      onChange={(option) => {
        setData({ ...data, paperType: option.value, paperTypeName: option.label });
      }}
      options={[{ label: '普票', value: 0 }, { label: '专票', value: 1 }]}
    />

    <MyPicker
      onClose={() => setVisible()}
      visible={visible === 'rate'}
      value={data.rate}
      onChange={(option) => {
        setData({ ...data, rate: option.value, rateName: option.label });
      }}
      options={taxData}
    />

    <MyPicker
      onClose={() => setVisible()}
      visible={visible === 'freight'}
      value={data.freight}
      onChange={(option) => {
        setData({ ...data, freight: option.value, freightName: option.label });
      }}
      options={[{ label: '是', value: 1 }, { label: '否', value: 0 }]}
    />

    <MyPicker
      onClose={() => setVisible()}
      visible={visible === 'generateContract'}
      value={data.generateContract}
      onChange={(option) => {
        setData({ ...data, generateContract: option.value, generateContractName: option.label });
      }}
      options={[{ label: '生成合同', value: 1 }, { label: '无合同', value: 0 }, { label: '上传合同', value: 2 }]}
    />

    <MyPicker
      onClose={() => setVisible()}
      visible={visible === 'payPlan'}
      value={data.payPlan}
      onChange={async (option) => {
        let paymentDetail;
        switch (option.value) {
          case 2:
          case 3:
            break;
          default:
            const res = await request({ ...paymentTemplateDetail, data: { templateId: option.value } });
            paymentDetail = res.templates;
            break;
        }
        setData({ ...data, payPlan: option.value, payPlanName: option.label, paymentDetail });
      }}
      options={[
        ...isArray(paymentTemplate),
        { label: '按时间分期付款', value: 2 },
        { label: '按动作分期付款', value: 3 },
      ]}
    />

    <Customers
      data={visible === 'buyerId' ? { status: 99 } : { supply: 1 }}
      onClose={() => setVisible('')}
      zIndex={1002}
      value={visible === 'buyerId' ?
        (data.buyerId ? [{ customerId: data.buyerId, customerName: data.buyerName }] : [])
        :
        (data.sellerId ? [{ customerId: data.sellerId, customerName: data.sellerName }] : [])
      }
      visible={['buyerId', 'sellerId'].includes(visible)}
      onChange={(customer) => {
        if (visible === 'buyerId') {
          setData({ ...data, buyerName: customer.customerName, buyerId: customer.customerId });
          if (!customer.customerId) {
            return;
          }
          selfEnterpriseRun({ data: { customerId: customer.customerId } });
        } else {
          setData({ ...data, sellerName: customer.customerName, sellerId: customer.customerId });
          if (!customer.customerId) {
            return;
          }
          customerRun({ data: { customerId: customer.customerId } });
        }
      }}
    />

    <MyCheckList
      searchPlaceholder='请输入合同模板信息'
      api={templateList}
      searchLabel='name'
      label='name'
      listKey='templateId'
      onClose={() => setVisible('')}
      onChange={(template) => {
        if (template.templateId) {
          templateGetLabelRun({ params: { templateId: template.templateId } });
        }
        setData({ ...data, templateName: template.name, templateId: template.templateId });
      }}
      value={data[visible] ? [{ name: data.templateName, templateId: data.templateId }] : []}
      visible={visible === 'templateId'}
      title='选择合同模板'
    />

    {
      (templateLoading || taxLoading || customerLoading || contactsLoading || selfEnterpriseLoading) &&
      <MyLoading />
    }
  </>;
};

export default CreatePurchaseOrder;
