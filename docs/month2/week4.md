# Month 2: 유니티 엔진과 OOP의 결합

## Week 4: ⏰ 에디터 커플링 탈출 미션 (타이머와 알람 시계)

드디어 Month 2의 마지막 과제입니다. 수많은 초보 프로그래머와 AI가 가장 똥을 많이 싸는 구역, 바로 **'시간의 흐름 분리'** 입니다. 무조건 `Update` 하나에 모든 걸 쑤셔 넣는 **Update 커플링(Coupling) 종속성**을 부수고, 우아하게 시간 타이머를 백그라운드에 던져놓고 단잠을 자는 기법을 배웁니다.

---

### 📅 [Day 1] 시간에 쫓기는 Update의 재앙

#### 📖 1. 예습 (불침번 서는 경계병)
> **🥵 "3초 뒤에 독 데미지를 10 넣고 싶습니다!"**
> 
> 하수 프로그래머나 멍청한 AI는 이 로직을 짤 때 무식하게 `Update` 심박동에 카운터 변수를 탑재합니다.
> `time += Time.deltaTime;` (시간 측정기)
> 코드는 이렇게 작동합니다. "지금 1초 지났어? 아니." (1초 60번 반복) "어! 3초 지났다!! 데미지!!"
> 이건 마치 라면 물 올려놓고 **가스레인지 앞에서 눈도 안 깜빡이고 3분 동안 초침을 세고 있는 미련한 불침번 행위**입니다. `Update` 함수가 거대해질수록 프레임(렉)이 박살 납니다.

#### 🚨 2. 문제와 함정 (Update 거대화)
```csharp
public class PoisonState : MonoBehaviour 
{
    private float poisonTimer = 0f;

    void Update() 
    {
        // 1초에 60번씩 숫자를 계속 무의미하게 강제 누적함
        poisonTimer += Time.deltaTime; 

        if (poisonTimer >= 3f) 
        {
            TakeDamage(10);
            poisonTimer = 0f; // 초기화
        }
    }
}
```

---

### 📅 [Day 2] Invoke - 5분 뒤 라면 불끄기 제일 쉬운 알람

#### 📖 1. 예습 (스마트 알람시계)
> **⏰ "AI야, 라면 불 올려놓고 스마트 알람 3분 맞춘 다음에 침대 가서 자라!"**
> 
> 유니티는 타이머만을 위한 전용 비서 스킬을 제공합니다. 바로 **`Invoke("함수이름", 지연시간)`** 입니다. 
> 호출 즉시 3초 타이머 알람시계를 공중에 던져놓고, 스크립트 본체는 할 일 다 하고 쉽니다. 3초가 땡! 울리는 순간 저 지정된 함수가 번쩍! 하고 독립 실행됩니다.

#### ✅ 2. 스마트 알람 독해
```csharp
public class PoisonState : MonoBehaviour 
{
    void Start() 
    {
        // [문장 1 독해] "야! 3초 뒤에 DoPoison 함수 알아서 때려 줘! 난 여기서 Update 안 부르고 잘래!"
        Invoke("DoPoison", 3f); 
    }

    void DoPoison() 
    {
        TakeDamage(10);
        // 여기서 다시 Invoke("DoPoison", 3f); 를 부르면 3초 알람이 재장전되는 무한 루프 가능!
    }
}
```
**💡 주의점:** `Invoke` 안의 함수 이름은 반드시 **문자열("쌍따옴표")**로 적어야 합니다. 오타가 나면 알람이 안 울립니다!

---

### 📅 [Day 3] 코루틴 (Coroutine) - 멈췄다 다시 시작하는 마법의 분신

#### 📖 1. 예습 (다이렉트 스레드 지연 꼼수)
> **🎩 마술사의 상자 속 들어가기**
> 
> `Invoke`가 단순한 알람시계라면, **코루틴(Coroutine, 협동 루틴)**은 내 몸을 복제한 **마법의 분신 알바생**입니다.
> "용사가 쓰러진다 -> 1초 대기 -> 화면이 까매진다 -> 2초 대기 -> 부활한다."
> 이렇게 여러 단계의 컷 애니메이션 같은 지연 연출이 필요할 땐 `Invoke`를 쓰려면 함수를 3개나 따로 판 다음 알람을 3개 맞춰야 해서 지옥이 열립니다.
> 
> 이때! 코루틴 중괄호 `{ }` 안에 들어가서 **`yield return new WaitForSeconds(1f);`** 라는 일시 지정 포즈(Pause) 버튼을 박으면, **다른 스크립트나 게임은 버젓이 돌아가고 있는데 딱 이 공간의 코드 흐름만 얼음! 하고 그 자리에서 멈췄다가 1초 뒤에 땡! 하고 이어서 실행됩니다.** 

#### ✅ 2. 마법 분신 독해법 (`IEnumerator`)
```csharp
public class Cutscene : MonoBehaviour 
{
    void Start() 
    {
        // [문장 1 독해] 코루틴(마법 분신 공장)을 가동시켜라! 이름은 죽음 연출기!
        StartCoroutine(DeathSequence());
    }

    // [문장 2 독해] 열거자(IEnumerator): 여기서부터는 코루틴 차원의 시간 마법이 작동하는 비밀의 방이다.
    IEnumerator DeathSequence() 
    {
        Debug.Log("용사가 쓰러진다!");

        // [문장 3 독해] 양보(yield)하고 반환(return). 1초를 기다리기(WaitForSeconds) 전까지 내 분신을 동결 시켜라!
        yield return new WaitForSeconds(1f);

        Debug.Log("화면이 까매진다!");
        
        yield return new WaitForSeconds(2f); // 여기서 분신이 또다시 2초간 동결

        Debug.Log("새로운 맵에서 부활한다!");
    }
}
```

#### 🗣️ 3. 지휘관의 프롬프팅
> **"야 AI, 스킬 쿨타임이랑 컷씬 연출 도는데 그걸 왜 무식하게 통짜 `Update`에 `deltaTime` 넣어서 비대하게 Coupling(종속)되게 짜? 당장 저거 떼어내서 백그라운드 코루틴(`Coroutine`)으로 던지고 `yield return WaitForSeconds` 써서 시간차 분리해!"**

---

### 📅 [Day 4] 무한 루프 탈출과 Yield Null

#### 📖 1. 예습 (숨통 틔워주기)
> Month 1에서 무한 악덕 사장이 부리는 지옥의 저주, **`while`루프 무한정 지연 렉 (게임 터짐)**을 배웠습니다. 
> 그런데, 놀랍게도 **코루틴 안에서 `while`을 굴리면 컴퓨터가 터지지 않게 숨통을 틔워줄 수 있습니다!**
> 
> `yield return null;` 이라는 마법의 구절 덕분입니다.
> "야 무한 반복하긴 하는데, **딱 한 프레임(보통 1/60초)은 유니티한테 컴퓨터 CPU 권한 넘겨주고 다음 프레임에 나머지 이어서 계속 돌려.**" 라는 뜻의 양보(Yield) 선언입니다. 

#### ✅ 2. 무한 루프 숨 들이쉬기
```csharp
IEnumerator SmoothRotate() 
{
    // 이론상으론 게임이 터지는 최악의 무한 루트 while(true)
    while (true) 
    {
        transform.Rotate(0, 1f, 0); // 코루틴 안에서 차근차근 1바퀴씩 회전

        // [문장 1 독해] 양보해라 빈 것(null)을. 즉, "이번 프레임 연산 끝났으니 한 프레임 쉰다!" 
        // 1프레임 쉴 동안 유니티 다른 엔진들이 정상적으로 돌아가서 렉이 안 걸림!
        yield return null; 
    }
}
```

---

### 📅 [Day 5] 🕹️ 미니 프로젝트 & 쿨타임 방탈출

#### 🎮 [미니 프로젝트] 3단 콤보 시한폭탄 해제
1. 유니티 큐브에 `BombTimer` 스크립트를 생성합니다.
2. `Start` 함수 내부에 딱 이 한 줄 코루틴만 던져봅시다. 
```csharp
using UnityEngine;
using System.Collections; // IEnumerator 사용을 위한 필수 헤더(using)

public class BombTimer : MonoBehaviour 
{
    void Start() {
        StartCoroutine(BombSequence());
    }

    IEnumerator BombSequence() {
        Debug.Log("폭탄이 가동되었습니다. 파란 선 컷!");
        yield return new WaitForSeconds(2f);
        Debug.Log("빨간 선 컷! 후... 2초 지났네.");
        yield return new WaitForSeconds(3f);
        Debug.Log("투다다다다 (3초 뒤 터짐)");
        Destroy(gameObject);
    }
}
```
3. **쾌감의 순간:** 플레이(▶)를 누르고 콘솔 로그의 왼쪽 '로그 시간' 스탬프를 확인해 보십시오! **우리의 스크립트는 멈춰 잤는데 시간은 완벽하게 흐르고 분신이 부활하며 단계적으로 폭발**하는 백그라운드 아키텍처를 느끼실 수 있습니다.

---
#### 🧩 Month 2 최후의 방탈출 시험
1.  "AI야, 3초 동안 독무뎀 쫙 돌리는 쿨타임 연산을 `Update`에 `deltaTime` 박아서 커플링하지 마. 당장 독립 실행되는 함수 파서 **`____(1)`** 로 던져놓고 3초 지연 알람시계 맞춰 놔!"
2.  "연출할 때 1초 대기, 2초 대기, 컷씬 흐름 통제할 건데 그걸 콜백으로 쪼개지 말고, 비동기로 백그라운드에서 한 번에 조절할 수 있는 마법의 분신 **`____(2)`** 로 당장 선언해!"
3.  "코루틴 선언할 때 리턴 타입으로 지정하는 외계어 마법진(**`____(3)`**) 안 달고 왜 이상한 거 달아놨어?"
4.  "코루틴 돌아갈 때 특정 초단위 지연 말고, 딱 1프레임만 양보하고 잠깐 숨 고르기 할 때는 **`____ ____ ____(4)`** 로 숨통 틔워 두라고!"

*(정답 코드는 나오지 않습니다. 이것으로 Month 2 - 유니티 엔진과 객체 지향의 위험한 동거를 완벽하게 지배하는 여정을 모두 마치셨습니다! 다음 달, 블랙박스 터미널 해킹(CLI) 코스에 참전할 마음의 준비를 하십시오!)*
