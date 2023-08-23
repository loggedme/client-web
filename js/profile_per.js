/*
  개인 프로필(게시물 여러개) 
  개인 프로필(게시물 없음)
*/
//페이지 로딩 시 각 카테고리에 맡게 하단바의 이미지를 변경

$(document).ready(function () {
  $("#bottom_nav_profile_image").attr(
    "src",
    "../image/bottom_nav_profile_black.png"
  );
});

/* 모달창 부분 */
$(".modal_overlay").hide();

$(".close_btn").click(function () {
  $(".modal_overlay").hide();
});

let badgeList = []; // 뱃지 배열을 badgeList에 저장
var badgeListLength = badgeList.length; // 뱃지 개수
let badgeImage = []; // 뱃지 이미지(썸네일) 리스트(bageList로 불러 올 수 있으면 굳이 필요 없을 수도있음)
var badgeDescription = []; // 뱃지 설명이 들어있는 배열
let FeedList = []; // 피드 아이디 들어있는 배열
let FeedImage = []; // 피드 값 중에서 image_urls 부분에서 첫 이미지들(image_urls[0])만 따로 받아오기(프로필 페이지 썸네일용)
var FeedListLength = FeedList.length; // 피드 개수
var isFollow = false;
/* ajax 부분 */
// ajax url에 user.id에 들어갈 값을 받아오는 부분

// http://127.0.0.1:5500/html/profile_per.html?userId=1&&userAccountType=personal
// -> 뒤에서 2가지 key=value 오고 그걸 get으로 받아오기
let params = new URLSearchParams(window.location.search); // 현재 페이지의 실제 주소(프론트에서의)
let userId = params.get("userId");
let userAccountType = params.get("userAccountType"); // 본인
/* 이해를 위한 예시 코드
let Ac = params.get("userAccountType");
console.log(userId);
console.log(Ac);
*/

/* 본인이 본인의 계정으로 들어온 것인지 확인하는 if문 (플러스 버튼의 유무를 위함) */
// 세션에 본인꺼 currentAccountType(personal/business), currentUserId가 들어있다.
if (userId === sessionStorage.getItem("currentUserId")) {
} else {
  $("a").remove("#feed_plus_btn");
}

// 토큰 받아오는 함수
function getTokenFromSessionStorage() {
  return sessionStorage.getItem("jwtToken");
}
var jwtToken = getTokenFromSessionStorage();

// get 부분 (handle, 프사, 팔로워, 팔로잉, 뱃지)
$.ajax({
  url: `http://43.202.152.189/user/${userId}`, // ${userId}에 백엔드의 user.id가 들어갈거고
  type: "GET",
  dataType: "json",
  contentType: "application/json",
  headers: {
    Authorization: `Bearer ${jwtToken}`,
  },
  success: function (data) {
    console.log("success:", JSON.stringify(data));

    // 프사 받아오기
    console.log(data.user.thumbnail);

    /* 본인이 본인의 계정으로 들어온 것인지 확인하는 if문 (플러스 버튼의 유무를 위함) */
    // 세션에 본인꺼 currentAccountType(personal/business), currentUserId가 들어있다.
    if (userId == sessionStorage.getItem("currentUserId")) {
      if (sessionStorage.getItem("thumbnail") == "null") {
        console.log("기본 이미지가 적용 안된다는거");
        $("#pro_img").attr("src", sessionStorage.getItem("thumbnail"));
      } else {
        // 위의 조건이 null이라는 건 아무것도 변경되지 않고 기본 이미지가 적용되어야 함.
      }
    } else {
      console.log("뭐가 안되는 걸까");
      $("a").remove("#feed_plus_btn");
    }

    if (sessionStorage.getItem("thumbnail")) {
      $("#pro_img").attr("src", data.user.thumbnail);
    } else {
    }

    // 아이디(handle) 받아오기
    document.querySelector(".per_id").innerText = data.user.handle;

    // 이름 받아오기
    document.querySelector(".name").innerText = data.user.name;

    var Posts = data.feed.count; // 피드 개수
    var Followers = data.follower; // "api 사용자 프로필 조회" 에서 받아오게
    var Following = data.following; // "api 사용자 프로필 조회" 에서 받아오게

    FeedPosts(Posts);
    myFollowers(Followers); // 팔로워 숫자 부분 html로 보내기
    myFollowing(Following); // 팔로우 숫자 부분 html로 보내기

    /* 
      뱃지 받아오는 부분
    */
    isFollow = data.user.is_following;
    if (isFollow) {
      $(".follow_btn").css("background-color", "rgba(217, 217, 217, 0.5)");
      $(".follow_btn").css("color", "black");
    } else {
      $(".follow_btn").css("background-color", "#6970f2");
      $(".follow_btn").css("color", "white");
    }
    $.each(data.badge.items, function (index, item) {
      // 각각의 뱃지 아이템을 배열에 하나씩 푸쉬
      badgeList.push(item); // ajax 밖에 있는 빈 배열 badgeList에 뱃지의 data 넣기
      badgeImage.push(item.thumbnail); // ajax 밖에 있는 빈 배열 badgeImage에 뱃지의 썸네일 넣기
      badgeDescription.push(item.description); // ajax 밖에 있는 빈 배열 badgeDescription에 뱃지 설명 넣기
    });
    badgeListLength = badgeList.length; // 뱃지 개수

    //----------------------------------------------------

    // 피드 id 배열에 넣기
    for (let i = 0; i < data.feed.items.length; i++) {
      FeedList.push(data.feed.items[i].id);
    }

    FeedListLength = Posts;

    for (let i = 0; i < FeedListLength; i++) {
      // 피드 썸네일 이미지 배열에 담기
      FeedImage.push(data.feed.items[i].image_urls[0]);
    }

    showBadge(badgeListLength); // 뱃지 html로 보내서 보여주는 함수
    showFeed(FeedListLength); // 피드 html로 보내서 보여주는 함수
  },
  error: function (jqXHR, textStatus, errorThrown) {
    if (jqXHR.status === 404) {
      console.error("404 Not Found", jqXHR.responseText);
      alert("조회 하려는 유저가 존재하지 않을 때");
    }
  },
});

/*
  posts, followers, following 숫자 변경 부분
*/

function FeedPosts(num) {
  // posts 숫자 함수
  document.getElementsByClassName("number")[0].innerText = num;
}

function myFollowers(num) {
  document.getElementsByClassName("number")[1].innerText = num;
}

function myFollowing(num) {
  document.getElementsByClassName("number")[2].innerText = num;
}

FeedPosts(FeedListLength); // posts 숫자 부분

function showBadge(badgeListLength) {
  let template = ``;

  if (badgeListLength != 0) {
    for (let i = 0; i < badgeListLength; i++) {
      template += `
      <div class="badge" id="badge${
        i + 1
      }"><img class="open_modal" onclick="modal_On(${i})" src="${
        badgeImage[i]
      }"></div>
      `;
    }
    $(".badge_inner").append(template);
  }
  if (userId != sessionStorage.getItem("currentUserId")) {
    $("div").remove("#add_badge");
    $("button").remove(".edit_btn");
  } else {
    $("button").remove(".follow_btn");
  }
}

/*
  뱃지 눌렀을 때, 뱃지 모달창의 내용 변경 부분
*/
// 이 부분은 badgeImage 배열 변수와, badgeList와 같이 있어야 됨.
function modal_On(num) {
  // showBadge(num); //함수가 실행되어야 실행되는 함수
  document.querySelector(".modal_image").src = badgeImage[num]; // badgeList를 통해서 받아올 수 있으면 그걸로 간다.(하지만.. 지금처럼 이미지들만 따로 배열에 넣은게 편할 수도 있다...)
  document.getElementsByClassName("modal_document")[0].innerText =
    badgeDescription[num]; // 스택에서 보면 classname으로 받아오면 배열로 받아옴. 그래서 첫번째 요소로 받아와야 원하는대로 된다.
  $(".modal_overlay").show(); // 모달 보여주는 코드
}
//---------------------------------------------------------------

/* 
  피드가 있을 경우 피드 없는 상태일 때의 div 삭제
 */

function showFeed(FeedListLength) {
  let template = ``;

  if (FeedListLength != 0) {
    $("div").remove(".zero_feed"); // 피드가 1개라도 있으면 게시물 없다는 표시의 div를 html에서 삭제
    for (let i = 0; i < FeedListLength; i++) {
      template += `
      <div class="goto_feed" id="feed_btn${i}" onclick="GoToFeed(${i})"><img class="feed_img" src="${FeedImage[i]}"></div>
      `;
    }
    $(".my_feed").append(template);
  }
}

function GoToFeed(num) {
  window.location.href = `./single_feed.html?feedId=${FeedList[num]}`; // 피드의 정보를 리턴
}

$(".edit_btn").click(function () {
  /* 프로필 수정 시 userId가 필요하지 않음(나중에 필요할 지도 모르니까 놔둬)
    window.location.href = `./profile_edit.html?userId=${data.id}`; 
    */
});

function getProfileImageFromSessionStorage() {
  return sessionStorage.getItem("thumbnail");
}

// ajax for 팔로우 요청
function followHandler(userId) {
  var jwtToken = getTokenFromSessionStorage();
  var currentUserId = getCurrentUserIdFromSessionStorage();
  $.ajax({
    url: `http://43.202.152.189/user/${currentUserId}/following/${userId}`,
    type: "POST",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      console.log("팔로우 성공: " + JSON.stringify(data));

      $(".follow_btn").css("background-color", "rgba(217, 217, 217, 0.5)");
      $(".follow_btn").css("color", "black");

      isFollow = true;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("접근 권한이 없습니다.");
        window.location.href = "./login.html";
      } else if (jqXHR.status === 404) {
        console.error("Not found:", jqXHR.responseText);
        alert("사용자가 존재하지 않습니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버 에러");
      }
    },
  });
}

// ajax for 팔로우 취소
function unfollowHandler(userId) {
  var jwtToken = getTokenFromSessionStorage();
  var currentUserId = getCurrentUserIdFromSessionStorage();
  $.ajax({
    url: `http://43.202.152.189/user/${currentUserId}/following/${userId}`,
    type: "DELETE",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      console.log("팔로우 취소: " + JSON.stringify(data));
      $(".follow_btn").css("background-color", "#6970f2");
      $(".follow_btn").css("color", "white");
      isFollow = false;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("접근 권한이 없습니다.");
        window.location.href = "./login.html";
      } else if (jqXHR.status === 404) {
        console.error("Not found:", jqXHR.responseText);
        alert("사용자가 존재하지 않습니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버 에러");
      }
    },
  });
}

$(".follow_btn").click(function () {
  if (isFollow) {
    unfollowHandler(userId);
  } else {
    followHandler(userId);
  }
});

function getCurrentUserIdFromSessionStorage() {
  return sessionStorage.getItem("currentUserId");
}

function getUserHandleFromSessionStorage() {
  return sessionStorage.getItem("handle");
}

function goToFollowers() {
  urlUserId = params.get("userId");
  window.location.href = `./follow_list.html?userId=${urlUserId}&&userHandle=${getUserHandleFromSessionStorage()}&&isFollowing=false`;
}

function goToFollowing() {
  urlUserId = params.get("userId");
  window.location.href = `./follow_list.html?userId=${urlUserId}&&userHandle=${getUserHandleFromSessionStorage()}&&isFollowing=true`;
}

$("#followers").click(function () {
  goToFollowers();
});

$("#following").click(function () {
  goToFollowing();
});
