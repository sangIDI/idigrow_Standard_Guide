// 실서버 체크
var isUrlLive= 0;
if(window.location.href.split('http')[1]){
	isUrlLive = 1;
}

// 뷰어용 외부 영상링크
function viewerVideo(url,title){
	if (!data.token || data.token === mirroringId) {
		parent.viewer.open_video('external',url,title);
	} else {
		// 새창으로 띄워서 재생?
		window.open(url,'_blank');
	}
}

// 시작
$('.nav li:first-child>*,.tab-pane:first-of-type').addClass('active');
$('.wrap-inner').prepend('<button type=button class="icon-folding" data-mirror-toggle=title>열기</button>');

// 이미지
$('img').each(function(){
	var t = $(this);
	t.attr('title',t.attr('alt'));
});
// 애니메이트 제거
function removeAnimate(){
    !$('[class^=math-]').length && $('.tab-pane:visible .animate__animated').removeClass('animate__animated');
}
$('#nav [data-target]').on('hide.bs.tab',function(){
    removeAnimate();
});

// 애니메이트 추가
$('[class^=social-] .btn-ani').on('click',function(){
    $(this).parent().find('.animate__fadeIn').addClass('animate__animated');
});
$('[class^=social-] .btn-ani2').on('click',function(){
    $(this).next().find('.animate__fadeIn').addClass('animate__animated');
});
/*========= 동작 =========*/
// scroll
function hei(el){
	try {
		if(el.parent().offset().top){
			return el.parent().offset().top;
		}
	} catch (error) {
		return 0;
	}

	return hei(el.parent());
}
var timerScroll,
    mirrorScrollT;
var resizing = false;
function mirrorScroll(resizing) {
	$(".content,.modal-body:not(.no-scroll)").each(function(i){
		var t = $(this),
			top = t.offset().top,
            minus = t.data('minus') || 0,
			setHeight = t.data('height');
			//console.log($('.h2-num').height());
		if(top===0 && !t.hasClass('modal-body')){
            top = hei(t);
		}
		/*퀴즈,수학익힘 버튼영역*/
		if(minus === 0 && ($('#wrap').hasClass('quiz') || $('#wrap').hasClass('quiz-ready') || $('#wrap').hasClass('step-pairbook'))){
            minus += 60;
		}

		t.hasClass('content') && t.height(952-top-minus);
		if(setHeight){
			if($('body').hasClass('folding-title') && !t.closest('.modal').length){
				setHeight = setHeight+h1Height;
			}
			t.height(setHeight);
		}
        // console.log(setHeight)
		t.mCustomScrollbar({
			theme:"rounded-dark",
			scrollInertia: 0,
			scrollEasing:"linear",
			callbacks:{
				onScroll:function(){
                    mirrorScrollT = this.mcs.top;
					// mirroring 보내기
                    if(!timerScroll){
                        timerScroll = setTimeout(function(){
                            timerScroll = null;
                            // 실행할 코드 내용
                            // if(!parent.viewer.is_mirroring_started){

							if (!data.token || data.token === mirroringId) {
								data.token = mirroringId;
                                data.click = '';
                                data.scroll[i] = mirrorScrollT;
                                dataWrite();
                            }
                        },200);
                    }
                    /*
					var activeIndex = t.height(952-top-minus),
						answerObj = $('.bx-btn-answer>li');
					if($('.tab').length){
						answerObj = answerObj.find('li');
					}
					$targetChild.eq(activeIndex).addClass('active').siblings().removeClass('active');
					answerObj.eq(activeIndex).addClass('active').siblings().removeClass('active');
                    */
                },
                onInit: function(e){
                    t.addClass('scroll-initialized');
                },
				onUpdate: function (e) {
					mirrorScrollT = 0;

					try {
						if (this.mcs.top < 0) resizing = true;
						console.log('onUpdate', resizing, this.mcs.top);
					} catch (error) {
						return;
					}

					// mirroring 보내기
					if (resizing) {
						if (!timerScroll) {
                            data.click = '';
                            data.video = [];
                            data.html = '';
                            mirrorScrollT = this.mcs.top;
							console.log('resizing', mirrorScrollT );
							timerScroll = setTimeout(function () {
								timerScroll = null;
								//if (!parent.viewer.is_mirroring_started) {
								if (!data.token || data.token === mirroringId) {
									data.token = mirroringId;
									data.scroll[i] = mirrorScrollT;
                                    dataWrite();
								}
								else {
									data.token = '';
								}
							}, 200);
						}
					}
					resizing = false;
				}
			},
            advanced:{
                autoScrollOnFocus: false,
            }
		});
		if(!t.find('.icon-top').length){
			t.find('.mCustomScrollBox').append('<button type="button" class="icon-top">최상단으로 가기</button>');
			t.find('.icon-top').data('target', t);
		}
	});
	// scroll - section
	$(".content-vertical").each(function(i){
		var t = $(this),
			top = t.offset().top,
			tabName = t.parent().attr('id'),
			$targetChild = t.find('div.vertical-section'),
			setHeight = t.data('height'),
			setHeightFix = t.data('height');

		if(top===0){
			top = hei(t);
		}
		var targetH = parseInt(952-top),
			$targetChild = t.find('.vertical-section');

		if(setHeight){
			if($('body').hasClass('folding-title') && !t.closest('.modal').length ){
				setHeight = setHeight+h1Height;
			}

			if(t.hasClass('fixed-height')){ targetH = setHeightFix; } else {  targetH = setHeight; } // 발문 관여없이 스크롤 높이값 고정 0727
		}

		$targetChild.height(targetH);
		t.height(targetH);
		var scrollInt = 0;
		// if (!data.token || data.token === mirroringId) {
		// 	scrollInt = 100;
		// }
		$(this).mCustomScrollbar({
			setHeight: targetH,
			theme:"rounded-dark",
			scrollInertia: scrollInt,
			snapAmount: targetH,
			mouseWheel:{
				scrollAmount: targetH,
				preventDefault: true,
			},
			advanced:{
				autoScrollOnFocus: false,
			},
			callbacks:{
				onScroll:function(){
					var activeIndex = Math.floor((-this.mcs.top+2) / targetH), // 스크롤오차로 인해 +2 추가
						answerObj = $('.bx-btn-answer>li.active');
					if($('.tab').length){
						answerObj = answerObj.find('li');
					}
                    console.log(activeIndex) ;
					$targetChild.eq(activeIndex).addClass('active').siblings().removeClass('active');
					answerObj.eq(activeIndex).addClass('active').siblings().removeClass('active');
					// mirroring 보내기
                    //if (!parent.viewer.is_mirroring_started) {
                    if (!data.token || data.token === mirroringId) {
						data.token = mirroringId;
						data.click = '';
						data.scrollV[i]=this.mcs.top;
						dataWrite();
					}
				} ,
				onUpdate: function (e) {
					try {
						mirrorScrollT = this.mcs.top;
					} catch (error) {
						return;
					}

					if (resizing) {
						data.click = '';
						data.video = [];
						data.html = '';
						console.log('resizing', mirrorScrollT);
						// mirroring 보내기
						//if (!parent.viewer.is_mirroring_started) {
						if (!data.token || data.token === mirroringId) {
							data.token = mirroringId;
							data.scrollV[i] = mirrorScrollT;
                            dataWrite();
						} else {
							data.token = '';
						}
					}
					resizing = false;
				}
			}
		});
	});
}
$(".content-vertical>*:first-child").addClass('active');
$(document).on('click','.icon-top', function(){
	var t = $(this),
		targetObj =  t.data('target') ;
	$(targetObj).mCustomScrollbar("scrollTo", "top");
});
$(window).on('load', function() {
	mirrorScroll();
})

// tab
$('[data-mirror-toggle=tab]').click(function(){
	var t = $(this),
		i = t.parent().index(),
		p = t.data('parent');
	t.tab('show');

	if(this.dataset.multi){
		$('[data-tab-multi="'+this.dataset.target+'"]').addClass('active').siblings().removeClass('active');
	}
	//dataWrite();

	// pagination click setup
	var t = $('.tab-pane.active');
	setTimeout( function(){
		t.find('.swiper-pagination [role=button]').each(function (i) {
			console.log(t.find('.swiper-pagination [role=button]')) ;
			if (!$(this).attr('id')) {
				$(this).attr('id', 'mteacherslide-' + t.attr('id') + i);
			}
		});
	} , 500);

	slideHeightRefresh();
});

// 전자저작물 정답
$('.tab li:first-child button,.bx-btn-answer li:first-child,.tab-pane:first-child').addClass('active');
$('.top-bar [data-mirror-toggle=tab]').on('shown.bs.tab',function(){
	var t = $(this),
		i = t.parent().index();
	$('.top-bar .bx-btn-answer').children().eq(i).addClass('active').siblings().removeClass('active');
	// $('.top-bar .bx-btn-answer li ul').children().eq(0).addClass('active').siblings().removeClass('active');
	
	$('.rating-bubble').hide() ;
    $('.rating-check').removeClass('active');
});

// show
$('[data-show-target]:not(.active-show)').each(function(){
	var t = $(this),
		id = t.attr('id'),
		type = t.data('type'),
		target = t.data('show-target');
	$(target).each(function(){
		if(type){
			$(this).addClass('invisible')
		} else {
			$(this).hide();
		}
	});
})
$('[data-show-target]').click(function(){
	var t = $(this),
		type = t.data('type'),
		target = t.data('show-target'),
		other = $('[data-show-target="'+target+'"]');
	// 동작
	if(t.hasClass('active-show') && !t.hasClass('is-show-fix')){
		//other.removeClass('active-show');
		t.removeClass('active-show');
		$(target).each(function(){
			if(type){
				$(this).addClass('invisible')
			} else {
				$(this).hide();
			}
		});
	} else {
		//other.addClass('active-show');
		t.addClass('active-show');
		$(target).each(function(){
			if(type){
				$(this).removeClass('invisible')
			} else {
				$(this).show();
			}
		});
	}
	//dataWrite();
});
// hide
$('[data-hide-target]').click(function(){
	var t = $(this),
		type = t.data('type'),
		target = t.data('hide-target'),
		other = $('[data-show-target="'+target+'"]');
	// 동작
	other.removeClass('active-show');
	$(target).each(function(){
		if(type){
			$(this).addClass('invisible')
		} else {
			$(this).hide();
		}
	});
});

// nav
$('[data-mirror-toggle=nav]').click(function(){
	var t = $(this);
	t.tab('show');
	if(this.dataset.multi){
		$('[data-tab-multi="'+this.dataset.target+'"]').addClass('active').siblings().removeClass('active');
	}
});
$('div.tab-button>button').on('click',function(){
	var $nav = $(this).parents('.tab-button').children('nav').length ? $(this).parents('.tab-button').children('nav') : $('#nav');
	var o = $nav.find('.active').parent().next().children();
	if($(this).hasClass('swiper-button-prev')){
		o = $nav.find('.active').parent().prev().children();
	}
	$(o).tab('show');
	//dataWrite();
});

// $('[id^=nav]:not([class^=math-] [id^=nav2]) [data-mirror-toggle=nav]').on('shown.bs.tab',function(e){ /* 서브 컨텐츠 이전 다음 비활성화 때문에 #nav2 추가 - 수학*/
// 	var elContain = $(this).parents('.tab-button').length;
// 	var $tab = elContain ? $(this).parents('.tab-button') : $('#wrap>.tab-button'); /* 서브 컨텐츠 이전 다음 비활성화 때문에 #wrap> 추가 - 수학*/
// 	var tablen = elContain ? $tab.find('.nav>li').length : $('#nav>ul>li').length;

// 	$tab.children('button').removeClass('swiper-button-disabled');
// 	if($(e.target).parent().index()===0){
// 		$tab.children('.swiper-button-prev').addClass('swiper-button-disabled');
// 	} else if($(e.target).parent().index()+1===tablen){
// 		$tab.children('.swiper-button-next').addClass('swiper-button-disabled');
// 	}
// });
// $('[data-mirror-toggle=tab],[data-mirror-toggle=nav]').not('[data-type=keep-audio]').on('hidden.bs.tab',function(){
//     audioStop();
// });


// 수학 탭버튼 추가
// tab
// $('.tab li:first-child button,.bx-btn-answer li:first-child,.tab-pane:first-child').addClass('active');
// $('.top-bar [data-mirror-toggle=tab]').on('shown.bs.tab',function(){
// 	var t = $(this),
// 		i = t.parent().index();
// 	$('.top-bar .bx-btn-answer').children().eq(i).addClass('active').siblings().removeClass('active');
// });

//tab prev-next
var tablen = $('ul.tab>li').length;
if(tablen){
	$('#wrap[class^=math-]').append('<div class="tab-button"><button type="button" class="swiper-button-prev swiper-button-disabled"></button><button type="button"  class="swiper-button-next tab-btn-next"></button></div>');
	if ($('#wrap[class^=math-]').length) {tablen = $('#ct>.top-bar ul.tab>li').length;} 
}
$('div.tab-button>button').on('click',function(){
	var o = $('ul.tab .active').parent().next().children();
	if($(this).hasClass('swiper-button-prev')){
		o = $('ul.tab .active').parent().prev().children();
	}
	$(o).tab('show');

	//수학 하단 화살표 버튼 누를때 음성 재생
	if($(o).data('audio')){
		$(o).trigger('click');
	}
});
$('.top-bar [data-mirror-toggle=tab]').on('shown.bs.tab',function(e){
	$('div.tab-button>button').removeClass('swiper-button-disabled');
	if($(e.target).parent().index()===0){
		$('div.tab-button>.swiper-button-prev').addClass('swiper-button-disabled');
	} else if($(e.target).parent().index()+1===tablen){
		$('div.tab-button>.swiper-button-next').addClass('swiper-button-disabled');
	}
});
// 수학 탭버튼 추가

// img change
$('[data-mirror-toggle*=img-change]').click(function(){
	var t = $(this),
		target = t.data('target');
	$(target).toggleClass('active');
});
// 멀티체인지
$('[data-mirror-toggle*=multi-change]').click(function(){
	var t = $(this).find('.active') ,
		$t_parent=$(this) ;
		$t_parent.children().removeClass('active');
	var t_len= $t_parent.children().length,
		target = t.next();
	if(!target.length){
		target=$t_parent.children().eq(0) ;
	}
	target.addClass('active');
	if(target.next().length){
		$t_parent.removeClass('active');
	} else {
		$t_parent.addClass('active');
	}
});

// active
$('[data-mirror-toggle*=active-this]').click(function(){
	var t = $(this);
	t.toggleClass('active');
});
$('[data-mirror-toggle*=active-parent]').click(function(){
	var t = $(this);
	t.parent().toggleClass('active');
});
$('[data-mirror-toggle*=active-target]').click(function(){
	var t = $(this),
		o = t.data('active-target'),
		className = t.data('active-name') || 'active';

	if(t.hasClass(className)){
        t.removeClass(className);
        $(o).removeClass(className);
    } else {
        t.addClass(className);
        $(o).addClass(className);
    }
});

/* modal */
$(document).on('click', '[data-mirror-toggle*=modal]', function(){
	var modalTg = $(this).data('target') ;
	$(modalTg).modal();
	// modal slide-페이지네이션 id 지급
	if ( $(modalTg).find('.swiper-wrapper').length ) {
		setTimeout( function(){
			$('.swiper-pagination [role=button]').each(function (i) {
				var t = $(this);
				if (!t.attr('id')) {
					t.attr('id', 'mteacherslide-' + i);
				}
			});
		} , 500);
	}
});
$(document).on('click', '[class^=social-] [data-mirror-toggle*=modal]', function(){
	$($(this).data('target')).modal();
	audioStop();
});
$('.modal').on('hidden.bs.modal',function(e){
	var t = $(this);
	if(t.hasClass('modal-slide')){
		t.find('[data-mirror-toggle=active-target]').removeClass('active');
		$(t.find('[data-mirror-toggle=active-target]').data('active-target')).removeClass('active');
	}
	!t.find('[data-guide-open]').length && audioStop();
	$('.vjs-playing').length && videoStop(true);
});

// h1 타이틀
var h1Height;
$('[data-mirror-toggle=title]').click(function(){
	var o = $('body');
	h1Height = $('h1').height();
	if($('body').hasClass('folding-title')){
		o.removeClass('folding-title');
	} else {
		o.addClass('folding-title');
	}

	$('.content', '.content-vertical').mCustomScrollbar('destroy').removeClass('scroll-initialized');
	$('.vertical-section').removeClass('active');
	$('.vertical-section:first-child').addClass('active');
	$('.bx-btn-answer>.active>ul li').removeClass('active');
	$('.bx-btn-answer>.active>ul li:first-child').addClass('active');
	mirrorScroll(true);
    // audioStop();
    removeAnimate();
});

// 단답형 문항  $(document).on('click'으로 변경
$(document).on('click','[data-mirror-toggle*=short-answer]' ,function(){
	var t = $(this),
		group = t.data('group');
	if(group){
		$(group).toggleClass('active').find('[data-mirror-toggle*=short-answer]').toggleClass('active').end().find('[data-invisible]').toggleClass('active');
	} else {
		t.toggleClass('active');
	}
});

// 선택형 문항 + answerbox (과학)
$('[class^=science-] [data-mirror-toggle*=answer-chk]').click(function(){
	var t = $(this),
		tg = t.parents('.tab-pane') , 
		answerbtn = $('.bx-btn-answer>.active>button');
		$(this).toggleClass('active');
		if (tg.find('.swiper-slide-active').length > 0) {
			tg = tg.find('.swiper-slide-active');
			answerbtn = $('.bx-btn-answer>.active').find('li.active>button');
		}

		if(!t.hasClass('active')){
			tg.find('.choice').removeClass('active') ;
			tg.find('input').prop('checked', false);
		} else {
			tg.find('.choice').addClass('active') ;
			tg.find('.choice [data-answer]').each(function(){
				$(this).prop('checked', true);
			});
		}

		answerChk( answerbtn ) ;

});

// 선택형
$(document).on('click','.choice input',function(){
	var t = $(this),
		o = t.closest('.choice'),
		tg = t.parents('.tab-pane');
	if(t.attr('type')==='checkbox'){
		if(o.hasClass('active')){
			o.removeClass('active').find('input').prop('checked', false);
			tg.find('[data-mirror-toggle*=answer-chk]').removeClass('active');
		} else if(o.find('[data-answer]').length===o.find('[data-answer]:checked').length){
			o.addClass('active');
			tg.find('[data-mirror-toggle*=answer-chk]').addClass('active');
		}
	} else {
		if(o.hasClass('active')){
			if ($(this).hasClass('on')) {
				o.removeClass('active').find('input').prop('checked', false).removeClass('on');
			} else {
				o.find('input').removeClass('on');
				$(this).addClass('on') ;
			}
			// o.removeClass('active').find('input').prop('checked', false);
		} else {
			$(this).addClass('on') ;
			o.addClass('active');
		}
	}
});

// 아무거나 클릭해도
$('[data-mirror-toggle=anything]').click(function(){
	var t = $(this),
		id = t.attr('id'),
		target = $(t.data('target'));
	target.toggleClass('active-anything');
});

// 전체 정답 - only social 
$('[class^=social-] [data-mirror-toggle=answer-chk]').click(function(){
    answerChk($(this));
});
function answerChk(t){
    var targetObj = $(t.data('target'));
	if(!t.data('target')){
		targetObj = $('#wrap');

		if(targetObj.hasClass('quiz-check')){
			targetObj = t.closest('.tab-pane');
		}
	}

	t.toggleClass('active');
	if(t.hasClass('active')){
		targetObj.find('input[data-answer]').prop('checked',true);
		targetObj.find('.choice,.choice-yn,[data-mirror-toggle*=short-answer],.img-change,[data-invisible],[data-group-parent]').addClass('active');
		targetObj.find('[data-invisible]').not('[data-invisible="any-answer"]').show();
		targetObj.find('.drag-obj').removeAttr('style').data('hasBeenDropped', false);
	} else {
		targetObj.find('input').prop('checked',false);
		targetObj.find('.choice,.choice-yn,[data-mirror-toggle*=short-answer],.img-change,[data-invisible],[data-group-parent]').removeClass('active');
		targetObj.find('[data-invisible]').removeClass('active');
		targetObj.find('[data-invisible]').not('[data-invisible="any-answer"]').removeAttr('style');
	}
}

// 전체 정답 -   math , sciende || $(document).on('click'으로 변경
$(document).on('click','[data-mirror-toggle="answer-all"]' ,function(){
    answerAll($(this));
});
function answerAll(t){
    var targetObj = $(t.data('target'));
	if(!t.data('target')){
		targetObj = $('#wrap');
	}
	t.toggleClass('active');
	if(t.hasClass('active')){
		targetObj.find('input[data-answer]').prop('checked',true);
		targetObj.find('.choice,.choice-yn,[data-mirror-toggle*=short-answer],[data-mirror-toggle*=answer-chk],.img-change,.protractor,[data-invisible],[data-group-parent]').addClass('active');
		targetObj.find('.multi-change>*').removeClass('active');
		targetObj.find('.multi-change , .multi-change>*:last-child').addClass('active');
		targetObj.find('[data-invisible]').not('[data-invisible="any-answer"]').show();
		targetObj.find('.drag-type-word').addClass('active');

	} else {
		targetObj.find('input').prop('checked',false);
		targetObj.find('.choice,.choice-yn,[data-mirror-toggle*=short-answer],[data-mirror-toggle*=answer-chk],.img-change,.protractor,[data-invisible],[data-group-parent]').removeClass('active');
		targetObj.find('.multi-change , .multi-change>*, [data-invisible]').removeClass('active');
		targetObj.find('.multi-change>*:first-child').addClass('active');
		// targetObj.find('[data-invisible]').not('[data-invisible="any-answer"]').removeAttr('style');
		targetObj.find('.drag-type-word').removeClass('active');
		targetObj.find('.ex-answer').val('');
	}
    // mirroring 미러링 추가
	data.html = '';
}

// 정답에 다 되었는지 실시간 체크
//$('.choice,.choice-yn,[data-mirror-toggle*=short-answer],[data-mirror-toggle*=img-change],[data-mirror-toggle*=multi-change],[data-mirror-toggle=aid-protractor]:not([data-standalone])').click(function(){
var answerChkObject = '.choice,.choice-yn,[data-mirror-toggle*=short-answer],[data-mirror-toggle*=img-change],[data-mirror-toggle*=multi-change],[data-mirror-toggle=aid-protractor]:not([data-standalone])';

$(document).on('click',answerChkObject ,function(){
	var targetObj = $('#wrap'),
		answerObj = $('.bx-btn-answer>.active');

	if($('body').hasClass('modal-open')){
		targetObj = targetObj.find('.modal.show');
		answerObj = targetObj.find('.bx-btn-answer>.active');

		if(targetObj.find('.content-vertical').length){
			targetObj = targetObj.find('.vertical-section.active');
			answerObj = answerObj.find('li.active');
		}
	}else{
		if($('.tab').length){
			targetObj = $('#ct>.tab-content>.active');
			answerObj = $('#ct>.top-bar .bx-btn-answer>.active');
		}
		if($('#wrap').hasClass('interaction')){
			// 수학 놀이 인터렉션
			targetObj = $('.step-content.tab-content>.active');
			answerObj = targetObj ;
		}
		// science quiz-check
		if(targetObj.find('.slide-page').length){
			targetObj = targetObj.find('.swiper-slide-active');
			// answerObj = targetObj.find('[data-mirror-toggle*=quiz-chk]');
			answerObj = answerObj.find('li.active');
		}
		if(targetObj.find('.swiper-q').length){
			targetObj = targetObj.find('.swiper-slide-active');
			//answerObj = answerObj.find('.active');
		}
		if(targetObj.find('.content-vertical').length){
			targetObj = targetObj.find('.vertical-section.active');
			answerObj = answerObj.find('li.active');
		}
		if(targetObj.find('.answer-steps-group').length){
			targetObj = targetObj.find('.a-steps-child');
		}
	}

	// 조건 : 모든 답이 체크되어야
	
	var q = targetObj.find('.choice [data-answer],.choice-yn,[data-mirror-toggle*=answer-chk],[data-mirror-toggle*=short-answer]:not([data-group]),[data-group-parent],.img-change,.multi-change,.protractor').filter(':visible').end() ,
		qNum = q.length ;
		//receive.js에서 choice 문제로로 지연 처리
		var settimesec = 0 ;
		if (targetObj.find('.choice [data-answer]').length > 0) {
			console.log('choice' , targetObj.find('.choice [data-answer]').length);
			settimesec = 200 ;
		}
	setTimeout(() => { 
		var aNum = q.filter('input[data-answer]:checked').length+q.find('.choice-yn').length+targetObj.find('[data-mirror-toggle*=short-answer].active:not([data-group])').length+targetObj.find('[data-group-parent].active').length+targetObj.find('[data-mirror-toggle*=answer-chk].active').length+targetObj.find('.img-change.active').length+targetObj.find('.protractor.active').length+targetObj.find('.multi-change.active').length;
   
		console.log( qNum,aNum);
		if(qNum===aNum){
			//answerObj.find('[data-mirror-toggle=answer-all]:not(.active)').click();
			var targetObj2 = targetObj.find('[data-mirror-toggle=answer-chk]:not(.active)');
			var answerObj2 = answerObj.find('[data-mirror-toggle=answer-all]:not(.active)');
			if(targetObj2.length){ //social34에서 사용
				answerChk(targetObj2);
			}
			if(answerObj2.length){
				answerChk(answerObj2);
			}
		} else {
			answerObj.find('[data-mirror-toggle=answer-all].active').removeClass('active');
		}
		if(aNum>0){
			targetObj.find('[data-invisible=any-answer]').addClass('active');
		} else {
			targetObj.find('[data-invisible=any-answer]').removeClass('active');
		}
	}, settimesec);
});


// 정답
function answerReset(target){
	$(target).removeClass('page-pass');

	// 초기화
	$(target).find('.active-show').trigger('click');
	$(target).find('[data-mirror-toggle*=short-answer]').removeClass('active');
	$(target).find('[data-mirror-toggle*=img-change]').each(function(){
		$(this.dataset.target).removeClass('active');
	});
	$(target).find('[data-mirror-toggle*=img-group-change]').each(function(){ //img-change 여러개 모두체크시 0729
		$(this.dataset.target).removeClass('active');
		$(this.dataset.target).find('.img-change').removeClass('active');
	});
	$(target).find('[data-mirror-toggle*=active-target]').each(function(){
		$(this).removeClass('active');
		$($(this).data('active-target')).removeClass('active');
	});
	$(target).find('.choice,.choice-character').removeClass('active');
	$(target).find('.draw-line').length && Canvas[$(target).find('.draw-line').attr('id')].clear();
	dragReset(target);
	$(target).find('input').prop({
		'checked': false,
		'disabled': false,
	});
    $('.icon-finish').remove();

	// 다음 단계
	quizTabBtnInActive();
}

function quizTabBtnInActive(){
	$('.tab-btn-next').removeClass('pointer-auto');
	$('.tab-quiz .active').parent().removeClass('pass');
}

function quizTabBtnActive(){
	$('.tab-btn-next').addClass('pointer-auto');
	$('.tab-quiz .active').parent().addClass('pass');
}

$('[data-mirror-toggle=answer]').click(function(){
	var t = $(this),
		id = t.attr('id'),
		target = t.data('target'),
		aTg = $('[data-mirror-toggle=answer]');

	var input = $(target).find('input[data-answer]');
	var inputAnswerNum = input.length;
	var inputAnswerChkNum = input.filter(':checked').length;
	var imgToggleGroup = $(target).find('[data-mirror-toggle*=img-group-change]:not([data-answer="except"])').data('target') ; //img-change 여러개 모두체크시 0729
	var imgToggleTarget = $(target).find('[data-mirror-toggle*=img-change]:not([data-answer="except"])').data('target') ;
	var activeToggleTarget = $(target).find('[data-mirror-toggle*=active-target]:not([data-answer="except"])').data('active-target');
	var toggle = $(target).find('[data-mirror-toggle*=short-answer]:not([data-answer="except"]),'+imgToggleTarget+','+activeToggleTarget+','+imgToggleGroup);
	var toggleNum = toggle.length;
	var checkCount = Number(this.dataset.typeCount) || 1;

	// 유형별 정답 조건
	var inputAnswer = inputAnswerNum && (inputAnswerNum === inputAnswerChkNum) && (inputAnswerChkNum === $(target).find('[type="radio"], [type="checkbox"]').filter(':checked').length);
	var toggleAnswer = toggleNum && (toggleNum === toggle.filter('.active').length);
	var lineAnswer = $($(target).find('canvas')).parent().hasClass('active') && !$($(target).find('canvas')).parent().find('.q-line-btn:not([data-line])').hasClass('line-done')
	var passAnswer = t.data('answer') === 'pass';
	var dropCorrectlength = $(target).find('.drop-correct').length;
	var dropchk = dropCorrectlength === $(target).find('.drop-obj[data-drop]').length;
	if($(target).data('multi-drop')){
		dropchk = true;
		var arr = $(target).data('multi-drop').split(',');
		for (var i = 0; i < arr.length; i++) {
			if(!$(target).find('.drop-obj[data-drop="'+arr[i]+'"]').filter('.ui-droppable-disabled').length){
				dropchk = false;
				break;
			}
		}
	}
	var dragAnswer = $(target).find('.ui-droppable-disabled').length && dropchk && (dropCorrectlength === $(target).find('.ui-droppable-disabled').length);

	if(t.hasClass('active')){
		answerReset(target);
		t.removeClass('active');
		return false;
	}

	// 오답체크 필요없을시
	if(this.dataset.answer === 'toggle'){
		$(target).addClass('page-pass');
		$(target).find('input').prop({
			'checked': false,
			'disabled': true,
		}).filter('[data-answer]').each(function(){
			$(this).prop('checked', true);
		});

		$(target).find('.draw-line').length && lineDrawAnswer(target);

		$(target).find('.short-answer').each(function(){
			$(this).addClass('active');
		});

		$(target).find('[data-mirror-toggle*=img-change]').each(function(){
			$(this.dataset.target).addClass('active');
		});

		t.addClass('active');
		return false;
	}

	//console.log(inputAnswer, toggleAnswer, lineAnswer, passAnswer, dragAnswer);

	var answerArray = [inputAnswer, toggleAnswer, lineAnswer, passAnswer, Boolean(dragAnswer)];
	var count = answerArray.filter(function(e){
		return e;
	}).length;

	// 정답확인 안했을 때, 정답이 틀렸을 때
	if(count !== checkCount || !( inputAnswer || toggleAnswer || lineAnswer || passAnswer || dragAnswer )){
		$('#modal-quiz-x').modal({backdrop:'static'});

		return false;
	}

	t.addClass('active');

    var $modalQuiz = $('#modal-quiz');
    var txt = '정답입니다.';
    var btnTxt = '확인 완료';
    if(toggleAnswer || passAnswer){
        txt = '정답을 확인하였습니다.';
        btnTxt = '확인 완료';
    }
    $modalQuiz.on('show.bs.modal', function (e) {
        $modalQuiz.find('h4').html(txt);
        $modalQuiz.find('.btn-icon').html(btnTxt);
    });
    $modalQuiz.modal({backdrop:'static'});

	if($('.tab-pane.active:not(.sub-tabs)').index() === $('.tab-pane:not(.sub-tabs)').length - 1){
		//$('#modal-quiz-finish').modal({backdrop:'static'});
        $('.tab-pane.active .icon-answer').before('<button type="button" class="icon-finish" data-mirror-toggle="modal" data-target="#modal-quiz-finish">완료</button>');
	}
});
$('#modal-quiz [data-dismiss],#modal-quiz-finish [data-dismiss]').click(function(){
	var resetTarget = '.tab-pane.active:not(.sub-tabs)';
	$(resetTarget).addClass('page-pass');
	$(resetTarget).find('[data-show-target]').not('.active-show').trigger('click');
	$(resetTarget).find('.draw-line').length && lineDrawAnswer(resetTarget);
	//console.log($(resetTarget));
	quizTabBtnActive();
});
$('#modal-quiz-x [data-dismiss]').click(function(){
	answerReset('.tab-pane.active');
});

$('.page-auto.active').length && quizTabBtnActive();

$('.tab-quiz [data-mirror-toggle="nav"]').on('shown.bs.tab', function (e) {
	if($(e.target.dataset.target).hasClass('page-auto')){
		quizTabBtnActive();
		return false;
	}
	$(e.target.dataset.target).hasClass('page-pass') ? quizTabBtnActive() : quizTabBtnInActive();
});
$('.icon-reset').click(function(){
	var resetTarget = $(this).parents('.tab-pane').length ? $('.tab-pane.active') : $('.page-pass');
	resetTarget.removeClass('page-pass');
	quizTabBtnInActive();
	$(this).parents('.tab-pane').find('[data-mirror-toggle="answer"]').removeClass('active');
	$('.icon-finish').remove();
});

$('[data-img-parent]').click(function(){
	var $t=$(this),
		groupParent = $t.data('img-parent');
	setTimeout(
		function(){
			var imgGroup = $('[data-img-parent="'+groupParent+'"]') ,
				imgGroupActive = $('[data-img-parent="'+groupParent+'"].active');

			var imgLen = imgGroup.length,
				imgLenActive = imgGroupActive.length ;
				//console.log(imgLen,imgLenActive, groupParent);

			if(imgLen==imgLenActive){
				$(groupParent).addClass('active') ;
			} else {
				$(groupParent).removeClass('active') ;
			}
		}
	,200);
});


/* 스와이프 */
var swipeQ = [],
	swipeBasic = [],
	swipeModal = [];
// 1. 스와이프 슬라이드 이미지 형 .slide-img
$('.slide-img .swiper-container').each(function(i){
	var t = $(this);
	swipeBasic[i] = new Swiper(t,{
		observer: true,
		observeParents:true,
		pagination:{
			el:t.find('.swiper-pagination'),
			clickable:true,
		},
		navigation:{
			nextEl:t.parent().find('.swiper-button-next'),
			prevEl:t.parent().find('.swiper-button-prev'),
		},
		//initialSlide:data.slide[i].active,
		on:{
			init:function(){

			},
			slideChange:function(){

			}
		},
	});
});
// 2. 스와이프 슬라이드 형 .slide
$('.slide .swiper-container').each(function(i){
	var t = $(this);
	swipeBasic[i] = new Swiper(t,{
		observer: true,
		observeParents:true,
		pagination:{
			el:t.find('.swiper-pagination'),
			clickable:true,
		},
		simulateTouch : false,
		allowTouchMove : false,
		navigation:{
			nextEl:t.parent().find('.swiper-button-next'),
			prevEl:t.parent().find('.swiper-button-prev'),
		},
		//initialSlide:data.slide[i].active,
		on:{
			init:function(){
				setTimeout(function(){
					t.find('.swiper-slide').each(function(i){
						t.find('.swiper-pagination-bullet').eq(i).html('<img src="'+$(this).find('img').attr('src')+'" alt="" />');
					});
				},500);
			},
			slideChange:function(){
				//data.slide[i].active=$(this)[i].activeIndex;
				//dataWrite();
			}
		},
	});
});
// 3. 스와이프 모달 형 .slide-pn-dot
$('.slide-pn-dot .swiper-container').each(function(i){
	var t = $(this);
	var autoHeight = true;
	var effect = t.data('effect') || 'slide';
	swipeModal[i] = new Swiper(t,{
		autoHeight: t.hasClass('auto-height'),
		effect: effect,
		observer: true,
		observeParents:true,
		simulateTouch : false,
		allowTouchMove : false,
		pagination:{
			el: t.parent().find('.swiper-pagination'),
			clickable:true,
		},
		navigation:{
			nextEl: t.parent().find('.swiper-button-next'),
			prevEl: t.parent().find('.swiper-button-prev'),
		},
		//initialSlide:data.slidePnDot[i].active,
		on:{
			init:function(){
			},
			slideChange:function(){
				//data.slidePnDot[i].active=$(this)[i].activeIndex;
				//dataWrite();

				$('.vjs-playing').length && videoStop(true);
			}
		},
	});
});
// 3. 과학 스와이프 .slide-page
$('.slide-page .swiper-container').each(function(i){
	var t = $(this);
	var autoHeight = true;
	var effect = t.data('effect') || 'slide';
	swipeBasic[i] = new Swiper(t,{
		autoHeight: t.hasClass('auto-height'),
		effect: effect,
		observer: true,
		observeParents:true,
		simulateTouch : false,
		allowTouchMove : false,
		navigation:{
			nextEl: t.parent().find('.swiper-control .swiper-button-next'),
			prevEl: t.parent().find('.swiper-control .swiper-button-prev'),
		},
		//initialSlide:data.slidePnDot[i].active,
		on:{
			init:function(){

			},
			slideChange:function(e){
				//data.slidePnDot[i].active=$(this)[i].activeIndex;
				//dataWrite();
				var activeIndex = $(this)[0].activeIndex,
					answerObj = $('.bx-btn-answer>li.active');
				if($('.tab').length){
					answerObj = answerObj.find('li');
				}
				console.log(i ,activeIndex) ;
				// $targetChild.eq(activeIndex).addClass('active').siblings().removeClass('active');
				answerObj.eq(activeIndex).addClass('active').siblings().removeClass('active');

				$('.vjs-playing').length && videoStop(true);
				
			}
		},
	});
});
// 스와이프 모달 형 버튼
$('[data-mirror-toggle=modal-swipe]').click(function(){
	var $t = $(this),
		$target = $($t.data('target')),
		swipeIndex = 0,
		index = $t.data('index');
	$('.slide-pn-dot .swiper-container').each(function(i){
		if('#'+$(this).closest('.modal').attr('id')===$t.data('target')){
		   swipeIndex = i;
		}
	});
	swipeModal[swipeIndex].slideTo(index);
	$target.modal('show');
	//dataWrite();
});

$('input,textarea').on('drop',function(e){
    e.preventDefault();
});

// only science

// --- 컨텐츠 높이값 계산
var $hdH = $('#hd').outerHeight(true);
$('[class^=science-] #ct').css({ 'height': 'calc(100% - ' + $hdH + 'px)' });
// 과 인풋 미러
$('[class^=science-] input.input-step').on('change keyup',function(){
    var inputEq = $(this).index('.input-step') ;
    var inputVal = $(this).val() ;
    if ( $(this).val() == '') {
        inputVal = 'keyup==null';
    } 
    data.inputtext = inputVal;
    data.inputeq = inputEq;
    dataWrite();
});

// --- 슬라이드 페이지 높이값 계산
slideHeightRefresh();
function slideHeightRefresh(){
	var $Wrp = $('#wrap'),
		$tg = $Wrp.find($('.slide-page'));

	if($('.tab-content').length){
		$Wrp = $('.tab-pane').filter('.active');
		$tg = $Wrp.find('.slide-page');

	}

	$tg.each(function (){
		var $siblings = $tg.siblings();
		if($siblings.length){

			$siblings.each(function (){
				var $siblingsH = $siblings.outerHeight(true);
				$tg.css({'height': 'calc(100% - ' + $siblingsH + 'px)' });
			});
		}
	})
}

// --- 인터랙션 리셋
var $reset = $('.btn-reset');
$reset.filter('[data-reset-type]').prop('disabled',true);

// $reset.on('click', function(){
$(document).on('click', '.btn-reset', function(){
	var $t = $(this),
		$tg = $('#wrap');

	if($('.tab-content').length){
		$tg = $('.tab-pane').filter('.active');
	}

	if($t.data('reset-target')){
		$tg = $($t.data('reset-target'));
	}

	if(!$t.data('reset-type')){
		$tg.find('.active').removeClass('active');
		// $tg.find('.btn-reset').prop('disabled',true);
	}

	if($t.data('reset-type') == 'dragdrop'){
		$tg.find('.drag-item').data('hasBeenDropped', '').removeAttr('style');
		$tg.find('.dropbox, .drop-word').empty();
		$tg.find('.equipment').attr('data-weight','0');
		$tg.find('.dropped, .disable, .disabled, ui-droppable-disabled, .correct').removeClass('dropped disable disabled ui-droppable-disabled correct');
		$tg.find('.drop-box').droppable('option', 'disabled', false);
		$tg.find('.btn-reset').prop('disabled',true);
	}
	if($t.data('reset-type') == 'rating'){
		$tg.find('.btn-reset').prop('disabled',true);
		$tg.find('.rating-check').find('p').html('') ;
	}
})

$('.drop-box').droppable({

})

// --- 평가하기
let $rWrp = $('.rating-check'),
    $rating =  $('.rating-check button'),
	ratingInnerHtml = '<div class="rating-bubble"><div class="inner-rating-bubble"><div role="button"><i class="rating-01"></i></div><div role="button"><i class="rating-02"></i></div><div role="button"><i class="rating-03"></i></div></div></div>' ;

    $(ratingInnerHtml).appendTo($rWrp);
	$('.rating').find('input').attr('autocomplete','off');

    $rating.click(function(){
        var $t = $(this);

        $rWrp.removeClass('active');
        $('.rating-bubble').hide();
        $t.parent().addClass('active').find('.rating-bubble').show();
    });

    $('.inner-rating-bubble div').click(function(e){
        var $t = $(this),
            $checktext = $t.html();

        $t.closest($rWrp).removeClass('active').find('p').html($checktext);
		$t.parents('.rating').parent('div').find('.btn-reset').prop('disabled',false);
        // console.log($t.closest($rWrp), $checktext);
    });


// 오디오
$('body').append('<div id=audiobook class=sr-only>');
$('[data-audio]').each(function(i){
	var t = $(this),
		id = t.attr('id');

	if(!id){
		t.attr('id','audio-btn-'+i);
		id = 'audio-btn-'+i;
	}
	$('#audiobook').append('<audio id=audio-'+id+' src='+t.data('audio')+'>');
});
// function audioStop(){
// 	$('audio,video').each(function(){
// 		$(this)[0].pause();
//         $(this)[0].currentTime = 0;
// 	});
// }
$('[data-audio]').click(function(){
	var t = $(this),
		id = t.attr('id');

	if(t.hasClass('modal')) return false;
console.log('audio play');
	audioStop();

	if(t.hasClass('active-audio')){
		t.removeClass('active-audio');
		audioStop();
	} else {
		t.addClass('active-audio');
		document.getElementById('audio-'+id).play();
	}
});
// bubble
$('[data-bubble-audio]').each(function(i){
	var t = $(this),
		id = t.data('id')+'-'+t.data('index');
	$('#audiobook').append('<audio id=audio-'+id+' src='+t.data('bubble-audio')+'>');
});
$('[data-mirror-toggle=bubble]').click(function(){
	var t = $(this),
		id = t.data('id'),
		i = t.data('index'),
		$target = $('#'+id+'-'+i);
	audioStop();
	t.toggleClass('active');
    console.log('버블');
	if(t.attr('data-multiple')){
		$target = $('.bubble[data-id="'+id+'"]');
	}
	if(t.hasClass('active')){
		if(isUrlLive===1){
			// 파일 체크
			$.ajax({
				url:$('#audio-'+id+'-'+i).attr('src'),
				success:function(){
					document.getElementById('audio-'+id+'-'+i).play();
				}
			});
		} else {
			document.getElementById('audio-'+id+'-'+i).play();
		}
		$target.addClass('active');
	} else {
		$target.removeClass('active');
	}
});

// 플레이어
var $playerWrap = $('#player'),
	player = $('#player-obj'),
	playerO = player[0],
	playSec = 0,
	endTime = 0,
	endSec = 0,
	playerRepeat = 0,
	$playerbar = $('#player-bar'),
	$playerCnt = $('#player-cnt'),
	$playerAllTime = $('#player-all-time'),
	$playerTime = $('#player-time'),
	$playerStop = $('#player-stop'),
	$playerPlay = $('#player-play'),
	playerHeight = $playerCnt.height();

/*
player.on("loadedmetadata",function(e){
	endTime = e.target.duration;
	alert(endTime)
});
*/
player.on('timeupdate',function(){
	var time = this.currentTime;
	// 자막 표시
	$('#player [data-playtime]').each(function(){
		var pt = String($(this).attr('data-playtime'));
		var playtime = pt.split(',')[0];
		var endtime = pt.split(',')[1];
		if(playtime<time && time<endtime){
			$(this).addClass('active');
		} else {
			$(this).removeClass('active');
		}
	});
	// 자막 올라가기
	// 로드메타가 안되어서 편법
	var t = $(this)[0];
	playSec = parseInt(t.currentTime%60);
	endTime = parseInt(t.duration);
	endSec = parseInt(t.duration%60);
	if(playSec<10){
		playSec = '0'+playSec;
	}
	if(endSec<10){
		endSec = '0'+endSec%60;
	}
	/*
	if($playerCnt.find('.active').position().top>350){
		$playerCnt.css({
			'transform':'translate(0,'+(350-$playerCnt.find('.active').position().top)+'px)'
		});
	}
	*/
	if(playerHeight>700){
		$playerCnt.css({
			'transform':'translate(0,'+(700-$playerCnt.height())*parseInt(t.currentTime)/endTime+'px)'
		});
	}
	$playerAllTime.text('0'+parseInt(t.duration/60)+':'+endSec);
	$playerTime.text('0'+parseInt(t.currentTime/60)+':'+playSec);
	$playerbar.val(parseInt(t.currentTime/t.duration*100));
	$playerWrap.find('.playbar-page').not('.active').each(function(){
		$(this).addClass('active').css({
			left:(400-36)*$(this).data('time')/t.duration
		});
	});
	if(t.paused){
		$('#player').removeClass('playing');
	} else {
		$('#player').addClass('playing');
	};
})
/*
.on('canplay',function(){
	// 작동안함
	playSec = parseInt($(this)[0].duration%60);
	if(playSec<10){
		playSec = '0'+playSec;
	}
	$playerAllTime.text('0'+parseInt($(this)[0].duration/60)+':'+playSec);
})
*/
.on('ended',function(){
	$('#player').removeClass('playing');
	playerO.currentTime = 0;
	if(playerRepeat===1){
		playerO.play();
	}
});
$playerWrap.find('.playbar-page').click(function(){
	playerO.currentTime = $(this).data('time');
});
$playerPlay.click(function(){
	var o = $('#player');
	if(playerO.paused){
		playerO.play();
	} else {
		playerO.pause();
	}
});
$playerStop.click(function(){
	playerO.pause();
	playerO.currentTime = 0;
	$('#player').removeClass('playing');
	// mirroring 미러링 추가
	data.video = [];
});
$playerbar.mousedown(function(){
	playerO.pause();
}).mouseup(function(){
	playerO.currentTime = playerO.duration*$(this).val()/100;
	playerO.play();
	// mirroring 미러링 추가
	if(!data.token || data.token===mirroringId){
		data.token = mirroringId;
		// data.video[0]=playerO.duration*$(this).val()/100 ;
		data.video[0]= { time: playerO.duration*$(this).val()/100, func: 'play' };
		dataWrite();
	} else {
		data.token = '';
	}
});
$('#player-repeat').click(function(){
	var t = $(this);
	if(playerRepeat===0){
		t.addClass('active');
		playerRepeat = 1;
	} else {
		t.removeClass('active');
		playerRepeat = 0;
	}
});
$('#player-speed-layer button').click(function(){
	var t = $(this);
	t.addClass('active').parent().siblings().find('button').removeClass('active');
	playerO.playbackRate = t.data('val');
});
$('[id^=player-ctr-]').click(function(){
	var t = $(this),
		v = t.data('val');
	t.addClass('active').siblings('[id^=player-ctr-]').removeClass('active');
	$('#player').removeClass('player-mode3 player-mode4').addClass('player-mode'+v);
	if(v===4){
		playerO.muted = true;
	} else {
		playerO.muted = false;
	}
});
function audioStop(){
	$('audio,video:not([autoplay])').each(function(){
		$(this)[0].pause();
		if (!isNaN($(this)[0].duration)) {
			$(this)[0].currentTime = 0;
		}
	});
}
// mirroring 미러링 추가
$('audio').each(function(){
	var t = $(this);
	t.on("play",function(){
        try {
            if (data.token === mirroringId) {
                t[0].muted = false;
            } else {
                t[0].muted = true;
            }

        } catch (error) {
            // unmute ?
        }
	})
    .on("ended",function(){
        $('.active-audio[data-audio]').removeClass('active-audio');
	});
});
$('video').each(function(){
	var t = $(this);
	t.on("play",function(){
        try {
            if (!data.token || data.token === mirroringId) {
                t[0].muted = false;
            } else {
                t[0].muted = true;
            }

        } catch (error) {
            // unmute ?
        }
	})
    .on("ended",function(){
        $('.active-audio[data-audio]').removeClass('active-audio');
	});
});

// video
$('.video-js').each(function(i){
	var t = $(this);
	if(!t.attr('id')){
		t.attr('id','mteacher-video'+i);
	}
});
if($('.video-js').length){
	// 비디오 임시
	var Button = videojs.getComponent('Button');
	// 정지버튼
	var stopButton = videojs.extend(Button, {
		constructor: function() {
			Button.apply(this, arguments);
			this.controlText('정지');
			this.addClass('vjs-stop-control');
		},
		handleClick: function() {
			this.player_.pause();
			this.player_.currentTime(0);
			//this.player_.posterImage.show();
			this.player_.hasStarted(false);
		}
	});
	videojs.registerComponent('stopButton', stopButton);
	// 자막버튼
	var CaptionToggle = videojs.extend(Button, {
		constructor: function() {
			Button.apply(this, arguments);
			this.controlText('자막 보기');
			this.addClass('vjs-caption-control');
			this.showing = false;
		},
		handleClick: function() {
			this.player_.toggleClass('vjs-caption-active');
			(!this.showing) ? this.controlText('자막 닫기') : this.controlText('자막 보기');
			this.showing = !this.showing;
		}
	});
	videojs.registerComponent('captionToggle', CaptionToggle);

    $('.video-js').each(function(i){
        videojs(document.querySelector('#'+this.id),{
    		controls: true,
    		// fluid: true,
    		controlBar: {
    			volumePanel: {inline: false},
    			children: [
    				'playToggle',
    				'stopButton',
    				'progressControl',
    				'volumeMenuButton',
    				'currentTimeDisplay',
    				'durationDisplay',
    				'volumePanel',
    				//'captionToggle',
    				'fullscreenToggle',
    				'remainingTimeDisplay'
    			]
    		}
    	},function onPlayerReady(){

    		var player = this;
    		var $video = $(this);

            $video.next('.video-caption').length && $video.append($video.next('.video-caption'));

    		player.on('timeupdate',function(){
    			var time = player.currentTime();
    			$('[data-mirror-toggle=video-caption]').each(function(){
    				var t = $(this);
    				var pt = String($(this).attr('data-playtime'));
    				var playtime = pt.split(',')[0];
    				var endtime = pt.split(',')[1];
    				if(playtime<time && time<endtime){
    					t.addClass('playing-video-script');
    					return;
    				} else {
    					t.removeClass('playing-video-script');
    				}
    			});
    		});
			// mirroring 미러링 추가
			player.on("pause", function (e) {
				console.log('video on pause: ' + data.token);

				if (!data.token || data.token === mirroringId) {
					data.token = mirroringId;
					data.click = '';
					data.video[i] = { time: player.currentTime(), func: 'pause' };
					dataWrite();
				} else {
					data.token = '';
				}
			});

			player.on("play", function (e) {
				console.log('video on play: ' + data.token);

				if (!data.token || data.token === mirroringId) {
					data.token = mirroringId;
					data.click = '';
					data.video[i] = { time: player.currentTime(), func: 'play' };
					dataWrite();
				} else {
					data.token = '';
				}
			});

			player.on('seeked', function () {
				console.log('seeked token : ', data.token)
				console.log('seeked mirroringId : ', mirroringId)

				if (!data.token || data.token === mirroringId) {
					data.token = mirroringId;
					data.click = '';
					data.video[i] = { time: player.currentTime() };
					if (data.video[i].time != 0) {
						dataWrite();
					} else {
						return;
					}
				} else {
					data.token = '';
				}

			});
    	});
    });

    $('[data-mirror-toggle]').click(function(e){
		if (!$(this).hasClass('icon-folding')) {
		    $('.vjs-playing').length && videoStop(e);
        }
    });

}

function videoStop(e){
	var $video = $('.video-js.vjs-playing')[0].player;
	$video.pause();
    console.log('비디오스톱');
	if($(e.target).parents('.nav').length || !$('.video-js.vjs-playing').is(':visible') || e){
		$video.currentTime(0);
		$video.hasStarted(false);
	}
}

// 선긋기
if($('.draw-line').length){

	$('.draw-line').each(function(){
		var t = $(this);
		t.prepend('<canvas id="canvas-'+t.attr('id')+'" class="canvas"></canvas>').find('.q-line-btn').each(function(i){
			$(this).append('<button type="button" class="text-hide" data-first>선택</button>');
		});

		if(t.find('.line-cross').length){
			$('.line-cross .q-line-btn').each(function(i){
				var t = $(this);
				t.prepend('<button type="button" class="text-hide" data-last>선택</button>');
			});
		}
	});

	var Canvas = {};

	function CANVAS(){
		this.line = '.line-from, .line-to, .line-cross',
		this.moveLine = function(startBtn, endBtn, color){
			var sx = offsetValue(startBtn.offset().left-this.parent.offset().left)+6;
			var sy = offsetValue(startBtn.offset().top-this.parent.offset().top)+6;
			var ex = offsetValue(endBtn.offset().left-this.parent.offset().left)+6;
			var ey = offsetValue(endBtn.offset().top-this.parent.offset().top)+6;

			this.ctx.lineWidth = 4;
			this.ctx.strokeStyle = color || '#e08737';
			this.ctx.beginPath();
			this.ctx.moveTo(sx, sy);
			this.ctx.lineTo(ex, ey);
			this.ctx.stroke();
			this.ctx.closePath();
		},
		this.clear = function(){
			var parent = this.parent;
			this.lineReset();
			parent.find('.line-done, .done').removeClass('line-done done');
			this.ctx.clearRect(0, 0, this.parent.width(), this.parent.height());
			this.chkAnswer = this.isMulti ? this.isMulti : this.parent.find('.line-from .q-line-btn[data-line]').length;
			parent.removeClass('active');
			parent.find('.q-line-btn[data-line]').each(function(){
				$(this).data({
					'done': '',
					'refuse': '',
				});
				if($(this).parents('.line-from').length){
					$(this).data('remain', parent.find('[data-line="'+this.dataset.line+'"]').length-1);
				}
			});
			sizeSet(this.parent, document.getElementById(this.parent.find('canvas').attr('id')));
		},
		this.lineReset = function(){
			this.parent.removeClass('drawing');
			$('.line-start').removeClass('line-start');
			$(this.line).removeClass('disabled');
		}
	}

	function appZoom(){
		if(parent.ZOOMVALUE == undefined) {
			parent.ZOOMVALUE = 1;
		}
		return parent.ZOOMVALUE;
	}

	function offsetValue(value){
		return value/appZoom();
	}

	function sizeSet(o, canvas){
		canvas.width = o.width();
		canvas.height = o.height();
	}

	function lineAnswerLoop(el, endParent, id){
		var lineColor="#003cff";
		if($('#'+id).hasClass('red-line')) lineColor="#ff0000";
		el.each(function(){
			var startBtn = $(this);
			var startParent = startBtn.parent();
			var endBtn = endParent.find('[data-line="'+startParent.data('line')+'"]').children('button[data-first]');
			if(endBtn.length){
				Canvas[id].moveLine(startBtn, endBtn,lineColor);
			}
		});
	}

	function lineDrawAnswer(el){
		var id = $(el).find('.draw-line').attr('id');
		var start = $(el).find('.line-from .q-line-btn[data-line] button[data-first]');
		var end = $(el).find('.line-to');
		Canvas[id].clear();

		if(Canvas[id].isCross){
			lineAnswerLoop(start, $(el).find('.line-cross'), id);
			lineAnswerLoop($(el).find('.line-cross .q-line-btn[data-line] button[data-last]'), end, id);

		}else if(Canvas[id].isMulti){
			lineAnswerLoop(start, end, id);
			$(el).find('[data-multi]').each(function(){
				var multiArr = $(this).data('line').split(',');
				for (var i = 0; i < multiArr.length; i++) {
					var endTarget = $(el).find('[data-line="'+multiArr[i]+'"]');
					endBtn = endTarget.children('button');
					Canvas[id].moveLine($(this).children('button'),endBtn, '#003cff');
				}
			});
		}else{
			lineAnswerLoop(start, end, id);
		}


		$(el).find('.q-line-btn').addClass('line-done');
	}

	function lineDraw(id){
		var o = $('#'+id);
		var btn = o.find('.q-line-btn');
		var canvas = document.getElementById(o.find('canvas').attr('id'));
		var startBtn, endBtn, multiAnswer;

		sizeSet(o, canvas);
		Canvas[id] = new CANVAS();
		Canvas[id].ctx = canvas.getContext("2d");
		Canvas[id].parent = o;
		Canvas[id].isCross = o.find('.line-cross').length;
		Canvas[id].isMulti = o.data('multi-line');
		Canvas[id].chkAnswer = Canvas[id].isMulti ? Canvas[id].isMulti : o.find('.line-from .q-line-btn[data-line]').length;

		!o.is(':visible') && o.addClass('hidden');

		if(Canvas[id].isCross){
			o.find('.line-from .q-line-btn[data-line]').each(function(){
				this.dataset.remain = o.find('[data-line="'+this.dataset.line+'"]').length-1;
			});
		}

		btn.on('click',function(e){
			var t = $(this);
			var parent = t.closest(Canvas[id].line);
			o = t.parents('.draw-line');

			if(t.hasClass('line-done')) return false;

			parent.hasClass('disabled') && Canvas[id].lineReset();

			function btnLineDraw(startBtn, endBtn){
				Canvas[id].moveLine(startBtn, endBtn);
				Canvas[id].lineReset();
				endBtn = startBtn = '';
			}

			if(!o.hasClass('drawing')){
				startBtn = t.children('button');
				o.addClass('drawing');
				t.addClass('line-start');
				parent.addClass('disabled');
			}else if(Canvas[id].isCross){
				var startParent = startBtn.parents('[data-refuse]');
				var endParent = t.parents('[data-refuse]');
				var endData = t.data('line');

				endBtn = startParent.hasClass('line-to') ? t.children('button[data-last]') : t.children('button[data-first]');

				if(startParent.hasClass('line-cross')){
					startBtn = endParent.hasClass('line-from') ? startBtn.filter('[data-first]') : startBtn.filter('[data-last]');
				}

				if(endParent.data('refuse')){/*  to<->form 요건 if 추가 2021.07.14*/
					if(startParent.attr('class').indexOf(endParent.data('refuse')) !== -1 ||
					startBtn.hasClass('done') || endBtn.hasClass('done')){
						Canvas[id].lineReset();
						return false;
					}
				}
				btnLineDraw(startBtn, endBtn); /* 크로스,멀티라인 요건 추가 2021.06.09*/
				if( !startBtn.parent().hasClass('q-line-multi') ) { startBtn.addClass('done'); }
				if( !endBtn.parent().hasClass('q-line-multi') ) { endBtn.addClass('done'); }

				btn.each(function(i,el){
					if($(el).find('button').length === $(el).find('.done').length) $(el).addClass('line-done');
				});

				if(endData && $(startBtn).parent().data('line') === endData){
					var lineData = o.find('.line-from [data-line="'+endData+'"]').data('remain');
					o.find('.line-from [data-line="'+endData+'"]').data('remain', --lineData);
					!lineData && Canvas[id].chkAnswer--;
				}
			}else if(Canvas[id].isMulti){
				var limit = o.data('multi-limit');
				var prop;
				endBtn = t.children('button');
				btnLineDraw(startBtn, endBtn);

				function multiChk(el, el2){
					var refuse = el.data('refuse') || [];
					if(refuse.indexOf(el2.attr('id')) === -1){
						refuse.push(el2.attr('id'));
						var done = el.data('done') || 0 ;
						el.data('refuse', refuse);
						el.data('done', ++done);
						done === limit && el.addClass('line-done');
						return prop = true;
					}else{
						Canvas[id].lineReset();
						return prop = false;
					}
				}

				multiChk(t, $(startBtn).parent());
				multiChk($(startBtn).parent(), t);

				if(prop){
					var startLine = $(startBtn).parent().data('line')+'';
					var endLine = t.data('line')+'';

					(endLine.indexOf(startLine) !== -1 || startLine.indexOf(endLine) !== -1) && Canvas[id].chkAnswer--;
				}
			}else{
				endBtn = t.children('button');
				btnLineDraw(startBtn, endBtn);

				t.addClass('line-done');
				$(startBtn).parent().addClass('line-done');

				$(startBtn).parent().data('line') === t.data('line') && Canvas[id].chkAnswer--;
			}

			!Canvas[id].chkAnswer && o.addClass('active');
		});
	}

	setTimeout(function(){
		$('.draw-line').each(function(){
			lineDraw($(this).attr('id'));
		});
	},300);

	var tabpage = $('.tab-pane');
	if(tabpage.length){
		$('[data-mirror-toggle="nav"]').on('shown.bs.tab', function (e) {
			var target = $(e.target.dataset.target).find('.hidden');
			if(target.length){
				target.removeClass('hidden');
				setTimeout(function(){
					sizeSet(target, document.getElementById(target.find('canvas').attr('id')));
				},300);
			}
		});
	}

	$('.icon-reset[data-canvas]').on('click',function(){ //리셋
		Canvas[this.dataset.canvas].clear();
	});

	$('[data-mirror-toggle=title]').click(function(){
		var target = tabpage.length ? $('.tab-pane.active').find('.draw-line') : $('.draw-line');
		var canvas = document.getElementById(target.find('canvas').attr('id'));
		var oldWidth = canvas.width;
		var oldHeight = canvas.height;
		var ratio1 = oldWidth/target.width();
		var ratio2 = oldHeight/target.height();
		var ctx = canvas.getContext('2d');

		if(ratio1 === 1 && ratio2 === 1){
			ctx.scale(1, 1);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		}else{
			ctx.scale(ratio1, ratio2);
		}
	});
}

// 특화컨텐츠 임시
$('.last-guide-motion').on('animationend webkitAnimationEnd',function  () {
	$('#sp').addClass('active');
});

$('.btn-point-group>li').click(function(){
	var num=$(this).index();
	$('.bubble-group>div').removeClass('active');
	$('.bubble-group>div .icon-act').removeClass('active');
	$('.bubble-group>div .bubble').removeClass('active');
	$('.bubble-group>div').eq(num).addClass('active');
});

$('.fraction-auto').each(function(){
	var ftext = $(this).text();
	var f_arr = ftext.split('/');
	var write_text = "<span>"+f_arr[0]+"</span><br/><span>"+f_arr[1]+"</span>"
	$(this).html(write_text);
});

$('.tb [rowspan]').each(function(){
	var t = $(this),
		p = t.parent(),
		spanCount = Number(p.index())+Number(t.attr('rowspan'))+1;
	// 옆에 있는 애들
	p.nextUntil(':nth-child('+spanCount+')').children(':first-child').addClass('colspan-first');
	// 마지막 애들
	if(!p.nextUntil(':nth-child('+spanCount+')').next().length){
		t.addClass('colspan-last');
	}
});

// layer
$(document).on('click', '[data-mirror-toggle=layer]', function(){
	var btn = $(this),
		o = btn.attr('data-target'),
		oParent = $(o).closest('.layer-wrp'),
		layerIdx = btn.index('[data-mirror-toggle=layer]');


	$(o).toggle();
	if ( !$(o).find('i.icon-layer-clse').length ) {
		$(o).append('<i class="icon-layer-clse" id="mteacher-layer'+layerIdx+'close" role="button">')
	}
	oParent.toggleClass('open');
	if(this.dataset.close){
		$(this.dataset.close).trigger('click');
	}

	return false;
});
$('body').on('click','[data-mirror-toggle=layerClse] .icon-layer-clse',function(event){
	var t = $(this) ;

	t.parent().hide().closest('.layer-wrp').removeClass('open');
	// if(t.hasClass('icon-layer-clse')){
	// 	t.parent().hide().closest('.layer-wrp').removeClass('open');
	// 	return false;
	// }

	// if($(event.target).is('a,a *,button,input,textarea,label,[role=button],label *, .event-disabled, .event-disabled *')){
	// 	return;
	// }
	// event.stopPropagation();

	// t.hide().closest('.layer-wrp').removeClass('open');
});
