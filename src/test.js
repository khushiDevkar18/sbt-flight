function highlightText() {
    var paragraph = document.getElementById("dynamic-text");
    var text = paragraph.innerHTML;
    
    var highlightedText = text.replace(/APPLICATION AND OTHER CONDITIONS/g, '<span class="highlightpolicy">APPLICATION AND OTHER CONDITIONS</span>');
  
    // Update the paragraph with the highlighted text
    paragraph.innerHTML = highlightedText;
  }
  
  // Call the function when the page loads
//   highlightText();

console.log('Bla bla')
  setInterval(()=>{
    this.highlightText();
  }, 1000)
  