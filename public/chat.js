// 메시지를 DOM에 표시하기 위한 함수
function appendText(messageListEl, text) {
  const messageEl = document.createElement('p')
  messageEl.textContent = text
  messageEl.classList.add('message')
  messageEl.classList.add('new') //낙관적 업데이트 하는 아이
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
socket.emit('join', {id: roomId}, data => {
  username = data.username
  console.log(username)
})
  // form 전송 이벤트 핸들러 => 발생시킬 ‘chat’이라는 e vent를 전송
formEl.addEventListener('submit', e => {
  e.preventDefault()
  const message = formEl.elements.message.value
  //message = chat.pug에서 input엘리먼트가 된다.
  const messageEl = appendText(messageListEl, formatMessage({username, message}))
  socket.emit('new chat', {message}, data => {
    //메시지 전송이 잘되었다는 표시를 해주면된다.
    messageEl.classList.remove('new')
  })

  formEl.reset()
})

   // (chat) 채팅 메시지가 올 때마다 출력
    socket.on('chat', data => {
      const messageEl = appendText(messageListEl,formatMessage(data))
      setTimeout(()=>{ //시간지연, 다른 사람들 코드에서 css의 트랜젝션
        //window.requestAnimationFrame(callback) : setTimeout이랑 비슷한의미이지만 심화과정
        messageEl.classList.remove('new')
      })
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
