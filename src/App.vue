<template>
  <div id="app">
    <h1>AI Chat</h1>
    <div class="chat-box">
      <div v-for="(msg, i) in messages" :key="i" :class="msg.role">
        {{ msg.text }}
      </div>
      <div v-if="typing" class="typing">AI 正在输入...</div>
    </div>
    <div class="input-area">
      <input
        v-model="input"
        @keydown.enter="send"
        placeholder="说点什么..."
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
    const res = await fetch('https://ai-psi-teal.vercel.app/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一个友好的助手' },
          { role: 'user', content: question }
        ]
      })
    })

    const data = await res.json()
    typing.value = false

    if (data.choices && data.choices[0]) {
      messages.value.push({
        role: 'ai',
        text: data.choices[0].message.content
      })
    } else {
      messages.value.push({
        role: 'ai',
        text: '出错了: ' + JSON.stringify(data)
      })
    }
  } catch (err) {
    typing.value = false
    messages.value.push({
      role: 'ai',
      text: '网络请求失败，请检查控制台'
    })
    console.error(err)
  }
}
</script>

<style>
#app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}
.chat-box {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  min-height: 300px;
  margin-bottom: 16px;
}
.chat-box .user {
  text-align: right;
  color: #333;
  margin: 8px 0;
  background: #f0f0f0;
  padding: 8px;
  border-radius: 8px;
}
.chat-box .ai {
  text-align: left;
  color: #0066cc;
  margin: 8px 0;
  background: #e6f7ff;
  padding: 8px;
  border-radius: 8px;
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
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.input-area button {
  padding: 8px 16px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
