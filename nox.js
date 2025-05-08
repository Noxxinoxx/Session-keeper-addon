
const toggleButton = document.getElementById('toggleTabs');
const tabsList = document.getElementById("content");
toggleButton.addEventListener('click', async () => {
  
    // Load tabs
    let tabs = await browser.tabs.query({}); 
    for (let tab of tabs) {
      let p = document.createElement('p');
      p.textContent = tab.url;
      tabsList.appendChild(p);
    }
 
    var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}



});





