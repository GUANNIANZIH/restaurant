<template>
  <!-- v-app 應用在最外層架構 -->
  <!-- v-app 裡面會放 v-navigation、v-main、v-footer，但導覽列可以能各個位置不同
  所以把導覽列放在 layouts 裡面。 -->
  <v-app>
    <!-- 給 layouts 處理，因為不同的 layouts 可能導覽列的位置也會不一樣 -->
    <router-view />
  </v-app>
</template>