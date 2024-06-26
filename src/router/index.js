import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      children: [
        {
          path: 'found',
          name: 'found',
          component: () => import('@/views/Found.vue')
        },
        {
          path: 'lost',
          name: 'lost',
          component: () => import('@/views/Lost.vue')
        },
        {
          path: 'forum',
          name: 'forum',
          component: () => import('@/views/Forum.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/allfounditems',
      name: 'allfounditems',
      component: () => import('@/views/AllFoundItems.vue')
    },
    {
      path: '/alllostitems',
      name: 'alllostitems',
      component: () => import('@/views/AllLostItems.vue')
    },
    {
      path: '/selfcenter',
      name: 'selfcenter',
      component: () => import('@/views/SelfCenter.vue'),
      children: [
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/Profile.vue')
        },
        {
          path: 'selfinfo',
          name: 'selfinfo',
          component: () => import('@/views/SelfInfo.vue')
        },
        {
          path: 'usermanagement',
          name: 'usermanagement',
          component: () => import('@/views/UserManagement.vue')
        },
        {
          path: 'receivedmessages',
          name: 'receivedmessages',
          component: () => import('@/views/ReceivedMessages.vue')
        },
        {
          path: 'itemmanagement',
          name: 'itemmanagement',
          component: () => import('@/views/ItemManagement.vue')
        },
        {
          path: 'announcement',
          name: 'announcement',
          component: () => import('@/views/Announcement.vue')
        },
        {
          path: 'announcementUpload',
          name: 'announcementUpload',
          component: () => import('@/views/AnnouncementUpload.vue')
        }
      ]
    }
  ]
})

export default router
