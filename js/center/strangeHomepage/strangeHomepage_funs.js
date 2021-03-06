$(function() {
	var lookName = getURIArgs("from");
	//获取陌生人资料
	findUserInformation(UserName, strangename);

	/*用户点击关注以及加好友，发消息等
	 */
	//可能认识的人
	recommendRosters(UserName);
	//获取粉丝列表
	getFunsList(strangename)

	//获取粉丝列表
	function getFunsList(username) {
		var str = "";
		var pagenum = (getURIArgs('pageno')) ? getURIArgs('pageno'):1
		$.ajax({
			type: "get",
			url: serviceHOST() + "/following/getHerFollowersWeb.do",
			dataType: "json",
			data: {
				myname: UserName,
				hername: username,
				pagenum: pagenum,
				pagesize: 12
			},
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				$('.jiazai').remove();
				if (msg.data.followerEntities.length == 0) {
					$('.no_publish').show();
				} else {
					for (var i = 0; i < msg.data.followerEntities.length; i++) {
						var mssg = msg.data.followerEntities[i];
						str += '<li class="funsList" data-username="' + mssg.followEntity.username + '" ><a href="javascript:;" class="guanzhu_img"><img src="';
						var avaFile = mssg.followEntity.avatarfile;
						if (avaFile == '' || avaFile == null) {
							str += '/img/first.png" >';
						} else {
							if (avaFile.indexOf('http') > -1) {
								str += '' + avaFile + '" >';
							} else {
								str += ImgHOST() + mssg.followEntity.avatarfile + '">';
							}
						}
						str += '</a><dl class="guanzhu_info"><dd class="guanzhu_name">';
						str += (mssg.followEntity.nickname || shieldNumber(mssg.followEntity.username)) + '</dd><dd class="guanzhu_type">'+
						(mssg.followEntity.myindustry || '') + '</dd></dl>';

						//判断是否关注的自己
						if (mssg.followEntity.username != UserName) {
							str += '<div class="funs_content">';
							if (mssg.isHerFollower == 0) { //判断是否关注
								str += '<a href="javascript:;" class="funs_guanzhu"><i></i>关注</a><a href="javascript:;" class="funs_more">更多<i></i><div class="more_box setting_box">';

							} else {
								str += '<a href="javascript:;" class="focus"><i></i>已关注</a><a href="javascript:;" class="funs_more">更多<i></i><div class="more_box setting_box">';
							}
							if (mssg.friendRelation == 1 || mssg.friendRelation == 2 || mssg.friendRelation == 3) {
								str += '<span class="sendMessageBtn messages" data-username="' + mssg.followEntity.username + '">发消息</span>';
							} else {
								str += '<span class="addFriendBtn messages" data-username="' + mssg.followEntity.username + '">加为好友</span>';
							}
							if (mssg.isHerFollower == 0) {
								str += '<span class="complaint">投诉</span></div></a></div>';
							} else {
								str += '<span class="cancelGuanzhu">取消关注</span><span class="complaint">投诉</span></div></a></div>';
							}
						}
						str += '<div class="clear"></div></li>';
					};
					$('.guanzhu_wrap').html(str);
					$('.personal_guanzhu').show();
				}

				var pageStr = printPage({
					pageNo: getURIArgs('pageno') || 1,
					pageSize: 12,
					dataSum: msg.data.totalcnt
				});
				$(".page").empty().append(pageStr);
			},
			error: function() {
				console.log("error")
			}
		})
	};

	//点击分页时候
	$(document).on('click', '#page>a', function() {
		var pageNo = $(this).attr('pageno');
		var href = window.location.href.split('&')[0];
		window.location.href = href + '&pageno=' + pageNo;
	})

	//更多设置
	$(document).on('click', '.funs_more', function(e) {
		$(this).find('.more_box').toggle();
		$(this).parents('li').siblings().find('.more_box').hide();
		e.stopPropagation();
	});
	$(document).on('click', '.setting_box span', function(e) {
		$(this).parent().hide();
		e.stopPropagation();
	});
	$(document).on('click', function() {
		$('.setting_box').hide();
	});

	//添加好友
	$(document).on("click", ".addFriendBtn", function() {
		var _this = $(this);
		var jid2add = $(this).parents(".funsList").attr("data-username");
		AddfriendRequest(UserName, jid2add, _this);
	})



	//关注设置
	$(document).on('click', '.funs_guanzhu', function() {
		var following = $(this).parents('.funsList').attr("data-username");
		setFocus(UserName, following);
		$(this).next().find('.messages').after('<span class="cancelGuanzhu">取消关注</span>');
		$(this).addClass('focus').removeClass('funs_guanzhu').html('<i></i>已关注');

	});
	//取消关注
	$(document).on('click', '.cancelGuanzhu', function() {
		var following = $(this).prev().attr("data-username");
		unsetFocus(UserName, following);
		$(this).parents('.funs_content').children().eq(0).removeClass('focus').addClass('funs_guanzhu').html('<i></i>关注');
		$(this).remove();
	});




	//修改好友备注名字 users/roster/update_markname 
	$(document).on("click", ".like_more .cancel_more .setting_remark", function() {
		update_markname(UserName, strangename)
	})


	//跳转到用户主页
	$(document).on("click", ".guanzhu_img", function() {
		var strangename = $(this).parents('li').attr("data-username");
		if (strangename == UserName) {
			window.location.href = '/center/me/page.html';
		} else {
			getInfo({
				myname: getCookie("username") || "nouser",
				username: strangename,
				templetName: "pageJingtai"
			});
		}
	})
})