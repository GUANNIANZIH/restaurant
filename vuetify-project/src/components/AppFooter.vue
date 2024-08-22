<template>
    <!-- 如果加了 app 屬性會讓 footer 固定在畫面底部 -->
    <v-footer class="bg-deep">
      <v-container class="my-container">
        <v-row>
          <v-col cols="4" sm="4" md="4" lg="4" class="d-flex align-center justify-center">
            <img src="@/assets/logo/logo-web-navHome-notext-white-03.png" height="60">
          </v-col>
  
          <v-col cols="4" sm="4" md="4" lg="4">
            <div>
              <p class="p-text">熱門訊息</p>
              <hr>
              <ul class="none-list-style no-bullets">
                <li
                v-for="news in restaurantNews"
                :key="news.to">
                  <router-link :to="restaurantNews" class="custom-link">
                    <v-icon :icon="news.icon"></v-icon>
                    {{ news.title }}
                  </router-link>
                  <br>
                  {{ news.date }}
                </li>
              </ul>
            </div>
          </v-col>
  
          <v-col cols="4" sm="4" md="4" lg="4">
            <div>
              <p class="p-text">最新消息</p>
              <hr>
              <ul class="no-bullets">
                <li
                v-for="activity in activities"
                :key="activity.to">
                <router-link :to="activity.to" class="custom-link">
                  <v-icon :icon="activity.icon"></v-icon>
                  {{ activity.title }}
                </router-link>
                <br>
                {{ activity.date }}
                </li>
              </ul>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-flex align-center justify-center">
            <span>2024© Enjoying meals in the forest every day - JADE |  </span>
            <!-- 連結到管理者登入頁面 -->
            <router-link to="/admin" class="custom-link"> 夥伴登入 </router-link>
          </v-col>
        </v-row>
        <v-row>
          <v-col clos="12" class="d-flex align-center justify-center">
            <v-btn class="custom-btn"><router-link to="/menu" class="top-btn">BUY NOW</router-link></v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </template>
  
  <script setup>
  import { definePage } from 'vue-router/auto'
  
  definePage({
    meta: {
      title: '玉食堂 | JADE'
    }
  })
  // 補連結到各個頁面
  const restaurantNews = [
    {
      title: '新品上市 | 秘製私廚滷肉飯開放預購中',
      icon: 'mdi-arrow-right',
      to: '/specialty',
      date: 'July 02, 2024'
    },
    {
      title: '新品上市 | 純手工烏梅汁熱銷中',
      icon: 'mdi-arrow-right',
      to: '/menu',
      date: 'July 02, 2024'
    }
  ]
  
  const activities = [
    {
      title: '「員工考察之旅」- 店內公休四天',
      icon: 'mdi-arrow-right',
      to: '/news',
      date: 'Aug 27, 2024'
    },
    {
      title: '玉食堂品牌記憶 | 一起回顧玉食堂歷史',
      icon: 'mdi-arrow-right',
      to: '/about',
      date: 'Aug 01, 2022'
    }
  ]

  const navigateTo = (path) => {
      router.push(path);
  };

  </script>
  
  <style scoped lang="scss">
  
    .my-container{
      width: 80%;
      margin: 0 auto;
    }
    // bg
    .bg-deep {
      font-size: 12px;
      color: white;
      background-color: rgb(46, 46, 46);
      background-color: #2C3E31;
    }
    // list-style
    .no-bullets {
    list-style-type: none;
    margin: 12px 0px 12px 0px;
    padding: 0;
    }
    // p-text
    .p-text{
      font-size: 16px;
      font-weight: bold;
      color: white;
    }
      // a
    .custom-link {
      color: white;
      text-decoration: none;
    }
    .custom-link:visited {
      color: white;
      text-decoration: none;
    }
    .custom-link:hover {
      text-decoration: underline;
      text-decoration: none;
    }
    // TOP - btn
    .a-class {
      display: block;
    }
    // Button
    .custom-btn{
      background-color: #3C5D44;
    }
    .top-btn {
      color: white;
      text-decoration: none;
    }
  </style>
  