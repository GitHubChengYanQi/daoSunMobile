import React from 'react';
import MaterialAnalysis from './components/MaterialAnalysis';
import style from './index.less';
import Title from '../components/Title';
import MyNavBar from '../components/MyNavBar';
import InventoryRotation from './components/InventoryRotation';
import WorkEfficiency from './components/WorkEfficiency';
import ErrorSku from './components/ErrorSku';

const Report = () => {

  return <div className={style.report}>
    <div className={style.Item}>
      <div>
        <Title>物料分析</Title>
      </div>
      <MaterialAnalysis />
    </div>

    <div className={style.Item}>
      <div>
        <Title>库存轮转</Title>
      </div>
      <InventoryRotation />
    </div>

    <div className={style.Item}>
      <div>
        <Title>工作效率</Title>
      </div>
      <WorkEfficiency />
    </div>

    <div className={style.Item}>
      <div>
        <Title>异常物料</Title>
      </div>
      <ErrorSku />
    </div>

  </div>;
};

export default Report;
