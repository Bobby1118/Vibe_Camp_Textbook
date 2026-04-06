# Month 2: 유니티 엔진과 OOP의 결합

## Week 1: 💓 생명 주기의 감별사 (Lifecycle)

축하합니다! C#의 딱딱한 문법 세계를 무사히 통과하셨습니다. 이번 2개월 차부터는 여러분이 배운 클래스와 함수가 **유니티 엔진(Unity)** 안에서 어떻게 생명을 얻고 살아 숨 쉬는지, 그 **"심장 박동(Lifecycle)"**을 완전히 통제하는 법을 배웁니다. 이것을 모르면 AI가 짜준 코드가 이유도 없이 프레임을 깎아 먹거나 폰을 손난로로 만들어 버립니다!

---

### 📅 [Day 1] Awake vs Start - 출생신고와 첫 등교

#### 📖 1. 예습 (시간의 순서가 삶과 죽음을 결정한다)
> **👼 병원 출생신고(`Awake`) vs 🏫 유치원 첫 등교 인사(`Start`)**
> 
> "고블린이 태어날 때 사운드 매니저에게 소리를 뿜으라고 한다"는 로직을 어디에 써야 할까요? 유니티에는 게임이 켜질 때 딱 한 번 실행되는 2대장 함수가 있습니다. 바로 `Awake`와 `Start`입니다.
> 
> *   **`Awake` (출생신고):** 눈도 못 뜬 아기. 씬이 열리면 **무조건 최우선**으로 1번 실행됩니다. 이때는 뇌(메모리)에 "내 HP 공간, 내 스피드 공간"을 박아넣는 지독하게 이기적인 **내부 세팅**만 해야 합니다.
> *   **`Start` (유치원 등교):** 눈을 뜨고 밥을 먹은 뒤. 모든 몬스터의 앞선 `Awake`가 전부 끝난 직후 실행됩니다. 이때부터 비로소 **남들과 상호작용**이 가능합니다. (예: 사운드 매니저에게 소리 내달라고 요청하기)

#### 🚨 2. 문제와 함정 (AI의 타이밍 버그)
AI에게 "고블린 생성 시 총알 매니저에게 총알 세팅을 받아와라"라고 했더니 아래처럼 짰습니다.

```csharp
public class Goblin : MonoBehaviour 
{
    private BulletManager manager;

    // AI의 치명적 만행: 눈도 못 뜬 신생아에게 심부름을 시킴!
    void Awake() 
    {
        manager = GameObject.Find("Manager").GetComponent<BulletManager>();
        manager.GiveDefaultBullet(); 
    }
}
```
**🤔 이게 왜 지옥을 부르나요?**
`Awake`는 신생아입니다. 만약 저 `BulletManager` 스크립트도 자기 자신의 `Awake`에서 총알 데이터를 1번 세팅해야 하는데, 고블린이 우연히 0.001초 먼저 태어나서 매니저한테 총알을 내놓으라고 멱살을 잡으면? 
매니저는 아직 세팅이 안 된 백지상태라 그 악명 높은 **`NullReferenceException (아무것도 없는데요?!)`** 에러를 뿜으며 화면이 정지됩니다!

#### ✅ 3. 모범 답안 (이기주의와 이타주의 룰)
```csharp
public class Goblin : MonoBehaviour 
{
    private BulletManager manager;

    // [이기주의의 시간] 나 자신의 메모리만 세팅한다! 남한테 절실한 걸 요구하지 마라!
    void Awake() 
    {
        Debug.Log("나 고블린 방금 세상에 태어남. 내장 메모리 공간 확보 완료.");
    }

    // [이타주의의 시간] 모든 Awake가 끝나 세상이 안정화되면 그때 외부에 말을 건다.
    void Start() 
    {
        manager = GameObject.Find("Manager").GetComponent<BulletManager>();
        manager.GiveDefaultBullet(); 
    }
}
```

#### 🗣️ 4. 지휘관의 프롬프팅
> **"야 AI! `Awake` 안에서 외부 오브젝트(`Manager`) 끄집어내서 함수 부르는 미친 짓 하지 마라! 순서 꼬여서 NullReference 터지니까, 무조건 나 혼자 초기화하는 건 `Awake`, 남이랑 통신 시작하는 건 `Start`로 칼같이 분리해!"**

---

### 📅 [Day 2] Update의 굴레 - 1초에 60번 뛰는 심장

#### 📖 1. 예습 (미친 심박동과 바윗덩어리)
> **❤️ 1초에 60번 요동치는 거대한 펌프 질**
> 
> `Update` 함수는 유니티 엔진의 핵심 심장입니다. 유니티는 화면을 부드럽게 보여주기 위해(60FPS), 이 중괄호 `{ }` 안의 코드를 **1초에 무조건 60번 이상** 무자비하게 후드려팹니다! 
> 이곳은 **캐릭터의 이동 방향키 처리, 마우스 좌클릭 감지** 같은 초당 실시간 반응이 필요한 아주 가벼운 코드만 살 수 있는 성역입니다.

#### 🚨 2. 문제와 함정 (심장마비 렉)
```csharp
public class Player : MonoBehaviour 
{
    // 심장에 낀 바위! 폰을 액체로 녹여버릴 발열의 주범!
    void Update() 
    {
        // 1초에 60번씩 서울 한복판에서 "김서방(Dragon)"을 미친듯이 찾아 헤맴!!
        GameObject boss = GameObject.Find("Dragon"); 
        
        if (Input.GetKeyDown(KeyCode.Space)) {
            boss.GetComponent<Dragon>().TakeDamage(10);
        }
    }
}
```
**🤔 디렉터의 분노 지점**
`GameObject.Find`는 컴퓨터의 모든 메모리 주소를 싹 다 다 뒤지는 어마어마하게 무거운 노가다 작업입니다. 이걸 `Update`에 넣는 것은, 1초에 60번씩 **1만 페이지짜리 영한사전을 처음부터 끝까지 다 읽고 드래곤을 찾으라고 시키는 것**과 같습니다. 게임 프레임은 10으로 곤두박질치고 폰은 손난로가 됩니다.

#### ✅ 3. 모범 답안 (캐싱: 미리 기억해 두기)
```csharp
public class Player : MonoBehaviour 
{
    private Dragon boss; // 기억해둘 공간 (메모지)

    // 태어날 때 딱! 한 번만 서울에서 김서방을 찾아서 지갑에 전화번호를 적어둔다. (캐싱)
    void Start() 
    {
        boss = GameObject.Find("Dragon").GetComponent<Dragon>();
    }

    // 1초에 60번 뛸 때는 깃털처럼 가볍게 키를 눌렀는지만 판별!
    void Update() 
    {
        if (Input.GetKeyDown(KeyCode.Space)) 
        {
            boss.TakeDamage(10); // 주머니 메모지에 있는 다이렉트 콜! 렉 0%!
        }
    }
}
```

#### 🗣️ 4. 지휘관의 프롬프팅
> **"AI! `Update` 안에다가 `Find`나 `GetComponent` 같은 무거운 탐색 함수 박아넣는 최적화 테러 할래? 당장 싹 다 빼서 `Start`에 캐싱(Caching)해 두고 쓰라고!"**

---

### 📅 [Day 3] FixedUpdate - 물리 엔진과 헛도는 톱니바퀴

#### 📖 1. 예습 (화면 엔진 vs 물리 엔진)
> **🎨 물감 칠하기(`Update`) vs 🌍 뉴턴의 법칙(`FixedUpdate`)**
> 
> 고해상도 그래픽과 렉 치안 상태에 따라, **`Update`는 1초에 30번 뛸 수도, 120번 뛸 수도 있는 고무줄 엔진**입니다. 여기서 리지드바디(`Rigidbody`, 물리엔진 중력)를 밀면 어떨 때는 세게 밀리고 어떨 때는 약하게 밀리는 기묘한 "벽 뚫고 나가기 버그"가 발생합니다!
> 
> 유니티는 물리 연산 붕괴를 대비해 **절대적인 철시계, `FixedUpdate` (일반적으로 0.02초, 1초에 정확히 50번 확정 고정)**를 만들어 두었습니다. 점프, 밀기, 폭발 반동 같은 무거운 물리적 힘은 무조건 이 규칙적인 철시계 안에서 관리해야 합니다!

#### ✅ 2. 룰북
- **`Update`:** 키보드, 마우스 입력 감지 🎮
- **`FixedUpdate`:** Rigidbody를 이용한 물리력 적용 💥
- **🚨 치명적 씹힘 버그:** 마우스 입력 감지를 `FixedUpdate`에서 받으려 하면, 철시계의 간격(0.02초) 틈새에 클릭했을 때 입력을 못 받고 씹혀버립니다!

```csharp
public class Player : MonoBehaviour 
{
    private Rigidbody rb;
    private bool jumpPressed = false;

    void Start() { rb = GetComponent<Rigidbody>(); }

    // [화면 엔진] 물감 칠하듯 빠르게 스위치 켜진지만 체크 (씹힘 방지)
    void Update() {
        if (Input.GetButtonDown("Jump")) { jumpPressed = true; }
    }

    // [물리 엔진] 0.02초마다 도는 철시계가 돌아갈 때 정확한 힘으로 밀어냄!
    void FixedUpdate() {
        if (jumpPressed) {
            rb.AddForce(Vector3.up * 500f);
            jumpPressed = false; // 일 끝났으면 스위치 리셋!
        }
    }
}
```

---

### 📅 [Day 4] OnDestroy / OnDisable - 죽음의 뒷모습과 청소부

#### 📖 1. 예습 (폭파 직전의 마지막 유언장)
> **🧹 떠날 때 방을 안 치우면 쓰레기장이 된다**
> 
> 오브젝트가 삭제될 때(`Destroy`), 유니티는 자비롭게도 완전히 존재가 삭제되기 0.001초 전에 실행할 수 있는 유언장 함수를 열어줍니다. 바로 `OnDestroy` (파괴 시) 와 `OnDisable` (비활성화 시) 입니다.
> 여기서 다른 쪽에서 맺어둔 통신망 연결을 안 끊고 죽어버리면, 컴퓨터는 주인이 죽었는데도 영원히 허공에 전기를 쏘는 **좀비 레퍼런스 누수(Memory Leak)**에 시달립니다.

#### 🗣️ 2. 지휘관의 프롬프팅
> **"객체 날릴 때는 무조건 `OnDestroy` 열어서 구독했던 UI 델리게이트 이벤트들 `-=` 처리해서 모조리 구독 취소시키고, 허공에 도는 좀비 타이머 코루틴들 당장 폭발하도록 세팅해라!"**

---

### 📅 [Day 5] 🕹️ 미니 프로젝트 & 지옥의 프레임 체험

이번 미니 프로젝트에서는 **"나쁜 코드의 렉 유발"**을 눈으로 보겠습니다!

#### 🎮 [미니 프로젝트] 1초에 6,000번 찾아라! 지옥의 렉 체험
1.  **준비:** 유니티 씬에 빈 큐브(Cube)를 생성하고 이름을 `BossCube` 라 적습니다.
2.  **클론 부대:** 빈 게임오브젝트를 100개 복사(`Ctrl+D`)해서 씬에 쫙 깝니다.
3.  **코드 작성:** 100개의 빈 오브젝트 전체에 아래 `HellUpdate` 스크립트를 박아 넣습니다.
```csharp
using UnityEngine;

public class HellUpdate : MonoBehaviour 
{
    void Update() 
    {
        // 최악의 끔찍한 바위!
        // 100명이 1초에 60번씩 메모리 전체를 다 털며 "BossCube"를 찾습니다. 
        // 총 1초에 6,000번 호출! 컴퓨터 비명 소리 강제 달성!
        GameObject myBoss = GameObject.Find("BossCube");
        
        // 회피 기동: 이 주석을 풀고 위 노가다 코드를 죽이면 렉이 즉시 증발하는 기적 체험!
        // Debug.Log("난 캐싱을 할 줄 아는 우월한 디렉터");
    }
}
```
4.  **쾌감의 순간:** 플레이(▶)를 누르고 유니티 우측 상단 `Stats` 탭을 눌러 **FPS(프레임)** 수치를 보십시오. 이 2줄짜리 코드가 겜을 어떻게 파괴하는지 목격한 뒤, **캐싱(Start로 옮기기)**의 위대함을 체감합시다.

---

#### 🧩 Week 1 종합 방탈출 퀴즈
1. "야 AI! 메모리 참조(할당)는 무조건 제일 먼저 뜨는 **`____(1)`** 에 세팅하고, 다른 시스템 스크립트랑 통신해서 값 주고받는 건 씬 로딩 완전히 끝난 직후인 **`____(2)`** 에 쑤셔 넣어!"
2. "매 프레임마다 마우스 좌클릭 입력 체크해야 하는 가벼운 코드는 **`____(3)`** 에 쓰는데, 몬스터가 로켓 점프하는 반동 물리력 작용은 무조건 일정 주기의 철시계인 **`____(4)`** 에 넣어 놔!"
