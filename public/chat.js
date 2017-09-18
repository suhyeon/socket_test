// 메시지를 DOM에 표시하기 위한 함수
function appendText(messageListEl, text) {
  const messageEl = document.createElement('p')
  messageEl.textContent = text
  messageEl.classList.add('message')
  messageEl.classList.add('new')
  messageListEl.insertBefore(messageEl, messageListEl.firstChild)
  return messageEl
}

// 메시지 양식
function formatMessage({username, message}) {
  return `${username}: ${message}`
}

document.addEventListener('DOMContentLoaded', e => {
  let username;

  // 사용할 엘리먼트 가져오기
  const formEl = document.querySelector('#chat-form')
  const messageListEl = document.querySelector('#messages')
  const roomId = formEl.dataset.room
//격리시킬 id
  // socket.io 연결 수립하고 room 설정, username 설정
socket = io('/chat')
socket.emit('join', {id: roomId})
  // form 전송 이벤트 핸들러 => 발생시킬 ‘chat’이라는 e vent를 전송
formEl.addEventListener('submit', e => {
  e.preventDefault()
  const message = formEl.elements.message.value
  //message = chat.pug에서 input엘리먼트가 된다.
  socket.emit('clientchat', {message})
  formEl.reset()
})

   // (chat) 채팅 메시지가 올 때마다 출력
    socket.on('chat', data => {
      appendText(messageListEl,data.message)
    })
  // (user connected) 새 사용자가 접속한 사실을 출력

    socket.on('user connected', data => {
      appendText(messageListEl, `${data.username}님이 접속하셨습니다.`)
    })
  // (user disconnected) 사용자의 연결이 끊어졌다는 사실을 출력
    socket.on('user disconnected', data => {
      appendText(messageListEl, `${data.username}님이 접속이 끊겼습니다.`)
    })
})
