<template>
  <div class="dashboard-page">
    <div class="dashboard-toolbar">
      <div>
        <div class="dashboard-title">BKVision 数据仪表盘</div>
        <div class="dashboard-subtitle">API 调用统计、访问日志与用户备份画像</div>
      </div>
      <div class="dashboard-actions">
        <bk-button icon="refresh" @click="refreshDashboard">刷新</bk-button>
        <bk-button icon="share" @click="openDashboard">新窗口打开</bk-button>
      </div>
    </div>
    <iframe
      v-if="dashboardUrl"
      :key="frameKey"
      class="dashboard-frame"
      :src="dashboardUrl"
      title="BKVision Dashboard"
      frameborder="0"
      allowfullscreen>
    </iframe>
    <bk-exception
      v-else
      class="dashboard-empty"
      type="empty"
      scene="part"
      title="未配置仪表盘地址" />
  </div>
</template>

<script>
const EMBED_APP_ID = 'bk-vision-10086';
const DEFAULT_DASHBOARD_URL = "https://apps.ce.bktencent.com/bk-vision/embed/?uid=3ZJQxqGBhnBw3JbyZEyHWK&bk_app_id=bk-vision-10086&bk_app_list=['bk-vision-10086']&name=&show_copyright=True&watermark=True&time_readonly=False&show_time=True&show_refresh=True&start_time=now/d&end_time=now/d&preview=False&hide_toolbox=False&hide_filter=False&panels=&refresh=False";

const normalizeDashboardUrl = (value) => {
  if (!value || typeof value !== 'string') {
    return '';
  }
  const srcMatch = value.match(/\ssrc=["']([^"']+)["']/);
  let url = (srcMatch ? srcMatch[1] : value).trim();
  if (!/^https?:\/\//.test(url)) {
    return '';
  }
  url = url.replace(/^http:\/\//, 'https://');
  url = url.replace(/([?&]bk_app_id=)(&|$)/, `$1${EMBED_APP_ID}$2`);
  if (!/[?&]bk_app_id=/.test(url)) {
    url += `${url.includes('?') ? '&' : '?'}bk_app_id=${EMBED_APP_ID}`;
  }
  return url;
};

export default {
  name: 'DashBoard',
  data() {
    return {
      frameKey: 1,
    };
  },
  computed: {
    dashboardUrl() {
      return (
        normalizeDashboardUrl(window.BK_VISION_DASHBOARD_URL)
        || normalizeDashboardUrl(process.env.BK_VISION_DASHBOARD_URL)
        || DEFAULT_DASHBOARD_URL
      );
    },
  },
  methods: {
    refreshDashboard() {
      this.frameKey += 1;
    },
    openDashboard() {
      window.open(this.dashboardUrl, '_blank');
    },
  },
};
</script>

<style scoped>
.dashboard-page {
  height: calc(100vh - 150px);
  min-height: 560px;
  display: flex;
  flex-direction: column;
}

.dashboard-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  margin-bottom: 12px;
}

.dashboard-title {
  color: #313238;
  font-size: 16px;
  font-weight: 600;
}

.dashboard-subtitle {
  margin-top: 4px;
  color: #979ba5;
  font-size: 12px;
}

.dashboard-actions {
  display: flex;
  gap: 8px;
}

.dashboard-frame {
  width: 100%;
  flex: 1;
  min-height: 0;
  border: 1px solid #dcdee5;
}

.dashboard-empty {
  margin-top: 120px;
}
</style>
