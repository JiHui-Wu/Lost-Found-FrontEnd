<template>
  <ItemsPreview
      title="最近丢失的物品"
      :fetchItems="getAllLostItems"
      locationLabel="丢失位置"
      timeLabel="丢失时间"
      timeProp="lost_time"
      routePath="/alllostitems"
  />
</template>

<script setup>
import { getAllLostItems } from '@/apis/lost.js';
import ItemsPreview from '@/components/ItemsPreview.vue';
</script>
