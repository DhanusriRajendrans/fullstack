function sayHello() {
  const text = "Hello World!";
  const output = document.getElementById("output");
  
  output.innerText = ""; // clear previous text
  
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      output.innerText += text.charAt(i);
      i++;
      setTimeout(typeWriter, 80); // typing speed
    }
  }
  typeWriter();
}
