/*
  base.js
*/

function getUserIdFromSessionStorage () {
  // 세션에 있는 userId 받아오는 함수
  return sessionStorage.getItem("currentUserId");
}

function getCurrentUserAccountType() {
  // 세션에 있는 userAccountType(personal또는 business인지) 받아오는 함수
  return sessionStorage.getItem("currentUserAccountType"); // 값이 1이면 personal, 2면 business
}

/*
  base 부분 연결 "해당 파트(필요 파라미터)"
*/

// 기업 피드 볼 때(x) 


// 개인 피드 볼 때(x) 


// 탐색 피드 볼 때(x)


// 게시물 추가 할 때(x) -> a 태그라 따로 js 처리 불필요


// 프로필 볼 때(userId)
const goToProfile = document.getElementById("bottom_nav_profile_image");

goToProfile.addEventListener("click", () => {
  if (getCurrentUserAccountType() == 1) {
    window.location.href = `./profile_per.html?userId=${getUserIdFromSessionStorage()}`;
  } else if (getCurrentUserAccountType() == 2) {
    window.location.href = `./profile_ent.html?userId=${getUserIdFromSessionStorage()}`;
  } else {
    alert("userId 또는 accountType을 확인해주세요.(url 값과 sessionStorage 값)");
  }
});

// mock data 사용법
/*
$.getJSON("../mock/searchingData.json", function (data) {
  // data 확인
  console.log(data);
  // list 형식의 json data를 받아와서 사용하는 방법 예시
  $.each(data, function (index, item) {
    var imgElement = $("<img>").attr({
      src: item.imageSrc,
      alt: item.name,
      width: "100px",
      height: "100px",
    });
    // main 태그에 추가
    $("main").append(imgElement);
  });
});
*/