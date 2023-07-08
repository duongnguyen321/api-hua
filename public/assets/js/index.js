const root = document.getElementById("root");
window.addEventListener("DOMContentLoaded", async () => {
  const getData = await (async () => {
    const res = await fetch("/api");
    const data = await res.json();
    return data.data;
  })();
  await (async (data) => {
    const html = Object.keys(data).map((item) => {
      const el = document.createElement("div");
      return el.classList.add("card"), (el.innerHTML = data[item]), el;
    });
    root.append(...html);
  })(getData);
});
