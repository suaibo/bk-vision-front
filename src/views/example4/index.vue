<template>
  <div class="backup-record-page">
    <div class="record-toolbar">
      <bk-form form-type="inline">
        <bk-form-item label="主机ID">
          <bk-input v-model="filters.bk_host_id" placeholder="全部" />
        </bk-form-item>
        <bk-form-item label="备份人">
          <bk-input v-model="filters.operator" placeholder="用户名" />
        </bk-form-item>
        <bk-form-item label="后缀">
          <bk-input v-model="filters.suffix" placeholder="log" />
        </bk-form-item>
        <bk-form-item label="关键字">
          <bk-input v-model="filters.keyword" placeholder="备份文件名" />
        </bk-form-item>
        <bk-form-item>
          <bk-button theme="primary" icon="search" @click="getBackupRecord">查询</bk-button>
          <bk-button icon="refresh" @click="resetFilters">重置</bk-button>
          <bk-button icon="download" @click="exportCsv">导出CSV</bk-button>
        </bk-form-item>
      </bk-form>
    </div>

    <div class="record-summary">
      <div class="summary-item">
        <div class="summary-value">{{ summary.total || 0 }}</div>
        <div class="summary-label">备份记录</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">{{ summary.host_count || 0 }}</div>
        <div class="summary-label">涉及主机</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">{{ summary.operator_count || 0 }}</div>
        <div class="summary-label">备份用户</div>
      </div>
      <div class="summary-item wide">
        <div class="summary-value">{{ summary.latest_time || '-' }}</div>
        <div class="summary-label">最近备份时间</div>
      </div>
    </div>

    <bk-table
      style="margin-top: 15px;"
      :data="recordData"
      v-bkloading="{ isLoading: isLoading, title: '正在加载备份记录...', zIndex: 15 }">
      <bk-table-column type="index" label="序号" align="center" width="60" />
      <bk-table-column label="主机ID" prop="bk_host_id" width="120" />
      <bk-table-column label="文件目录" prop="bk_file_dir" width="180" />
      <bk-table-column label="文件后缀" prop="bk_file_suffix" width="100" />
      <bk-table-column label="备份文件" prop="bk_backup_name" />
      <bk-table-column label="备份时间" prop="bk_file_create_time" width="200" />
      <bk-table-column label="备份人" prop="bk_file_operator" width="150" />
      <bk-table-column label="备份结果" prop="bk_job_link" width="100">
        <template slot-scope="{ row }">
          <a :href="row.bk_job_link" target="_blank">JOB结果</a>
        </template>
      </bk-table-column>
    </bk-table>
  </div>
</template>

<script>
const CSV_HEADERS = [
  ['bk_host_id', '主机ID'],
  ['bk_file_dir', '文件目录'],
  ['bk_file_suffix', '文件后缀'],
  ['bk_backup_name', '备份文件'],
  ['bk_file_create_time', '备份时间'],
  ['bk_file_operator', '备份人'],
  ['bk_job_link', 'JOB结果'],
];

export default {
  data() {
    return {
      filters: {
        bk_host_id: '',
        operator: '',
        suffix: '',
        keyword: '',
      },
      recordData: [],
      summary: {},
      isLoading: false,
    };
  },
  created() {
    this.getBackupRecord();
  },
  methods: {
    buildQuery() {
      const query = { include_summary: 1 };
      Object.keys(this.filters).forEach((key) => {
        const value = `${this.filters[key] || ''}`.trim();
        if (value) {
          query[key] = value;
        }
      });
      return query;
    },
    async getBackupRecord() {
      this.isLoading = true;
      try {
        const res = await this.$store.dispatch('example/getBackupRecord', this.buildQuery(), {
          clearCache: true,
        });
        const data = res.data || {};
        this.recordData = data.items || [];
        this.summary = data.summary || {};
      } finally {
        this.isLoading = false;
      }
    },
    resetFilters() {
      this.filters = {
        bk_host_id: '',
        operator: '',
        suffix: '',
        keyword: '',
      };
      this.getBackupRecord();
    },
    exportCsv() {
      if (!this.recordData.length) {
        this.$bkMessage({
          theme: 'primary',
          message: '暂无可导出的备份记录',
          offsetY: 80,
        });
        return;
      }
      const escapeCsv = value => `"${`${value || ''}`.replace(/"/g, '""')}"`;
      const rows = [
        CSV_HEADERS.map(([, label]) => escapeCsv(label)).join(','),
        ...this.recordData.map(record => CSV_HEADERS.map(([key]) => escapeCsv(record[key])).join(',')),
      ];
      const blob = new Blob([`\uFEFF${rows.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `backup-records-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    },
  },
};
</script>

<style scoped>
.backup-record-page {
  min-height: 100%;
}

.record-toolbar {
  padding: 16px;
  background: #fff;
  border: 1px solid #dcdee5;
}

.record-summary {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  gap: 12px;
}

.summary-item {
  padding: 16px;
  background: #fff;
  border: 1px solid #dcdee5;
}

.summary-value {
  color: #313238;
  font-size: 22px;
  font-weight: 600;
  line-height: 30px;
}

.summary-label {
  margin-top: 6px;
  color: #63656e;
  font-size: 12px;
}

.wide .summary-value {
  font-size: 16px;
}
</style>
