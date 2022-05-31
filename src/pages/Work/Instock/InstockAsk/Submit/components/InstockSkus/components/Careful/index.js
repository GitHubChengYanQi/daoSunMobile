import React, { useState } from 'react';
import style from '../../../PurchaseOrderInstock/index.less';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { Divider, Input, Selector, Toast } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useRequest } from '../../../../../../../../../util/Request';
import { announcementsAdd, announcementsListSelect } from '../../../../../../Url';
import { useBoolean } from 'ahooks';
import LinkButton from '../../../../../../../../components/LinkButton';

const Careful = (
  {
    params,
    setParams,
  }) => {

  const { loading: announcemensLoading, data: announcemens, refresh } = useRequest(announcementsListSelect);

  const { loading: addLoading, run: add } = useRequest(announcementsAdd, {
    manual: true,
    onSuccess: (res) => {
      openAddOther();
      refresh();
      setParams({ ...params, noticeIds: [...(params.noticeIds || []), res.noticeId] });
    },
  });

  const [allCareful, { toggle: carefulToggle }] = useBoolean();

  const [addOther, { toggle: openAddOther }] = useBoolean();

  const [content, setContent] = useState('');

  return <>
    <div className={style.carefulData}>
      <Selector
        value={params.noticeIds}
        className={style.selector}
        options={[...ToolUtil.isArray(announcemens).filter((item, index) => allCareful || index < 6), {
          label: '其他',
          value: 'other',
        }]}
        multiple={true}
        onChange={(noticeIds) => {
          if (noticeIds.includes('other')) {
            setContent('');
            openAddOther();
          }
          setParams({ ...params, noticeIds: noticeIds.filter(item => item !== 'other') });
        }}
      />
      {addOther && <div className={style.addCareful}>
        <Input className={style.input} placeholder='请输入注意事项名称' onChange={setContent} />
        <LinkButton className={style.button} onClick={() => {
          openAddOther();
        }}>取消</LinkButton>
        <LinkButton className={style.button} onClick={() => {
          if (content) {
            add({ data: { content } });
          } else {
            Toast.show({ content: '请输入事项名称！', position: 'bottom' });
          }
        }}>保存</LinkButton>
      </div>}
    </div>
    {ToolUtil.isArray(announcemens).length > 6 && <Divider className={style.allSku}>
      <div onClick={() => {
        carefulToggle();
      }}>
        {
          allCareful ?
            <UpOutline />
            :
            <DownOutline />
        }
      </div>
    </Divider>}

    {(announcemensLoading || addLoading) && <MyLoading />}
  </>;
};

export default Careful;
