import React, { useEffect, useState } from 'react';
import { List } from 'antd-mobile';
import { LeftOutline, RightOutline } from 'antd-mobile-icons';
import LinkButton from '../../../../../../../../../../../../components/LinkButton';
import { MyLoading } from '../../../../../../../../../../../../components/MyLoading';
import MyCheck from '../../../../../../../../../../../../components/MyCheck';
import MyEllipsis from '../../../../../../../../../../../../components/MyEllipsis';
import MySearch from '../../../../../../../../../../../../components/MySearch';
import { useRequest } from '../../../../../../../../../../../../../util/Request';
import {
  backDetails,
  partsList,
} from '../../../../../../../../../../../Sku/SkuList/components/SkuScreen/components/Url';
import { SkuResultSkuJsons } from '../../../../../../../../../../../../Scan/Sku/components/SkuResult_skuJsons';
import spuStyle from '../../index.less';
import style from '../../../../../../../../../../../Sku/SkuList/components/SkuScreen/components/Bom/index.less';
import { ToolUtil } from '../../../../../../../../../../../../components/ToolUtil';
import BottomButton from '../../../../../../../../../../../../components/BottomButton';

const Bom = (
  {
    value = [],
    onChange = () => {
    },
    selectBom,
  }) => {

  const [all, setAll] = useState(selectBom === 'All');

  const [boms, setBoms] = useState([[]]);

  const { loading, run } = useRequest(backDetails, {
    manual: true,
    onSuccess: (res) => {
      if (Array.isArray(res)) {
        setBoms([...boms, res.map(item => {
          const skuResult = item.skuResult || {};
          const spuResult = skuResult.spuResult || {};
          return {
            key: item.skuId,
            title: spuResult.name + ' ' + skuResult.skuName,
            partsId: item.partsId,
            isNull: !item.isNull,
          };
        })]);
      }
    },
  });

  const [searchValue, setSearchValue] = useState();

  const { loading: listLoading, run: listRun } = useRequest(partsList, {
    manual: true,
    onSuccess: (res) => {
      const options = res.map((item) => {
        return {
          title: SkuResultSkuJsons({ skuResult: item.skuResult }),
          key: item.skuId,
        };
      });
      setBoms([options]);
    },
  });

  const Select = (skuName) => {
    listRun({
      params: { limit: 10, page: 1 },
      data: { skuName },
    });
  };

  useEffect(() => {
    Select();
  }, []);

  const [bomItem, setBomItem] = useState(value);

  const keys = bomItem.map(item => item.key);

  return <div style={{ padding: 12 }}>
    <MySearch
      className={spuStyle.filterSearch}
      onSearch={(value) => {
        Select(value);
      }}
      onChange={setSearchValue}
      value={searchValue}
      onClear={Select}
    />
    <div className={style.bomType} style={{ paddingBottom: 16 }}>
      <div className={style.radio}>
        <MyCheck checked={all} onChange={(checked) => {
          setAll(checked);
        }}>全部BOM</MyCheck>
      </div>

      {boms.length > 1 && <LinkButton className={style.upBom} onClick={() => {
        setBoms(boms.filter((item, index) => {
          return index !== boms.length - 1;
        }));
      }}><LeftOutline /> 返回{boms.length - 1}级</LinkButton>}
    </div>
    <div style={{ paddingBottom: 60 }}>
      {(loading || listLoading) ? <MyLoading skeleton /> : <List className={spuStyle.list}>
        {
          boms[boms.length - 1].map((item, index) => {
            return <List.Item
              className={ToolUtil.classNames(style.bomItem, spuStyle.bomItem)}
              key={index}
              extra={!item.isNull && <RightOutline
                style={{ color: '#000000' }}
                onClick={() => {
                  run({ params: { id: item.key, type: 1 } });
                }}
              />}
            >
              <div className={style.listItem}>
                <MyCheck
                  checked={keys.includes(item.key)}
                  onChange={(checked) => {
                    if (checked) {
                      setBomItem([...bomItem, item]);
                    } else {
                      setBomItem(bomItem.filter(bomItem => bomItem.key !== item.key));
                    }

                  }}
                >
                  <MyEllipsis width='100%'>{item.title}</MyEllipsis>
                </MyCheck>
              </div>

            </List.Item>;
          })
        }
      </List>}
      <BottomButton
        leftText='重置'
        svg
        className={style.bottom}
        rightOnClick={() => {
          onChange(bomItem, all ? 'All' : 'Present');
        }}
        leftOnClick={() => {
          onChange({});
        }}
      />
    </div>

  </div>;
};

export default Bom;
