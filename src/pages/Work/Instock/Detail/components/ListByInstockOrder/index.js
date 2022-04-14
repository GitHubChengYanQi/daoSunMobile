import React from 'react';
import { useRequest } from '../../../../../../util/Request';
import MyEmpty from '../../../../../components/MyEmpty';
import { MyLoading } from '../../../../../components/MyLoading';
import { Card, Space } from 'antd-mobile';
import MyEllipsis from '../../../../../components/MyEllipsis';
import styles from './index.css';

const ListByInstockOrder = ({ id }) => {

  const { loading, data } = useRequest({
    url: '/instockLog/getListByInstockOrder',
    method: 'GET',
    params: { id },
  });

  if (loading) {
    return <MyLoading />;
  }

  if (!data || data.length === 0) {
    return <MyEmpty />;
  }

  return <div style={{ paddingBottom: 70 }}>
    {
      data.map((item, index) => {
        const user = item.createUserResult || {};
        return <Card
          key={index}
          title={<Space align='center'>
            <div
              style={{
                marginRight: 8,
                backgroundColor: 'var(--adm-color-primary)',
                borderRadius: '100%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}>
              {index + 1}
            </div>
            <Space direction='vertical' style={{ maxWidth: '80vw' }}>
              <div>{item.createTime}</div>
              <div><MyEllipsis>{user.name} / {user.roleName} / {user.deptName}</MyEllipsis></div>
            </Space>
          </Space>}
        >
          <table border={1} className={styles.table}>
            <tbody>
            <tr>
              <td>
                编码
              </td>
              <td>
                名称
              </td>
              <td>
                计划入库
              </td>
              <td>
                入库数量
              </td>
            </tr>
            {
              item.detailResults.map((item, index) => {
                const skuResult = item.skuResult || {};
                return <tr key={index}>
                  <td>
                    <MyEllipsis>{skuResult.standard}</MyEllipsis>
                  </td>
                  <td>
                    <MyEllipsis> {skuResult.spuResult && skuResult.spuResult.name}</MyEllipsis>
                  </td>
                  <td>
                    {item.listNumber}
                  </td>
                  <td>
                    {item.number}
                  </td>
                </tr>;
              })
            }
            </tbody>
          </table>
        </Card>;
      })
    }
  </div>;
};

export default ListByInstockOrder;
