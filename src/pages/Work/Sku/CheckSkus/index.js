import React, { useRef, useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import MySearchBar from '../../../components/MySearchBar';
import { skuList } from '../../../Scan/Url';
import MyList from '../../../components/MyList';
import Icon from '../../../components/Icon';
import { Button, Checkbox, Divider, Space } from 'antd-mobile';
import Label from '../../../components/Label';
import MyEllipsis from '../../../components/MyEllipsis';
import LinkButton from '../../../components/LinkButton';
import MyBottom from '../../../components/MyBottom';
import MyPopup from '../../../components/MyPopup';
import Detail from '../Detail';

const CheckSkus = (
  {
    value = [],
    onCheck = () => {
    },
    onChange = () => {
    },
  }) => {

  const ref = useRef();

  const detailRef = useRef();

  const [data, setData] = useState([]);

  const [skus, setSkus] = useState(value);

  const checked = (id) => {
    return skus.map(item => item.skuId).includes(id);
  };

  const click = (item) => {
    if (checked(item.skuId)) {
      const array = skus.filter((checkItem) => {
        return checkItem.skuId !== item.skuId;
      });
      setSkus(array);
    } else {
      setSkus([...skus, item]);
    }
  };

  return <div style={{ backgroundColor: '#fff' }}>
    <MyBottom
      leftActuions={<div>已选 {skus.length} 条</div>}
      buttons={<Space>
        <Button onClick={() => {
          onCheck(skus);
        }}>选中</Button>
        <Button color='primary' onClick={() => {
          onChange(skus);
        }}>选中并关闭</Button>
      </Space>}
    >
      <div style={{ position: 'sticky', top: 0, zIndex: 99 }}>
        <MySearchBar extra onSearch={(value) => {
          ref.current.submit({ skuName: value });
        }} />
      </div>

      <MyList
        ref={ref}
        api={skuList}
        data={data}
        getData={(value) => {
          setData(value.filter(item => item));
        }}
      >
        {
          data.map((item, index) => {
            return <div key={index}>
              <div style={{ display: 'flex' }}>
                <div
                  style={{ width: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => {
                    click(item);
                  }}
                >
                  <Checkbox
                    checked={checked(item.skuId)}
                    icon={checked =>
                      checked ? <Icon type='icon-duoxuanxuanzhong1' /> : <Icon type='icon-a-44-110' />
                    }
                  />
                </div>
                <div
                  style={{ flexGrow: 1 }}
                  onClick={() => {
                    click(item);
                  }}>
                  <Space direction='vertical' style={{ maxWidth: '70vw' }}>
                    <MyEllipsis>
                      {item.standard} / {item.spuResult && item.spuResult.name}
                    </MyEllipsis>
                    <div style={{ display: 'flex' }}>
                      <div style={{minWidth:115}}>
                        <Label>型号 / 规格 :</Label>
                      </div>
                      <MyEllipsis width='50%'>
                        {item.skuName} / {item.specifications || '无'}
                      </MyEllipsis>
                    </div>
                    <div>
                      <Label>当前库存量 :</Label>0
                    </div>
                  </Space>
                </div>
                <div style={{ width: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LinkButton onClick={() => {
                    detailRef.current.open(item.skuId);
                  }}>详情</LinkButton>
                </div>
              </div>
              <Divider />
            </div>;
          })
        }

      </MyList>
    </MyBottom>


    <MyPopup
      title='物料信息'
      position='bottom'
      height='80vh'
      ref={detailRef}
      component={Detail}
    />

  </div>;
};

export default CheckSkus;
