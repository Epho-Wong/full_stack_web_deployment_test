<script setup>
import {ref,onMounted} from 'vue'

const pgData=ref(null)
const mysqlData=ref(null)

onMounted(async()=>{
  try{
    const res1=await fetch('/api/django/db/')
    pgData.value=await res1.json()
  }catch(err){
    console.error('django_postgresql data error: ', err)
  }

  try{
    const res2=await fetch('/api/node/db')
    mysqlData.value=await res2.json()
  }catch(err){
    console.error('node_mysql data error: ', err)
  }
})
</script>

<template>
  <div style="padding: 20px; font-family: sans-serif; line-height: 1.8;">
    <h1>Vue_django_postgresql_nodejs_mysql_redis</h1>
    
    <div style="display: flex; gap: 40px;">
      <!-- left side：PostgreSQL -->
      <div style="flex: 1; border: 1px solid #ccc; padding: 15px; border-radius: 8px;">
        <h2>🐘 PostgreSQL (via Django)</h2>
        <p v-if="pgData" :style="{color: pgData.source === 'Redis_Cache' ? 'green' : 'orange'}">
          data source：{{ pgData.source }}
        </p>
        <ul v-if="pgData">
          <li v-for="(item, idx) in pgData.items" :key="idx">
            <strong>{{ item.name }}</strong>: {{ item.description }}
          </li>
        </ul>
        <p v-else>loading...</p>
      </div>

      <!-- right side：MySQL -->
      <div style="flex: 1; border: 1px solid #ccc; padding: 15px; border-radius: 8px;">
        <h2>🐬 MySQL (via Node.js + Prisma)</h2>
        <p v-if="mysqlData" :style="{color: mysqlData.source === 'Redis_Cache' ? 'green' : 'orange'}">
          data source：{{ mysqlData.source }}
        </p>
        <ul v-if="mysqlData">
          <li v-for="(item, idx) in mysqlData.items" :key="idx">
            <strong>{{ item.name }}</strong>: {{ item.description }}
          </li>
        </ul>
        <p v-else>loading...</p>
      </div>
    </div>
  </div>
</template>