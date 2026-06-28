<script setup>
import { ref } from 'vue'

const input = ref('')
const messages = ref([])
const typing = ref(false)

async function send() {
  if (!input.value.trim()) return

  // 添加用户消息
  messages.value.push({ role: 'user', text: input.value })
  const question = input.value
  input.value = ''
  typing.value = true

  try {
    let res = await fetch('/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一个友好的助手' },
          { role: 'user', content: question }
        ]
      })
    })

    let data = await res.json()
    typing.value = false

    // 🔥 修正点在这里：将 msg 改成了 message
    if (data.choices && data.choices[0]) {
      messages.value.push({
        role: 'ai',
        text: data.choices[0].message.content
      })
    } else {
      // 如果出错，显示返回的数据方便调试
      messages.value.push({
        role: 'ai',
        text: '出错了: ' + JSON.stringify(data)
      })
    }
  } catch (error) {
    typing.value = false
    messages.value.push({
      role: 'ai',
      text: '网络请求失败，请检查控制台'
    })
    console.error(error)
  }
}
</script>
<template>
  <div class="container">
    <h1>💬 我的 AI 助手</h1>
    
    <div class="chat-box">
      <div v-if="messages.length === 0" class="empty">
        说点什么吧~
      </div>
      <div 
        v-for="(msg, i) in messages" 
        :key="i" 
        :class="['msg', msg.role]"
      >
        {{ msg.text }}
      </div>
      <div v-if="typing" class="msg ai typing">正在思考...</div>
    </div>

    <div class="input-area">
      <input 
        v-model="input" 
        @keydown.enter="send"
        placeholder="输入你的问题..." 
      />
      <button @click="send">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const messages = ref([])
const typing = ref(false)

async function send() {
  if (!input.value.trim()) return

  messages.value.push({ role: 'user', text: input.value })
  const question = input.value
  input.value = ''
  typing.value = true

  try {
    let res = await fetch('/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一个友好的助手' },
          { role: 'user', content: question }
        ]
      })
    })

    let data = await res.json()
    typing.value = false

    if (data.choices && data.choices[0]) {
      messages.value.push({
        role: 'ai',
        text: data.choices[0].message.content
      })
    } else {
      messages.value.push({
        role: 'ai',
        text: 'AI 返回异常：' + JSON.stringify(data)
      })
    }
  } catch (e) {
    typing.value = false
    messages.value.push({
      role: 'ai',
      text: '请求失败，检查 Vite 是否在运行，或密钥是否正确。'
    })
  }
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: "微软雅黑", sans-serif;
  background: #f0f2f5;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

h1 {
  text-align: center;
  margin-bottom: 16px;
  color: #333;
}

.chat-box {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 16px;
  overflow-y: auto;
  margin-bottom: 12px;
}

.empty {
  color: #bbb;
  text-align: center;
  margin-top: 40px;
}

.msg {
  padding: 10px 14px;
  border-radius: 12px;
  margin: 8px 0;
  max-width: 80%;
  line-height: 1.5;
  white-space: pre-wrap;
}

.msg.user {
  background: #10a37f;
  color: white;
  margin-left: auto;
}

.msg.ai {
  background: #f1f1f1;
  color: #333;
}

.typing {
  color: #999;
  font-style: italic;
}

.input-area {
  display: flex;
  gap: 8px;
}

.input-area input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.input-area button {
  padding: 12px 24px;
  background: #10a37f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
</style>

