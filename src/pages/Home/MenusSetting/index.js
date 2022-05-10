import React, { useState } from 'react';
import style from './index.less';
import { Badge, Card, Grid, Toast } from 'antd-mobile';
import Menus from '../component/Menus';
import { AddOutline, DownOutline, MinusOutline, SetOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import LinkButton from '../../components/LinkButton';
import { Sortable } from '../../components/DndKit/Sortable';
import { Handle } from '../../components/DndKit/Item';
import { useModel } from '../../../.umi/plugin-model/useModel';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';


const menusAddApi = { url: '/mobelTableView/add', method: 'POST' };
const menusDetailApi = { url: '/mobelTableView/detail', method: 'GET' };

const MenusSetting = () => {

  const [commonlyMenus, setCommonlyMenus] = useState([]);

  const [show, { toggle: showToggle }] = useBoolean();

  const [menuSys, { toggle }] = useBoolean();

  const [refresh, { toggle: sortToggle }] = useBoolean();

  const { loading: addLoading, run: addRun } = useRequest(menusAddApi, {
    manual: true,
    onSuccess: () => {
      toggle();
      Toast.show({ content: '保存成功！', position: 'bottom' });
    },
  });

  const { loading: detailLoading } = useRequest(menusDetailApi, {
    onSuccess: (res) => {
      setCommonlyMenus(res.details || []);
    },
  });

  const { initialState } = useModel('@@initialState');

  const sysMenus = initialState.menus || [];

  const menus = (item) => {
    return <Menus
      textOverflow={70}
      module={module}
      code={item.code}
      name={item.name}
      fontSize={40}
      menuSys={menuSys}
    />;
  };

  const addAction = async (data) => {
    await setCommonlyMenus([...commonlyMenus, data]);
    sortToggle();
  };

  const remove = async (code) => {
    await setCommonlyMenus(commonlyMenus.filter(item => item.code !== code));
    sortToggle();
  };

  const Item = (props) => {

    const { value, item, index, ...other } = props;

    if (!menuSys) {
      return menus(item);
    }
    return <div>
      <Badge content={<MinusOutline onClick={() => {
        remove(item.code);
      }} />}>
        <Handle {...other} >
          {menus(item)}
        </Handle>
      </Badge>

    </div>;
  };

  const addButton = (code, name) => {
    const commonly = commonlyMenus.map(item => item.code);
    return (menuSys && !commonly.includes(code)) ? <AddOutline onClick={() => {
      addAction({ code, name });
    }} /> : null;
  };

  return <div className={style.menuSetting}>
    <Card
      className={style.card}
      title={<div className={style.cardTitle}>常用功能</div>}
      extra={<LinkButton
        className={style.menuSys}
        onClick={() => {
          if (menuSys) {
            const details = commonlyMenus.map((item, index) => {
              return {
                ...item,
                sort: index,
              };
            });
            addRun({
              data: { details },
            });
            return;
          }
          toggle();
        }}
      >
        {
          !menuSys
            ?
            <>
              管理<SetOutline style={{ marginLeft: 5 }} />
            </>
            :
            '保存'
        }
      </LinkButton>}
      bodyClassName={(show || menuSys) ? style.commonlyOpen : style.cardBody}
      headerClassName={style.cardHeader}
    >
      {
        (show || menuSys)
          ?
          <Sortable
            refresh={refresh}
            handle={!menuSys}
            style={{ display: 'block' }}
            definedItem={Item}
            Container={(props) => {
              if (props.children.length === 0) {
                return <div style={{ padding: '16px 21px' }}>请添加应用</div>;
              }
              return <Grid columns={4} gap={0}>
                {props.children.map((item, index) => {
                  return <Grid.Item className={style.menus} key={index}>
                    {item}
                  </Grid.Item>;
                })}
              </Grid>;
            }}
            liBorder
            items={commonlyMenus.map(item => {
              return { key: item.code, ...item };
            })}
            onDragEnd={(value) => {
              setCommonlyMenus(value);
            }}
          />
          :
          <div className={style.commonlyClose} onClick={() => {
            showToggle();
          }}>
            <div className={style.commonlyLeft}>
              已收起{commonlyMenus.length}个应用
            </div>
            <div className={style.commonlyRight}>
              {
                commonlyMenus.map((item, index) => {
                  if (index < 5) {
                    return <Menus code={item.code} key={index} onlyIcon />;
                  }
                  return null;
                })
              }
              <DownOutline className={style.commonlyIcon} />
            </div>
          </div>
      }
    </Card>


    {
      sysMenus.map((item, index) => {
        const subMenus = item.subMenus || [];
        return <Card
          key={index}
          className={style.card}
          title={<div className={style.cardTitle}>
            {item.name}
            {addButton(item.id, item.name)}
          </div>}
          bodyClassName={style.menuCardBody}
          headerClassName={style.cardHeader}
        >
          <Grid columns={4} gap={0}>
            {
              subMenus.map((item, index) => {
                return <Grid.Item className={style.menus} key={index}>
                  <Badge content={addButton(item.code, item.name)} color='var(--adm-color-primary)'>
                    {menus(item)}
                  </Badge>
                </Grid.Item>;
              })
            }
          </Grid>
        </Card>;
      })
    }

    {(detailLoading || addLoading) && <MyLoading />}
  </div>;
};

export default MenusSetting;
