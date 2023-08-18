/*
    게시물 작성 페이지-1
*/
/* 맨 아래 base 구간 */
// 지금 있는 페이지 버튼 검정으로
$(document).ready(function () {
  $(".base_bottom_nav_plus_image").attr(
    "src",
    "../image/bottom_nav_plus_black.png"
  );
});

// close버튼 클릭 시 뒤로가기
function goBack() {
  window.history.back();
}

// photo_add부분 사진 추가시 작게 보이는 preview부분

var input = document.getElementById("input");
var initLabel = document.getElementById("label");
const imageList = []; // 이미지 백에서 받아서 담을 배열
var imageLengthCount = 0;
var imgFirstInput = 0;

// 마우스 올렸을 때 효과
initLabel.addEventListener("mouseover", (event) => {
  event.preventDefault();
  const label = document.getElementById("label");

  label?.classList.add("label--hover");
});

initLabel.addEventListener("mouseout", (event) => {
  event.preventDefault();
  const label = document.getElementById("label");

  label?.classList.remove("label--hover");
});

// test 해보는 중... (아이디어 handleUpdate함수에 매개변수를 하나 더 만들어서 배열 마지막 요소도 같이 줘보자)

// change이벤트 -> 요소 변경이 끝나면 발생
input.addEventListener("change", (event) => {
  // html에서 onchange 이벤트를 js에서 하는 방법이다
  const files = changeEvent(event);
  const fileLastElement = files.slice(-1); // last라는 변수에 files로 온 이미지의 마지막 요소를 저장
  const reverse = [...files].reverse();
  /* 검사
  console.log(files);
  console.log(fileLastElement);
  console.log(files[0]);
  console.log(fileLastElement[0]);
  console.log(reverse);
  */

  var check = handleUpdate(reverse); // 원래 handleUpdate(files)인데 last 추가한거야
  if (check == 1) {
    alert("이미지 개수는 10개까지입니다.");
  } else {
    handleUpdatePre(fileLastElement);
  }
});

// test 해보는 중...

function changeEvent(event) {
  const { target } = event; // const target = event.target 이랑 똑같데(설명: object 안에 존재하는 값을 바로 변수 할당 시켜주는 것)
  return [...target.files]; // target.files == event.target.files (둘이 똑같다...)
}

function handleUpdate(fileList) {
  //console.log(fileList);
  const preview = document.getElementById("preview");
  // 이미지 개수 10개 제한
  if (imageLengthCount + fileList.length > 10) {
    return 1;
  } else {
    /*imageList.push(...fileList);*/
    imageLengthCount += fileList.length;
    imgFirstInput++;
    console.log(imageLengthCount);
    /* 검사!!!
      console.log(imageList);
      console.log(imageLengthCount);
      console.log(imgFirstInput);*/
  }
  fileList.forEach((file) => {
    const reader = new FileReader();

    reader.addEventListener("load", (event) => {
      const img = el("img", {
        className: "embed-img",
        src: event.target?.result, // src는 base-64형태
      });
      imageList.push(reader.result);
      /*console.log(imageList[0]);*/
      const imgContainer = el("div", { className: "container-img" }, img);
      preview.append(imgContainer);
    });

    reader.readAsDataURL(file);
  });
}

/***********************테스트 중!!!**************8 */
function handleUpdatePre(fileLast) {
  const preview_image = document.getElementById("preview_image"); // 새로 만든 부분

  fileLast.forEach((file) => {
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      const img_pre = el("img", {
        // 새로 만든 부분
        className: "preview_image",
        src: event.target?.result,
      });
      const imgContainer_pre = el(
        "div",
        { className: "container-img" },
        img_pre
      ); // 새로 만든 부분
      if (imgFirstInput == 1) {
        preview_image.append(imgContainer_pre); // 새로 만든 부분
      } else {
        document.querySelector(".preview_image").src = reader.result;
      }
      // append 는 최초 1번만 두번째부터 if문으로 소스 바꾸기
      // 기본 이미지 넣어놓고 새로 들어오면 소스만 바꿔줘
    });
    reader.readAsDataURL(file);
  });
}

function el(nodeName, attributes, ...children) {
  const node =
    nodeName === "fragment"
      ? document.createDocumentFragment()
      : document.createElement(nodeName);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "events") {
      Object.entries(value).forEach(([type, listener]) => {
        node.addEventListener(type, listener);
      });
    } else if (key in node) {
      try {
        node[key] = value;
      } catch (err) {
        node.setAttribute(key, value);
      }
    } else {
      node.setAttribute(key, value);
    }
  });

  children.forEach((childNode) => {
    if (typeof childNode === "string") {
      node.appendChild(document.createTextNode(childNode));
    } else {
      node.appendChild(childNode);
    }
  });
  return node;
}

// 이미지 리스트를 로컬 스토리지로 보내는 방법
document.getElementById("Next").addEventListener("click", () => {
  localStorage.setItem("imageList", JSON.stringify(imageList));
});

/*********************** 
const sliderWrap = document.querySelector(".slider__wrap");
const sliderImg = document.querySelector(".slider__img");       // 보여지는 영역
const sliderInner = document.querySelector(".slider__inner");   // 움직이는 영역
const slider = document.querySelectorAll(".slider"); 
const sliderBtn = document.querySelector(".slider__btn");    //버튼
const sliderBtnPrev = document.querySelector(".prev");       //왼쪽버튼
const sliderBtnNext = document.querySelector(".next");       //오른쪽버튼
const sliderDot = document.querySelector(".slider__dot");       //닷 메뉴
const BtnNext = document.getElementById("Next");              // 다음 버튼을 통해 오른쪽으로 슬라이드
const BtnBack = document.getElementById("backBtn");            // 뒤로 가기를 통해 왼쪽으로 슬라이드
const pageImg = document.querySelector(".page__img");         // 페이지가 보여지는 영역
const pageInner = document.querySelector(".page__inner");

let currentIndex = 0;                       //현재 이미지
let sliderCount = imageLengthCount;            //이미지 갯수(imageList.length) -> 원래 slider.length
console.log(sliderCount);
let sliderWidth = sliderImg.offsetWidth;    //이미지 가로
let dotIndex = "";
let currentPage = 0;                        //현재 페이지
let pageWidth = pageImg.offsetWidth;        //페이지 가로
*/
let currentIndex = 0; //현재 이미지
let dotIndex = "";
const sliderBtnPrev = document.querySelector(".prev"); //왼쪽버튼
const sliderBtnNext = document.querySelector(".next");
const BtnNext = document.getElementById("Next"); // 다음 버튼을 통해 오른쪽으로 슬라이드
const BtnBack = document.getElementById("backBtn"); // 뒤로 가기를 통해 왼쪽으로 슬라이드
const pageImg = document.querySelector(".page__img"); // 페이지가 보여지는 영역
const pageInner = document.querySelector(".page__inner");
let pageWidth = pageImg.offsetWidth; //페이지 가로

// 이미지 움직이는 영역
function gotoSlider(num) {
  const sliderInner = document.querySelector(".slider__inner");
  const sliderImg = document.querySelector(".slider__img"); // 보여지는 영역
  let sliderWidth = sliderImg.offsetWidth; //이미지 가로

  sliderInner.style.transition = "all 400ms";
  sliderInner.style.transform = "translateX(" + -sliderWidth * num + "px)";
  currentIndex = num;

  // 두번째 이미지 == 두번째 닷에 클래스 추가
  // 닷 메뉴 클래스 모두 삭제 -> 해당 이미지의 닷 메뉴에 클래스 추가
  let dotActive = document.querySelectorAll(".slider__dot .dot");
  dotActive.forEach((el) => el.classList.remove("active"));
  dotActive[num].classList.add("active");
}

// 왼쪽 버튼을 클릭했을 때
sliderBtnPrev.addEventListener("click", () => {
  let prevIndex = (currentIndex + (imageLengthCount - 1)) % imageLengthCount; // imageLengthCount는 원래 sliderCount엿다
  // 4, 1, 2, 3, 4, 1, 2, ...
  gotoSlider(prevIndex);
});

// 오른쪽 버튼을 클릭했을 때
sliderBtnNext.addEventListener("click", () => {
  let nextIndex = (currentIndex + 1) % imageLengthCount; // imageLengthCount는 원래 sliderCount엿다
  // 1, 2, 3, 4, 0, 1, 2, ...
  gotoSlider(nextIndex);
});

// Next 버튼을 클릭했을 때
BtnNext.addEventListener("click", () => {
  if (imageLengthCount === 0) {
    return alert("이미지를 1개 이상 선택해 주십시오");
  }

  let template = ``;
  var currentNext = 0; // Next를 누른 횟수
  var sliderLengthCount = 0;

  if (currentNext == 0) {
    for (let i = 0; i < imageLengthCount; i++) {
      template += `
      <div class="slider" role="group"><img class="sliderImg" src="${imageList[i]}"></div>\n
      `;
    }
    currentNext++;
    sliderLengthCount += imageLengthCount;
  } else {
    for (let i = 0; i < imageLengthCount - sliderLengthCount; i++) {
      template += `
      <div class="slider" role="group"><img class="sliderImg" src="${
        imageList[i + sliderLengthCount]
      }"></div>\n
      `;
    }
    sliderLengthCount = imageLengthCount;
  }

  // tag company가 보여질지 아닐지의 부분
  if (getCurrentAccountTypeFromSessionStorage() == 2) {
    $("#open_modal").remove();
  }

  $(".slider__inner").append(template);

  pageInner.style.transition = "all 400ms";
  pageInner.style.transform = "translateX(" + -pageWidth + "px)";
  currentPage = 1;

  init();
});

// Back 버튼을 클릭했을 때
BtnBack.addEventListener("click", () => {
  pageInner.style.transition = "all 400ms";
  pageInner.style.transform = "translateX(" + 0 + "px)";
  currentPage = 0;

  $("div").remove(".slider");
  dotIndex = "";
});

// 슬라이드 초기값 설정 함수 init()
function init() {
  // <a href="#" class="dot active">이미지1</a>
  const slider = document.querySelectorAll(".slider");
  const sliderDot = document.querySelector(".slider__dot");

  slider.forEach(() => {
    dotIndex += "<a href='#' class='dot'>이미지1</a>";
  });
  sliderDot.innerHTML = dotIndex;

  // 첫 번째 닷 버튼에 활성화 표시(active)
  sliderDot.firstChild.classList.add("active");
}
// ***************************************init();*********************************************

// 닷 버튼을 클릭했을 때 해당 이미지로 이동
document.querySelectorAll(".slider__dot .dot").forEach((dot, index) => {
  dot.addEventListener("click", () => {
    gotoSlider(index);
  });
});

/* tag company 모달창 기능 */
$(".modal_overlay").hide();
$(".close_btn").click(function () {
  $(".modal_overlay").hide();
});
$("#open_modal").click(function (e) {
  e.preventDefault();
  $(".modal_overlay").show();
});

/*
  ajax 연결... 
*/

/* GET 부분 */
// 로그인 token(jstToken)을 get해와서 success되면 지금 위의
// 함수들 실행하게 만들자.(corporationFeed_Mockup.js 참고)

getProfileImageFromSessionStorage();
var jwtToken = getTokenFromSessionStorage();
// 모달 get 부분
$.ajax({
  url: "http://43.202.152.189/user?recommend=true&type=business",
  type: "GET",
  dataType: "json",
  contentType: "application/json",
  headers: {
    Authorization: `Bearer ${jwtToken}`,
  },
  success: function (data) {
    var DoneCount = 0;

    var company_template = ``;

    for (let i = 0; i < data.length; i++) {
      company_template += `
      <div class="company_item">
        <div class="company">
            <img class="company_image" src="${data[i].thumbnail}">
            <p class="company_name">${data[i].handle}</p>
        </div>
        <input type="radio" name="tagged" value="${data[i].handle}">
      </div>
      `;
    }

    $(".company_list").append(company_template);

    $(".Done").click(function () {
      var radioVal = $('input[name="tagged"]:checked').val();
      var template = `
      <div class=tagged_company>${radioVal}</div>
      `;
      //$('.open_modal').insertBefore(template, $('.Tag_text').nextSibling);
      if (DoneCount == 0) {
        $(".Tag_text").append(template);
        DoneCount++;
      } else {
        $("div").remove(".tagged_company");
        $(".Tag_text").append(template);
      }

      $(".modal_overlay").hide();
    });
  },
  error: function (jqXHR, textStatus, errorThrown) {
    if (jqXHR.status === 400) {
      console.error("Bad Request:", jqXHR.responseText);
      alert("존재하지 않는 계정 종류거나, reccomend가 true가 아닐 때");
    }
  },
});

/* POST 부분*/
// Share 눌렀을 때, ajax 발동하게(데이터들 주자)

function giveText() {
  /* content 입력할 때, value가 적용되는지 확인 */
  return document.getElementById("text").value;
}

var formData = new FormData();

$("#Share").click(function () {
  /*
    폼 데이터에 올릴 사진 배열을 전부 append하기
  */
  const formDom = document.getElementById("new-post-form");

  for (let i = 0; i < imageLengthCount; i++) {
    formDom.append(imageList[i]);
  }

  /* 여기서 부터  */
  /*
  var tagged_user_template = ``;
  var Tag = document.querySelector(".tagged_company");
  var valueofTag = Tag.innerText;

  tagged_user_template += `

  <input type="hiddin" name="tagged_user" value="${valueofTag}">
  `;

  console.log(valueofTag);
  formDom.append(tagged_user_template);
  */
  /* 여기까지가 작성했는데 안된 곳...*/

  ///////////////////////////////////// 이거 하고 있었다
  var inputTaggedUser = document.createElement('input');
  inputTaggedUser.setAttribute('type', 'hidden');
  inputTaggedUser.setAttribute('name', 'tagged_user');
  if (getCurrentAccountTypeFromSessionStorage() == 1) {
    inputTaggedUser.setAttribute('value', $(".tagged_company").val());
  }
  formDom.appendChild(inputTaggedUser);
  

  formData = new FormData(formDom);

  $.ajax({
    url: "http://43.202.152.189/feed",
    type: "POST",
    data: formData,
    processData: false, // FormData 처리 방지
    contentType: false, // 컨텐츠 타입 설정 방지
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      console.log(data);
      console.log(formData);

      // url에 피드 아이디 값을 넣어서 보내는 부분
      window.location.href = `./single_feed.html?feedId=${data.id}`;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 400) {
        console.error("Bad Request:", jqXHR.responseText);
        alert("올바르지 않은 형식의 입력.");
      } else if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("로그인 되지 않은 사용자.");
      } else if (jqXHR.status === 413) {
        console.error("Payload Too Large:", jqXHR.responseText);
        alert("이미지의 크기가 규격보다 클 때");
      }
    },
  });
});

// 토큰 받아오는 함수
function getTokenFromSessionStorage() {
  return sessionStorage.getItem("jwtToken");
}

function setContentFromSessionStorage(content) {
  return sessionStorage.setItem("content", content);
}

function setImagesFromSessionStorage(images) {
  return sessionStorage.setItem("images", images);
}

function setTaggedUserFromSessionStorage(tagged_user) {
  return sessionStorage.setItem("tagged_user", tagged_user);
}

// 사용자의 AccountType을 세션에서 가져오는 함수
function getCurrentAccountTypeFromSessionStorage() {
  return sessionStorage.getItem("currentUserAccountType");
}

// 프사 가져오는 함수
function getProfileImageFromSessionStorage() {
  // 사용자 프사 세션에서 받아오는 코드
  if(sessionStorage.getItem("thumbnail") == null) {
    return $("#profile").attr("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/680px-Default_pfp.svg.png?20220226140232");
  }
  return $("#profile").attr("src", sessionStorage.getItem("thumbnail"));
}

