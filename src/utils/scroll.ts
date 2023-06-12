export default function scroll(id: string) {
  const el = document.getElementById(`${id}`);
  el && el.scrollIntoView({ behavior: "smooth" });
}
