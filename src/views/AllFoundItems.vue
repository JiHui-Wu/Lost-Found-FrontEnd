<template>
  <AllItems
      :fetchItems="getAllFoundItems"
      searchPlaceholder="搜索物品名称或发现位置"
      locationLabel="发现位置"
      timeLabel="发现时间"
      timeProp="found_time"
      :sendMessage="sendMessage"
      messageType="found"
  />
</template>

<script setup>
import {getAllFoundItems} from '@/apis/found.js';
import {sendMessage} from '@/apis/message.js';
import AllItems from '@/components/AllItems.vue';
</script>
