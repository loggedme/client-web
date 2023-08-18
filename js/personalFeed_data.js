$(document).ready(function () {
  $("#bottom_nav_person_image").attr(
    "src",
    "../image/bottom_nav_person_black.png"
  );
});

$(document).ready(function (jwtToken) {
  var jwtToken = getTokenFromSessionStorage();
  var currentUserId = getCurrentUserIdFromSessionStorage();

  // 유저 썸네일 받아오기
  var userThumbnail = getCurrentUserThumbnailFromSessionStorage();
  //console.log(userThumbnail);
  // 댓글 모달창 댓글 작성
  var postingUserImg = $("<div>").addClass("postingUser_img");
  var postingImg = $("<img>").attr({
    src: `${userThumbnail}`,
    alt: "imgs",
  });
  postingUserImg.append(postingImg);

  var commentInputContainer = $("<div>").addClass("commentInput");
  var commentInput = $(
    "<input type=text id=comment_input autocomplete=off placeholder=댓글남기기>"
  );
  commentInputContainer.append(commentInput);

  $.ajax({
    url: "http://43.202.152.189/feed?following=true&type=personal",
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      //console.log("sueccess: " + JSON.stringify(data));

      $.each(data.items, function (index, item) {
        var currentFeedId = item.id;
        //console.log(currentFeedId);

        // 전체 아이템 박스
        var feedItem = $("<div>").prop({
          class: "feed_item",
        });
        var feedInfo = $("<div>").prop({
          class: "feed_info",
          id: "feedInfo" + item.id,
        });
        // feed 상단 부분 사용자 사진, 아이디
        var feedTopContainer = $("<div>").prop({
          class: "feedTop_container",
        });
        var feedTop = $("<div>").prop({
          class: "feed_top",
        });
        // 사용자 프로필 정보 컨테이너
        var profileInfo = $("<a>").prop({
          class: "profile_info",
          href: "../html/profile_ent.html",
        });
        var profileImg = $("<img>").attr({
          src: item.author.thumbnail,
          alt: item.author.id,
        });
        var userId = $("<div>").prop({
          class: "user_id",
          textContent: `${item.author.handle}`,
        });
        profileInfo.append(profileImg, userId);

        // 옵션 토글 버튼 (점 세 개)
        var optionContent = $("<div style=display:none>").prop({
          class: "option_content",
        });
        var gotoUserInfo = $("<a>").prop({
          class: "goTo_userInfo",
          href: "../html/profile_ent.html",
          textContent: "이 계정 정보",
        });
        var saveBtnOption = $("<button type=button>")
          .addClass("save_btn")
          .html("저장하기")
          .on("click", changeSaveBtn);
        optionContent.append(gotoUserInfo, saveBtnOption);
        var optionBtn = $(
          "<button style=background-color:transparent;border:none;>"
        )
          .addClass("optionBtn")
          .on("click", function () {
            optionContent.toggle();
          });
        var optionImg = $("<img>").attr({
          src: "../image/option_btn.png",
          alt: "optionButton",
        });
        optionBtn.append(optionImg);

        feedTop.append(profileInfo, optionBtn);
        feedTopContainer.append(feedTop, optionContent);

        // feed 이미지
        var imgUrls = item.image_urls;
        var imageContainer = $("<div>").addClass("image_container");
        var imageAlbum = $("<div>").addClass("image_album");
        var images = [];

        var btnContainer = $("<div>").addClass("btn_container");

        var prevBtn = $("<button>").addClass("previous");
        var prevImg = $("<img>").attr({
          src: "../image/new_feed2_leftarrow.png",
          alt: "prevButton",
        });
        prevBtn.append(prevImg);

        var nextBtn = $("<button>").addClass("next");
        var nextImg = $("<img>").attr({
          src: "../image/new_feed2_rightarrow.png",
          alt: "nextButton",
        });
        nextBtn.append(nextImg);

        var currentSlideIndex = 0; // 현재 이미지 인덱스
        var sliding = false;

        // 이미지들 images 배열에 넣기
        $.each(imgUrls, function (imgIndex, imgUrl) {
          var feedImg = $("<img>").attr({
            src: imgUrl,
            alt: "Image " + (imgIndex + 1),
            class: "feed_image",
          });

          images.push(feedImg);
        });
        // 첫 번째 이미지 추가
        imageAlbum.append(images[currentSlideIndex]);
        prevBtn.prop("disabled", true);
        prevBtn.on("click", goToPrev);
        nextBtn.on("click", goToNext);
        // 이미지 슬라이드 점들 추가
        var slideDots = $("<div>").addClass("slide_dots");
        var slideDotsList = [];
        for (var i = 0; i < imgUrls.length; i++) {
          var dot = $("<div>").addClass("dot").html(" ");
          slideDots.append(dot);
          slideDotsList.push(dot);
        }
        // 점들에 .dot 클래스 부여 후 슬라이드 점들 추가
        slideDotsList[0].addClass("active_dot");
        // 이미지 슬라이드 점 클릭 이벤트
        $(".dot").on("click", dotClick);
        btnContainer.append(prevBtn, nextBtn);
        imageContainer.append(imageAlbum, btnContainer, slideDots);

        // 기능 버튼 아이콘 (좋아요, 댓글, 공유, 저장)
        var feedFunctionContainer = $("<div>").addClass(
          "feedFunction_container"
        );
        var functionIconContainer = $("<div>").addClass(
          "functionIcon_container"
        );
        var functionIconItem = $("<div>").addClass("functionIcon_item");

        var heartImg = $("<img>").attr({
          id: "heart",
          src: "../image/heart.png",
          alt: "heart",
          width: "38rem",
          style: "padding-top: 0.1rem;",
        });
        var heartLink = $("<button type=button>")
          .addClass("heart_link")
          .on("click", function () {
            var currentSrc = heartImg.attr("src");
            var newSrc;

            if (
              heartLink.hasClass("filled_heart_link") &&
              currentSrc === "../image/filled_heart.png" &&
              item.is_liked == true
            ) {
              newSrc = "../image/heart.png";
              heartLink.removeClass("filled_heart_link");
              heartLink.addClass("heart_link");
              item.is_liked = false;
              unlikedFeed(currentFeedId);
            } else {
              newSrc = "../image/filled_heart.png";
              heartLink.addClass("filled_heart_link");
              heartLink.removeClass("heart_link");
              item.is_liked = true;
              likedFeed(currentFeedId);
            }

            heartImg.attr("src", newSrc);
          });

        heartLink.prop({
          id: "heart_link" + item.id,
        });
        heartLink.append(heartImg);

        var currentSrc = item.is_liked
          ? "../image/filled_heart.png"
          : "../image/heart.png";
        heartImg.attr("src", currentSrc);

        if (currentSrc === "../image/filled_heart.png") {
          heartLink.removeClass("heart_link");
          heartLink.addClass("filled_heart_link");
        } else {
          heartLink.removeClass("filled_heart_link");
          heartLink.addClass("heart_link");
        }

        var commentLink = $("<button type=button id=comment_btn>")
          .addClass("comment_link")
          .on("click", function () {
            openModal(item.id, data);
          });
        var commentImg = $("<img>").attr({
          src: "../image/comment.png",
          alt: "comment",
          width: "31rem",
          style: "margin-left: 0.3rem; padding-top: 0.1rem;",
        });
        commentLink.prop({
          id: item.id,
        });
        commentLink.append(commentImg);

        var CopyUrl = `http://127.0.0.1:5500/html/single_feed.html?feedId=${currentFeedId}`;
        var shareLink = $("<button type=button>")
          .addClass("share_link")
          .on("click", function () {
            copyLink(CopyUrl);
          });
        var shareImg = $("<img>").attr({
          src: "../image/share.png",
          alt: "shareBtn",
          width: "40rem",
          style: "margin-left: 0.4rem; padding-top: 0.2rem;",
        });
        shareLink.prop({
          id: "share_link" + item.id,
        });
        shareLink.append(shareImg);
        functionIconItem.append(heartLink, commentLink, shareLink);

        var saveImg = $("<img>").attr({
          src: "../image/save.png",
          alt: "saveBtn",
          width: "32rem",
        });
        var saveLink = $("<button type=button>")
          .addClass("save_link")
          .on("click", function () {
            var currentSaveSrc = saveImg.attr("src");
            var newSaveSrc;

            if (
              saveLink.hasClass("filled_save_link") &&
              currentSaveSrc === "../image/filled_save.png" &&
              item.is_saved == true
            ) {
              newSaveSrc = "../image/save.png";
              saveLink.removeClass("filled_save_link");
              saveLink.addClass("save_link");
              item.is_saved = false;
              unsavedFeed(currentFeedId);
            } else {
              newSaveSrc = "../image/filled_save.png";
              saveLink.addClass("filled_save_link");
              saveLink.removeClass("save_link");
              item.is_saved = true;
              savedFeed(currentFeedId);
            }

            saveImg.attr("src", newSaveSrc);
          });
        saveLink.prop({
          id: "save_link" + item.id,
        });
        var currentSaveSrc = item.is_saved
          ? "../image/filled_save.png"
          : "../image/save.png";
        saveImg.attr("src", currentSaveSrc);

        if (currentSaveSrc === "../image/filled_save.png") {
          saveLink.removeClass("save_link");
          saveLink.addClass("filled_save_link");
        } else {
          saveLink.removeClass("filled_save_link");
          saveLink.addClass("save_link");
        }

        saveLink.append(saveImg);
        functionIconContainer.append(functionIconItem, saveLink);
        // 좋아요 수
        var likesContainer = $("<div>").addClass("likesNum_container");
        var likesNum = item.likes;
        likesContainer = likesNum + "명이 좋아합니다.";
        var likesNumContainer = $("<div>")
          .addClass("likesNum_container")
          .text(likesContainer);
        // 기능목록 flex 합치기
        feedFunctionContainer.append(functionIconContainer, likesNumContainer);

        // feed 하단부분 전체 (아이디, 해쉬태그, 내용)
        // IdHashtag div (아이디, 해쉬태그)
        var IdHashtag = $("<div>").prop({
          class: "IdHashtag",
        });
        var bottomUserId = $("<a>")
          .prop({
            class: "bottom_id",
            textContent: item.author.handle,
          })
          .on("click", function () {
            window.location.href = `${userProfileLink}?userId=${item.author.id}`;
          });
        var feedHashtag = $("<a>")
          .prop({
            class: "feed_hashtag",
            textContent: `${
              item.tagged_user && item.tagged_user.name !== null
                ? item.tagged_user.name
                : "태그된 기업"
            }`,
          })
          .on("click", function () {
            if (item.tagged_user && item.tagged_user.id) {
              window.location.href = `./profile_ent.html?userId=${item.tagged_user.id}`;
            }
          });

        IdHashtag.append(bottomUserId, feedHashtag);

        var feedScript = $("<div>").prop({
          class: "feed_script",
          textContent: item.content,
        });

        // 업로드 날짜 (현재로부터 얼마 전인지)
        var uploaded_date = $("<div>").addClass("uploaded_date");

        var uploadDate = new Date(item.created_at);
        var currentDate = new Date();
        var timeDiffInMilliseconds = currentDate - uploadDate;

        var timeDiffInHours = Math.floor(
          timeDiffInMilliseconds / (1000 * 60 * 60)
        );
        var timeDiffInDays = Math.floor(timeDiffInHours / 24);

        var uploadDateString =
          timeDiffInHours < 24
            ? timeDiffInHours + "시간 전 게시"
            : timeDiffInDays + "일 전 게시";

        var uploadedDate = $("<div>")
          .addClass("uploaded_date")
          .text(uploadDateString);

        uploaded_date.append(uploadedDate);

        feedInfo.append(IdHashtag, feedScript, uploaded_date);

        feedItem.append(
          feedTopContainer,
          imageContainer,
          feedFunctionContainer,
          feedInfo
        );
        $(".feed_list").append(feedItem);

        // 댓글 모달창 함수
        function openModal(feedId, data) {
          $.ajax({
            url: `http://43.202.152.189/feed/${currentFeedId}/comment`,
            type: "GET",
            dataType: "json",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            success: function (data) {
              //console.log("sueccess: " + JSON.stringify(data));
              var commentPost = $("<div>").addClass("comment_post");
              var commentPostBtn = $("<button type=button>")
                .html("게시")
                .on("click", function postingComment() {
                  console.log(currentFeedId);

                  var commentContent = $("#comment_input").val();
                  if (commentContent.trim() === "") {
                    alert("댓글을 입력해주세요.");
                    return;
                  }

                  $.ajax({
                    url: `http://43.202.152.189/feed/${currentFeedId}/comment`,
                    type: "POST",
                    headers: {
                      Authorization: `Bearer ${jwtToken}`,
                    },
                    data: JSON.stringify({ content: commentContent }),
                    contentType: "application/json",
                    success: function (data) {
                      console.log("댓글 작성 성공: " + JSON.stringify(data));
                      $("#comment_input").val("");
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
                    var uploadDate = new Date(comment.created_at);
                    var currentDate = new Date();
                    var timeDiffInMilliseconds = currentDate - uploadDate;

                    var timeDiffInHours = Math.floor(
                      timeDiffInMilliseconds / (1000 * 60 * 60)
                    );
                    var timeDiffInDays = Math.floor(timeDiffInHours / 24);

                    var uploadDateString =
                      timeDiffInHours < 24
                        ? timeDiffInHours + "시간 전"
                        : timeDiffInDays + "일 전";

                    // 댓글 쓴 사람의 이미지 대신 일단 글쓴 사람 이미지 불러오도록 해놓음
                    return `
                                      <div class="comments_item">
                                          <a><img src="${comment.author.thumbnail}"></a>
                                          <div class="comments_info">
                                              <div class="comments_idDate">
                                                  <a style="margin-right: 0.5rem; font-weight: bold;">${comment.author.name}</a>
                                                  <div style="color:#888; font-size:small;">${uploadDateString}</div>
                                              </div>
                                              <div class="comments_content">${comment.content}</div>
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

        // 함수들
        // 이미지 슬라이드
        function goToPrev() {
          if (!sliding) {
            sliding = true;
            currentSlideIndex =
              (currentSlideIndex - 1 + images.length) % images.length;
            updateSlide();
          }
        }

        function goToNext() {
          if (!sliding) {
            sliding = true;
            currentSlideIndex = (currentSlideIndex + 1) % images.length;
            updateSlide();
          }
        }
        // 점 클릭
        function dotClick() {
          if (!sliding) {
            var index = $(this).index();
            if (index !== currentSlideIndex) {
              sliding = true;
              currentSlideIndex = index;
              updateSlide();
            }
          }
        }
        // 이미지 슬라이드 업뎃
        function updateSlide() {
          imageAlbum.empty();
          imageAlbum.append(images[currentSlideIndex]);

          slideDotsList.forEach(function (dot, index) {
            if (index === currentSlideIndex) {
              dot.addClass("active_dot");
            } else {
              dot.removeClass("active_dot");
            }
          });

          sliding = false;

          // prevBtn과 nextBtn 처음과 끝일 때 버튼 사용 X
          if (currentSlideIndex === 0) {
            prevBtn.prop("disabled", true);
          } else {
            prevBtn.prop("disabled", false);
          }

          if (currentSlideIndex === images.length - 1) {
            nextBtn.prop("disabled", true);
          } else {
            nextBtn.prop("disabled", false);
          }
        }

        //좋아요 버튼
        function likedFeed(feedId) {
          $.ajax({
            url: `http://43.202.152.189/feed/${feedId}/like`,
            type: "POST",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            success: function (data) {
              console.log("좋아요 성공: " + JSON.stringify(data));
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
        function unlikedFeed(feedId) {
          $.ajax({
            url: `http://43.202.152.189/feed/${feedId}/like`,
            type: "DELETE",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            success: function (data) {
              console.log("좋아요 취소 성공: " + JSON.stringify(data));
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

        //피드 스크랩 ajax
        function savedFeed(feedId) {
          $.ajax({
            url: `http://43.202.152.189/user/${currentUserId}/saved/${currentFeedId}`,
            type: "POST",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            success: function (data) {
              console.log(
                `피드 스크랩 성공: ${currentUserId}, ${currentFeedId}`
              );
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
        function unsavedFeed(feedId) {
          $.ajax({
            url: `http://43.202.152.189/user/${currentUserId}/saved/${currentFeedId}`,
            type: "DELETE",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            success: function (data) {
              console.log(
                `피드 스크랩 취소 성공: ${currentUserId}, ${currentFeedId}`
              );
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
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 400) {
        console.error("Bad Request:", jqXHR.responseText);
        alert("잘못된 주소입니다.");
      } else if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("로그인되지 않은 사용자입니다.");
        location.href = "../html/login.html";
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
      }
    },
  });
});

// 모달창 닫기 버튼 클릭 시 모달창을 닫도록 이벤트를 추가합니다.
$(".close_modal").on("click", function () {
  $(".modal").css("display", "none");

  $(".feeds_container").empty();
  $(".comments_container").empty();
  $(".comment_post").empty();
  $("#comment_input").val(null);
});

// 저장 버튼 onclick 이벤트
function changeSaveBtn() {
  var currentSrc = saveImg.attr("src");
  var newSrc =
    currentSrc === "../image/save.png"
      ? "../image/filled_save.png"
      : "../image/save.png";
  saveImg.attr("src", newSrc);

  if (saveLink.hasClass("filled_save_link")) {
    saveLink.removeClass("filled_save_link");
    saveLink.addClass("save_link");
    item.is_saved = false;
  } else {
    saveLink.removeClass("save_link");
    saveLink.addClass("filled_save_link");
    item.is_saved = true;
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
