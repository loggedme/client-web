

// mock data
$.getJSON("../mock/corporationFeedData.json", function (data) {
    console.log(data);
  
   
    $.each(data, function (index, item) {
      var feedInfo = $("<div>").addClass("feed_info");
      var feedItem = $("<div>").addClass("feed_item");
  
      // feed 상단 부분 사용자 사진, 아이디
      var feedTopContainer = $("<div>").addClass("feedTop_container");
      var feedTop = $("<div>").addClass("feed_top");
  
      var profileInfo = $("<div>").addClass("profile_info");
      var profileImg = $("<img onclick=location.href='#';>").attr({
          src: item.profileImgSrc,
          alt: item.taggedCompany,
        });
      var userId = $("<div onclick=location.href='#';>")
        .addClass("user_id")
        .text(item.userId);
  
      profileInfo.append(profileImg, userId);

      // 드롭다운 옵션 버튼 
      var optionContent = $("<div style=display:none;>").addClass("option_content");
      var gotoUserInfo = $("<button type=button>").addClass("goTo_userInfo").html("이 계정 정보");
      var saveBtnOption = $("<button type=button>")
      .addClass("save_btn")
      .html("저장하기")
      .on("click", function() {
        var currentSrc = saveImg.attr("src");
        var newSrc = currentSrc === "../image/save.png" ? "../image/filled_save.png" : "../image/save.png";
        saveImg.attr("src", newSrc);

        if (saveLink.hasClass("filled_save_link")) {
          saveLink.removeClass("filled_save_link");
          saveLink.addClass("save_link");
         
      } else {
          saveLink.removeClass("save_link");
          saveLink.addClass("filled_save_link");
          
      }
      });
      var unfollowBtn = $("<button type=button>").addClass("unfollow_btn").html("팔로우 취소");
      
      optionContent.append(gotoUserInfo, saveBtnOption, unfollowBtn);

      var optionBtn = $("<button style=background-color:transparent;border:none;>")
      .addClass("optionBtn")
      .on("click", function() {
        optionContent.toggle();
      })
      var optionImg = $("<img>").attr({
        src: "../image/option_btn.png",
        alt: "optionButton",
      });
      optionBtn.append(optionImg);
  
      feedTop.append(profileInfo, optionBtn);
      feedTopContainer.append(feedTop, optionContent);
  
  
      // feed 이미지
      var feedImgList = item.feedImgList;
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
      $.each(feedImgList, function (imgIndex, imgItem) {
        var feedImg = $("<img>").attr({
          src: imgItem.feedImg,
          alt: "Image " + imgItem.imgId,
          class: "feed_image",
        });

        images.push(feedImg);
      });

      // 첫 번째 이미지 추가
      imageAlbum.append(images[currentSlideIndex]);

      prevBtn.prop("disabled", true);

      prevBtn.on("click", goToPrev);

        // 이미지 슬라이드 함수
        function goToPrev() {
          if (!sliding) {
              sliding = true;
              currentSlideIndex = (currentSlideIndex - 1 + images.length) % images.length;
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

      nextBtn.on("click", function () {
        if (!sliding) {
          sliding = true;
          currentSlideIndex = (currentSlideIndex + 1) % images.length;
          updateSlide();
        }
      });

      // 이미지 슬라이드 현재 위치 점 표시

      // 이미지 슬라이드 점들 추가
      var slideDots = $("<div>").addClass("slide_dots");
      var slideDotsList = [];

      for (var i = 0; i < feedImgList.length; i++) {
        var dot = $("<div>").addClass("dot").html(" ");
        slideDots.append(dot);
        slideDotsList.push(dot);
      }
      
      // 점들에 .dot 클래스 부여 후 슬라이드 점들 추가
      slideDotsList[0].addClass("active_dot");
 
      // 이미지 슬라이드 점 클릭 이벤트
      $(".dot").on("click", function () {
        if (!sliding) {
          var index = $(this).index();
          if (index !== currentSlideIndex) {
            sliding = true;
            currentSlideIndex = index;
            updateSlide();
          }
        }
      });

      // 이미지 슬라이드 업데이트
      function updateSlide() {
        imageAlbum.empty(); 
        imageAlbum.append(images[currentSlideIndex]);
        
       slideDotsList.forEach(function(dot, index) {
        if (index === currentSlideIndex){
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

      btnContainer.append(prevBtn, nextBtn);
      imageContainer.append(imageAlbum, btnContainer, slideDots);
        
      // 기능 버튼 아이콘 (좋아요, 댓글, 공유, 저장)
      var feedFunctionContainer = $("<div>").addClass("feedFunction_container");
      var functionIconContainer = $("<div>").addClass("functionIcon_container");
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
      .on("click", function() {
          var currentSrc = heartImg.attr("src");
          var newSrc = currentSrc === "../image/heart.png" ? "../image/filled_heart.png" : "../image/heart.png";
          heartImg.attr("src", newSrc);

          if (heartLink.hasClass("filled_heart_link")) {
              heartLink.removeClass("filled_heart_link");
              heartLink.addClass("heart_link");
          } else {
              heartLink.removeClass("heart_link");
              heartLink.addClass("filled_heart_link");
          }

          
        });

      heartLink.append(heartImg);

      heartLink.append(heartImg);

  
      var commentLink = $("<button type=button id=comment_btn>")
      .addClass("comment_link")
      .on("click", function () {
        openModal(item.feedId, data); 
      });
      var commentImg = $("<img>").attr({
        src: "../image/comment.png",
        alt: "comment",
        width: "31rem",
        style: "margin-left: 0.3rem; padding-top: 0.1rem;",
      });
      commentLink.append(commentImg);
  
      var shareLink = $("<button type=button>").addClass("share_link");
      var shareImg = $("<img>").attr({
        src: "../image/share.png",
        alt: "shareBtn",
        width: "40rem",
        style: "margin-left: 0.4rem; padding-top: 0.2rem;",
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
        var currentSrc = saveImg.attr("src");
        var newSrc = currentSrc === "../image/save.png" ? "../image/filled_save.png" : "../image/save.png";
        saveImg.attr("src", newSrc);
      });
      
      saveLink.append(saveImg);
  
      functionIconContainer.append(functionIconItem, saveLink);
      
  
  
      // 좋아요 수
      var likesContainer = $("<div>").addClass("likesNum_container");
  
      var likesNum = item.likesNum;
      likesContainer = likesNum + '명이 좋아합니다.';
  
      var likesNumContainer = $("<div>")
        .addClass("likesNum_container")
        .text(likesContainer);
  
      // 기능목록 flex 합치기
      feedFunctionContainer.append(functionIconContainer, likesNumContainer);
  
  
  
      // feed 하단부분 전체(아이디, 해쉬태그, 내용)
      
      // IdHashtag div (아이디, 해쉬태그)
      var IdHashtag = $("<div>").addClass("IdHashtag");
  
      var bottomUserId = $("<div onclick=location.href='#';>")
        .addClass("bottom_id")
        .text(item.userId);
  
      var feedHashtag = $("<div onclick=location.href='#'; style=color:#3E93E1>")
        .addClass("feed_hashtag")
        .text(item.hashtag);
  
      IdHashtag.append(bottomUserId, feedHashtag);
  
      // feed 내용
      var feedScript = $("<div>")
        .addClass("feed_script")
        .text(item.script);
  
  
      // 업로드 날짜 (현재로부터 얼마 전인지) 표시
      var uploaded_date = $("<div>").addClass("uploaded_date");
  
      var uploadDate = new Date(item.uploadDate.replace(/-/g, "/"));
      var currentDate = new Date();
      var timeDiffInMilliseconds = currentDate - uploadDate;
  
      var timeDiffInHours = Math.floor(timeDiffInMilliseconds / (1000 * 60 * 60));
      var timeDiffInDays = Math.floor(timeDiffInHours / 24);
  
      var uploadDateString = timeDiffInHours < 24 ? timeDiffInHours + '시간 전 게시' : timeDiffInDays + '일 전 게시';
  
      var uploadedDate = $("<div>")
        .addClass("uploaded_date")
        .text(uploadDateString);
  
      uploaded_date.append(uploadedDate);
  
      feedInfo.append(IdHashtag,feedScript ,uploaded_date);
  
  
      // 댓글 Mock 데이터
      $.getJSON("../mock/commentData.json", function (commentsData) {
        console.log(commentsData);
  
        var commentsForFeed = commentsData.filter(function (comment) {
          return comment.feedId === item.feedId;
        });
  
        // 댓글 수, 목록을 포함하는 컨테이너
        var commentContainer = $("<div>").addClass("comment_container");
        var commentList = $("<div>").addClass("comment_list");
          
        // 최대 2개까지만 댓글 보이게
        $.each(commentsForFeed.slice(0, 2), function (
          index, item
        ) {
          // 댓글 목록 리스트 컨테이너
          var commentItem = $("<div>").addClass("comment_item");
          var commentUserId = $("<div style= margin-right:0.5rem;font-weight:bold;>")
            .addClass("commentUser_id")
            .text(item.userId);
  
          var commentScript = $("<div>")
            .addClass("comment_script")
            .text(item.commentScript);
  
          commentItem.append(commentUserId, commentScript);
          commentList.append(commentItem);
        });
  
        // 댓글 수 세기
        var commentsCount = '댓글 ' + commentsForFeed.length + '개 모두 보기';
          
        var commentNumContainer = $("<button type=button>")
          .addClass("commentNum_container")
          .text(commentsCount)
          .on("click", function () {
            openModal(item.feedId, data); // openModal 함수에 data를 전달
          });
  
        // 댓글 컨테이너에 댓글 수, 댓글 목록 넣기
        commentContainer.append(commentNumContainer, commentList);
        feedInfo.append(commentContainer);
      });
  
      feedItem.append(feedTopContainer, imageContainer, feedFunctionContainer, feedInfo);
      $(".feed_list").append(feedItem);

      
    });
  });
  
  $.getScript("../js/corporation_feed.js");
  
  
