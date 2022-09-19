import React, { useState } from 'react';
import { Divider, Popup } from 'antd-mobile';
import { AddButton } from '../../../../../../components/MyButton';
import Spus from '../Spus';
import { useRequest } from '../../../../../../../util/Request';
import { MyLoading } from '../../../../../../components/MyLoading';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import { Message } from '../../../../../../components/Message';
import SkuItem from '../../../../../Sku/SkuItem';
import LinkButton from '../../../../../../components/LinkButton';
import style from './index.less';
import MyRemoveButton from '../../../../../../components/MyRemoveButton';
import MyEllipsis from '../../../../../../components/MyEllipsis';
import { useHistory } from 'react-router-dom';

export const getOne = { url: '/inventory/conditionGetOne', method: 'POST' };

const SelectSkus = (
  {
    inkind,
    noChecked,
    value = [],
    onChange = () => {
    },
    backTitle,
  },
) => {

  const [visible, setVisible] = useState();

  const { loading, run } = useRequest(getOne, {
    manual: true,
    onError: () => {
      Message.errorToast('添加物料失败！');
    },
  });

  const [skus, setSkus] = useState(value);

  const skusChange = (newSkus) => {
    setSkus(newSkus);
    onChange(newSkus);
  };

  return <div className={style.skus}>
    {
      skus.map((item, index) => {
        const skuResult = item.skuResult || {};
        const inkindId = skuResult.inkindId;
        return <div key={index} className={style.skuItem}>
          <div className={style.nav} style={{
            background: index % 2 === 0 ? 'rgb(57 116 199 / 20%)' : 'rgb(57 116 199 / 50%)',
            color: index % 2 === 0 ? 'rgb(57 116 199 / 80%)' : '#fff',
          }}>
            物 <br /> 料 <br />{index + 1}
          </div>
          <div className={style.skuData}>
            <div className={style.skuAction}>
              <div className={style.sku}>
                <SkuItem
                  skuResult={skuResult}
                  otherData={[ToolUtil.isObject(item.brandResult).brandName || '所有品牌']}
                />
              </div>
              <MyRemoveButton onRemove={() => {
                skusChange(skus.filter((item, removeIndex) => removeIndex !== index));
              }} />
            </div>
            <Divider style={{ margin: '0 24px' }} />
            <div className={style.text} hidden={!item.params && !inkindId}>
              <MyEllipsis
                maxWidth='70vw'
                width='auto'
              >
                {!inkindId ? item.filterText : `实物养护 (${skuResult.number || 0})`}
              </MyEllipsis>
              {!inkindId && <LinkButton onClick={() => {
                setVisible({ ...item.params, key: index });
              }}>({item.skuNum}) >></LinkButton>}
            </div>
          </div>

        </div>;
      })
    }
    <Divider style={{ margin: 0, padding: 12, backgroundColor: '#fff' }}>
      <AddButton onClick={() => {
        setVisible({});
      }} />
    </Divider>

    <Popup
      visible={visible}
      position='right'
      destroyOnClose
    >
      <Spus
        backTitle={backTitle}
        inkind={inkind}
        noChecked={noChecked}
        value={visible}
        onClose={() => setVisible(null)}
        onChange={async (params, checkSkus = []) => {
          if (checkSkus.length > 0) {
            const addSkus = checkSkus.map(item => {
              return {
                skuResult: item,
              };
            });
            let newSkus = skus;
            if (params.key !== undefined) {
              newSkus = skus.filter((item, index) => index !== params.key);
            }
            skusChange([...newSkus, ...addSkus]);
            return;
          }
          const filterText = [];
          params.name && filterText.push(params.name);
          const skuClasses = ToolUtil.isArray(params.skuClasses);
          const brands = ToolUtil.isArray(params.brands);
          const positions = ToolUtil.isArray(params.positions);
          const boms = ToolUtil.isArray(params.boms);

          const sku = await run({
            data: {
              spuIds: params.spuId && [params.spuId],
              classIds: skuClasses.map(item => {
                filterText.push(item.label);
                return item.value;
              }),
              brandIds: brands.map(item => {
                filterText.push(item.label);
                return item.value;
              }),
              positionIds: positions.map(item => {
                filterText.push(item.name);
                return item.id;
              }),
              bomIds: boms.map(item => {
                filterText.push(item.title);
                return item.key;
              }),
            },
          });
          if (sku) {

            if (params.key !== undefined) {
              const newSkus = skus.map((item, index) => {
                if (index === params.key) {
                  return { ...sku, filterText: filterText.join('/'), params };
                } else {
                  return item;
                }
              });
              skusChange(newSkus);
            } else {
              skusChange([...skus, { ...sku, filterText: filterText.join('/'), params }]);
            }
          } else {
            Message.warningDialog({ content: '库存不存在此物料!' });
          }
        }}
      />
    </Popup>

    {loading && <MyLoading />}
  </div>;
};

export default SelectSkus;
