import React, { useEffect, useState } from 'react';
import { Card, Checkbox, Divider, List, Radio, Steps } from 'antd-mobile';
import LinkButton from '../../../../../../../components/LinkButton';
import style from './index.less';
import Icon from '../../../../../../../components/Icon';
import { LeftOutline, RightOutline } from 'antd-mobile-icons';
import MyEllipsis from '../../../../../../../components/MyEllipsis';
import { useRequest } from '../../../../../../../../util/Request';
import { backDetails, partsList } from '../Url';
import { MyLoading } from '../../../../../../../components/MyLoading';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import MySearch from '../../../../../../../components/MySearch';
import { SkuResultSkuJsons } from '../../../../../../../Scan/Sku/components/SkuResult_skuJsons';

const Bom = (
  {
    title,
    value,
    onChange = () => {
    },
  }) => {

  const [type, setType] = useState('Present');

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

  return <div className={style.content}>
    <Card
      title={<Divider contentPosition='left' className={style.divider}>{title}</Divider>}
    >
      <MySearch
        className={style.searchBar}
        onSearch={(value) => {
          Select(value);
        }}
        onChange={setSearchValue}
        value={searchValue}
        onClear={Select}
      />
      <div className={style.bomType}>
        <div className={style.radio}>
          <Radio
            icon={(checked) => {
              return <Icon type={checked ? 'icon-a-danxuanxuanzhong' : 'icon-danxuanweixuanzhong'} />;
            }}
            checked={type === 'Present'}
            key='children'
            style={{
              '--icon-size': '18px',
              '--font-size': '14px',
              '--gap': '6px',
            }}
            onChange={() => {
              setType('Present');
              if (value) {
                onChange(value, 'Present');
              }
            }}
          >
            显示下一级
          </Radio>
          <Radio
            icon={(checked) => {
              return <Icon type={checked ? 'icon-a-danxuanxuanzhong' : 'icon-danxuanweixuanzhong'} />;
            }}
            checked={type === 'All'}
            key='sku'
            style={{
              '--icon-size': '18px',
              '--font-size': '14px',
              '--gap': '6px',
            }}
            onChange={() => {
              setType('All');
              if (value) {
                onChange(value, 'All');
              }
            }}
          >
            显示全部
          </Radio>
        </div>

        {boms.length > 1 && <LinkButton className={style.upBom} onClick={() => {
          setBoms(boms.filter((item, index) => {
            return index !== boms.length - 1;
          }));
        }}><LeftOutline /> 返回至第{boms.length - 1}级</LinkButton>}
      </div>

      <div className={style.bomSteps}>
        <Steps
          current={1}
          style={{
            '--title-font-size': '14px',
            '--description-font-size': '15px',
            '--indicator-margin-right': '12px',
            '--icon-size': '14px',
          }}
        >
          {
            boms.map((item, index) => {
              return <Steps.Step
                key={index}
                icon={<div
                  className={ToolUtil.classNames(
                    style.stepIcon,
                    index === boms.length - 1 ? style.stepCurrentIcon : style.stepOtherIcon,
                  )}
                >{index + 1}</div>}
                status='process'
              />;
            })
          }
        </Steps>
      </div>

      {(loading || listLoading) ? <MyLoading skeleton /> : <List>
        {
          boms[boms.length - 1].map((item, index) => {
            return <List.Item
              className={style.bomItem}
              key={index}
              extra={!item.isNull && <RightOutline
                style={{ color: '#000000' }}
                onClick={() => {
                  run({ params: { id: item.key, type: 1 } });
                }}
              />}
            >
              <div className={style.listItem}>
                <Checkbox
                  checked={value === item.key}
                  icon={(checked) => {
                    return checked ? <Icon type='icon-a-jianqudingceng2' /> : <Icon type='icon-jizhumimamoren' />;
                  }}
                  onChange={(checked) => {
                    if (!checked) {
                      onChange(null, type);
                    } else {
                      onChange(item.key, type);
                    }
                  }}
                >
                  <MyEllipsis width='100%'>{item.title}</MyEllipsis>
                </Checkbox>
              </div>

            </List.Item>;
          })
        }
      </List>}

    </Card>

  </div>;
};

export default Bom;
