<template>
  <div class="title">述职评分识别系统</div>
  <div class="wrapper">
    <!-- <nav> -->
    <div class="RouterBtn" :class="{ active: isActive[0] }" @click="navigateTo(0)">一类院校</div>

    <div class="RouterBtn" :class="{ active: isActive[1] }" @click="navigateTo(1)">二类院校</div>

    <div class="RouterBtn" :class="{ active: isActive[2] }" @click="navigateTo(2)">三类院校</div>

    <!-- </nav> -->
  </div>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useSchoolIndexStore } from './stores/schoolIndex'
// import HelloWorld from './components/HelloWorld.vue'
let isActive = ref<boolean[]>([false, false, false])
// const router = useRouter()
const schoolIndexStore = useSchoolIndexStore()

const navigateTo = (index: number) => {
  // 将isActive全部设置为false
  isActive.value = [false, false, false]
  isActive.value[index] = true
  schoolIndexStore.setSchoolIndex(index)
  // let path = index == 0 ? '' : index == 1 ? 'two' : 'three'
  // router.push('/' + path)
}
</script>

<style scoped>
.title {
  font-size: 3.6rem;
  font-weight: 500;
  background-color: white;
  margin: 2rem 0;
  padding: 2rem;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: fit-content;
}

.wrapper {
  display: flex;
  .RouterBtn {
    color: white;
    background-color: var(--el-color-primary);
    margin: 0 2rem 0 0;
    padding: 1rem;
    border-radius: 5px;
    transition: background-color 0.3s;
    cursor: pointer;
  }
}

.RouterBtn:hover {
  background-color: var(--el-color-primary-light-3);
  color: #fff;
}

.RouterBtn.active {
  background-color: var(--el-color-primary-dark-2);
  color: #fff;
}
</style>
