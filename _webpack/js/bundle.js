window.addEventListener("scroll", scrollFunction);

function scrollFunction() {
  const backToTopButton = document.querySelector("#back-to-top-btn");
  if (backToTopButton) {
    if (window.pageYOffset > 300) {
      // Show backToTopButton
      if (!backToTopButton.classList.contains("btnEntrance")) {
        backToTopButton.classList.remove("btnExit");
        backToTopButton.classList.add("btnEntrance");
        backToTopButton.style.display = "block";
      }
    } else {
      // Hide backToTopButton
      if (backToTopButton.classList.contains("btnEntrance")) {
        backToTopButton.classList.remove("btnEntrance");
        backToTopButton.classList.add("btnExit");
      setTimeout(function () { 
          backToTopButton.style.display = "none";
        }, 250);
      }
    }
  }
  else{
    //pass
  }
}

window.onscroll = function () {
  idExists = document.getElementById("myBar")
  if (idExists){
    barProgress();
  }
  else {
    //pass
  }
};

function barProgress() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
}