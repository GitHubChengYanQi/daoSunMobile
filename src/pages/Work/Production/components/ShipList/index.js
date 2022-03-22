import React from 'react';
import MyEmpty from '../../../../components/MyEmpty';
import { Button, Card, List, Space } from 'antd-mobile';
import Label from '../../../../components/Label';
import SkuResultSkuJsons from '../../../../Scan/Sku/components/SkuResult_skuJsons';
import styles from '../../index.css';
import { history } from 'umi';

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

            <List
              style={{
                '--border-top': 'none',
                '--border-bottom': 'none',
              }}
            >
              {
                setpSetDetails.map((item, index) => {
                  return <List.Item key={index} extra={<>× {item.num}</>}>
                    <Space direction='vertical'>
                      <SkuResultSkuJsons skuResult={item.skuResult} />
                    </Space>
                  </List.Item>;
                })
              }

            </List>
          </Card>
          <Button
            onClick={() => {
              history.push('/Work/Production/CreateTask');
            }}
            color='primary'
            style={{
              width: '100%',
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
