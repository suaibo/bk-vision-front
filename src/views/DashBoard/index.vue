<template>
  <div class="dashboard-page">
    <iframe
      v-if="dashboardUrl"
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
export default {
  name: 'DashBoard',
  computed: {
    dashboardUrl() {
      const url = window.BK_VISION_DASHBOARD_URL || process.env.BK_VISION_DASHBOARD_URL || '';
      return url.trim().replace(/^http:\/\//, 'https://');
    },
  },
};
</script>

<style scoped>
.dashboard-page {
  height: calc(100vh - 150px);
  min-height: 560px;
}

.dashboard-frame {
  width: 100%;
  height: 100%;
  border: 0;
}

.dashboard-empty {
  margin-top: 120px;
}
</style>
