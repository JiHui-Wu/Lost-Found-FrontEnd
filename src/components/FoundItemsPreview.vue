<template>
  <ItemsPreview
      title="最近找到的物品"
      :fetchItems="getAllFoundItems"
      locationLabel="找到位置"
      timeLabel="找到时间"
      timeProp="found_time"
      routePath="/allfounditems"
  />
</template>

<script setup>
import { getAllFoundItems } from '@/apis/found.js';
import ItemsPreview from '@/components/ItemsPreview.vue';
</script>
