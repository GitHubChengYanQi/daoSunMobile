import React, { useEffect, useState } from 'react';
import { Card, Checkbox, List, Radio } from 'antd-mobile';
import { Steps } from 'antd';
import LinkButton from '../../../../../../../../components/LinkButton';
import style from './index.less';
import Icon from '../../../../../../../../components/Icon';
import { RightOutline } from 'antd-mobile-icons';
import MyEllipsis from '../../../../../../../../components/MyEllipsis';
import { useRequest } from '../../../../../../../../../util/Request';
import { backDetails } from '../Url';
import { MyLoading } from '../../../../../../../../components/MyLoading';

const Bom = (
  {
    options,
    title,
    value,
    onChange = () => {
    },
    refresh,
  }) => {

  const [type, setType] = useState('Present');

  const [boms, setBoms] = useState([options]);

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

  useEffect(() => {
    if (refresh && !value) {
      setBoms([options]);
    }
  }, [refresh]);

  if (options.length === 0) {
    return <></>;
  }

  return <div>
    <Card
      title={title}
    >
      <div className={style.bomType}>
        <Radio
          checked={type === 'Present'}
          key='children'
          style={{
            '--icon-size': '18px',
            '--font-size': '14px',
            '--gap': '6px',
          }}
          onChange={() => {
            setType('Present');
          }}
        >
          子级物料
        </Radio>
        <Radio
          checked={type === 'All'}
          key='sku'
          style={{
            '--icon-size': '18px',
            '--font-size': '14px',
            '--gap': '6px',
          }}
          onChange={() => {
            setType('All');
          }}
        >
          基础物料
        </Radio>
      </div>

      <div className={style.bomSteps}>
        <Steps className={style.steps}>
          {
            boms.map((item, index) => {
              return <Steps.Step key={index} status={index === boms.length - 1 ? 'process' : 'wait'} />;
            })
          }
        </Steps>
        <LinkButton disabled={boms.length <= 1} className={style.upBom} onClick={() => {
          setBoms(boms.filter((item, index) => {
            return index !== boms.length - 1;
          }));
        }}>上一级</LinkButton>
      </div>

      {loading ? <MyLoading skeleton /> : <List>
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