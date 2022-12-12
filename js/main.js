import { swiper } from "./swiper.js";
import {
  createSubmitEvent,
  createLoginEvent,
  getItemWithExpireTime,
} from "./signup.js";
import { authLogin, editUser } from "./requests.js";
import { renderAdminItems } from "./admin.js";
import { getItem } from "./requests.js";
import { renderMainItems, renderCategoryPages } from "./render.js";
import { render, sassFalse } from "sass";

// 관리자 이메일 -> 추후 .env넣어야함.
const ADMIN_EMAIL = `hyochofriend@naver.com`;

const firstNav = document.querySelector("ul.nav-1depth > li:first-child");
const backGround = document.querySelector(".back-ground");
export const loginBtnEl = document.querySelector(".login");
const loginModal = document.querySelector(".login-modal");
const signupModal = document.querySelector(".signup-modal");
export const mainPgEl = document.querySelector(".main-page");
const userPgEl = document.querySelector(".user-page");
const adminPgEl = document.querySelector(".admin-page");
const footerEl = document.querySelector("footer");

// signup elements
export const emailInputEl = document.getElementById("signup-email");
export const passwordInputEl = document.getElementById("signup-pw");
export const passwordcheckEl = document.getElementById("signup-repw");
export const displayNameInputEl = document.getElementById("signup-name");
export const submitEl = document.getElementById("frm");

// login elements
export const loginId = document.querySelector(".login-id");
export const loginPw = document.querySelector(".login-pw");
export const loginBtn = document.querySelector(".login-btn");
export const idboxEl = document.querySelector(".id-box");
export const pwboxEl = document.querySelector(".pw-box");

//search elements
const searchInput = document.getElementById("search-main");

// user Info elements
export const userInfoName = document.getElementById("user-info-name");
export const nameChangeBtn = document.querySelector(".name-change-btn");
export const userInfoPw = document.getElementById("user-info-pwd");
export const userInfoNewPw = document.getElementById("user-info-new-pwd");
const pwChangeBtn = document.querySelector(".pw-change-btn");

//상세페이지
const detailPageEl = document.querySelector(".detail-container");

firstNav.addEventListener("mouseover", () => {
  backGround.style.visibility = "visible";
});
firstNav.addEventListener("mouseout", () => {
  backGround.style.visibility = "hidden";
});

// 로그인/회원가입 모달 visibility 조정
loginBtnEl.addEventListener("click", () => {
  if (loginBtnEl.textContent === "로그인/가입") {
    backGround.style.visibility = "visible";
    loginModal.style.visibility = "visible";
    document.querySelector(".close-login").addEventListener("click", () => {
      backGround.style.visibility = "hidden";
      loginModal.style.visibility = "hidden";
    });
    document.querySelector(".signup").addEventListener("click", () => {
      signupModal.style.visibility = "visible";
      loginModal.style.visibility = "hidden";
      document.querySelector(".close-signup").addEventListener("click", () => {
        backGround.style.visibility = "hidden";
        signupModal.style.visibility = "hidden";
      });
    });
  }
});

export const userModal = document.querySelector(".user-modal");
const userModalBtn = document.querySelector(".user-modal-btn");
export const userModalContent = document.querySelector(".user-modal-content");
submitEl.addEventListener("submit", createSubmitEvent);
loginBtn.addEventListener("click", createLoginEvent);
export const content = "";
// 이름 옆에 변경 버튼 누르면 이름 변경되도록 만들기
nameChangeBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  await editUser("이름", userInfoName.value);
});
// 변경 됐다는 모달창에 있는 확인 버튼
userModalBtn.addEventListener("click", () => {
  userModal.classList.remove("show");
});
// 비밀번호 변경 버튼 누르면 비밀번호 변경되도록 만들기
pwChangeBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  await editUser(
    "비밀번호",
    userInfoName.value,
    userInfoPw.value,
    userInfoNewPw.value
  );
});

// 로컬에 로그인 데이터 있는지 확인.
(async () => {
  const token = localStorage.getItem("token");
  if (token) {
    loginBtnEl.textContent = "로그아웃";
    await authLogin();
  } else {
    loginBtnEl.textContent = "로그인/가입";
  }
  // 만료시간 체크는 계속
  getItemWithExpireTime("token");
})();

// 로그인 시 유효성 검사
const idErrorMsg = document.querySelector(".id-error-msg");
loginId.addEventListener("focusout", () => {
  const exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
  if (loginId.value && !exptext.test(loginId.value)) {
    idErrorMsg.classList.add("show");
    idboxEl.style.border = "1px solid #ed234b";
  }
});
loginId.addEventListener("focusin", () => {
  idErrorMsg.classList.remove("show");
  idboxEl.style.border = "1px solid #999";
});

// 로그인 실패 시
const loginErrorBox = document.querySelector(".login-error-box");
export function showErrorBox() {
  loginErrorBox.classList.add("show");
  setTimeout(() => {
    loginErrorBox.classList.remove("show");
  }, 2000);
}

// 회원가입 유효성 검사
// const singupEmailBox = document.querySelector('.signup-email-box')
// emailInputEl.addEventListener("focusout", () => {
//   const exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
//   if (emailInputEl.value && !exptext.test(emailInputEl)) {
//     // idErrorMsg.classList.add("show");
//     singupEmailBox.style.border = "1px solid #ed234b";
//   }
// });

// 초기화면(새로고침, 화면진입) 렌더
router();

// 이후로는 hashchange(페이지이동)때 렌더
window.addEventListener("hashchange", router);

// 라우팅
async function router() {
  const routePath = location.hash;
  // 초기화면
  if (routePath === "") {
    detailPageEl.style.display = "none";
    mainPgEl.style.display = "none";
    userPgEl.style.display = "none";
    adminPgEl.style.display = "none";
    footerEl.style.display = "none";
    await renderMainItems();
    mainPgEl.style.display = "block";
    footerEl.style.display = "block";
    //회원정보 페이지
  } else if (routePath.includes("#/user")) {
    mainPgEl.style.display = "none";
    userPgEl.style.display = "block";
    adminPgEl.style.display = "none";
    detailPageEl.style.display = "none";
    //제품 상세정보 페이지
  } else if (routePath.includes("#/detail")) {
    mainPgEl.style.display = "none";
    userPgEl.style.display = "none";
    adminPgEl.style.display = "none";
    detailPageEl.style.display = "block";
    //관리자 페이지
  } else if (routePath.includes("#/admin")) {
    // 관리자인지 확인
    const email = await authLogin();
    detailPageEl.style.display = "none";
    //만약 관리자라면,
    if (email === ADMIN_EMAIL) {
      mainPgEl.style.display = "none";
      userPgEl.style.display = "none";
      adminPgEl.style.display = "block";
      renderAdminItems();
    } else {
      // 허가되지 않은 사용자면 -> alert띄운다
      alert("허용되지 않은 접근입니다.");
    }
    //category 분류 페이지
  } else if (routePath.includes("#/furniture")) {
    detailPageEl.style.display = "none";
    mainPgEl.style.display = "none";
    userPgEl.style.display = "none";
    adminPgEl.style.display = "none";
    // category url에서 파싱
    const category = routePath.split("/")[2];
    await renderCategoryPages(category);
  }
}

// token이 없을 때 회원정보를 클릭하면 로그인을 하라고 모달창
const userInfoBtn = document.querySelector(".user-info-btn");
userInfoBtn.addEventListener("click", () => {
  const token = localStorage.getItem("token");
  if (token) {
    window.location = "#/user";
  } else {
    userModalContent.innerHTML = `로그인을 해주세요.`;
    userModal.classList.add("show");
  }
});

// bank elements
const inputBankEl1 = document.querySelector(".bank-link-1");
const inputBankEl2 = document.querySelector(".bank-link-2");
const inputBankEl3 = document.querySelector(".bank-link-3");
const inputBankEl4 = document.querySelector(".bank-link-4");
const allInputBankEl = document.querySelectorAll(".bank-link-input");
const bankSelectEl = document.querySelector(".bank-select");
const bankSubmitBtn = document.querySelector(".bank-link-btn");
let bankNumber = "";

bankSelectEl.addEventListener("change", () => {
  let select1 = bankSelectEl[bankSelectEl.selectedIndex].value;
  let arr = [];
  if (select1 === "none") {
    inputDisplay("none");
  } else if (select1 === "bank-nh") {
    inputDisplay("inline");
    arr = [3, 4, 4, 2];
  } else if (select1 === "bank-kb") {
    inputDisplay("inline");
    arr = [3, 2, 4, 3];
  } else if (select1 === "bank-sh") {
    inputDisplay("inline");
    arr = [3, 3, 6];
  } else if (select1 === "bank-ka") {
    inputDisplay("inline");
    arr = [4, 2, 7];
  }

  inputBankEl1.value = "";
  inputBankEl2.value = "";
  inputBankEl3.value = "";
  inputBankEl4.value = "";

  inputBankEl1.setAttribute("maxlength", arr[0]);
  inputBankEl2.setAttribute("maxlength", arr[1]);
  inputBankEl3.setAttribute("maxlength", arr[2]);
  inputBankEl4.setAttribute("maxlength", arr[3]);

  const i4Len = inputBankEl4.getAttribute("maxlength");

  if (i4Len === "undefined") {
    inputBankEl4.style.display = "none";
  } else {
    inputBankEl4.style.display = "inline";
  }
  inputBankEl1.focus();

  function inputDisplay(display) {
    allInputBankEl.forEach((e) => {
      e.style.display = display;
    });
  }
});

allInputBankEl.forEach((e, i) => {
  e.addEventListener("input", () => {
    if (i < 3) {
      if (
        allInputBankEl[i].value.length ===
        Number(allInputBankEl[i].getAttribute("maxlength"))
      ) {
        allInputBankEl[i + 1].focus();
      }
    }
  });
});
bankSubmitBtn.addEventListener("click", () => {
  allInputBankEl.forEach((e) => {
    bankNumber += e.value;
    e.value = "";
  });
  if (!Number(bankNumber)) {
    window.alert("숫자만 입력하세요");
  } else {
    // console.log(Number(bankNumber));
  }
  // console.log(bankNumber);
  bankNumber = "";
});
