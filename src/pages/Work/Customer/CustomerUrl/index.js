
export const UserIdSelect = {
  url: '/rest/mgr/Select',
  method: 'POST',
};

export const CustomerLevelIdSelect = {
  url: '/crmCustomerLevel/listSelect',
  method: 'POST'
};

export const OriginIdSelect = {
  url: '/origin/listSelect',
  method: 'POST'
};

export const crmIndustryTreeView = {
  url: '/crmIndustry/treeView',
  method: 'POST',
  rowKey:'industryId'
};

export const CompanyRoleIdSelect = {
  url: '/companyRole/listSelect',
  method: 'POST',
};

export const commonArea = {
  url: '/commonArea/treeView',
  method: 'POST',
};

export const contractIdSelect = {
  url: '/contract/listSelect',
  method: 'POST'
};

export const BusinessNameListSelect = {
  url: '/crmBusiness/listSelect',
  method: 'POST',
};

export const customerIdSelect = {
  url: '/customer/listSelect',
  method: 'POST'
};

export const trackMessageAdd = {
  url: '/trackMessage/add',
  method: 'POST',
  rowKey:'trackMessageId'
};

export const supplierIdSelect = {
  url: '/supplier/listSelect',
  method: 'POST'
};

export const supplierBySku = {
  url: '/supply/getCustomerBySku',
  method: 'POST'
};

