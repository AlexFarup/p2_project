let navBarMenu = document.querySelector(".togglemenu");

navBarMenu.addEventListener("click", toggleNav);

let toggleNavStatus = false;

function toggleNav() {
  let getSidebar = document.querySelector(".menu");
  let getSidebarUl = document.querySelector(".menu ul");
  let getSidebarTitle = document.querySelector(".menu span");
  let getSidebarLinks = document.querySelectorAll(".menu a");

  if (toggleNavStatus === false) {
    getSidebarUl.style.visibility = "visible";
    getSidebar.style.width = "200px";
    getSidebarTitle.style.opacity = "0.5";

    let arrayLength = getSidebarLinks.length;
    for (let i = 0; i < arrayLength; i++) {
      getSidebarLinks[i].style.opacity = "1";
    }

    toggleNavStatus = true;
  } else if (toggleNavStatus === true) {
    getSidebar.style.width = "50px";
    getSidebarTitle.style.opacity = "0";

    let arrayLength = getSidebarLinks.length;
    for (let i = 0; i < arrayLength; i++) {
      getSidebarLinks[i].style.opacity = "0";
    }

    getSidebarUl.style.visibility = "hidden";

    toggleNavStatus = false;
  }
}