<script setup lang="ts">
import { useTranslation } from "../i18n";
import type { DownscaleNotice } from "./editor";

defineProps<{ error: string; notice: DownscaleNotice | null }>();

const { t, n } = useTranslation();
</script>

<template>
  <div v-if="error || notice" class="messages">
    <p v-if="error" role="alert" class="message error">{{ error }}</p>
    <p v-if="notice" role="status" class="message notice">
      {{
        t("notice.downscaled", {
          width: n(notice.original.width),
          height: n(notice.original.height),
          max: n(notice.max),
          scaledWidth: n(notice.scaled.width),
          scaledHeight: n(notice.scaled.height),
        })
      }}
    </p>
  </div>
</template>

<style scoped>
.messages {
  display: grid;
  gap: 12px;
}

.message {
  margin: 0;
  padding: 10px 12px;
  border-radius: var(--radius);
}

.error {
  background: var(--error-bg);
  color: var(--error-text);
}

.notice {
  background: var(--notice-bg);
  color: var(--text);
}
</style>
