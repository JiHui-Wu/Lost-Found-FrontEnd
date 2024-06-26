<template>
  <AllItems
      :fetchItems="getAllLostItems"
      searchPlaceholder="搜索物品名称或丢失位置"
      locationLabel="丢失位置"
      timeLabel="丢失时间"
      timeProp="lost_time"
      :sendMessage="sendMessage"
      messageType="lost"
  />
</template>

<script setup>
import { getAllLostItems } from '@/apis/lost.js';
import { sendMessage } from '@/apis/message.js';
import AllItems from '@/components/AllItems.vue';
</script>
