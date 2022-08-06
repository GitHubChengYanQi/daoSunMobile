import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import MyNavBar from '../../../components/MyNavBar';
import MyCard from '../../../components/MyCard';
import SkuItem from '../../Sku/SkuItem';
import ShopNumber from '../../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { Button } from 'antd-mobile';
import style from './index.less';
import { useHistory } from 'react-router-dom';
import User from '../../Instock/InstockAsk/Submit/components/InstockSkus/components/User';
import MyEmpty from '../../../components/MyEmpty';
import Distribution from './components/Distribution';
import BottomButton from '../../../components/BottomButton';
import { Message } from '../../../components/Message';
import {
  getEndData,
  getStartData,
  getStoreHouse,
} from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Allocation/getData';
import MyAntPopup from '../../../components/MyAntPopup';
import { ToolUtil } from '../../../components/ToolUtil';
import Title from '../../../components/Title';
import Data from './components/Data';

export const detailApi = { url: '/allocation/detail', method: 'POST' };
export const checkCart = { url: '/allocation/checkCart', method: 'POST' };
export const allocationCartDelete = { url: '/allocationCart/delete', method: 'POST' };

const SelectStoreHouse = () => {

  const history = useHistory();

  const query = history.location.query;

  const [user, setUser] = useState({});

  const [params, setParams] = useState({});

  const [data, setData] = useState([]);

  const [storeHouses, setStoreHouses] = useState([]);

  const [visible, setVisible] = useState();

  const { loading: checkCartLoading, run: checkCartRun } = useRequest(checkCart, {
    manual: true,
    onSuccess: () => {
      Message.successToast('分派成功！', () => {
        history.goBack();
      });
    },
  });

  const { loading: detailLoading, run: getDetail, refresh } = useRequest(detailApi, {
    manual: true,
    onSuccess: (res) => {
      setUser({ id: res.userId });
      const detail = res || {};
      const askSkus = getStartData(detail.detailResults);

      const carry = ToolUtil.isArray(detail.allocationCartResults).filter(item => item.type === 'carry');
      const hope = ToolUtil.isArray(detail.allocationCartResults).filter(item => item.type === 'hope');

      const distributionSkuIds = carry.map(item => item.skuId);

      const hopeSkus = getEndData(askSkus, hope);
      const distributionSkus = getEndData(askSkus, carry.filter(item => item.status === 0)).filter(item => distributionSkuIds.includes(item.skuId));

      const newHopeSkus = [];
      hopeSkus.forEach(item => {
        let carryNumber = 0;
        carry.forEach(carryItem => {
          if (carryItem.skuId === item.skuId) {
            carryNumber += carryItem.number;
          }
        });
        const number = item.number - carryNumber;
        if (number > 0) {
          const storeHouse = item.storeHouse || [];
          const newStoreHouse = storeHouse.map(item => {
            const brands = item.brands || [];
            const positions = item.positions || [];
            const newBrands = brands.map(item => ({ ...item, checked: carryNumber === 0 }));
            const newPositions = positions.map(item => {
              const brands = item.brands || [];
              const newBrands = brands.map(item => ({ ...item, checked: carryNumber === 0 }));
              return { ...item, brands: newBrands };
            });
            return { ...item, brands: newBrands, positions: newPositions };
          });
          newHopeSkus.push({ ...item, number, storeHouse: newStoreHouse });
        }
      });

      const stores = getStoreHouse(distributionSkus);

      const out = detail.allocationType !== 1;

      const newParams = {
        out,
        title: `选择调${!out ? '出' : '入'}仓库`,
        distribution: `分配调${!out ? '出' : '入'}物料`,
        batch: out,
        storeHouseTitle: `调${!out ? '出' : '入'}明细`,
      };
      setParams(newParams);
      setData(newHopeSkus);
      setStoreHouses(stores);
    },
  });

  useEffect(() => {
    if (query.id) {
      getDetail({ data: { allocationId: query.id } });
    }
  }, []);

  if (!query.id) {
    return <MyEmpty />;
  }

  return <div style={{ paddingBottom: 60, backgroundColor: '#fff', height: '100%' }}>
    <MyNavBar title={params.title} />
    <div className={style.content}>
      <User id={user.id} title='负责人' name={user.name} avatar={user.avatar} onChange={({ id, name, avatar }) => {
        setUser({ id, name, avatar });
      }} />
      <MyCard hidden={data.length === 0} title='待分配物料'>
        {
          data.map((item, index) => {

            const brands = item.brands || [];

            return <div key={index} className={style.SkuItem} style={{ border: index === data.length - 1 && 'none' }}>
              <div className={style.sku}>
                <SkuItem
                  skuResult={item.skuResult}
                  otherData={[
                    item.haveBrand ? brands.map(item => item.brandName || '无品牌').join(' / ') : '任意品牌',
                  ]}
                  extraWidth='140px'
                />
              </div>
              <div className={style.action}>
                <ShopNumber
                  show
                  value={item.number}
                />
                <Button color='primary' fill='outline' onClick={() => {
                  setVisible(item);
                }}>分配</Button>
              </div>
            </div>;
          })
        }
      </MyCard>

      <MyCard
        titleBom={<Title className={style.storesTitle}>
          {params.storeHouseTitle}
          <span style={{ marginLeft: 8 }}>涉及 <span className='numberBlue'>{storeHouses.length}</span> 个仓库</span>
        </Title>}
        headerClassName={style.cardHeader}
        bodyClassName={style.cardBody}
      >
        <Data out={params.out} storeHouses={storeHouses} setVisible={setVisible} />
      </MyCard>
    </div>

    <MyAntPopup title={params.distribution} visible={visible} onClose={() => setVisible(false)} destroyOnClose>
      <Distribution
        allocationId={query.id}
        skuItem={visible}
        out={params.out}
        onClose={() => setVisible(false)}
        refresh={() => {
          setVisible(false);
          refresh();
        }}
      />
    </MyAntPopup>

    <BottomButton
      leftOnClick={() => {
        history.goBack();
      }}
      rightDisabled={storeHouses.length === 0 || !user.id}
      rightOnClick={() => {
        checkCartRun({
          data: {
            allocationId: query.id,
            userId: user.id,
          },
        });
      }}
    />

    {(detailLoading || checkCartLoading) && <MyLoading />}

  </div>;
};

export default SelectStoreHouse;
