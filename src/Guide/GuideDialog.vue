<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <guide-table :PropTable="propsTable" />

    <!-- //mark: 내부 소스 -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <v-btn class="pl-btn" @click="mixin_showDialog('Medium')" >중간 사이즈</v-btn>
        <v-btn class="pl-btn" @click="mixin_showDialog('Large')" >대형 사이즈</v-btn>
        <v-btn class="pl-btn" @click="mixin_showDialog('Custom')" >스크롤</v-btn>
        <v-btn class="pl-btn" @click="mixin_showDialog('Full')" >전체화면</v-btn>
      </div>
      <!-- medium -->
      <v-dialog
        v-model="dialogMedium"
        content-class="dialog-draggable"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="중간 Dialog"
          @hide="mixin_hideDialog('Medium')"
          @submit="submitDialog('Medium')"
        >
          <template slot="search">
            custom search
          </template>
          <template slot="body">
            custom body
          </template>
          <template slot="footer">
            custom footer
          </template>
        </compo-dialog>
      </v-dialog>
      <!-- large -->
      <v-dialog
        v-model="dialogLarge"
        content-class="dialog-draggable is-lg"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="대형 Dialog"
          @hide="mixin_hideDialog('Large')"
          @submit="submitDialog('Large')"
        >

        </compo-dialog>
      </v-dialog>
      <!-- custom -->
      <v-dialog
        v-model="dialogCustom"
        content-class="dialog-draggable is-scroll"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="개별 Dialog"
          @hide="mixin_hideDialog('Custom')"
          @submit="submitDialog('Custom')"
        >
        <template slot="body">
            청춘의 사는가 노년에게서 쓸쓸하랴? 없으면, 인류의 우리의 끓는 같으며, 사람은 광야에서 보는 봄바람이다. 풀밭에 그들은 자신과 대한 원질이 생명을 듣는다. 역사를 얼음과 소담스러운 청춘의 피다. 현저하게 부패를 인생을 사막이다. 얼음과 청춘에서만 거선의 피부가 운다. 그들에게 웅대한 있으며, 피가 영원히 듣는다. 청춘에서만 청춘 앞이 소담스러운 사람은 노년에게서 피다. 가는 가치를 트고, 끝에 피고, 무엇을 새가 있는 있다. 얼마나 자신과 꾸며 따뜻한 뿐이다. 뜨고, 온갖 같으며, 구하지 불러 보이는 청춘 청춘의 철환하였는가? 영락과 되는 가는 있는가? 가지에 무한한 있는 봄바람이다. 용감하고 그들은 찬미를 긴지라 듣기만 것이다. 자신과 많이 못할 내는 그러므로 그러므로 있으며, 얼마나 있으랴? 대고, 황금시대의 커다란 든 속잎나고, 끓는 너의 쓸쓸하랴? 청춘의 같은 오직 예수는 지혜는 고행을 있다. 위하여 부패를 용기가 이상 끓는다. 황금시대를 고동을 붙잡아 소리다.이것은 품었기 긴지라 얼음 원대하고, 인간의 봄바람이다. 꾸며 품에 설산에서 힘있다. 싹이 모래뿐일 심장의 힘차게 때까지 그것을 행복스럽고 가슴에 운다. 곳이 사람은 꽃이 그들의 가지에 힘차게 소담스러운 이상은 것이다. 따뜻한 인생에 찾아다녀도, 우는 군영과 위하여 이상 보배를 것이다. 몸이 풀이 실로 인도하겠다는 못할 관현악이며, 쓸쓸한 것이다. 거친 대한 위하여 위하여 인간에 황금시대다. 열락의 물방아 청춘이 그들에게 같은 더운지라 그들의 가는 것이다. 만물은 원대하고, 청춘의 뼈 운다. 피가 열매를 청춘은 모래뿐일 가슴이 그들의 앞이 것이다. 가진 풀이 소리다.이것은 방지하는 품었기 열매를 목숨이 칼이다. 이것이야말로 공자는 것은 인간은 밝은 소담스러운 같이 얼마나 보라. 위하여 하는 듣기만 그들의 보는 철환하였는가? 얼음 능히 모래뿐일 피가 트고, 낙원을 공자는 사막이다. 영원히 가치를 인생에 인생에 위하여, 아니더면, 앞이 철환하였는가? 그들은 오아이스도 모래뿐일 공자는 품었기 넣는 가는 있다. 황금시대의 석가는 바이며, 피어나기 구할 피고, 같이 보는 소금이라 것이다. 석가는 물방아 청춘의 품었기 아름답고 이성은 아니한 그와 듣는다. 가는 간에 청춘의 청춘을 인생에 주며, 봄바람이다. 자신과 가치를 보배를 동산에는 끓는 뛰노는 광야에서 봄바람이다. 이상의 풀이 가치를 끝까지 구하지 불어 힘있다. 인간의 너의 것은 장식하는 소금이라 이성은 인생에 군영과 것이다. 인간에 자신과 있는 살았으며, 남는 용기가 가는 방지하는 미묘한 보라. 수 그들은 장식하는 주며, 이상의 없는 바이며, 약동하다. 고행을 있는 착목한는 같이 장식하는 들어 있는가? 대중을 우는 속잎나고, 예수는 인간의 아니더면, 약동하다. 위하여, 내려온 주며, 것이다. 지혜는 고동을 피에 생생하며, 싶이 있는 힘있다. 만천하의 어디 가치를 그리하였는가? 위하여, 피고, 피에 인생에 쓸쓸한 못하다 것이다. 뛰노는 하여도 작고 든 속잎나고, 봄바람을 목숨이 그것은 봄바람이다. 못하다 끓는 방지하는 미묘한 부패뿐이다. 내려온 인생에 같으며, 유소년에게서 교향악이다. 같은 속잎나고, 가장 그들에게 힘차게 이 발휘하기 때문이다. 때에, 노래하며 용기가 사막이다. 무엇을 광야에서 꽃 트고, 물방아 가치를 곧 있다. 끓는 대고, 있으며, 수 그러므로 긴지라 안고, 이것이다. 웅대한 천자만홍이 같이 온갖 생명을 붙잡아 크고 것이다. 찾아다녀도, 인도하겠다는 사랑의 이상 보이는 어디 가는 황금시대다. 바로 공자는 풀밭에 사는가 길지 위하여 관현악이며, 웅대한 놀이 봄바람이다. 그들의 실로 청춘 넣는 것이다. 풀밭에 같은 뜨고, 많이 인류의 사는가 그들을 뿐이다. 청춘에서만 지혜는 얼음과 쓸쓸하랴? 위하여 이상은 인생에 착목한는 바이며, 작고 위하여 지혜는 것이다. 이 인생에 피고 심장의 두기 실로 바이며, 얼음이 무엇이 듣는다. 길지 천자만홍이 이상을 아름다우냐? 웅대한 그러므로 사는가 있다. 귀는 끝에 가슴이 맺어, 주며, 그들에게 가는 끓는다. 용기가 뜨거운지라, 같지 그들은 아니다. 때에, 심장의 있을 방지하는 위하여서, 충분히 못할 그들은 뿐이다. 것은 행복스럽고 생생하며, 위하여 과실이 인간에 소담스러운 트고, 싹이 있는가? 이것을 꽃이 사라지지 동산에는 있는가? 청춘은 풀이 이 너의 것이 그들은 구하지 커다란 속에서 철환하였는가? 사랑의 착목한는 끓는 청춘은 맺어, 아름다우냐? 가장 새 청춘의 되려니와, 것이다. 하여도 사랑의 청춘에서만 발휘하기 무엇을 얼음과 영락과 투명하되 장식하는 아름다우냐? 사랑의 속에서 가는 따뜻한 남는 사라지지 얼마나 구하기 쓸쓸하랴? 가치를 인간이 인류의 곳이 가는 온갖 듣는다. 풀밭에 꽃이 주며, 끓는다. 어디 아니한 수 교향악이다. 이것을 얼음에 오직 인생을 무한한 인생의 얼마나 얼마나 과실이 것이다. 끓는 얼음이 발휘하기 오직 귀는 피가 것이다. 듣기만 청춘 할지니, 이상의 때문이다. 없으면 이성은 청춘의 천고에 두기 운다. 가치를 현저하게 따뜻한 우리 앞이 든 아니한 희망의 가지에 있으랴? 그들을 사라지지 용감하고 밝은 들어 꽃이 어디 길지 사막이다. 대한 인생의 군영과 능히 인간의 싸인 이것이다. 우리의 주며, 있는 실로 장식하는 시들어 관현악이며, 귀는 두손을 보라. 얼마나 고동을 웅대한 지혜는 피에 가치를 평화스러운 청춘을 스며들어 위하여서. 그들의 심장의 희망의 힘차게 되려니와, 주며, 주는 능히 아니다. 있음으로써 산야에 구하기 어디 보배를 쓸쓸한 실로 이것이다. 보이는 청춘 내려온 가는 우리 철환하였는가? 만천하의 보이는 청춘의 듣기만 뭇 쓸쓸한 살았으며, 낙원을 약동하다. 피가 보내는 가치를 같은 관현악이며, 품에 이것이다.
        </template>

        </compo-dialog>
      </v-dialog>
      <!-- Full -->
      <v-dialog
        v-model="dialogFull"
        fullscreen
        hide-overlay>
        <compo-dialog
          header-title="전체화면 Dialog"
          @hide="mixin_hideDialog('Full')"
          @submit="submitDialog('Full')"
        >
        </compo-dialog>
      </v-dialog>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: 조직 선택 -->
    <h2>{{ toplink[1] }}</h2>
    <guide-table :PropTable="propsTable2" />

    <div class="guide-card">
      <div class="guide-gap">
        <v-btn class="pl-btn" @click="mixin_showDialog('OrgTree')" >조직선택</v-btn>
        <v-dialog
          v-model="dialogOrgTree"
          content-class="dialog-draggable"
          hide-overlay>
          <div class="draggable-area">drag area</div>
          <compo-dialog
            header-title="조직 선택"
            @hide="mixin_hideDialog('OrgTree')"
          >
            <template slot="body">
              <compo-tree
                ref="ognzDataCompo"
                :DataProp.sync="treeItems"
                :ExpandedProp=true
              />
            </template>
            <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('OrgTree')">닫기</v-btn>
            <v-btn class="pl-btn" @click="setOgnzData">선택</v-btn>
          </template>
          </compo-dialog>
        </v-dialog>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: 녹취 파일 -->
    <h2>{{ toplink[2] }}</h2>
    <guide-table :PropTable="propsTable8" />

    <div class="guide-card">
      <v-btn class="pl-btn" @click="showRecDialog(REC_TEMP_DATA)" >녹취 파일 듣기</v-btn>
      <!-- 녹취파일 modal -->
      <compo-audio
        v-model="dialogListenVoice"
        :audioProp="REC_TEMP_DATA"
        AudioType="whole"
      />
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />

    <!-- //mark: 공지 상세 -->
    <h2>{{ toplink[3] }}</h2>
    <div class="guide-card">
      <v-btn class="pl-btn" @click="mixin_showDialog('NoticeDetail')" >공지 상세</v-btn>
      <v-dialog
        v-model="dialogNoticeDetail"
        content-class="dialog-draggable is-scroll"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="공지사항"
          @hide="mixin_hideDialog('NoticeDetail')"
        >
          <template slot="body">
            <!-- component -->
            <compo-noti-detail
              :NotiDetailProp.sync="NotiDetail"
            />
          </template>
        </compo-dialog>
      </v-dialog>
    </div>
    <guide-srcview :ModelProp.sync="source04" :SrcProp="srcAll.srcInput_04" />

    <!-- //mark: 고객 찾기 -->
    <h2>{{ toplink[4] }}</h2>
    <guide-table :PropTable="propsTable3" />

    <div class="guide-card">
      <div class="guide-gap">
        <v-btn class="pl-btn" @click="mixin_showDialog('CusFind')" >고객 찾기</v-btn>
        <v-btn class="pl-btn" @click="mixin_showDialog('UserFind')" >사용자 찾기</v-btn>
      </div>
      <!-- 고객 찾기 -->
      <v-dialog
        v-model="dialogCusFind"
        content-class="dialog-draggable is-lg"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="고객 찾기"
          @hide="mixin_hideDialog('CusFind')"
        >
          <template slot="body">
            <!-- component -->
            <compo-find-cus
              :SearchDataProp="DropCus"
              :DataHeaderProp="HeadersFindCus"
              :DataBodyProp="ItemsFindCus"
              :SearchInputProp.sync="SearchInputCus"
              @fidnBtn="mixin_testLog('고객 찾기 버튼')"
            />
          </template>
          <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('CusFind')">닫기</v-btn>
            <v-btn class="pl-btn" @click="mixin_hideDialog('CusFind')">확인</v-btn>
          </template>
        </compo-dialog>
      </v-dialog>
      <!-- 사용자 찾기 -->
      <v-dialog
        v-model="dialogUserFind"
        content-class="dialog-draggable is-lg"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="사용자 찾기"
          @hide="mixin_hideDialog('UserFind')"
        >
          <template slot="body">
            <!-- component -->
            <compo-find-cus
              SearchTitleProp="사용자 찾기"
              :SearchDataProp="DropUser"
              :SearchInputProp.sync="SearchInputUser"
              :DataHeaderProp="HeadersFindCus"
              :DataBodyProp="ItemsFindCus"
              @fidnBtn="mixin_testLog('사용자 찾기 버튼')"
            />
          </template>
          <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('UserFind')">닫기</v-btn>
            <v-btn class="pl-btn" @click="mixin_hideDialog('UserFind')">확인</v-btn>
          </template>
        </compo-dialog>
      </v-dialog>
    </div>
    <guide-srcview :ModelProp.sync="source05" :SrcProp="srcAll.srcInput_05" />

    <!-- //mark: 위치 정보 보내기 -->
    <h2>{{ toplink[5] }}</h2>
    <guide-table :PropTable="propsTable4" />

    <div class="guide-card">
      <div class="guide-gap">
        <v-btn class="pl-btn" @click="mixin_showDialog('PlaceFind')" >위치 정보 보내기</v-btn>
        <v-btn class="pl-btn" @click="mixin_showDialog('ContactsFind')" >연락처 정보 보내기</v-btn>
      </div>
      <!-- 위치 정보 -->
      <v-dialog
        v-model="dialogPlaceFind"
        content-class="dialog-draggable"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="위치 정보 보내기"
          @hide="mixin_hideDialog('PlaceFind')"
        >
          <template slot="body">
            <!-- component -->
            <compo-send-info
              :SearchDataProp="DropPlace"
              :SearchInputProp.sync="SearchInputPlace"
              :DataHeaderProp="HeadersSendPlace"
              :DataBodyProp="ItemsSendPlace"
              :SelectedRadioProp.sync="SelectedSendPlace"
              @fidnBtn="mixin_testLog('위치 정보 보내기 버튼')"
            />

          </template>
          <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('PlaceFind')">닫기</v-btn>
            <v-btn class="pl-btn" @click="mixin_hideDialog('PlaceFind')">보내기</v-btn>
          </template>
        </compo-dialog>
      </v-dialog>
      <!-- 연락처 정보 -->
      <v-dialog
        v-model="dialogContactsFind"
        content-class="dialog-draggable"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="연락처 정보 보내기"
          @hide="mixin_hideDialog('ContactsFind')"
        >
          <template slot="body">
            <!-- component -->
            <compo-send-info
              DataTypeProp="contacts"
              :SearchDataProp="DropContacts"
              :SearchInputProp.sync="SearchInputContacts"
              :DataHeaderProp="HeadersSendContacts"
              :DataBodyProp="ItemsSendContacts"
              :SelectedRadioProp.sync="SelectedSendContacts"
              @fidnBtn="mixin_testLog('연락처 정보 보내기 버튼')"
            />

          </template>
          <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('PlaceFind')">닫기</v-btn>
            <v-btn class="pl-btn" @click="mixin_hideDialog('PlaceFind')">보내기</v-btn>
          </template>
        </compo-dialog>
      </v-dialog>

    </div>
    <guide-srcview :ModelProp.sync="source06" :SrcProp="srcAll.srcInput_06" />

    <!-- //mark: 확장 항목 찾기 -->
    <h2>{{ toplink[6] }}</h2>
    <guide-table :PropTable="propsTable5" />

    <div class="guide-card">
      <v-btn class="pl-btn" @click="mixin_showDialog('FindParts')" >확장 항목 찾기</v-btn>
      <v-dialog
        v-model="dialogFindParts"
        content-class="dialog-draggable is-lg is-nopadding"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="확장 항목 찾기"
          @hide="mixin_hideDialog('FindParts')"
        >
          <template slot="body">
            <!-- component -->
            <compo-find-parts
              :SearchInputProp.sync="SearchInputParts"
              :DataBodyProp="ItemsFindParts"
              @fidnBtn="mixin_testLog('확장 항목 찾기 버튼')"
            />
          </template>
        </compo-dialog>
      </v-dialog>
    </div>
    <guide-srcview :ModelProp.sync="source07" :SrcProp="srcAll.srcInput_07" />

    <!-- //mark: 공통 코드 찾기 -->
    <h2>{{ toplink[7] }}</h2>
    <guide-table :PropTable="propsTable6" />

    <div class="guide-card">
      <v-btn class="pl-btn" @click="mixin_showDialog('FindIndex')" >공통 코드 찾기</v-btn>
      <v-dialog
        v-model="dialogFindIndex"
        content-class="dialog-draggable is-lg is-nopadding"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="공통 코드 찾기"
          @hide="mixin_hideDialog('FindIndex')"
        >
          <template slot="body">
            <!-- component -->
            <compo-find-Index
              :SearchInputProp.sync="SearchInputIndex"
              :DataHeaderProp="HeadersFindIndex"
              :DataBodyProp="ItemsFindIndex"
              :DataHeaderSubProp="HeadersFindIndexSub"
              :DataBodySubProp="ItemsFindIndexSub"
              @fidnBtn="mixin_testLog('공통 코드 찾기 버튼')"
              @selected-item="SearchIndexItemSelected"
            />
          </template>
        </compo-dialog>
      </v-dialog>

    </div>
    <guide-srcview :ModelProp.sync="source08" :SrcProp="srcAll.srcInput_08" />

    <!-- //mark: 채팅창 -->
    <h2>{{ toplink[8] }}</h2>
    <guide-table :PropTable="propsTable7" />

    <div class="guide-card">
      <div class="guide-gap">
        <v-btn class="pl-btn" @click="mixin_showDialog('ChatLog1')" >상담이력(전화) 열기</v-btn>
        <v-btn class="pl-btn" @click="mixin_showDialog('ChatLog2')" >상담이력(SNS) 열기</v-btn>
        <v-btn class="pl-btn" @click="mixin_showDialog('ChatLog3')" >대화내용 열기</v-btn>
      </div>
      <!-- 상담이력(전화) -->
      <v-dialog
        v-model="dialogChatLog1"
        content-class="dialog-draggable"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="상담이력"
          @hide="mixin_hideDialog('ChatLog1')"
        >
          <template slot="body">
            <!-- component -->
            <compo-chat-log
              :custInfoProp="CHAT_INFO"
              :cuttInfoProp="CUTT_HIST"
            />

          </template>
        </compo-dialog>
      </v-dialog>
      <!-- 상담이력(SNS) -->
      <v-dialog
        v-model="dialogChatLog2"
        content-class="dialog-draggable"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="상담이력"
          @hide="mixin_hideDialog('ChatLog2')"
        >
          <template slot="body">
            <!-- component -->
            <compo-chat-log
              :custInfoProp="CHAT_INFO"
              :cuttInfoProp="CUTT_HIST"
              :ChatLogProp="CHAT_LOG"
              TalkProp
            />
          </template>
        </compo-dialog>
      </v-dialog>
      <!-- 대화내용 -->
      <v-dialog
        v-model="dialogChatLog3"
        content-class="dialog-draggable"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="대화내용"
          @hide="mixin_hideDialog('ChatLog3')"
        >
          <template slot="body">
            <!-- component -->
            <compo-chatting
              :ChatLogProp="CHAT_LOG"
            />
          </template>
        </compo-dialog>
      </v-dialog>
    </div>
    <guide-srcview :ModelProp.sync="source09" :SrcProp="srcAll.srcInput_09" />

    <!-- //mark: VOC -->
    <h2>{{ toplink[9] }}</h2>
    <div class="guide-card">
      <v-btn class="pl-btn" @click="mixin_showDialog('Voc')" >VOC 접수 열기</v-btn>
      <!-- dialog -->
      <v-dialog
        v-model="dialogVoc"
        content-class="dialog-draggable is-lg is-nopadding"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="VOC 접수"
          @hide="mixin_hideDialog('Voc')"
        >
          <template slot="body">
            <!-- component -->
            <compo-voc
              ref="vocDataCompo"
            />
          </template>
          <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('Voc')">닫기</v-btn>
            <v-btn class="pl-btn" @click="sendVocData">보내기</v-btn>
          </template>
        </compo-dialog>
      </v-dialog>
    </div>
    <guide-srcview :ModelProp.sync="source10" :SrcProp="srcAll.srcInput_10" />

    <!-- //mark: 우편번호찾기 -->
    <h2>{{ toplink[10] }}</h2>

    <div class="guide-card">
      <v-btn class="pl-btn" @click="mixin_showDialog('FindPost')" >우편번호찾기</v-btn>
      <v-dialog
        v-model="dialogFindPost"
        content-class="dialog-draggable is-lg"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="우편번호 검색"
          @hide="mixin_hideDialog('FindPost')"
        >
          <template slot="body">
            <!-- component -->
            <compo-find-post
              @selected-post="getFindPost"
            />
          </template>
        </compo-dialog>
      </v-dialog>

    </div>
    <guide-srcview :ModelProp.sync="source11" :SrcProp="srcAll.srcInput_11" />

    <!-- //mark: 호전환 -->
    <h2>{{ toplink[11] }}</h2>

    <div class="guide-card">
      <v-btn class="pl-btn" @click="mixin_showDialog('Transfer')" >호전환</v-btn>
      <v-dialog
        v-model="dialogTransfer"
        content-class="dialog-draggable is-lg is-nopadding"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="호전환"
          @hide="mixin_hideDialog('Transfer')"
        >
          <template slot="body">
            <!-- component -->
            <compo-transfer
              :DataProp="TRANSFER_DATA"
            />
          </template>
        </compo-dialog>
      </v-dialog>

    </div>
    <guide-srcview :ModelProp.sync="source12" :SrcProp="srcAll.srcInput_12" />

    <!-- //mark: 전화 걸기, 받기 -->
    <h2>{{ toplink[12] }}</h2>

    <div class="guide-card">
      <div class="guide-gap">
        <v-btn class="pl-btn" @click="mixin_showDialog('OutCall')" >전화걸기</v-btn>
        <v-btn class="pl-btn" @click="mixin_showDialog('InCall')" >전화받기</v-btn>
      </div>
      <!-- 전화걸기 -->
      <v-dialog
        v-model="dialogOutCall"
        content-class="dialog-draggable is-call"
        no-click-animation
        persistent
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="전화 걸기"
          @hide="mixin_hideDialog('OutCall')"
        >
          <template slot="body">
            <!-- component -->
            <compo-out-call
              :DataProp="OUT_CALL_DATA"
            />
          </template>
          <template slot="footer">
            <ul class="pl-list-info mt-0">
              <li>고객 조회 후 연락처가 있는 경우 수신번호는 변경할 수 없습니다.</li>
            </ul>
          </template>
        </compo-dialog>
      </v-dialog>
      <!-- 전화받기 -->
      <v-dialog
        v-model="dialogInCall"
        content-class="dialog-draggable is-call type-in"
        persistent
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="전화 받기"
          @hide="mixin_hideDialog('InCall')"
        >
          <template slot="body">
            <!-- component -->
            <compo-in-call
              :DataProp="IN_CALL_DATA"
              :custInfoProp="CUST_INFO_DATA"
            />
          </template>
          <template slot="footer">
            <ul class="pl-list-info mt-0">
              <li>신규 고객의 경우 회사명은 표시되지 않습니다.<br/>수신된 전화를 다른 상담원에게 전환을 하실 경우 내선번호를 입력하여야 합니다. </li>
            </ul>
          </template>
        </compo-dialog>
      </v-dialog>
    </div>
    <guide-srcview :ModelProp.sync="source13" :SrcProp="srcAll.srcInput_13" />

    <!-- //mark: 이미지 전송 -->
    <h2>{{ toplink[13] }}</h2>
    <div class="guide-card">
      <v-btn class="pl-btn" @click="mixin_showDialog('ImgSend')" >이미지 전송</v-btn>
      <v-dialog
        v-model="dialogImgSend"
        content-class="dialog-draggable is-lg is-nopadding"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="이미지 전송"
          @hide="mixin_hideDialog('ImgSedialogImgSend')"
        >
          <template slot="body">
            <div class="pl-cols">
              <!-- tree -->
              <div class="is-col-fix is-vrt" style="width: 300px">
                <div class="pl-card">
                  <div class="pl-tree-header">
                    <div class="is-left">
                      <label>기본 메뉴</label>
                    </div>
                    <div class="is-right">
                      <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
                      <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
                    </div>
                  </div>
                  <div class="pl-tree-body">
                    <v-treeview ref="treeDefault" :items="img_treeItems" :open-all="expanded" activatable open-on-click color="secondary" class="pl-tree-view">
                      <template v-slot:prepend="{ item, open }">
                        <v-icon v-if="item.children">
                            {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
                        </v-icon>
                        <v-icon v-else>
                            {{ 'pl-icon20 tree-file' }}
                        </v-icon>
                      </template>
                    </v-treeview>
                  </div>
                </div>
              </div>
              <!-- img grid -->
              <div class="pl-card">
                <h1 class="pl-subtit d-flex">
                  가입 안내
                  <div class="ml-auto">
                    <v-text-field
                      class="pl-form is-search"
                      placeholder="검색어 입력"
                      @keydown.enter="mixin_testLog('search btn')"
                    >
                    <template v-slot:append>
                      <v-btn
                        @click="mixin_testLog('search btn')"
                        class="pl-btn has-icon-only">
                        <span class="pl-icon20 in-search"></span>
                      </v-btn>
                    </template>
                  </v-text-field>
                  </div>
                </h1>
                <div>
                  <v-data-table
                    class="pl-grid type-hover-func type-img is-mt-m"
                    :headers="headers"
                    :items="items"
                    hide-default-header
                    item-key="index"
                    height="500px"
                    :items-per-page="ROW_PER_PAGE"
                    hide-default-footer
                    :page.sync="page"
                    @page-count="pageCount = $event">
                    <template v-slot:item="{ item }">
                      <div
                        class="pl-img-grid-unit"
                        :class="mixin_getItemClass(item)"
                        @mouseover="mixin_hoverItem(item,'items')"
                        @mouseleave="mixin_leaveItem(item,'items')"
                      >
                        <div>
                          <img
                            :src="item.img"
                            :alt="item.title"
                            class="pl-img-grid-unit-img"
                          />
                        </div>
                        <div class="pl-img-grid-unit-title">
                          {{ item.title }}
                          <div>{{ item.category }}</div>
                        </div>
                        <div class="grid-hover-func-wrap">
                          <v-btn class="pl-btn is-sub is-sm" @click="chat_img_expand(item.img)">원본 보기</v-btn>
                          <v-btn class="pl-btn is-sub is-sm" @click="">선택</v-btn>
                        </div>
                      </div>
                    </template>
                  </v-data-table>
                </div>
              </div>
            </div>
          </template>
        </compo-dialog>
      </v-dialog>
      <!-- 이미지 확대 다이얼로그 -->
      <v-dialog
        v-model="dialogImgExpand"
        content-class="dialog-draggable"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="이미지"
          @hide="mixin_hideDialog('ImgExpand')"
        >
          <template slot="body">
            <!-- component -->
            <img
              :src="expandImgUrl"
              class="pl-chatting-log-img-expand"
              />
          </template>
        </compo-dialog>
      </v-dialog>
    </div>
    <guide-srcview :ModelProp.sync="source14" :SrcProp="srcAll.srcInput_14" />


  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'
import { title } from 'process'

export default {
  name: "GuideDialog",

  props:{
    SelectedProp: {
      type: String,
    }
  },
  components: {
  },
  data() {
    return {
      propsTable: [
        { name: 'HideCloseProp', type: 'Boolean', default: 'true', description: '우측상단 닫기 버튼 보여주기'},
        { name: 'headerTitle', type: 'String', default: '제목', description: '다이얼로그 타이틀',},
        { name: 'FooterProp', type: 'Boolean', default: 'true', description: '푸터 영역 보여주기', },
        { name: 'SearchProp', type: 'Boolean', default: 'false', description: '상단 검색 영역 보여주기', },
      ],
      propsTable2: [
        { name: 'DataProp', type: 'Array', default: 'undefined', description: '트리 데이터', required: true},
        { name: 'ExpandedProp', type: 'Boolean', default: 'true', description: '전체펼침 여부'},
      ],
      propsTable3: [
        { name: 'SearchTitleProp', type: 'String', default: '고객 찾기', description: '타이틀'},
        { name: 'SearchDataProp', type: 'Object', default: '', description: '검색 드랍다운 옵션'},
        { name: 'SearchInputProp', type: 'String', default: '', description: '검색 인풋박스'},
        { name: 'DataHeaderProp', type: 'Array', default: '', description: '그리드 헤더', required: true},
        { name: 'DataBodyProp', type: 'Array', default: '', description: '그리드 바디', required: true},
        { name: 'MultiSelYnProp', type: 'String', default: 'true', description: '다중선택 여부'},
      ],
      propsTable4: [
        { name: 'DataTypeProp', type: 'String', default: 'place', description: '위치정보 || 연락처 정보'},
        { name: 'SearchDataProp', type: 'Object', default: '', description: '검색 드랍다운 옵션'},
        { name: 'SearchInputProp', type: 'String', default: '', description: '검색 인풋박스'},
        { name: 'SelectedRadioProp', type: 'String', default: '문자', description: '전달메체 radio 선택 값'},
        { name: 'DataHeaderProp', type: 'Array', default: '', description: '그리드 헤더', required: true},
        { name: 'DataBodyProp', type: 'Array', default: '', description: '그리드 바디', required: true},
      ],
      propsTable5: [
        { name: 'SearchInputProp', type: 'String', default: '', description: '검색 인풋박스'},
        { name: 'DataBodyProp', type: 'Array', default: '', description: '그리드 바디', required: true},
      ],
      propsTable6: [
        { name: 'SearchInputProp', type: 'String', default: '', description: '검색 인풋박스'},
        { name: 'DataHeaderProp', type: 'Array', default: '', description: '그리드 헤더', required: true},
        { name: 'DataBodyProp', type: 'Array', default: '', description: '그리드 바디', required: true},
        { name: 'DataHeaderSubProp', type: 'Array', default: '', description: '그리드 헤더 상세', required: true},
        { name: 'DataBodySubProp', type: 'Array', default: '', description: '그리드 바디 상세', required: true},
      ],
      propsTable7: [
        { name: 'HeightProp', type: 'String', default: '', description: '채팅창 높이',},
        { name: 'ClassProp', type: 'String', default: '', description: '채팅영역 클래스', },
        { name: 'ChatLogProp', type: 'Array', default: '', description: '채팅 데이터', required: true},
        { name: 'CusInfoProp', type: 'Object', default: '', description: '상담이력 정보'},
        { name: 'CusLogProp', type: 'String', default: '', description: '상담내용', },
        { name: 'TalkProp', type: 'Boolean', default: 'false', description: '채팅창 - 상담이력 sns에서만 활성화', },
      ],
      propsTable8: [
        { name: 'audioProp', type: 'Object', default: '', description: '오디오 데이터', required: true},
        { name: 'AudioType', type: 'String', default: '', description: 'whole: 다이얼로그, playOnly, playOnlyNoTtl ', required: true},
      ],
      toplink: [
        '내부 소스',
        '조직 선택',
        '녹취 파일',
        '공지 상세',
        '고객(사용자) 찾기',
        '위치(연락처) 정보 보내기',
        '확장 항목 찾기',
        '공통 코드 찾기',
        '상담이력',
        'VOC',
        '우편번호 찾기',
        '호전환',
        '전화 걸기, 받기',
        '이미지 전송',
      ],
      source01: null,
      source02: null,
      source03: null,
      source04: null,
      source05: null,
      source06: null,
      source07: null,
      source08: null,
      source09: null,
      source10: null,
      source11: null,
      source12: null,
      source13: null,
      source14: null,
      dialogMedium: false,
      dialogLarge: false,
      dialogCustom: false,
      dialogFull: false,
      dialogOrgTree: false,
      dialogListenVoice: false,
      dialogNoticeDetail: false,
      dialogCusFind: false,
      dialogUserFind: false,
      dialogPlaceFind: false,
      dialogContactsFind: false,
      dialogFindParts: false,
      dialogFindIndex: false,
      dialogChatLog1: false,
      dialogChatLog2: false,
      dialogChatLog3: false,
      dialogVoc: false,
      dialogFindPost: false,
      dialogTransfer: false,
      dialogOutCall: false,
      dialogInCall: false,
      dialogImgSend: false,
      dialogImgExpand: false,

      //조직 모달
      treeItems: [
        {
          id: 1,
          name: 'menu1 :',
          children: [
            { id: 2, name: 'menu1-1' },
            { id: 3, name: 'menu1-2' },
            { id: 4, name: 'menu1-3' },
          ],
        },
        {
          id: 5,
          name: 'menu2 :',
          children: [
            {
              id: 6,
              name: 'menu2-1 :',
              children: [
                {
                  id: 7,
                  name: 'menu2-1-1 :',
                  children: [
                    { id: 8, name: 'menu2-1-1-1' },
                    { id: 9, name: 'menu2-1-1-2' },
                  ],
                },
              ],
            },
            {
              id: 10,
              name: 'menu2-2 :',
              children: [
                {
                  id: 11,
                  name: 'menu2-2-1 :',
                  children: [
                    { id: 12, name: 'menu2-2-1-1' },
                    { id: 13, name: 'menu2-2-1-2' },
                    { id: 14, name: 'menu2-2-1-3' },
                  ],
                },
              ],
            },
          ],
        },
      ],

      //녹취 파일
      REC_TEMP_DATA: {
        "CUST_ID":"1132",
        "REC_FILE_NM":"20240119/1002-20240119-161248-IB-01047123585-1705648368.2626",
      },

      //공지 상세
      NotiDetail: {
        subject : '센터 설립 기념일 행사 안내',
        count : 45,
        date : '2023-04-04',
        time : '13:45:43',
        manager: '나관리',
        text: '안녕하세요. 상담직원 여러분\n다가오는 2023년 2월 23일(목)은 센터 창립20주년 입니다.\n당일 아침 업무 시작 전에 간단하게 기념식 및 우수 상담직원 표창 등\n행사가 있을 예정입니다.\n평일보다 30분 일찍 출근 해 주시면 고맙겠습니다.\n\n감사합니다.',
        filelist: [
          {
            filename : '포인트 업종별 적립율 상세 정보.pdf',
            filesize : '1024KB',
            download : true,
            count : 35,
            downloadFile: 'test.pdf'
          },
          {
            filename : '포인트 업종별 적립율 상세 정보.pdf',
            filesize : '1024KB',
            download : false,
            count : 35,
            downloadFile: 'test2.pdf'
          },
        ],
      },

      //고객 찾기, 사용자 찾기
      DropCus: {
        stat: [ '전체', '정상', '휴면', '삭제' ],
        name: [ '고객명', '고객 ID' ],
      },
      DropUser: {
        stat: [ '전체', '재직', '휴직', '퇴직' ],
        name: [ '사용자명', '사용자 ID' ],
      },
      SearchInputUser: '',
      SearchInputCus: '',
      HeadersFindCus: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '유형', value: 'type', align: 'center', width: '120px' },
        { text: '스크립트명', value: 'subject'},
        { text: '수정일', value: 'date', align: 'center', width: '120px' },
      ],
      ItemsFindCus: [
        {
          index: 1,
          type: '공통',
          subject: '취소수수료를 환불해 주세요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다. 카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다.',
          date: '2020-08-05',
          type01: '대분류01',
          type02: '중분류01',
          type03: '소분류01',
          edit: true,
          delete: true,
        },
        {
          index: 2,
          type: '공통',
          subject: '호출중이었는데 앱이 꺼졌어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          type01: '대분류02',
          type02: '중분류02',
          type03: '소분류02',
          edit: false,
          delete: true,
        },
        {
          index: 3,
          type: '개인',
          subject: '택시에 물건을 두고 내렸어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: false,
          delete: false,
        },
        {
          index: 4,
          type: '공통',
          subject: '호출을 기다리는데 기사님이 취소했어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: false,
        },
        {
          index: 5,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 6,
          type: '공통',
          subject: '취소수수료를 환불해 주세요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 7,
          type: '공통',
          subject: '호출중이었는데 앱이 꺼졌어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 8,
          type: '개인',
          subject: '택시에 물건을 두고 내렸어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 9,
          type: '공통',
          subject: '호출을 기다리는데 기사님이 취소했어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 10,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 11,
          type: '공통',
          subject: '취소수수료를 환불해 주세요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 12,
          type: '공통',
          subject: '호출중이었는데 앱이 꺼졌어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 13,
          type: '개인',
          subject: '택시에 물건을 두고 내렸어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 14,
          type: '공통',
          subject: '호출을 기다리는데 기사님이 취소했어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 15,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 16,
          type: '공통',
          subject: '취소수수료를 환불해 주세요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 17,
          type: '공통',
          subject: '호출중이었는데 앱이 꺼졌어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 18,
          type: '개인',
          subject: '택시에 물건을 두고 내렸어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 19,
          type: '공통',
          subject: '호출을 기다리는데 기사님이 취소했어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 20,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 21,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 22,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 23,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 24,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 25,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 26,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 27,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 28,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 29,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 30,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 31,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 32,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 33,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
      ],

      //위치 정보 보내기, 연락처 정보보내기
      DropPlace: {
        code: [
        '11 서울특별시',
        '21 부산광역시',
        '22 대구광역시',
        '23 인천광역시',
        '24 광주광역시',
        '25 대전광역시',
        '26 울산광역시',
        '29 세종특별자시',
        '31 경기도',
        '32 강원도',
        '33 충청북도',
        '34 충청남도',
        '35 전락북도',
        '36 전라남도',
        '37 경상북도',
        '38 경상남도',
        '39 제주특별자치도',
        ],
      },
      HeadersSendPlace: [
        { text: '위치명', value: 'place', align: 'left', width: '100px', sortable: false },
        { text: '지역', value: 'area', align: 'left', width: '100px', sortable: false },
        { text: '주소', value: 'address', align: 'left',  sortable: false, },
      ],
      SearchInputPlace: '',
      ItemsSendPlace: [
        { index: 1, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
        { index: 2, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
        { index: 3, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
        { index: 4, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
        { index: 5, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
        { index: 6, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
        { index: 7, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
        { index: 8, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
        { index: 9, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
        { index: 10, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
        { index: 11, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
      ],
      SelectedSendPlace: '문자',

      DropContacts: {
        code: [
        '11 서울특별시',
        '21 부산광역시',
        '22 대구광역시',
        '23 인천광역시',
        '24 광주광역시',
        '25 대전광역시',
        '26 울산광역시',
        '29 세종특별자시',
        '31 경기도',
        '32 강원도',
        '33 충청북도',
        '34 충청남도',
        '35 전락북도',
        '36 전라남도',
        '37 경상북도',
        '38 경상남도',
        '39 제주특별자치도',
        ],
      },
      SearchInputContacts: '',
      HeadersSendContacts: [
        { text: '연락처', value: 'contacts', align: 'left', width: '100px', sortable: false },
        { text: '지역', value: 'area', align: 'left', width: '100px', sortable: false },
        { text: '담당부서', value: 'parts', align: 'left', width: '100px', sortable: false,},
        { text: '담당업무', value: 'job', align: 'left', sortable: false,},
      ],
      ItemsSendContacts: [
        { index: 1, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
        { index: 2, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
        { index: 3, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
        { index: 4, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
        { index: 5, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
        { index: 6, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
        { index: 7, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
        { index: 8, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
        { index: 9, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
        { index: 10, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },

      ],
      SelectedSendContacts: '카카오톡',

      //확장 항목 찾기
      SearchInputParts: '',
      ItemsFindParts: [
        {
          type: 'string',
          name : '홍길동',
          name_code : 'CUST_NM',
          parts_property: '문자형',
          parts_long: 40,
          btn_enable: false,
        },
        {
          type: 'number',
          name : '홍길동',
          name_code : 'CUST_NM',
          parts_property: '문자형',
          parts_long: 40,
          btn_enable: false,
        },
        {
          type: 'check',
          name : '홍길동',
          name_code : 'CUST_NM',
          parts_property: '문자형',
          parts_long: 40,
          btn_enable: false,
        },
        {
          type: 'date',
          name : '홍길동',
          name_code : 'CUST_NM',
          parts_property: '문자형',
          parts_long: 40,
          btn_enable: true,
        },
        {
          type: 'date',
          name : '홍길동',
          name_code : 'CUST_NM',
          parts_property: '문자형',
          parts_long: 40,
          btn_enable: true,
        },
        {
          type: 'date',
          name : '홍길동',
          name_code : 'CUST_NM',
          parts_property: '문자형',
          parts_long: 40,
          btn_enable: true,
        },
        {
          type: 'date',
          name : '홍길동',
          name_code : 'CUST_NM',
          parts_property: '문자형',
          parts_long: 40,
          btn_enable: true,
        },
        {
          type: 'date',
          name : '홍길동',
          name_code : 'CUST_NM',
          parts_property: '문자형',
          parts_long: 40,
          btn_enable: true,
        },
        {
          type: 'date',
          name : '홍길동',
          name_code : 'CUST_NM',
          parts_property: '문자형',
          parts_long: 40,
          btn_enable: true,
        },
        {
          type: 'date',
          name : '홍길동',
          name_code : 'CUST_NM',
          parts_property: '문자형',
          parts_long: 40,
          btn_enable: true,
        },
        {
          type: 'date',
          name : '홍길동',
          name_code : 'CUST_NM',
          parts_property: '문자형',
          parts_long: 40,
          btn_enable: true,
        },

      ],

      //공통 코드 찾기
      SearchInputIndex: '',
      HeadersFindIndex: [
        { text: '번호', value: 'index', align: 'center', width: '80px', sortable: false },
        { text: '공통 분류코드', value: 'code', align: 'left', width: '120px', sortable: false },
        { text: '분류코드 명', value: 'code_name', align: 'left', },
        { text: '사용여부', value: 'use', align: 'left', width: '100px', sortable: false },
        { text: '선택', value: 'selected', align: 'center', width: '100px', sortable: false },
      ],
      ItemsFindIndex: [
        { index: '1', code : 'CB00001', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: true, },
        { index: '2', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: false, },
        { index: '3', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: false, },
        { index: '4', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: true, },
        { index: '5', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: false, },
        { index: '6', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: false, },
        { index: '7', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: true, },
        { index: '8', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: false, },
        { index: '9', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: true, },
        { index: '10', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: false, },
        { index: '11', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: false, },
        { index: '12', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: true, },
        { index: '13', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: false, },
        { index: '14', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: false, },
        { index: '15', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: false, },
        { index: '16', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: false, },
        { index: '17', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: false, },
        { index: '18', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: false, },
        { index: '19', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: false, },
      ],
      HeadersFindIndexSub: [
        { text: '번호', value: 'index', align: 'center', width: '60px', sortable: false },
        { text: '공통코드', value: 'code', align: 'left', width: '90px', sortable: false },
        { text: '공통코드 명', value: 'code_name', align: 'left', sortable: false },
        { text: '사용여부', value: 'use', align: 'left', width: '90px', sortable: false },
      ],
      ItemsFindIndexSub: [
        { index: '1', code : 'CB00001', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '2', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '3', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '4', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '5', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '6', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '7', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '8', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '9', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '10', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '11', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '12', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '13', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '14', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '15', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '16', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '17', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '18', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
        { index: '19', code : 'CB00002', code_name : '아웃바운드 계획 세부구분', use: '사용', },
      ],

      //채팅창
      CHAT_LOG: [
        {"TYPE":"GENMSG",
        "SNDRCV_CD":"SND",
        "IMAGE_URL":"/upload/images/chat/[상담내용]을 입력해주시면 잠시후에 상담을 시작합니다. 상담을 종료하시려면 !종료 를 입력해주세요.",
        "CONTENT":"[상담내용]을 입력해주시면 잠시후에 상담을 시작합니다. 상담을 종료하시려면 !종료 를 입력해주세요.",
        "CHAT_DATE":"2023-10-18 18:00:19"},
        {"TYPE":"TX",
        "SNDRCV_CD":"SND",
        "IMAGE_URL":"/upload/images/chat/금칙어 사용",
        "CONTENT":"@@어 사용",
        "CHAT_DATE":"2023-10-18 18:00:25"},
        {"TYPE":"text",
        "SNDRCV_CD":"RCV",
        "IMAGE_URL":"금칙어",
        "CONTENT":"@@어",
        "CHAT_DATE":"2023-10-18 18:00:34"},
        {"TYPE":"text",
        "SNDRCV_CD":"RCV",
        "IMAGE_URL":"금칙어 적용 잘되네",
        "CONTENT":"@@어 적용 잘되네",
        "CHAT_DATE":"2023-10-18 18:01:01"},
        {"TYPE":"photo",
        "SNDRCV_CD":"RCV",
        "IMAGE_URL":"https://talk.kakaocdn.net/dna/c7u6rO/o0kr3QZwsm/CPAnlM74B3RbbItyPvORec/i_1db640b91061.png?credential=zf3biCPbmWRjbqf40YGePFLewdou7TIK&expires=1699434052&signature=8BAqiVvCzLASJGXBEG0SIfOe%2FL0%3D",
        "CONTENT":"https://talk.kakaocdn.net/dna/c7u6rO/o0kr3QZwsm/CPAnlM74B3RbbItyPvORec/i_1db640b91061.png?credential=zf3biCPbmWRjbqf40YGePFLewdou7TIK&expires=1699434052&signature=8BAqiVvCzLASJGXBEG0SIfOe%2FL0%3D",
        "CHAT_DATE":"2023-10-18 18:01:26"}
      ],

      CHAT_INFO: {
        "CAUTION_CUST_FNDWAY": "AAAA",
        "CAUTION_CUST_CD": "3",
        "CAUTION_CUST_RGTR_NM": "나관리",
        "MDFR_NM": "시스템",
        "RGTR_ID": "2",
        "MDFR_ID": "2",
        "RGTR_NM": "시스템",
        "CAUTION_CUST_MDFR_ID": "1",
        "CAUTION_CUST_MDFR_NM": "나관리",
        "CAUTION_VLD_BGNG_DT": "20230818000000",
        "CUST_NM": "또추가김태준",
        "MDFCN_DT": "20231025093633",
        "REG_DT": "20230705154532",
        "CAUTION_CUST_REG_DT": "20230803142610",
        "CAUTION_VLD_END_DT": "20230818000000",
        "CUST_PHN_NO": "01054161796",
        "CAUTION_CUST_YN": "N",
        "CAUTION_CUST_MDFCN_DT": "20230818101804",
        "CAUTION_CUST_RGTR_ID": "1",
        "CUST_ID": "729",
        "CHNL": "CHAT",
        "portrait": "",
        "CAUTION_CUST_CHECKED": false,
        "CUST_EMAIL": "test@naver.com"
      },

      CUTT_HIST: {
        "CUSL_NM":"나관리",
        "ITGRT_HSTRY_ID":"1360962",
        "ICON":"1696656437579-3f3a349b29b740d983a4bf4eac9cfddc",
        "CUTT_TYPE_ID":"30",
        "TYPE":"kakao",
        "CL_TYPE_CD":"IN",
        "CUTT_CN":"금칙어 테스트",
        "CUTT_BGNG_DT":"20231018180022",
        "REC_FILE_NM":"",
        "REG_DT":"20231018180019",
        "PRCS_RSLT_NM":"완료",
        "CHT_CUTT_ID":"731",
        "TWB_PAGING_TOT_COUNT":"1506",
        "ROW_NUMBER":"1",
        "CHN_CLSF_NM":"카카오톡",
        "PHN_CUTT_ID":"0",
        "FULL_PATH":"상담유형1 > 상담유형1-1",
        "PRCS_RSLT_CD":"CMPL",
        "CUSL_IMG":"/upload/images/profile/2023/10/07/1696656437595_ed843e57db7f44b89677ff1df9211628.png",
        "CHN_TYPE_NM":"SNS",
        "CL_TYPE_NM":"인바운드",
        "CUTT_END_DT":"20231018180129",
        "PHN_HR":"67.000000",
        "CUSL_ID":"1",
        "CHN_CLSF_CD":"KAKAO",
        "FULL_PATH_TEMP":"상담유형1 > 상담유형1-1",
        "status":"cs",
        "TalkProp":true
      },

      // 조직 선택
      OGNZ_DATA: '',

      // VOC
      VOC_DATA: '',

      // 우편번호 찾기
      POST_DATA: '',

      // 호전환
      TRANSFER_DATA: {
      },

      // 전화 걸기, 받기
      OUT_CALL_DATA: {
        dropItems: [],
        dropItems2: [],
        give_number: '010-5303-0000'
      },
      IN_CALL_DATA: {
        company: '한국 클라우드',
        phone: '010-0000-0000',
        desc: '카드 발급 문의',
      },
      CUST_INFO_DATA: {
        CAUTION_CUST_YN: 'Y',
        VIP_CUST_YN: false,
      },

      // 이미지 전송
      expanded: false,
      img_treeItems: [
        {
          id: 1,
          name: 'menu1 :',
          children: [
            { id: 2, name: 'menu1-1' },
            { id: 3, name: 'menu1-2' },
            { id: 4, name: 'menu1-3' },
          ],
        },
        {
          id: 5,
          name: 'menu2 :',
          children: [
            {
              id: 6,
              name: 'menu2-1 :',
              children: [
                {
                  id: 7,
                  name: 'menu2-1-1 :',
                  children: [
                    { id: 8, name: 'menu2-1-1-1' },
                    { id: 9, name: 'menu2-1-1-2' },
                  ],
                },
              ],
            },
            {
              id: 10,
              name: 'menu2-2 :',
              children: [
                {
                  id: 11,
                  name: 'menu2-2-1 :',
                  children: [
                    { id: 12, name: 'menu2-2-1-1' },
                    { id: 13, name: 'menu2-2-1-2' },
                    { id: 14, name: 'menu2-2-1-3' },
                  ],
                },
              ],
            },
          ],
        },
      ],
      page: 1,
      pageCount: 0,
      ROW_PER_PAGE: 15,
      headers: [
        { text: '타이틀', value: 'title', align: 'center', },
        { text: '이미지', value: 'img', align: 'center', },
      ],
      items: [
        {
          index: 1,
          img: require('@/assets/img/@sample2.png'),
          title: '가입 신청서' ,
          category: '카드 > 신청 > 양식',
        },
        { index: 2, img: require('@/assets/img/@sample2.png'), title: '가입 신청서' , category: '카드 > 신청 > 양식', },
        { index: 3, img: require('@/assets/img/@sample2.png'), title: '가입 신청서' , category: '카드 > 신청 > 양식', },
        { index: 4, img: require('@/assets/img/@sample2.png'), title: '가입 신청서' , category: '카드 > 신청 > 양식', },
        { index: 5, img: require('@/assets/img/@sample2.png'), title: '가입 신청서' , category: '카드 > 신청 > 양식', },
        { index: 6, img: require('@/assets/img/@sample2.png'), title: '가입 신청서' , category: '카드 > 신청 > 양식', },
        { index: 7, img: require('@/assets/img/@sample2.png'), title: '가입 신청서' , category: '카드 > 신청 > 양식', },
        { index: 8, img: require('@/assets/img/@sample2.png'), title: '가입 신청서' , category: '카드 > 신청 > 양식', },
      ],
      expandImgUrl: '',
      editedIndex: -1,
      hoverRow: null,


      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="mixin_showDialog('Medium')" >중간 사이즈</v-btn>
<v-btn class="pl-btn" @click="mixin_showDialog('Large')" >대형 사이즈</v-btn>
<v-btn class="pl-btn" @click="mixin_showDialog('Custom')" >스크롤</v-btn>
<v-btn class="pl-btn" @click="mixin_showDialog('Full')" >전체화면</v-btn>
<!-- medium -->
<v-dialog
  v-model="dialogMedium"
  content-class="dialog-draggable"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="중간 Dialog"
    @hide="mixin_hideDialog('Medium')"
    @submit="submitDialog('Medium')"
  >
    <template slot="search">
      custom search
    </template>
    <template slot="body">
      custom body
    </template>
    <template slot="footer">
      custom footer
    </template>
  </compo-dialog>
</v-dialog>
<!-- large -->
<v-dialog
  v-model="dialogLarge"
  content-class="dialog-draggable is-lg"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="대형 Dialog"
    @hide="mixin_hideDialog('Large')"
    @submit="submitDialog('Large')"
  >

  </compo-dialog>
</v-dialog>
<!-- custom -->
<v-dialog
  v-model="dialogCustom"
  content-class="dialog-draggable is-scroll"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="개별 Dialog"
    @hide="mixin_hideDialog('Custom')"
    @submit="submitDialog('Custom')"
  >

  </compo-dialog>
</v-dialog>
<!-- Full -->
<v-dialog
  v-model="dialogFull"
  fullscreen
  hide-overlay>
  <compo-dialog
    header-title="전체화면 Dialog"
    @hide="mixin_hideDialog('Full')"
    @submit="submitDialog('Full')"
  >
  </compo-dialog>
</v-dialog>`
          },
          { tab: "script", content:
`export default {
  data() {
    return {
      dialogMedium: false,
      dialogLarge: false,
      dialogCustom: false,
      dialogFull: false,
    }
  },
  methods: {
    submitDialog(type){
      this[\`dialog\${type}\`] = false
      alert('완료');
    },
  }
}` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="mixin_showDialog('OrgTree')" >조직선택</v-btn>
<v-dialog
  v-model="dialogOrgTree"
  content-class="dialog-draggable"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="조직 선택"
    @hide="mixin_hideDialog('OrgTree')"
  >
    <template slot="body">
      <compo-tree
        :DataProp.sync="treeItems"
        :ExpandedProp=true
      />
    </template>
  </compo-dialog>
</v-dialog>`
          },
          { tab: "script", content:
`data() {
  return {
    dialogOrgTree: false,
    treeItems: [
      {
        id: 1,
        name: 'menu1 :',
        children: [
          { id: 2, name: 'menu1-1' },
          { id: 3, name: 'menu1-2' },
          { id: 4, name: 'menu1-3' },
        ],
      },
      {
        id: 5,
        name: 'menu2 :',
        children: [
          {
            id: 6,
            name: 'menu2-1 :',
            children: [
              {
                id: 7,
                name: 'menu2-1-1 :',
                children: [
                  { id: 8, name: 'menu2-1-1-1' },
                  { id: 9, name: 'menu2-1-1-2' },
                ],
              },
            ],
          },
          {
            id: 10,
            name: 'menu2-2 :',
            children: [
              {
                id: 11,
                name: 'menu2-2-1 :',
                children: [
                  { id: 12, name: 'menu2-2-1-1' },
                  { id: 13, name: 'menu2-2-1-2' },
                  { id: 14, name: 'menu2-2-1-3' },
                ],
              },
            ],
          },
        ],
      },
      ...
    ],
  }
},
methods: {
  expandAll(id){
    this.expanded = true;
    this.$refs[id].updateAll(true);
  },
  collapseAll(id){
    this.expanded = false;
    this.$refs[id].updateAll(false);
  },
}, ` },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="showRecDialog(REC_TEMP_DATA)" >녹취 파일 듣기</v-btn>
<!-- 녹취파일 modal -->
<compo-audio
  v-model="dialogListenVoice"
  :audioProp="REC_TEMP_DATA"
  AudioType="whole"
/>`
          },
          { tab: "script", content:
`data() {
  return {
    dialogListenVoice : false, //녹음 파일 재생 dialog
    //녹취 파일
    REC_TEMP_DATA: {
      "CUST_ID":"1132",
      "REC_FILE_NM":"20240119/1002-20240119-161248-IB-01047123585-1705648368.2626",
    },
  }
}
methods: {
  //녹취파일 듣기
  showRecDialog(item) {
    this.REC_TEMP_DATA={};
    this.REC_TEMP_DATA = item;
    this.mixin_showDialog('ListenVoice');
  },
}
computed: {

},` },
        ],
        srcInput_04: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="mixin_showDialog('NoticeDetail')" >공지 상세</v-btn>
<v-dialog
  v-model="dialogNoticeDetail"
  content-class="dialog-draggable is-scroll"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="공지사항"
    @hide="mixin_hideDialog('NoticeDetail')"
  >
    <template slot="body">
      <!-- component -->
      <compo-noti-detail
        :NotiDetailProp.sync="NotiDetail"
      />
    </template>
  </compo-dialog>
</v-dialog>`
          },
          { tab: "script", content:
`data() {
  return {
    //공지 상세
    NotiDetail: {
      subject : '센터 설립 기념일 행사 안내',
      count : 45,
      date : '2023-04-04',
      time : '13:45:43',
      manager: '나관리',
      text: '안녕하세요. 상담직원 여러분\n다가오는 2023년 2월 23일(목)은 센터 창립20주년 입니다.\n당일 아침 업무 시작 전에 간단하게 기념식 및 우수 상담직원 표창 등\n행사가 있을 예정입니다.\n평일보다 30분 일찍 출근 해 주시면 고맙겠습니다.\n\n감사합니다.',
      filelist: [
         {
          filename : '포인트 업종별 적립율 상세 정보.pdf',
          filesize : '1024KB',
          download : true,
          count : 35,
          downloadFile: 'test.pdf'
        },
        {
          filename : '포인트 업종별 적립율 상세 정보.pdf',
          filesize : '1024KB',
          download : false,
          count : 35,
          downloadFile: 'test2.pdf'
        },
      ],
    },
  }
}
methods: {

}
computed: {

},` },
        ],
        srcInput_05: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="mixin_showDialog('CusFind')" >고객 찾기</v-btn>
<v-btn class="pl-btn" @click="mixin_showDialog('UserFind')" >사용자 찾기</v-btn>
<!-- 고객 찾기 -->
<v-dialog
  v-model="dialogCusFind"
  content-class="dialog-draggable is-lg"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="고객 찾기"
    @hide="mixin_hideDialog('CusFind')"
  >
    <template slot="body">
      <!-- component -->
      <compo-find-cus
        :SearchDataProp="DropCus"
        :DataHeaderProp="HeadersFindCus"
        :SearchInputProp.sync="SearchInputCus"
        :DataBodyProp="ItemsFindCus"
        @fidnBtn="mixin_testLog('고객 찾기 버튼')"
        MultiSelYnProp="true"
      />
    </template>
    <template slot="footer">
      <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('CusFind')">닫기</v-btn>
      <v-btn class="pl-btn" @click="mixin_hideDialog('CusFind')">확인</v-btn>
    </template>
  </compo-dialog>
</v-dialog>
<!-- 사용자 찾기 -->
<v-dialog
  v-model="dialogUserFind"
  content-class="dialog-draggable is-lg"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="사용자 찾기"
    @hide="mixin_hideDialog('UserFind')"
  >
    <template slot="body">
      <!-- component -->
      <compo-find-cus
        SearchTitleProp="사용자 찾기"
        :SearchDataProp="DropUser"
        :SearchInputProp.sync="SearchInputCus"
        :DataHeaderProp="HeadersFindCus"
        :DataBodyProp="ItemsFindCus"
        @fidnBtn="mixin_testLog('사용자 찾기 버튼')"
        MultiSelYnProp="true"
      />
    </template>
    <template slot="footer">
      <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('UserFind')">닫기</v-btn>
      <v-btn class="pl-btn" @click="mixin_hideDialog('UserFind')">확인</v-btn>
    </template>
  </compo-dialog>
</v-dialog>`
          },
          { tab: "script", content:
`data() {
  return {
    //고객 찾기, 사용자 찾기
    DropCus: {
      stat: [ '전체', '정상', '휴면', '삭제' ],
      name: [ '고객명', '고객 ID' ],
    },
    DropUser: {
      stat: [ '전체', '재직', '휴직', '퇴직' ],
      name: [ '사용자명', '사용자 ID' ],
    },
    SearchInputUser: '',
    SearchInputCus: '',
    HeadersFindCus: [
      { text: '번호', value: 'index', align: 'center', width: '80px' },
      { text: '유형', value: 'type', align: 'center', width: '120px' },
      { text: '스크립트명', value: 'subject'},
      { text: '수정일', value: 'date', align: 'center', width: '120px' },
    ],

  }
}
methods: {

}
computed: {

},` },
        ],
        srcInput_06: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="mixin_showDialog('PlaceFind')" >위치 정보 보내기</v-btn>
<v-btn class="pl-btn" @click="mixin_showDialog('ContactsFind')" >연락처 정보 보내기</v-btn>
<!-- 위치 정보 -->
<v-dialog
  v-model="dialogPlaceFind"
  content-class="dialog-draggable"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="위치 정보 보내기"
    @hide="mixin_hideDialog('PlaceFind')"
  >
    <template slot="body">
      <!-- component -->
      <compo-send-info
        :SearchDataProp="DropPlace"
        :SearchInputProp.sync="SearchInputPlace"
        :DataHeaderProp="HeadersSendPlace"
        :DataBodyProp="ItemsSendPlace"
        :SelectedRadioProp.sync="SelectedSendPlace"
        @fidnBtn="mixin_testLog('위치 정보 보내기 버튼')"
      />
    </template>
    <template slot="footer">
      <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('PlaceFind')">닫기</v-btn>
      <v-btn class="pl-btn" @click="mixin_hideDialog('PlaceFind')">보내기</v-btn>
    </template>
  </compo-dialog>
</v-dialog>
<!-- 연락처 정보 -->
<v-dialog
  v-model="dialogContactsFind"
  content-class="dialog-draggable"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="연락처 정보 보내기"
    @hide="mixin_hideDialog('ContactsFind')"
  >
    <template slot="body">
      <!-- component -->
      <compo-send-info
        DataTypeProp="contacts"
        :SearchDataProp="DropContacts"
        :SearchInputProp.sync="SearchInputContacts"
        :DataHeaderProp="HeadersSendContacts"
        :DataBodyProp="ItemsSendContacts"
        :SelectedRadioProp.sync="SelectedSendContacts"
        @fidnBtn="mixin_testLog('연락처 정보 보내기 버튼')"
      />
    </template>
    <template slot="footer">
      <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('PlaceFind')">닫기</v-btn>
      <v-btn class="pl-btn" @click="mixin_hideDialog('PlaceFind')">보내기</v-btn>
    </template>
  </compo-dialog>
</v-dialog>`
          },
          { tab: "script", content:
`data() {
return {
  DropPlace: {
      code: [
      '11 서울특별시',
      '21 부산광역시',
      '22 대구광역시',
      '23 인천광역시',
      '24 광주광역시',
      '25 대전광역시',
      '26 울산광역시',
      '29 세종특별자시',
      '31 경기도',
      '32 강원도',
      '33 충청북도',
      '34 충청남도',
      '35 전락북도',
      '36 전라남도',
      '37 경상북도',
      '38 경상남도',
      '39 제주특별자치도',
      ],
    },
    HeadersSendPlace: [
      { text: '위치명', value: 'place', align: 'left', width: '100px', sortable: false },
      { text: '지역', value: 'area', align: 'left', width: '100px', sortable: false },
      { text: '주소', value: 'address', align: 'left',  sortable: false, },
    ],
    SearchInputPlace: '',
    ItemsSendPlace: [
      { index: 1, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
      { index: 2, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
      { index: 3, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
      { index: 4, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
      { index: 5, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
      { index: 6, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
      { index: 7, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
      { index: 8, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
      { index: 9, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
      { index: 10, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
      { index: 11, place: '한국클라우드', area: '서울특별시', address: '서울 금천구 서부샛길 606 대성디폴리스', },
    ],
    SelectedSendPlace: '문자',

    DropContacts: {
      code: [
      '11 서울특별시',
      '21 부산광역시',
      '22 대구광역시',
      '23 인천광역시',
      '24 광주광역시',
      '25 대전광역시',
      '26 울산광역시',
      '29 세종특별자시',
      '31 경기도',
      '32 강원도',
      '33 충청북도',
      '34 충청남도',
      '35 전락북도',
      '36 전라남도',
      '37 경상북도',
      '38 경상남도',
      '39 제주특별자치도',
      ],
    },
    SearchInputContacts: '',
    HeadersSendContacts: [
      { text: '연락처', value: 'contacts', align: 'left', width: '100px', sortable: false },
      { text: '지역', value: 'area', align: 'left', width: '100px', sortable: false },
      { text: '담당부서', value: 'parts', align: 'left', width: '100px', sortable: false,},
      { text: '담당업무', value: 'job', align: 'left', sortable: false,},
    ],
    ItemsSendContacts: [
      { index: 1, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
      { index: 2, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
      { index: 3, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
      { index: 4, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
      { index: 5, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
      { index: 6, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
      { index: 7, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
      { index: 8, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
      { index: 9, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },
      { index: 10, contacts: '02-1234-4321', area: '서울특별시', parts: '고객만족센터', job: '고객불만 및 민원처리' },

    ],
    SelectedSendContacts: '카카오톡',
  }
}
methods: {

}
computed: {

},` },
        ],
        srcInput_07: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="mixin_showDialog('FindParts')" >확장 항목 찾기</v-btn>
<v-dialog
  v-model="dialogFindParts"
  content-class="dialog-draggable is-lg is-nopadding"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="확장 항목 찾기"
    @hide="mixin_hideDialog('FindParts')"
  >
    <template slot="body">
      <!-- component -->
      <compo-find-parts
        :SearchInputProp.sync="SearchInputParts"
        :DataBodyProp="ItemsFindParts"
        @fidnBtn="mixin_testLog('확장 항목 찾기 버튼')"
      />
    </template>
  </compo-dialog>
</v-dialog>`
          },
          { tab: "script", content:
`data() {
  return {
    ItemsFindParts: [
      {
        type: 'string',
        name : '홍길동',
        name_code : 'CUST_NM',
        parts_property: '문자형',
        parts_long: 40,
        btn_enable: false,
      },
      {
        type: 'number',
        name : '홍길동',
        name_code : 'CUST_NM',
        parts_property: '문자형',
        parts_long: 40,
        btn_enable: false,
      },
      ...
    ]
  }
}
methods: {

}
computed: {

},` },
        ],
        srcInput_08: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="mixin_showDialog('FindIndex')" >공통 코드 찾기</v-btn>
<v-dialog
  v-model="dialogFindIndex"
  content-class="dialog-draggable is-lg is-nopadding"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="공통 코드 찾기"
    @hide="mixin_hideDialog('FindIndex')"
  >
    <template slot="body">
      <!-- component -->
      <compo-find-Index
        :SearchInputProp.sync="SearchInputIndex"
        :DataHeaderProp="HeadersFindIndex"
        :DataBodyProp="ItemsFindIndex"
        :DataHeaderSubProp="HeadersFindIndexSub"
        :DataBodySubProp="ItemsFindIndexSub"
        @fidnBtn="mixin_testLog('공통 코드 찾기 버튼')"
        @selected-item="SearchIndexItemSelected"
      />
    </template>
  </compo-dialog>
</v-dialog>`
          },
          { tab: "script", content:
`data() {
  return {
    SearchInputIndex: '',
    HeadersFindIndex: [
      { text: '번호', value: 'index', align: 'center', width: '80px', sortable: false },
      { text: '공통 분류코드', value: 'code', align: 'left', width: '120px', sortable: false },
      { text: '분류코드 명', value: 'code_name', align: 'left', },
      { text: '사용여부', value: 'use', align: 'left', width: '100px', sortable: false },
      { text: '선택', value: 'selected', align: 'center', width: '100px', sortable: false },
    ],
    ItemsFindIndex: [
      { index: '1', code : 'CB00001', code_name : '아웃바운드 계획 세부구분', use: '사용', selected: true, },
      ...
    ],
    HeadersFindIndexSub: [
      { text: '번호', value: 'index', align: 'center', width: '60px', sortable: false },
      { text: '공통코드', value: 'code', align: 'left', width: '80px', sortable: false },
      { text: '공통코드 명', value: 'code_name', align: 'left', sortable: false },
      { text: '사용여부', value: 'use', align: 'left', width: '60px', sortable: false },
    ],
    ItemsFindIndexSub: [
      { index: '1', code : 'CB00001', code_name : '아웃바운드 계획 세부구분', use: '사용', },
      ...
    ],
  }
},
methods: {
  SearchIndexItemSelected(item) {
    console.log(\`공통코드 선택된 아이템 \${item.index}\`);
  }
}
computed: {

},` },
        ],
        srcInput_09: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="mixin_showDialog('ChatLog1')" >상담이력(전화) 열기</v-btn>
<v-btn class="pl-btn" @click="mixin_showDialog('ChatLog2')" >상담이력(SNS) 열기</v-btn>
<v-btn class="pl-btn" @click="mixin_showDialog('ChatLog3')" >대화내용 열기</v-btn>
<!-- 상담이력(전화) -->
<v-dialog
  v-model="dialogChatLog1"
  content-class="dialog-draggable"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="상담이력"
    @hide="mixin_hideDialog('ChatLog1')"
  >
    <template slot="body">
      <!-- component -->
      <compo-chat-log
        :custInfoProp="CHAT_INFO"
        :cuttInfoProp="CUTT_HIST"
      />

    </template>
  </compo-dialog>
</v-dialog>
<!-- 상담이력(SNS) -->
<v-dialog
  v-model="dialogChatLog2"
  content-class="dialog-draggable"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="상담이력"
    @hide="mixin_hideDialog('ChatLog2')"
  >
    <template slot="body">
      <!-- component -->
      <compo-chat-log
        :custInfoProp="CHAT_INFO"
        :cuttInfoProp="CUTT_HIST"
        :ChatLogProp="CHAT_LOG"
        TalkProp
      />
    </template>
  </compo-dialog>
</v-dialog>
<!-- 대화내용 -->
<v-dialog
  v-model="dialogChatLog3"
  content-class="dialog-draggable"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="대화내용"
    @hide="mixin_hideDialog('ChatLog3')"
  >
    <template slot="body">
      <!-- component -->
      <compo-chatting
        :ChatLogProp="CHAT_LOG"
      />
    </template>
  </compo-dialog>
</v-dialog>`
          },
          { tab: "script", content:
`data() {
return {
  CHAT_LOG: [
    {"TYPE":"GENMSG",
    "SNDRCV_CD":"SND",
    "IMAGE_URL":"/upload/images/chat/[상담내용]을 입력해주시면 잠시후에 상담을 시작합니다. 상담을 종료하시려면 !종료 를 입력해주세요.",
    "CONTENT":"[상담내용]을 입력해주시면 잠시후에 상담을 시작합니다. 상담을 종료하시려면 !종료 를 입력해주세요.",
    "CHAT_DATE":"2023-10-18 18:00:19"},
    {"TYPE":"TX",
    "SNDRCV_CD":"SND",
    "IMAGE_URL":"/upload/images/chat/금칙어 사용",
    "CONTENT":"@@어 사용",
    "CHAT_DATE":"2023-10-18 18:00:25"},
    {"TYPE":"text",
    "SNDRCV_CD":"RCV",
    "IMAGE_URL":"금칙어",
    "CONTENT":"@@어",
    "CHAT_DATE":"2023-10-18 18:00:34"},
    {"TYPE":"text",
    "SNDRCV_CD":"RCV",
    "IMAGE_URL":"금칙어 적용 잘되네",
    "CONTENT":"@@어 적용 잘되네",
    "CHAT_DATE":"2023-10-18 18:01:01"},
    {"TYPE":"photo",
    "SNDRCV_CD":"RCV",
    "IMAGE_URL":"https://talk.kakaocdn.net/dna/c7u6rO/o0kr3QZwsm/CPAnlM74B3RbbItyPvORec/i_1db640b91061.png?credential=zf3biCPbmWRjbqf40YGePFLewdou7TIK&expires=1699434052&signature=8BAqiVvCzLASJGXBEG0SIfOe%2FL0%3D",
    "CONTENT":"https://talk.kakaocdn.net/dna/c7u6rO/o0kr3QZwsm/CPAnlM74B3RbbItyPvORec/i_1db640b91061.png?credential=zf3biCPbmWRjbqf40YGePFLewdou7TIK&expires=1699434052&signature=8BAqiVvCzLASJGXBEG0SIfOe%2FL0%3D",
    "CHAT_DATE":"2023-10-18 18:01:26"}
  ],

  CHAT_INFO: {
    "CAUTION_CUST_FNDWAY": "AAAA",
    "CAUTION_CUST_CD": "3",
    "CAUTION_CUST_RGTR_NM": "나관리",
    "MDFR_NM": "시스템",
    "RGTR_ID": "2",
    "MDFR_ID": "2",
    "RGTR_NM": "시스템",
    "CAUTION_CUST_MDFR_ID": "1",
    "CAUTION_CUST_MDFR_NM": "나관리",
    "CAUTION_VLD_BGNG_DT": "20230818000000",
    "CUST_NM": "또추가김태준",
    "MDFCN_DT": "20231025093633",
    "REG_DT": "20230705154532",
    "CAUTION_CUST_REG_DT": "20230803142610",
    "CAUTION_VLD_END_DT": "20230818000000",
    "CUST_PHN_NO": "01054161796",
    "CAUTION_CUST_YN": "N",
    "CAUTION_CUST_MDFCN_DT": "20230818101804",
    "CAUTION_CUST_RGTR_ID": "1",
    "CUST_ID": "729",
    "CHNL": "CHAT",
    "portrait": "",
    "CAUTION_CUST_CHECKED": false,
    "CUST_EMAIL": "test@naver.com"
  },

  CUTT_HIST: {
    "CUSL_NM":"나관리",
    "ITGRT_HSTRY_ID":"1360962",
    "ICON":"1696656437579-3f3a349b29b740d983a4bf4eac9cfddc",
    "CUTT_TYPE_ID":"30",
    "TYPE":"kakao",
    "CL_TYPE_CD":"IN",
    "CUTT_CN":"금칙어 테스트",
    "CUTT_BGNG_DT":"20231018180022",
    "REC_FILE_NM":"",
    "REG_DT":"20231018180019",
    "PRCS_RSLT_NM":"완료",
    "CHT_CUTT_ID":"731",
    "TWB_PAGING_TOT_COUNT":"1506",
    "ROW_NUMBER":"1",
    "CHN_CLSF_NM":"카카오톡",
    "PHN_CUTT_ID":"0",
    "FULL_PATH":"상담유형1 > 상담유형1-1",
    "PRCS_RSLT_CD":"CMPL",
    "CUSL_IMG":"/upload/images/profile/2023/10/07/1696656437595_ed843e57db7f44b89677ff1df9211628.png",
    "CHN_TYPE_NM":"SNS",
    "CL_TYPE_NM":"인바운드",
    "CUTT_END_DT":"20231018180129",
    "PHN_HR":"67.000000",
    "CUSL_ID":"1",
    "CHN_CLSF_CD":"KAKAO",
    "FULL_PATH_TEMP":"상담유형1 > 상담유형1-1",
    "status":"cs",
    "TalkProp":true
  },
}
methods: {
}
computed: {
},` },
        ],
        srcInput_10: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="mixin_showDialog('Voc')" >VOC 접수 열기</v-btn>
<!-- dialog -->
<v-dialog
  v-model="dialogVoc"
  content-class="dialog-draggable is-lg is-nopadding"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="VOC 접수"
    @hide="mixin_hideDialog('Voc')"
  >
    <template slot="body">
      <!-- component -->
      <compo-voc
        ref="vocDataCompo"
      />
    </template>
    <template slot="footer">
      <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('Voc')">닫기</v-btn>
      <v-btn class="pl-btn" @click="sendVocData">보내기</v-btn>
    </template>
  </compo-dialog>
</v-dialog>`
          },
          { tab: "script", content:
`data() {
  return {
    dialogVoc: false,
    VOC_DATA: '',
  }
},
methods: {
  sendVocData() {
    const data = this.$refs.vocDataCompo.saveVocData();
    return this.VOC_DATA = data;
  },
},
computed: {

},` },
        ],
        srcInput_11: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="mixin_showDialog('FindPost')" >우편번호찾기</v-btn>
<v-dialog
  v-model="dialogFindPost"
  content-class="dialog-draggable is-lg"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="우편번호 검색"
    @hide="mixin_hideDialog('FindPost')"
  >
    <template slot="body">
      <!-- component -->
      <compo-find-post
        @selected-post="getFindPost"
      />
    </template>
  </compo-dialog>
</v-dialog>`
          },
          { tab: "script", content:
`data() {
  return {
    dialogFindPost: false,
    POST_DATA: '',

  }
},
methods: {
  getFindPost(data) {
    this.POST_DATA = data;
  },
},
computed: {

},` },
        ],
        srcInput_12: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="mixin_showDialog('Transfer')" >호전환</v-btn>
<v-dialog
  v-model="dialogTransfer"
  content-class="dialog-draggable is-lg is-nopadding"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="호전환"
    @hide="mixin_hideDialog('Transfer')"
  >
    <template slot="body">
      <!-- component -->
      <compo-transfer
        :DataProp="TRANSFER_DATA"
      />
    </template>
  </compo-dialog>
</v-dialog>`
          },
          { tab: "script", content:
`data() {
  return {
    // 호전환
    TRANSFER_DATA: {
    },
  }
},
methods: {

},
computed: {

},` },
        ],
        srcInput_13: [
          {
            tab: "html",
            content:
`<div class="guide-gap">
  <v-btn class="pl-btn" @click="mixin_showDialog('OutCall')" >전화걸기</v-btn>
  <v-btn class="pl-btn" @click="mixin_showDialog('InCall')" >전화받기</v-btn>
</div>
<!-- 전화걸기 -->
<v-dialog
  v-model="dialogOutCall"
  content-class="dialog-draggable is-call"
  persistent
  no-click-animation
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="전화 걸기"
    @hide="mixin_hideDialog('OutCall')"
  >
    <template slot="body">
      <!-- component -->
      <compo-out-call
        :DataProp="OUT_CALL_DATA"
      />
    </template>
    <template slot="footer">
      <ul class="pl-list-info mt-0">
        <li>고객 조회 후 연락처가 있는 경우 수신번호는 변경할 수 없습니다.</li>
      </ul>
    </template>
  </compo-dialog>
</v-dialog>
<!-- 전화받기 -->
<v-dialog
  v-model="dialogInCall"
  content-class="dialog-draggable is-call type-in"
  persistent
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="전화 받기"
    @hide="mixin_hideDialog('InCall')"
  >
    <template slot="body">
      <!-- component -->
      <compo-in-call
        :DataProp="IN_CALL_DATA"
        :custInfoProp="CUST_INFO_DATA"
      />
    </template>
    <template slot="footer">
      <ul class="pl-list-info mt-0">
        <li>신규 고객의 경우 회사명은 표시되지 않습니다.<br/>수신된 전화를 다른 상담원에게 전환을 하실 경우 내선번호를 입력하여야 합니다. </li>
      </ul>
    </template>
  </compo-dialog>
</v-dialog>`
          },
          { tab: "script", content:
`data() {
  return {
    // 전화 걸기, 받기
    OUT_CALL_DATA: {
      dropItems: [],
      dropItems2: [],
      give_number: '010-5303-0000'
    },
    IN_CALL_DATA: {
      company: '한국 클라우드',
      phone: '010-0000-0000',
      desc: '카드 발급 문의',
    },
    CUST_INFO_DATA: {
      CAUTION_CUST_YN: 'Y',
      VIP_CUST_YN: false,
    },
  }
},
methods: {

},
computed: {

},` },
        ],
        srcInput_14: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="mixin_showDialog('ImgSend')" >이미지 전송</v-btn>
<v-dialog
  v-model="dialogImgSend"
  content-class="dialog-draggable is-lg is-nopadding"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="이미지 전송"
    @hide="mixin_hideDialog('ImgSedialogImgSend')"
  >
    <template slot="body">
      <div class="pl-cols">
        <!-- tree -->
        <div class="is-col-fix is-vrt" style="width: 300px">
          <div class="pl-card">
            <div class="pl-tree-header">
              <div class="is-left">
                <label>기본 메뉴</label>
              </div>
              <div class="is-right">
                <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
                <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
              </div>
            </div>
            <div class="pl-tree-body">
              <v-treeview ref="treeDefault" :items="img_treeItems" :open-all="expanded" activatable open-on-click color="secondary" class="pl-tree-view">
                <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="item.children">
                      {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
                  </v-icon>
                  <v-icon v-else>
                      {{ 'pl-icon20 tree-file' }}
                  </v-icon>
                </template>
              </v-treeview>
            </div>
          </div>
        </div>
        <!-- img grid -->
        <div class="pl-card">
          <h1 class="pl-subtit d-flex">
            가입 안내
            <div class="ml-auto">
              <v-text-field
                class="pl-form is-search"
                placeholder="검색어 입력"
                @keydown.enter="mixin_testLog('search btn')"
              >
              <template v-slot:append>
                <v-btn
                  @click="mixin_testLog('search btn')"
                  class="pl-btn has-icon-only">
                  <span class="pl-icon20 in-search"></span>
                </v-btn>
              </template>
            </v-text-field>
            </div>
          </h1>
          <div>
            <v-data-table
              class="pl-grid type-hover-func type-img is-mt-m"
              :headers="headers"
              :items="items"
              hide-default-header
              item-key="index"
              height="500px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              @page-count="pageCount = $event">
              <template v-slot:item="{ item }">
                <div
                  class="pl-img-grid-unit"
                  :class="mixin_getItemClass(item)"
                  @mouseover="mixin_hoverItem(item,'items')"
                  @mouseleave="mixin_leaveItem(item,'items')"
                >
                  <div>
                    <img
                      :src="item.img"
                      :alt="item.title"
                      class="pl-img-grid-unit-img"
                    />
                  </div>
                  <div class="pl-img-grid-unit-title">
                    {{ item.title }}
                    <div>{{ item.category }}</div>
                  </div>
                  <div class="grid-hover-func-wrap">
                    <v-btn class="pl-btn is-sub is-sm" @click="chat_img_expand(item.img)">원본 보기</v-btn>
                    <v-btn class="pl-btn is-sub is-sm" @click="">선택</v-btn>
                  </div>
                </div>
              </template>
            </v-data-table>
          </div>
        </div>
      </div>
    </template>
  </compo-dialog>
</v-dialog>
<!-- 이미지 확대 다이얼로그 -->
<v-dialog
  v-model="dialogImgExpand"
  content-class="dialog-draggable"
  hide-overlay>
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="이미지"
    @hide="mixin_hideDialog('ImgExpand')"
  >
    <template slot="body">
      <!-- component -->
      <img
        :src="expandImgUrl"
        class="pl-chatting-log-img-expand"
        />
    </template>
  </compo-dialog>
</v-dialog>`
          },
          { tab: "script", content:
`data() {
  return {
    expanded: false,
      img_treeItems: [
        {
          id: 1,
          name: 'menu1 :',
          children: [
            { id: 2, name: 'menu1-1' },
            { id: 3, name: 'menu1-2' },
            { id: 4, name: 'menu1-3' },
          ],
        },
        ...
      ],
      page: 1,
      pageCount: 0,
      ROW_PER_PAGE: 15,
      headers: [
        { text: '타이틀', value: 'title', align: 'center', },
        { text: '이미지', value: 'img', align: 'center', },
      ],
      items: [
        {
          index: 1,
          img: require('@/assets/img/@sample2.png'),
          title: '가입 신청서' ,
          category: '카드 > 신청 > 양식',
        },
        ...
      ],
      expandImgUrl: '',
      editedIndex: -1,
      hoverRow: null,

  }
},
methods: {
  expandAll(id){
    this.expanded = true;
    this.$refs[id].updateAll(true);
  },
  collapseAll(id){
    this.expanded = false;
    this.$refs[id].updateAll(false);
  },
  chat_img_expand(img) {
    this.expandImgUrl = img;
    this.mixin_showDialog('ImgExpand')
  },
},
computed: {

},` },
        ],






      },
    }
  },
  methods: {
    submitDialog(type){
      this[`dialog${type}`] = false
      alert('완료');
    },
    SearchIndexItemSelected(item) {
      // console.log(`공통코드 선택된 아이템 ${item.index}`);
    },
    //조직
    setOgnzData() {
      this.OGNZ_DATA = this.$refs.ognzDataCompo.setOgnzData();
      // console.log('조직 선택된 아이템', this.OGNZ_DATA);
    },
    // VOC
    sendVocData() {
      const data = this.$refs.vocDataCompo.saveVocData();
      return this.VOC_DATA = data;
    },

    //우편번호 찾기
    getFindPost(data) {
      this.POST_DATA = data;
    },

    // 이미지 전송
    expandAll(id){
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false);
    },
    chat_img_expand(img) {
      this.expandImgUrl = img;
      this.mixin_showDialog('ImgExpand')
    },

    //녹취 파일듣기
    //녹취파일 듣기
    showRecDialog(item) {
      this.REC_TEMP_DATA={};
      this.REC_TEMP_DATA = item;
      this.mixin_showDialog('ListenVoice');
    },
  },
  computed: {
  },
  created() {
  },
  mounted() {
    guideJs.appendHiddenLink(this.toplink);
  }
};

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>