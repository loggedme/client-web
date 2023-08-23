var jwtToken = getTokenFromSessionStorage();
var currentUserId = getCurrentUserIdFromSessionStorage();
var userAccountType = getCurrentUserAccountTypeFromSessionStorage();
var userThumbnail = getCurrentUserThumbnailFromSessionStorage();
var handle = sessionStorage.getItem("handle");

//좋아요 버튼
function likedFeed(feedId, likesNum) {
  $.ajax({
    url: `http://43.202.152.189/feed/${feedId}/like`,
    type: "POST",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      console.log("좋아요 성공: " + JSON.stringify(data));

      likesNum++;
      $(".likesNum_container").text(`${likesNum}명이 좋아합니다.`);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("접근 권한이 없습니다.");
        heartLink.removeClass("filled_heart_link");
        heartLink.addClass("heart_link");
        item.is_liked = false;
      } else if (jqXHR.status === 404) {
        console.error("Not found:", jqXHR.responseText);
        alert("사용자가 존재하지 않습니다.");
        heartLink.removeClass("filled_heart_link");
        heartLink.addClass("heart_link");
        item.is_liked = false;
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버 에러");
        heartLink.removeClass("filled_heart_link");
        heartLink.addClass("heart_link");
        item.is_liked = false;
      }

      console.log(item.is_liked);
    },
  });
}
// 좋아요 취소 버튼
function unlikedFeed(feedId, likesNum) {
  $.ajax({
    url: `http://43.202.152.189/feed/${feedId}/like`,
    type: "DELETE",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      console.log("좋아요 취소 성공: " + JSON.stringify(data));
      if (likesNum === 0) {
        $(".likesNum_container").text(`${likesNum}명이 좋아합니다.`);
      } else {
        likesNum--;
        $(".likesNum_container").text(`${likesNum}명이 좋아합니다.`);
      }
      
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("접근 권한이 없습니다.");
        heartLink.removeClass("filled_heart_link");
        heartLink.addClass("heart_link");
        item.is_liked = false;
      } else if (jqXHR.status === 404) {
        console.error("Not found:", jqXHR.responseText);
        alert("사용자가 존재하지 않습니다.");
        heartLink.removeClass("filled_heart_link");
        heartLink.addClass("heart_link");
        item.is_liked = false;
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버 에러");
        heartLink.removeClass("filled_heart_link");
        heartLink.addClass("heart_link");
        item.is_liked = false;
      }

      //console.log(item.is_liked);
    },
  });
}

function updateLikesCount(itemIndex, delta) {
    // itemIndex에 해당하는 아이템의 좋아요 수 업데이트
    var likesNumContainer = $(".likesNum_container")[itemIndex];
    if (likesNumContainer) {
        // 현재 좋아요 수를 가져온 후 delta만큼 증가시킴
        var currentLikes = parseInt(likesNumContainer.textContent);
        var newLikes = currentLikes + delta;
        likesNumContainer.textContent = newLikes + '명이 좋아합니다.';
    }
}

//피드 스크랩 버튼
function savedFeed(userId, feedId) {
  $.ajax({
    url: `http://43.202.152.189/user/${userId}/saved/${feedId}`,
    type: "POST",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      console.log(`피드 스크랩 성공: ${userId}, ${feedId}`);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
      } else if (jqXHR.status === 404) {
        console.error("Not found:", jqXHR.responseText);
      } else if (jqXHR.status === 409) {
        console.error("Already saved", jqXHR.responseText);
        alert("이미 저장된 피드입니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버 에러");
      }
    },
  });
}
// 피드 스크랩 취소 버튼
function unsavedFeed(userId, feedId) {
  $.ajax({
    url: `http://43.202.152.189/user/${userId}/saved/${feedId}`,
    type: "DELETE",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      console.log(`피드 스크랩 취소 성공: ${userId}, ${feedId}`);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("접근 권한이 없습니다.");
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

//댓글 조회 (모달창) 버튼
function openModal(feedId, userId, userProfileLink) {
  var userThumbnail = getCurrentUserThumbnailFromSessionStorage();
  // 댓글 모달창 댓글 작성
  var postingUserImg = $("<div>").addClass("postingUser_img");
  var postingImg = $("<img>").attr({
    src:
      userThumbnail === "null"
        ? "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/680px-Default_pfp.svg.png?20220226140232"
        : `${userThumbnail}`,
    alt: "imgs",
  });
  postingUserImg.append(postingImg);

  var commentInputContainer = $("<div>").addClass("commentInput");
  var commentInput = $(
    "<input type=text id=comment_input autocomplete=off placeholder=댓글남기기>"
  );
  commentInputContainer.append(commentInput);

  $.ajax({
    url: `http://43.202.152.189/feed/${feedId}/comment`,
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      console.log("sueccess: " + JSON.stringify(data.items));
      var commentPost = $("<div>").addClass("comment_post");
      var commentPostBtn = $("<button type=button>")
        .html("게시")
        .on("click", function () {
          postingComment(feedId);
        });
      commentPost.append(commentPostBtn);

      $(".postComment").append(
        postingUserImg,
        commentInputContainer,
        commentPost
      );

      var $modalFeedInfo = $(`#feedInfo${feedId}`).clone();
      var modalFeedInfoId = $modalFeedInfo.attr("id");

      if (modalFeedInfoId === "feedInfo" + feedId) {
        $(".feeds_container").append($modalFeedInfo);
      }

      // 피드의 댓글이 있을 경우
      if (data.items.length > 0) {
        var commentsHtml = data.items
          .map(function (comment) {
            // 댓글 작성 시간 계산
            var uploadDateString = calculateUploadDate(comment.created_at);

            // 댓글 삭제 버튼, 작성자만 보이도록
            var deleteCommentBtnClass =
              userId === comment.author.id ? "visible" : "hidden";

            // 댓글 작성자의 썸네일
            var authorThumbnail =
              userThumbnail === "null"
                ? "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/680px-Default_pfp.svg.png?20220226140232"
                : comment.author.thumbnail;

            return `
                        <div class="comments_item">
                            <div class="comments_user_info">
                                <a class="comment_author_img" onclick="window.location.href='${userProfileLink}?userId=${comment.author.id}';">
                                    <img src="${authorThumbnail}">
                                </a>
                                <div class="comments_info">
                                    <div class="comments_idDate">
                                        <a style="margin-right: 0.5rem; font-weight: bold;">${comment.author.handle}</a>
                                        <div style="color:#888; font-size:small;">${uploadDateString}</div>
                                    </div>
                                    <div class="comments_content">${comment.content}</div>
                                </div>
                            </div>
                            <div class="deleteCommentBtn ${deleteCommentBtnClass}">
                                <button type="button" onclick="deleteComment('${feedId}', '${comment.id}', this)">삭제</button>
                            </div>
                        </div>
                    `;
          })
          .join("");

        $(".comments_container").html(commentsHtml);

        // 피드의 댓글이 없을 경우
      } else {
        var commentEmptyMessage1 =
          $("<div id=empty1>").html("아직 댓글이 없습니다.");
        var commentEmptyMessage2 =
          $("<div id=empty2>").html("댓글을 남겨보세요.");
        $(".comments_container").append(
          commentEmptyMessage1,
          commentEmptyMessage2
        );
      }

      $(".modal").css("display", "block");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 404) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("피드가 존재하지 않습니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
      }
    },
  });
}

// 댓글 작성 버튼
function postingComment(feedId) {
  var jwtToken = getTokenFromSessionStorage();
  console.log(feedId);

  var commentContent = $("#comment_input").val();
  if (commentContent.trim() === "") {
    alert("댓글을 입력해주세요.");
    return;
  }

  // 댓글 작성 ajax
  $.ajax({
    url: `http://43.202.152.189/feed/${feedId}/comment`,
    type: "POST",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    data: JSON.stringify({ content: commentContent }),
    contentType: "application/json",
    success: function (data) {
      $("#comment_input").val("");

      console.log("댓글 작성 성공: " + JSON.stringify(data));
      
      // 작성한 댓글 정보 가져오기
      var uploadedComment = {
        author: {
          handle: handle, // 여기에 실제 handle 값을 넣어주세요
          thumbnail: userThumbnail, // 여기에 실제 thumbnail URL을 넣어주세요
        },
        content: commentContent,
        created_at: new Date().toISOString(), // 작성 시간 설정 (현재 시간으로 임시 설정)
      };

      // 새로운 댓글 요소 생성
      var newComment = `
        <div class="comments_item">
            <div class="comments_user_info">
                <a class="comment_author_img">
                    <img src="${uploadedComment.author.thumbnail}">
                </a>
                <div class="comments_info">
                    <div class="comments_idDate">
                        <a style="margin-right: 0.5rem; font-weight: bold;">${uploadedComment.author.handle}</a>
                        <div style="color:#888; font-size:small;">방금 전</div>
                    </div>
                    <div class="comments_content">${uploadedComment.content}</div>
                </div>
            </div>
        </div>
      `;

      // 새로운 댓글 요소를 comments_container에 추가
      $(".comments_container").append(newComment);
      $(".comments_container #empty1, .comments_container #empty2").remove();

    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 400) {
        console.error("Bad Request:", jqXHR.responseText);
        alert("올바르지 않은 형식입니다.");
      } else if (jqXHR.status === 401) {
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

// 작성 시간 계산 함수
function calculateUploadDate(created_at) {
  var uploadDate = new Date(created_at);
  var currentDate = new Date();
  var timeDiffInMilliseconds = currentDate - uploadDate;

  var timeDiffInMinutes = Math.floor(timeDiffInMilliseconds / (1000 * 60));
  var timeDiffInHours = Math.floor(timeDiffInMinutes / 60);
  var timeDiffInDays = Math.floor(timeDiffInHours / 24);

  if (timeDiffInDays > 0) {
    return timeDiffInDays + "일 전";
  } else if (timeDiffInHours > 0) {
    return timeDiffInHours + "시간 전";
  } else if (timeDiffInMinutes > 0) {
    return timeDiffInMinutes + "분 전";
  } else {
    return "방금 전";
  }
}

// 댓글 삭제 버튼
function deleteComment(feedId, commentId, deleteButton) {
  var jwtToken = getTokenFromSessionStorage();
  var $commentItem = $(deleteButton).closest(".comments_item");
  $.ajax({
    url: `http://43.202.152.189/feed/${feedId}/comment/${commentId}`,
    type: "DELETE",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      console.log("sueccess: " + JSON.stringify(data));
      console.log(`댓글 삭제 성공: ${feedId}, ${commentId}`);
      
      $commentItem.empty();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("로그인이 필요합니다.");
        window.location.href = "./login.html";
      } else if (jqXHR.status === 403) {
        console.error("Forbidden:", jqXHR.responseText);
        alert("작성한 댓글이 아닙니다.");
      } else if (jqXHR.status === 404) {
        console.error("Not found:", jqXHR.responseText);
        alert("피드 혹은 사용자가 존재하지 않습니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버 에러");
      }
    },
  });
}

// 피드 삭제 버튼
function deleteFeed(feedId) {
  var jwtToken = getTokenFromSessionStorage();
  $.ajax({
    url: `http://43.202.152.189/feed/${feedId}`,
    type: "DELETE",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      console.log("sueccess: " + JSON.stringify(data));
      console.log(`피드 삭제 성공: ${feedId}`);
      window.history.back();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("로그인이 필요합니다.");
        window.location.href = "./login.html";
      } else if (jqXHR.status === 403) {
        console.error("Forbidden:", jqXHR.responseText);
        alert("작성한 댓글이 아닙니다.");
      } else if (jqXHR.status === 404) {
        console.error("Not found:", jqXHR.responseText);
        alert("피드가 존재하지 않습니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버 에러");
      }
    },
  });
}

function copyLink(url) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(url)
      .then(function () {
        alert("URL이 복사되었습니다.");
      })
      .catch(function (error) {
        console.error("복사 실패:", error);
      });
  } else {
    // navigator.clipboard를 지원하지 않는 경우 대체 처리
    console.warn("현재 브라우저에서는 클립보드 복사를 지원하지 않습니다.");
  }
}

// 세션에서 받아올 값
function getTokenFromSessionStorage() {
  return sessionStorage.getItem("jwtToken");
}

function getCurrentUserIdFromSessionStorage() {
  return sessionStorage.getItem("currentUserId");
}

function getCurrentFeedIdFromSessionStorage() {
  return sessionStorage.getItem("currentFeedId");
}

function getCurrentUserAccountTypeFromSessionStorage() {
  return sessionStorage.getItem("currentUserAccountType");
}

function getCurrentUserThumbnailFromSessionStorage() {
  return sessionStorage.getItem("thumbnail");
}
