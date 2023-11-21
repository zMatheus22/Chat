// login elements
const login = document.getElementById("login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

const chat = document.getElementById("chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

const user = { id: "", name: "", color: "" };
let websocket;
const colors = [
  "cadetblue",
  "darkgoldenrod",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold",
];

const create_Message_Self_Element = (content) => {
  const div = document.createElement("div");
  div.classList.add("message--self");
  div.innerHTML = content;

  return div;
};

const create_Message_Other_Element = (user, userColor, content) => {
  const div = document.createElement("div");
  div.classList.add("message--other");

  const span = document.createElement("span");
  span.classList.add("message--seder");
  span.innerHTML = user;
  span.style.color = userColor;

  div.appendChild(span);
  div.innerHTML += content;

  return div;
};

const scroll_Screen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

const processMessage = ({ data }) => {
  const { userId, userName, userColor, content } = JSON.parse(data);

  const message =
    userId === user.id
      ? create_Message_Self_Element(content)
      : create_Message_Other_Element(userName, userColor, content);

  chatMessages.appendChild(message);
  scroll_Screen();
};

const handleLogin = (event) => {
  event.preventDefault();

  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = colors[Math.floor(Math.random() * colors.length)];

  login.style.display = "none";
  chat.style.display = "flex";

  websocket = new WebSocket("ws://localhost:8080");
  websocket.onmessage = processMessage;
};

const sendMessage = (event) => {
  event.preventDefault();

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value,
  };

  websocket.send(JSON.stringify(message));
  chatInput.value = "";
};

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
