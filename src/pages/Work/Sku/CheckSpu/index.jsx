import React, { useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { spuClassListSelect } from '../../Instock/Url';
import MyPicker from '../../../components/MyPicker';
import LinkButton from '../../../components/LinkButton';
import MySearch from '../../../components/MySearch';
import style from '../SkuList/components/SkuScreen/index.less';
import { MyLoading } from '../../../components/MyLoading';
import { Button, Loading, Selector } from 'antd-mobile';
import { SelectorStyle } from '../../../Report/InOutStock';
import { classNames, isArray, ToolUtil } from '../../../components/ToolUtil';
import MyEmpty from '../../../components/MyEmpty';
import MyAntPopup from '../../../components/MyAntPopup';
import { useSetState } from 'ahooks';
import SkuItem from '../SkuItem';
import styles from './index.less';
import { skuDetail, skuList } from '../../../Scan/Url';
import { Message } from '../../../components/Message';

export const spuList = {
  url: '/spu/list',
  method: 'POST',
  rowKey: 'spuId',
};

export const spuDetail = {
  url: '/spu/detail',
  method: 'POST',
  rowKey: 'spuId',
};

const CheckSpu = (
  {
    open,
    close = () => {
    },
    onChange = () => {
    },
  }) => {

  const { loading: skuClassLoading, data: skuClassData = [] } = useRequest(spuClassListSelect);

  const [skuClass, setSkuClass] = useState({});

  const [visible, setVisible] = useState('');

  const [spus, setSpus] = useState([]);

  const [searchValue, setSearchValue] = useState();

  const [spuId, setSpuId] = useState();

  const [config, setConfig] = useSetState({
    list: [],
    tree: [],
  });

  const [checkConfig, setCheckConfig] = useState([]);

  const { loading: skuLoading, data: sku, run: getSku, mutate } = useRequest(skuDetail, { manual: true });

  const change = (skuId) => {
    if (!skuId) {
      mutate(() => ({}));
      return;
    }
    getSku({ data: { skuId } });
  };


  const { loading, run } = useRequest(spuList, {
    manual: true,
    defaultParams: {
      params: { limit: 10, page: 1 },
    },
    onSuccess: (res) => {
      const newArray = Array.isArray(res) ? res.map(item => {
        return {
          label: item.name,
          value: item.spuId,
        };
      }) : [];

      setSpus(newArray);
    },
  });

  const onConfig = (k, v, config) => {

    let newCheckConfig = [];
    if (!k) {
      newCheckConfig = [];
    } else if (v) {
      newCheckConfig = [...checkConfig.filter((item) => {
        return item.k !== k;
      }), { k, v }];
    } else {
      newCheckConfig = [...checkConfig.filter((item) => {
        return item.k !== k;
      })];
    }

    setCheckConfig(newCheckConfig);

    const newConfigList = config.list.filter((item) => {
      return newCheckConfig.filter((checkIitem) => {
        return item[`s${checkIitem.k}`] === checkIitem.v;
      }).length === newCheckConfig.length;
    });

    const onSku = [];

    newConfigList.map((itemList) => {
      const trees = config.tree.filter((itemTree) => {
        return itemList[`s${itemTree.k_s}`];
      });
      if (newCheckConfig.length > 0 && trees.length === newCheckConfig.length) {
        onSku.push(itemList);
      }
      return null;
    });


    if (!v) {
      const sku = newConfigList.find(item => Object.keys(item).length === 1 && Object.keys(item)[0] === 'id');
      change(sku?.id);
    } else if (onSku.length === 1) {
      change(onSku[0].id);
    } else if (newConfigList.length === 1) {
      const check = [];
      config.tree.map((itemTree) => {
        if (newConfigList[0][`s${itemTree.k_s}`]) {
          check.push({
            k: itemTree.k_s,
            v: newConfigList[0][`s${itemTree.k_s}`],
          });
        }
        return null;
      });
      setCheckConfig(check);
      newCheckConfig = check;
      change(newConfigList[0].id);
    } else if (newConfigList.length > 0) {
      const sku = newConfigList.find(item => {
        if (Object.keys(item).length - 1 !== newCheckConfig.length) {
          return false;
        }
        return newCheckConfig.find(checkedItem => {
          return item[`s${checkedItem.k}`] === checkedItem.v;
        });
      });
      change(sku?.id);
    } else {
      change(null);
    }

    const newConfigTree = config.tree.map((itemK) => {
      return {
        ...itemK,
        v: itemK.v.map((itemV) => {
          return {
            ...itemV,
            checked: newCheckConfig.find((item) => {
              return item.v === itemV.id;
            }),
            disabled: !newConfigList.find((itemList) => {
              return itemList[`s${itemK.k_s}`] === itemV.id;
            }),
          };
        }),
      };
    });
    setConfig({ ...config, tree: newConfigTree });
  };

  const { loading: skuListLoading, run: getSkuList } = useRequest(skuList, {
    manual: true,
    onSuccess: (res) => {
      if (isArray(res).length === 0) {
        Message.toast('此产品下没有物料');
      } else {
        onChange(res[0]);
      }
    },
  });

  const { loading: detailLoading, data: spu, run: detailRun } = useRequest(spuDetail,
    {
      manual: true,
      onSuccess: (res) => {

        if (isArray(res?.sku?.list).length === 0) {
          getSkuList({ data: { spuId } });
          return;
        }
        const config = {
          list: res?.sku?.list || [],
          tree: res?.sku?.tree || [],
        };
        onConfig(null, null, config);
        setVisible('sku');
      },
    });

  const like = (string) => {
    run({
      data: { name: string, spuClassificationId: skuClass.value },
      params: { limit: 10, page: 1 },
    });
  };

  return <>
    <MyAntPopup
      afterShow={() => {
        like();
      }}
      afterClose={() => {
        setSkuClass({});
        setSpus([]);
        setSearchValue('');
        setSpuId('');
      }}
      visible={open}
      title='选择产品'
      leftText={<LinkButton onClick={close}>取消</LinkButton>}
      rightText={<LinkButton onClick={() => {
        detailRun({ data: { spuId } });
      }}>确定</LinkButton>}
    >

      <div style={{ padding: 16 }}>
        <div style={{ paddingBottom: 16 }}>
          分类：{
          skuClassLoading ? <Loading /> : <LinkButton
            onClick={() => setVisible('skuClass')}>
            {skuClass.value ? skuClass.label : '请选择物料分类'}
          </LinkButton>
        }
        </div>
        <MySearch
          placeholder=' 请输入产品信息'
          className={style.searchBar}
          onSearch={(value) => {
            like(value);
          }}
          onChange={setSearchValue}
          value={searchValue}
          onClear={like}
        />
        {loading ? <MyLoading skeleton /> : <Selector
          columns={1}
          style={SelectorStyle}
          className={ToolUtil.classNames(style.supply, style.left)}
          showCheckMark={false}
          value={spuId ? [spuId] : spuId}
          options={spus}
          onChange={(v) => {
            setSpuId(v[0]);
          }}
        />}
        {spus.length === 0 && <MyEmpty />}
      </div>


      <MyPicker
        visible={visible === 'skuClass'}
        value={skuClass.value}
        onChange={(option) => {
          run({
            data: { name: searchValue, spuClassificationId: option.value },
            params: { limit: 10, page: 1 },
          });
          setSkuClass(option || {});
        }}
        options={skuClassData}
        onClose={() => setVisible('')}
      />
    </MyAntPopup>

    <MyAntPopup title='选择物料' visible={visible === 'sku'} onClose={() => setVisible('')}>
      <div style={{ padding: 16 }}>
        {<div className={styles.sku}>
          <SkuItem title={spu?.name} noView skuResult={sku} />
        </div>}
        <div className={styles.skuContent}>
          {
            config.tree.map((item, index) => {
              const v = isArray(item.v);
              return <div key={index} className={styles.item}>
                <div className={styles.label}>{item.k}</div>
                <div className={styles.values}>
                  {
                    v.map((itemV, indexV) => {
                      return <div
                        key={indexV}
                        className={classNames(styles.value, itemV.checked && styles.checked, itemV.disabled && styles.disabled)}
                        onClick={() => {
                          if (itemV.disabled) {
                            return;
                          }
                          onConfig(item.k_s, !itemV.checked && itemV.id, config);
                        }}
                      >
                        {itemV.name}
                      </div>;
                    })
                  }
                </div>
              </div>;
            })
          }
        </div>
      </div>
      <div className={styles.add}>
        <Button loading={skuLoading} disabled={!sku?.skuId} color='primary' onClick={() => {
          setVisible('');
          onChange(sku);
        }}>确定</Button>
      </div>
    </MyAntPopup>

    {(detailLoading || skuListLoading) && <MyLoading />}
  </>;
};

export default CheckSpu;
