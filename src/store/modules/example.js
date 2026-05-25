/**
 * @file app store
 * @author
 */

import http from '@/api';
import queryString from 'query-string';

const withQuery = (url, params) => `${url}?${queryString.stringify(params)}`;

export default {
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
    getTableData(context, params, config = {}) {
      return http.get(`/api/table?&${queryString.stringify(params)}`, params, config);
    },
    getBizData(context, params, config = {}) {
      return http.get('/biz-list', config);
    },
    getSetData(context, params, config = {}) {
      return http.get(withQuery('/set-list', params), config);
    },
    getModuleData(context, params, config = {}) {
      return http.get(withQuery('/module-list', params), config);
    },
    getHostsData(context, params, config = {}) {
      return http.get(withQuery('/host-list', params), config);
    },
    getHostDetail(context, params, config = {}) {
      return http.get(withQuery('/host-detail', params), config);
    },
    searchFile(context, params, config = {}) {
      return http.get(withQuery('/search-file', params), config);
    },
    backupFile(context, params, config = {}) {
      return http.get(withQuery('/backup-file', params), config);
    },
    getBackupRecord(context, params, config = {}) {
      return http.get(withQuery('/backup-record', params), config);
    },
  },
};
