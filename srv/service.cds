using { XiaJiqiang_STUDENTG22 as my } from '../db/schema.cds';

@path: '/service/xiaJiqiang_STUDENTG22'
@requires: 'authenticated-user'
service xiaJiqiang_STUDENTG22Srv {
  @odata.draft.enabled
  entity CustomerMessage as projection on my.CustomerMessage;
}