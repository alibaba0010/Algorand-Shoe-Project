const content = "Ali is going to School";
// if (new RegExp(content.includes("school"), "i")) {
if (content.toLowerCase().includes("school")) {
  console.log("Postive");
} else {
  console.log("Negative");
}
