// 지금 있는 페이지 버튼 검정으로
$(document).ready(function () {
  $(".base_bottom_nav_plus_image").attr(
    "src",
    "../image/bottom_nav_plus_black.png"
  );
});

/* tag company 모달창 기능 */
$(".modal_overlay").hide();
$(".close_btn").click(function () {
  $(".modal_overlay").hide();
});
$(".open_modal").click(function () {
  $(".modal_overlay").show();
});

// tag company가 보여질지 아닐지의 부분
if (getCurrentAccountTypeFromSessionStorage() == 2) {
  $("#open_modal").remove();
}

// Cancle 버튼 클릭 시 뒤로가기
function goBack() {
  window.history.back();
}

/* ajax 부분 */

/* 세션에서 get (프사, 태그된 기업, content, image_urls) */

let params = new URLSearchParams(window.location.search); // 현재 페이지의 실제 주소(프론트에서의)
let feedId = params.get("feedId");

var jwtToken = getTokenFromSessionStorage();

$.ajax({
  url: `http://43.202.152.189/feed/${feedId}`, // ${feedId}에 백엔드의 feed.id가 들어갈거고
  type: "GET",
  datatype: "json",
  contentType: "application/json",
  headers: {
    Authorization: `Bearer ${jwtToken}`,
  },
  success: function (data) {
    console.log(data);

    var profile_template = "";
    var taggedCompany_template = "";

    profile_template += `
    <img id="profile_image" src="${data.author.thumbnail}">
    <div class="my_id">${data.author.handle}</div>
    `;

    $("#profile").append(profile_template);
    if(sessionStorage.getItem("thumbnail") == null) {
      $("#profile_image").attr("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/680px-Default_pfp.svg.png?20220226140232");
    }else {
      $("#profile_image").attr("src", sessionStorage.getItem("thumbnail"));
    } 
    // 이미지 배열 변수에 따로 저장
    const imageList = data.image_urls;
    var imageLengthCount = imageList.length; //data.image_urls.length;

    // 태그된 기업은 따로 append
    if (getCurrentAccountTypeFromSessionStorage() == 1) {
      taggedCompany_template += `
      <div class="tagged_company">${data.tagged_user.handle}</div>
      `;
      $(".Tag_text").append(taggedCompany_template);
    }

    // tag company가 보여질지 아닐지의 부분
    if (getCurrentAccountTypeFromSessionStorage() == 2) {
      $("#open_modal").remove();
    }

    $("#text").val(data.content);

    image_slider_apply(imageList);

    function image_slider_apply(imageList) {
      let template = ``;
      var sliderLengthCount = 0;

      for (let i = 0; i < imageLengthCount; i++) {
        template += `
        <div class="slider" role="group"><img class="sliderImg" style="width:330px; height:374px;" src="${imageList[i]}"></div>\n
        `;
      }
      sliderLengthCount += imageLengthCount;

      console.log(template);
      $(".slider__inner").append(template);
    }

    const sliderWrap = document.querySelector(".slider__wrap");
    const sliderImg = document.querySelector(".slider__img"); // 보여지는 영역
    const sliderInner = document.querySelector(".slider__inner"); // 움직이는 영역
    const slider = document.querySelectorAll(".slider");
    const sliderBtn = document.querySelector(".slider__btn"); //버튼
    const sliderBtnPrev = document.querySelector(".prev"); //왼쪽버튼
    const sliderBtnNext = document.querySelector(".next"); //오른쪽버튼
    const sliderDot = document.querySelector(".slider__dot"); //닷 메뉴

    let currentIndex = 0; //현재 이미지
    let sliderCount = imageLengthCount; //이미지 갯수(imageList.length)
    let sliderWidth = sliderImg.offsetWidth; //이미지 가로
    let dotIndex = "";

    // 이미지 움직이는 영역
    function gotoSlider(num) {
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
      let prevIndex = (currentIndex + (sliderCount - 1)) % sliderCount;
      // 4, 1, 2, 3, 4, 1, 2, ...
      gotoSlider(prevIndex);
    });

    // 오른쪽 버튼을 클릭했을 때
    sliderBtnNext.addEventListener("click", () => {
      let nextIndex = (currentIndex + 1) % sliderCount;
      // 1, 2, 3, 4, 0, 1, 2, ...
      gotoSlider(nextIndex);
    });

    // 초기값 설정 함수 init()
    function init() {
      // <a href="#" class="dot active">이미지1</a>

      slider.forEach(() => {
        dotIndex += "<a href='#' class='dot'>이미지1</a>";
      });
      sliderDot.innerHTML = dotIndex;

      // 첫 번째 닷 버튼에 활성화 표시(active)
      sliderDot.firstChild.classList.add("active");
    }
    init();

    // 닷 버튼을 클릭했을 때 해당 이미지로 이동
    document.querySelectorAll(".slider__dot .dot").forEach((dot, index) => {
      dot.addEventListener("click", () => {
        gotoSlider(index);
      });
    });

    /*
    getCurrentFeedIdFromSessionStorage();
    getProfileThumbnailFromSessionStorage();
    getProfileHandleFromSessionStorage();
    getCurrentFeedImagesFromSessionStorage();
    getCurrentFeedTaggedCompanyFromSessionStorage();
    getCurrentFeedContentFromSessionStorage();
    */
  },
  error: function (jqXHR, textStatus, errorThrown) {
    if (jqXHR.status === 404) {
      console.error("Not Found:", jqXHR.responseText);
      alert("피드가 존재하지 않음.");
    }
  },
});

/* 기업 태그 모달 get */
// 모달 get 부분
if (getCurrentAccountTypeFromSessionStorage() == 1) {
  $.ajax({
    url: "http://43.202.152.189/user?recommend=true&type=business",
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      var company_template = ``;

      for (let i = 0; i < data.length; i++) {
        company_template += `
        <div class="company_item">
          <div class="company">
              <img class="company_image" src="${data[i].thumbnail}">
              <p class="company_name">${data[i].handle}</p>
          </div>
          <input id="tagged" type="radio" name="tagged" value="${data[i].handle}">
        </div>
        `;
      }
      $(".company_list").append(company_template);

      $(".tag_Done").click(function () {
        var radioVal = $('input[name="tagged"]:checked').val();
        var template = `
        <div class=tagged_company>${radioVal}</div>
        `;
        //$('.open_modal').insertBefore(template, $('.Tag_text').nextSibling);

        $("div").remove(".tagged_company");
        $(".Tag_text").append(template);

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
}

// 토큰 받아오는 함수

function getTokenFromSessionStorage() {
  return sessionStorage.getItem("jwtToken");
}

// 세션에서 받아올 값에 대한 함수
/*
function getCurrentFeedIdFromSessionStorage() {
  return sessionStorage.getItem("currentFeedId");
};

function getProfileThumbnailFromSessionStorage() {
  return sessionStorage.getItem("thumbnail");
};

function getProfileHandleFromSessionStorage() {
  return sessionStorage.getItem("handle");
};

function getCurrentFeedImagesFromSessionStorage() {
  return sessionStorage.getItem("image_urls");
};
    
function getCurrentFeedTaggedCompanyFromSessionStorage() {
  
};

function getCurrentFeedContentFromSessionStorage() {
  
};
*/

/* ajax Done 눌렀을 때, put 전송 */

$("#Done").click(function () {
  var formData = new FormData();

  const TextToFrom = $("#text").val();
  const TaggedCompanyToForm = $("#tagged").val();

  
  formData.append("content", TextToFrom);
  formData.append("tagged_user", TaggedCompanyToForm);

  $.ajax({
    url: `http://43.202.152.189/feed/${feedId}`,
    type: "PUT",
    data: formData,
    processData: false, // FormData 처리 방지
    contentType: false, // 컨텐츠 타입 설정 방지
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      console.log("Response:", data);

      // 수정 완료되면 싱글 페이지로 이동
      window.location.href = `./single_feed.html?feedId=${data.id}`;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 400) {
        console.error("Bad Request:", jqXHR.responseText);
        alert("이메일 형식이 올바르지 않은 경우");
      } else if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("로그인 되지 않은 사용자.");
      } else if(jqXHR.status === 403) {
        console.error("Forbidden:", jqXHR.responseText);
        alert("로그인은 되어 있으나, 자신이 작성한 피드가 아닐때");
      } else if (jqXHR.status === 404) {
        console.error("Not Found:", jqXHR.responseText);
        alert("피드가 존재하지 않음");
      } else if (jqXHR.status === 413) {
        console.error("Payload Too Large:", jqXHR.responseText);
        alert("이미지의 크기가 규격보다 클 때");
      }
    },
  });
});

// 사용자의 AccountType을 세션에서 가져오는 함수
function getCurrentAccountTypeFromSessionStorage() {
  return sessionStorage.getItem("currentUserAccountType");
}

function giveText() {
  /* content 입력할 때, value가 적용되는지 확인 */
  return document.getElementById("text").value;
}
