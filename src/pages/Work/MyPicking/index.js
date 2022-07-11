import React from 'react';
import MyNavBar from '../../components/MyNavBar';
import style from './index.less';
import { useModel } from 'umi';
import { Image } from 'antd-mobile';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';
import MyEmpty from '../../components/MyEmpty';

const getStoreHouse = { url: '/productionPickListsCart/listPickListsStorehouse', method: 'POST' };

const MyPicking = () => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};

  const history = useHistory();

  const { loading, data } = useRequest(getStoreHouse);

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (!Array.isArray(data)) {
    return <MyEmpty />;
  }

  return <div className={style.myPicking}>
    <MyNavBar title='领料中心' />

    {
      data.map((item, index) => {
        const storehouseResult = item.storehouseResult || {};
        const classCounts = item.classCounts || [];

        return <div key={index} className={style.storeHouseItem} onClick={() => {
          history.push(`/Work/MyPicking/Sku?storehouseId=${storehouseResult.storehouseId}`);
        }}>
          <div className={style.storeHouseData}>
            <div className={style.img}><Image src={state.imgLogo} width={96} height={96} /></div>
            <div className={style.data}>
              <div className={style.name}>
                {storehouseResult.name}
              </div>
              <div className={style.address}>
                地址：{storehouseResult.palce}
              </div>
              <div className={style.pickData}>
                可领物料 <span>{item.skuCount || 0}</span>类 <span>{item.numberCount}</span>件
              </div>
            </div>
          </div>

          <div className={style.skuClassData}>
            {
              classCounts.map((classItem, classindex) => {
                return <div key={classindex} className={style.classItem}>
                  {classItem.className} <span>{classItem.classCount}</span>类 <span>{classItem.numberCount}</span>件
                </div>;
              })
            }
          </div>
        </div>;
      })
    }
  </div>;

};

export default MyPicking;
