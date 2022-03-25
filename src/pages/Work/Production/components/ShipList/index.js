import React from 'react';
import MyEmpty from '../../../../components/MyEmpty';
import { Button, Card, List, ProgressBar, Space } from 'antd-mobile';
import Label from '../../../../components/Label';
import styles from '../../index.css';
import { history } from 'umi';
import SkuResultSkuJsons from '../../../../Scan/Sku/components/SkuResult_skuJsons';

const ShipList = ({ data }) => {

  if (!Array.isArray(data) || data.length === 0) {
    return <MyEmpty />;
  }

  return <div className={styles.mainDiv}>
    {
      data.map((item, index) => {
        const setpSetResult = item.setpSetResult || {};
        const shipSetpResult = setpSetResult.shipSetpResult || {};
        const productionStation = setpSetResult.productionStation || {};
        const setpSetDetails = setpSetResult.setpSetDetails || [];

        return <div style={{ margin: 8 }} key={index}>
          <Card
            style={{ borderRadius: 0 }}
            key={index}
            title={<Space>
              <div>
                <Label>工序名称：</Label>{shipSetpResult.shipSetpName}
              </div>
              <div>
                <Label>工位：</Label>{productionStation.name}
              </div>
            </Space>}
          >
            <div style={{ display: 'flex' }}>
              <Space direction='vertical' align='center' style={{ flexGrow: 1 }}>
                <div>
                  卡片数
                </div>
                <div>
                  {item.count}
                </div>
              </Space>
              <Space direction='vertical' align='center' style={{ flexGrow: 1, color: '#f38403' }}>
                <div>
                  工单数
                </div>
                <div>
                  {item.count}
                </div>
              </Space>
              <Space direction='vertical' align='center' style={{ flexGrow: 1, color: 'green' }}>
                <div>
                  进行中
                </div>
                <div>
                  0
                </div>
              </Space>
              <Space direction='vertical' align='center' style={{ flexGrow: 1, color: 'blue' }}>
                <div>
                  已完成
                </div>
                <div>
                  0
                </div>
              </Space>
            </div>
          </Card>
          <List style={{backgroundColor:'#fff'}} header={<>产出物料</>}>
            {
              setpSetDetails.map((skuItem,index) => {
                return <List.Item key={index} extra={' × '+(parseInt(skuItem.num) * parseInt(item.count))}>
                  <SkuResultSkuJsons skuResult={skuItem.skuResult} />
                </List.Item>;
              })
            }
          </List>

          <ProgressBar percent={0} />
          <Button
            onClick={() => {
              history.push(`/Work/Production/CreateTask?id=${item.workOrderId}&max=${item.count}&shipName=${shipSetpResult.shipSetpName}`);
            }}
            style={{
              width: '100%',
              color: 'var(--adm-color-primary)',
              '--border-radius': '10px',
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          >
            指派任务
          </Button>
        </div>;
      })
    }

  </div>;
};

export default ShipList;
