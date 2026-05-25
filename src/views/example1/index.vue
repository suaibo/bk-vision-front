<template>
  <div class="example1-wrapper">
    <div class="fr clearfix mb15">
      <bk-form form-type="inline">
        <bk-form-item label="业务">
          <bk-select
            v-model="biz_id"
            style="width: 250px;"
            ext-cls="select-custom"
            ext-popover-cls="select-popover-custom"
            :clearable="false"
            searchable
            @change="handleBizChange">
            <bk-option
              v-for="item in biz_list"
              :key="item.bk_biz_id"
              :id="item.bk_biz_id"
              :name="`${item.bk_biz_id}-${item.bk_biz_name}`">
            </bk-option>
          </bk-select>
        </bk-form-item>
        <bk-form-item label="集群">
          <bk-select
            v-model="set_id"
            style="width: 250px;"
            ext-cls="select-custom"
            ext-popover-cls="select-popover-custom"
            :clearable="false"
            searchable
            @change="handleSetChange">
            <bk-option
              v-for="item in set_list"
              :key="item.bk_set_id"
              :id="item.bk_set_id"
              :name="`${item.bk_set_id}-${item.bk_set_name}`">
            </bk-option>
          </bk-select>
        </bk-form-item>
        <bk-form-item label="模块">
          <bk-select
            v-model="module_id"
            style="width: 250px;"
            ext-cls="select-custom"
            ext-popover-cls="select-popover-custom"
            :clearable="false"
            searchable
            @change="handleModuleChange">
            <bk-option
              v-for="item in module_list"
              :key="item.bk_module_id"
              :id="item.bk_module_id"
              :name="`${item.bk_module_id}-${item.bk_module_name}`">
            </bk-option>
          </bk-select>
        </bk-form-item>
        <bk-form-item label="操作人">
          <bk-input v-model="operator" placeholder="操作人" />
        </bk-form-item>
        <bk-form-item>
          <bk-button theme="primary" title="查询" @click="searchHosts">查询</bk-button>
        </bk-form-item>
      </bk-form>
    </div>

    <bk-table
      style="margin-top: 15px;"
      :data="host_list"
      :size="size"
      :pagination="pagination"
      v-bkloading="{ isLoading: isLoading, title: '正在加载...', zIndex: 15 }"
      @page-change="handlePageChange">
      <bk-table-column label="主机ID" prop="bk_host_id" />
      <bk-table-column label="主机IP" prop="bk_host_innerip" />
      <bk-table-column label="操作人" prop="operator" />
      <bk-table-column label="备份维护人" prop="bk_bak_operator" />
      <bk-table-column label="操作" width="150">
        <template slot-scope="props">
          <bk-button theme="primary" text @click="getHostDetail(props.row.bk_host_id)">
            查看详情
          </bk-button>
        </template>
      </bk-table-column>
    </bk-table>

    <bk-sideslider
      class="bk-layout-component-nelgpjna sideslider1e5ab"
      :is-show.sync="isSidesliderShow"
      :title="'主机详情'"
      :show-mask="false"
      :width="600"
      direction="right">
      <template slot="content">
        <div class="step-detail-container">
          <div
            v-for="item in host_detail"
            :key="item.bk_property_id"
            class="step-detail-item">
            <strong>{{ item.bk_property_name }}：</strong>
            <span>{{ item.bk_property_value || '无' }}</span>
          </div>
        </div>
      </template>
    </bk-sideslider>
  </div>
</template>

<script>
export default {
  data() {
    return {
      size: 'small',
      biz_list: [],
      set_list: [],
      module_list: [],
      host_list: [],
      host_detail: [],
      biz_id: null,
      set_id: null,
      module_id: null,
      operator: null,
      isSidesliderShow: false,
      isLoading: false,
      pagination: {
        current: 1,
        count: 0,
        limit: 10,
      },
    };
  },
  created() {
    this.getBizData();
  },
  methods: {
    async getBizData() {
      const res = await this.$store.dispatch('example/getBizData', {}, { fromCache: true });
      this.biz_list = ((res.data || {}).info || []);
    },
    async handleBizChange(newValue) {
      this.biz_id = newValue;
      this.set_id = null;
      this.module_id = null;
      this.set_list = [];
      this.module_list = [];
      if (!newValue) {
        return;
      }
      const setRes = await this.$store.dispatch('example/getSetData', { bk_biz_id: newValue }, { fromCache: true });
      this.set_list = ((setRes.data || {}).info || []);
    },
    async handleSetChange(newValue) {
      this.set_id = newValue;
      this.module_id = null;
      this.module_list = [];
      if (!this.biz_id || !newValue) {
        return;
      }
      const moduleRes = await this.$store.dispatch('example/getModuleData', {
        bk_biz_id: this.biz_id,
        bk_set_id: newValue,
      }, { fromCache: true });
      this.module_list = ((moduleRes.data || {}).info || []);
    },
    handleModuleChange(newValue) {
      this.module_id = newValue;
    },
    async searchHosts() {
      if (!this.biz_id) {
        this.$bkMessage({
          theme: 'warning',
          message: '请选择业务',
          offsetY: 80,
        });
        return;
      }

      const queryData = {
        bk_biz_id: this.biz_id,
      };
      if (this.set_id) {
        queryData.bk_set_id = this.set_id;
      }
      if (this.module_id) {
        queryData.bk_module_id = this.module_id;
      }
      if (this.operator) {
        queryData.operator = this.operator;
      }

      this.isLoading = true;
      try {
        const hostRes = await this.$store.dispatch('example/getHostsData', queryData, { fromCache: false });
        this.host_list = ((hostRes.data || {}).info || []);
        this.pagination.count = (hostRes.data || {}).count || this.host_list.length;
      } finally {
        this.isLoading = false;
      }
    },
    async getHostDetail(bkHostId) {
      const hostRes = await this.$store.dispatch('example/getHostDetail', { bk_host_id: bkHostId }, { fromCache: false });
      this.host_detail = hostRes.data || [];
      this.isSidesliderShow = true;
    },
    handlePageChange(page) {
      this.pagination.current = page;
    },
  },
};
</script>
