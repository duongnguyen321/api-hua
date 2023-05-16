const root = document.getElementById("root");

const getData = async () => {
  const response = await fetch("/api");
  const data = await response.json();
  return data;
};
const render = async (data) => {
  const elements = Object.keys(data).map((key) => {
    const element = document.createElement("div");
    element.classList.add("card");
    element.innerHTML = data[key];
    return element;
  });
  root.append(...elements);
};
window.addEventListener("DOMContentLoaded", async () => {
  const data = await getData();
  render(data);
});
