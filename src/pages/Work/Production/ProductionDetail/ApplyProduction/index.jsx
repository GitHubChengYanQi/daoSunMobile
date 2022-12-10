import React, { useRef, useState } from 'react';
import MyNavBar from '../../../../components/MyNavBar';
import MyCard from '../../../../components/MyCard';
import { Space } from 'antd';
import SkuItem from '../../../Sku/SkuItem';
import styles from '../components/Details/index.less';
import ShopNumber from '../../../AddShop/components/ShopNumber';
import { Divider, TextArea } from 'antd-mobile';
import User from '../../../CreateTask/components/User';
import LinkButton from '../../../../components/LinkButton';
import { PaperClipOutlined } from '@ant-design/icons';
import UploadFile from '../../../../components/Upload/UploadFile';
import { AddButton } from '../../../../components/MyButton';

const ApplyProduction = () => {

  const [data, setData] = useState({});

  const file = useRef();

  return <>
    <MyNavBar title='申请投产' />
    <MyCard title='部件' extra={<Space size={24}>
      <div>已投产：10</div>
      <div>可投产：10</div>
    </Space>}>
      <div className={styles.flexCenter}>
        <SkuItem imgSize={56} className={styles.flexGrow} />
        <ShopNumber show value={0} />
      </div>

      <Divider contentPosition='left'>明细</Divider>

      {
        [1, 2].map((item, index) => {
          return <div key={index} className={styles.productionDetail}>
            <div className={styles.flexCenter}>
              <SkuItem imgSize={56} className={styles.flexGrow} />
              <ShopNumber show value={0} />
            </div>
          </div>;
        })
      }
    </MyCard>

    <User
      title='领料人'
      value={data.userId ? [{
        id: data.userId,
        name: data.userName,
        avatar: data.avatar,
      }] : []}
      onChange={(users) => {
        const { id, name, avatar } = users[0] || {};
        setData({ ...data, userId: id, userName: name, avatar });
      }}
    />

    <MyCard title='数量' extra={<ShopNumber />} />

    <MyCard title='关联产品编号'>
      <Divider>
        <AddButton onClick={() => {

        }} />
      </Divider>
    </MyCard>

    <MyCard title='添加备注'>
      <TextArea
        rows={3}
        autoSize
        style={{ '--font-size': '14px' }}
        placeholder={`请输入`}
      />
    </MyCard>

    <MyCard title='添加附件' extra={<LinkButton onClick={() => {
      file.current.addFile();
    }}>
      <PaperClipOutlined />
    </LinkButton>}>
      <UploadFile
        file
        uploadId='contractFile'
        ref={file}
        onChange={(medias = []) => {
          setData({
            ...data,
            [item.key]: medias[0]?.mediaId,
            filedName: medias[0]?.filedName,
            filedUrl: medias[0]?.url,
          });
        }} />
    </MyCard>
  </>;
};

export default ApplyProduction;
