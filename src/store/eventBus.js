import Vue from 'vue';

export const eventBus =  new Vue({
    
    data() {
      return {
      };
    },
    methods: {

      /****************************************************************************************************************************************************
         * IPCC Socket 변수 / 함수 정보 START
       ***************************************************************************************************************************************************/

        /**
         * 로그인/아웃 CTI 배열 조정 
         */
        busInitCallCti(e) {
          this.$emit('busInitCallCti', e);
        },

        /**
         * 링이벤트
         */
        busCtiRinging(e) {
          this.$emit('busCtiRinging', e);
        },

        /**
         * 끊기 이벤트
         */
        busCtiHangup(e) {
          this.$emit('busCtiHangup', e);
        },
        
        /**
         * 받기 이벤트
         */
        busCtiAnswer(e) {
          this.$emit('busCtiAnswer', e);
        },

        /**
         * 판빌 전화기 이벤트 처리
         */
        busCtiInitCall(e) {
          this.$emit('busCtiInitCall', e);
        },
        
        /**
         * 호전환 리스트 
         * @param {} e 
         */
        busCtiTransferlst(e) {
          this.$emit('busCtiTransferlst', e);
        },

        /**
         * 호전환 시도 / 취소 
         */
         busCtiPhoneTran(e) {
          this.$emit('busCtiPhoneTran', e);
        },

        /**
         * 3자 시도 / 취소
         */
        busCtiPhoneConf(e) {
          this.$emit('busCtiPhoneConf', e);
        },
        
        /**
         * 3자 거부
         */
         busCtiConfBusy(e) {
          this.$emit('busCtiConfBusy', e);
        },

        /**
         * 3자 시도 내부->내부 (상대방 상담사 통화 후 종료) 
         */
         busCtiConfHang(e) {
          this.$emit('busCtiConfHang', e);
        },

         /**
         * 3자 완료 내부->내부 (상대방 상담사 통화 후 종료)
         */
          busCtiHangAgent(e) {
            this.$emit('busCtiHangAgent', e);
          },

        /**
         * 콜스킵기능_스킵/전환
         */
        busCtiSkipTrans(e) {
          this.$emit('busCtiSkipTrans', e);
        },

        /**
         * 호전환 취소 (phone_busy인 경우) 
         */
         busCtiPhoneBusy(e) {
          this.$emit('busCtiPhoneBusy', e);
        },

        /**
         * 호전환 취소 (phone_busy외 경우)  
         */
         busCtiPhoneNo(e) {
          this.$emit('busCtiPhoneNo', e);
        },

        /**
         * 호전환 상대방 거절 
         */
         busCtiTransBusy() {
          this.$emit('busCtiTransBusy');
        },

        /**
         * 예약
         */
         busResv(e) {
          this.$emit('busResv', e);
        },

        /**
         * 콜백
         */
         busCallBack(e) {
          this.$emit('busCallBack', e);
        },

        /**
         * 캠페인 
         */
         busCampain(e) {
          this.$emit('busCampain', e);
        },

        /**
         * 고객정보 조회
         */
         busCustInfoSrch(e) {
          this.$emit('busCustInfoSrch', e);
        },
        
        /**
         * 고객정보 조회
         */
        busRingingCustInfoSrch(e, CALL_DATA) {
          this.$emit('busRingingCustInfoSrch', CALL_DATA);
        },
        
        /**
         * CTI 버튼 상태 조회
         */
        getCtiBtnStat(e) {
          this.$emit('getCtiBtnStat', e);
        },
        
        /**
         * CTI 버튼 상태 셋팅
         */
        setCtiBtnStat(e, CTI_STAT) {
          this.$emit('setCtiBtnStat', CTI_STAT);
        },
        
        /**
         * 상담원 상태 조회
         */
        getCuslStat(e) {
          this.$emit('getCuslStat', e);
        },

        /**
         * 상담원 상태 셋팅
         */
        setCuslStat(e, CUSL_STAT) {
          this.$emit('setCuslStat', CUSL_STAT);
        },

        
        /****************************************************************************************************************************************************
         * IPCC Socket 변수 / 함수 정보 END 
         ****************************************************************************************************************************************************
         ***************************************************************************************************************************************************/
        
        /**
         * 사용자정보 조회
         */
        cs_info(e) {
          // console.log('cs_info(e) ', e)
          this.$emit('cs-info', e);
        },

        pwdChange() {
          this.$emit('pwdChange');
        },
        
        /**
         * 캘린더 타입
         */
        calType(e) {
          // console.log('calType(e) ', e)
          this.$emit('calType', e);
        },
      /****************************************************************************************************************************************************
         * 챗 Stomp 변수 / 함수 정보 START
       ***************************************************************************************************************************************************/

      /**
       * 소켓 연결 닫기 
       */
      busStompDisconnect() {
        this.$emit('busStompDisconnect');
      }, 

      /**
       * 상담원 대기 구독 메시지 인입 
       * @param {*} message 
       */
      busReadyCallback(message) {
        this.$emit('busReadyCallback', message);
      },
      
      /**
       * 채팅 메시지 인입 
       * @param {*} message 
       */
      busInoutCallback(message) {
        this.$emit('busInoutCallback', message);
      } ,

      /**
       * 3자채팅 메시지 인입 
       * @param {*} message 
       */
       busThirdInoutCallback(message) {
        this.$emit('busThirdInoutCallback', message);
      } ,

      /**
       * 채팅 리스트 조회
       * @param {*} message 
       */
      chtListSrch(message,newchat) {
        this.$emit('chtListSrch', message,newchat);
      } ,

      /****************************************************************************************************************************************************
         * 챗 Stomp변수 / 함수 정보 END 
       ****************************************************************************************************************************************************
       ***************************************************************************************************************************************************/

      /**
       * 채팅클릭
       * @param next  callback 함수 
       */
      changeChatInfo( next ) {
        this.$emit('changeChatInfo', next);
      } , 

      /**
       * 채팅프로세스 갱신
       */
      changeProcessInfo( ) {
        this.$emit('changeProcessInfo');
      } , 

      /**
       * 상담내용 다시 불러오기 
       * @param chtCuttId  컨텐츠 아이디
       */
      refreshChatContent(chtCuttId) {
        this.$emit('refreshChatContent', chtCuttId);
      } , 

      /**
       * 상담이력 저장/종료
       * @param chtCuttId  컨텐츠 아이디
       */
      saveTalkHistory(chtCuttId) {
        this.$emit('saveTalkHistory', chtCuttId);
      } , 

      /**
       * 전달 할 사용자 아이디 셋팅팅
       * @param transUserId  상담원 아이디
       */
      setTransUserId(transUserId) {
        this.$emit('setTransUserId', transUserId);
      } , 
      
      /**
       * 고객정보 조회
       * @param talkUserKey  사용자 키 
       * @param {*} msg 
       */
      getCustInfo(talkUserKey) {
        this.$emit('getCustInfo', talkUserKey);
      } , 
      
      /**
       * 상담이력 조회
       * @param userTelno  고객전화번호
       */
      getTalkHistory(userTelno) {
        
        this.$emit('getTalkHistory', userTelno);
      } , 
      
      /**
       * 스크립트 조회
       */
      getScripts() {
        this.$emit('getScripts');
      } , 
      
      /**
       * 스크립트 수정창 닫기
       */
      closeScriptForm() {
        this.$emit('closeScriptForm');
      } , 

      /**
       * 비대면링크 조회
       */
      getUntactUrls() {
        this.$emit('getUntactUrls');
      } , 
      
      /**
       * 상담내용보기 (팝업)
       */
      setMessageList(list) {
        this.$emit('setMessageList', list);
      } , 

      /**
       * 채팅창 입력 불가 처리 
       */
      disableChat() {
        this.$emit('disableChat');
      } , 
      
      /**
       * 상담이력 저장 창 닫기 이벤트 
       */
      controlCnslClick() {
        this.$emit('controlCnslClick');
      } ,
      
      /**
       * 상담입력 창 오픈
       */
      openMssgForm(){
        this.$emit('openMssgForm');
      },

      /**
       * 선택된 상담 초기화
       */
      initTalkContactInfo(){
        this.$emit('initTalkContactInfo');
      },

      /**
       * 전달 창 닫기 이벤트 
       */
      closeTransferDialog() {
        this.$emit('closeTransferDialog');
      } ,

      /**
       * 전달 창 열기 이벤트 
       */
      openTransferDialog() {
        this.$emit('openTransferDialog');
      } ,

      /**
       * 스크롤 아래 이벤트 
       */
      toBottomClick() {
        
        this.$emit('toBottomClick');
      } ,

      /**
       * 이미지 선택창 닫기
       * @param {req_type} req_type  message / expired_session
       * @param {*} msg 
       */
      closeImageDialog() {
        
        this.$emit('closeImageDialog');
      } ,

      /**
       * 전달 창 열기 이벤트 
       */
       openImageDialog() {
        this.$emit('openImageDialog');
      } ,
      
      /**
       * 스크립트 채팅창 이어붙이기 / 새로붙이기 
       */
      putScript(payload) {
        
        this.$emit('putScript', payload);
      } ,

      /**
       * 단축키로 스크립트 찾기
       * @param command  단축키 
       */
      searchScriptShortKey(command, custcoId) {
        
        this.$emit('searchScriptShortKey', command, custcoId);
      } ,

      /**
       * 채팅목록
       */
      getTalkers() {
        
        this.$emit('getTalkers');
      } ,

      /**
       * 상담내용 검색
       */
      searchMsg(keyword) {
        
        this.$emit('searchMsg' , keyword);
      } ,
      
      /**
       * 상담통합이력 상담구분콤보 셋팅
       */
       setCnslHstTypeComboData() {
        
        this.$emit('setCnslHstTypeComboData');
      } ,

      /**
       * 채팅 전송
       * @param message  메시지 내용
       */
       userchatMessage(message) {
        
        this.$emit('userchatMessage', message);
      } , 
      
      /**
       * 고객사 선택 이벤트
       * @param {*} SELECTED_COMPANY 
       */
      selCompanyAction(SELECTED_COMPANY) {
        this.$emit('selCompanyAction', SELECTED_COMPANY);
      },
      

      /**
       * 고객명 전달
       * @param {*} custInfo
       */
      setCustInfo(custInfo) {
        this.$emit('setCustInfo', custInfo);
      },

      /**
       * true 전달
       * @param {*} open
       */
      setTrue(open) {
        this.$emit('setTrue', open);
      },

      /**
       * type,고객번호 전달
       * @param {*} type
       */
      setSendInfoParm(type, custInfo) {
        this.$emit('setSendInfoParm', type, custInfo);
      },

      /**
       * 고객 이메일 전달.
       * @param custEmail
       */
      setSendEmailParm(custEmail) {
        this.$emit('setSendEmailParm', custEmail);
      },
      setSendEmail() {
        this.$emit('setSendEmail');
      },
      setSendEmailInit() {
        // console.log( 'setSendEmailInit' );
        this.$emit('setSendEmailInit');
      },
      
      /**
       * 사용자, 고객 컴포넌트 확인 버튼 이벤트
       */
      setUserInfo() {
        this.$emit('setUserInfo');
      },

      /**
       * 채팅 키워드 검색
       */
      srchChatKeyWord(highlight, keyword) {
        this.$emit('srchChatKeyWord', highlight, keyword);
      },


      /**
       * 게시판 상세조회 이벤트
       * @param {*} type
       */
      reloadBrdList(type) {
        this.$emit('reloadBrdList', type);
      },


      /**
       * 일괄저장 리스트 보기
       * @param {*} click
       */
      clickBat(click) {
        this.$emit('clickBat', click);
      },


      /**
       * 일괄저장 체크 리스트 전달
       * @param {*} click
       */
      checkBat(check) {
        this.$emit('checkBat', check);
      },


      /**
       * 고객 통합 후 채팅고객 id 업데이트
       * @param {*} click
       */
      chtCustMerge(cust_id) {
        this.$emit('chtCustMerge', cust_id);
      },


      /**
       * 예약상담 상담사 리스트 조회
       * @param {*} click
       */
      getRsvtCuslList() {
        this.$emit('getRsvtCuslList');
      },

    },

  }
)




