"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Trophy, Eye, MessageSquare, Play, Smartphone } from "lucide-react";
import { startRound, setRoomPhase } from "@/lib/rooms";
import { createRoom, joinRoom, subscribeToRoom, type RoomData } from "@/lib/rooms";

type 題目 = {
  詞語: string;
  類別: string;
  真相: string;
};

const 題庫: 題目[] = [
  { 詞語: "切香腸戰術", 類別: "政治/軍事", 真相: "指以逐步蠶食、每次推進一小步的方式，慢慢達成更大目標的策略。" },
  { 詞語: "美女拳法", 類別: "武俠/文學", 真相: "金庸小說中的古墓派武功，招式模擬古代美女神韻與姿態。" },
  { 詞語: "拉撒路現象", 類別: "醫學", 真相: "指心肺復甦停止後，患者又突然恢復自主循環的罕見現象。" },
  { 詞語: "忒修斯之船", 類別: "哲學", 真相: "探討一件東西所有部分都被更換後，是否仍是同一件東西的哲學問題。" },
  { 詞語: "黑天鵝事件", 類別: "風險/金融", 真相: "指極罕見、難以預測但影響極大的重大事件。" },
  { 詞語: "破窗理論", 類別: "社會學/犯罪學", 真相: "指小規模失序若不處理，可能誘發更大的失序與犯罪。" },
  { 詞語: "囚徒困境", 類別: "博弈論", 真相: "描述個體理性選擇未必帶來群體最佳結果的經典模型。" },
  { 詞語: "奧卡姆剃刀", 類別: "哲學/方法論", 真相: "在多種解釋都成立時，優先選擇假設最少、最簡單的一個。" },
  { 詞語: "潘朵拉盒子", 類別: "神話", 真相: "比喻一旦打開就會釋放出大量麻煩或無法收拾後果的事物。" },
  { 詞語: "薛丁格的貓", 類別: "物理學", 真相: "用來說明量子疊加概念的思想實驗。" },
  { 詞語: "曼德拉效應", 類別: "記憶/流行文化", 真相: "指一群人共同記得某件其實從未如此發生過的事情。" },
  { 詞語: "斯德哥爾摩症候群", 類別: "心理學", 真相: "指受害者對加害者產生情感依附或同情的現象。" },
  { 詞語: "彼得潘症候群", 類別: "心理/流行文化", 真相: "泛指成年人逃避成熟責任、長期維持少年心態的心理描述。" },
  { 詞語: "阿基里斯之踵", 類別: "希臘神話", 真相: "出自希臘神話，現多用來比喻最致命的弱點。" },
  { 詞語: "特洛伊木馬", 類別: "神話/資訊科技", 真相: "原指希臘神話中的攻城計，後也指偽裝成正常程式的惡意軟體。" },
  { 詞語: "邊沁式全景監獄", 類別: "社會思想/建築", 真相: "一種少數監視者可觀察眾多被監視者的監獄設計，也常用來討論監控社會。" },
  { 詞語: "河圖洛書", 類別: "中國神話/術數", 真相: "中國傳統文化中的神秘圖式，常與宇宙秩序、數理與術數思想聯繫在一起。" },
  { 詞語: "山海經", 類別: "古代典籍/神話", 真相: "中國古代充滿神話、異獸與傳說的典籍。" },
  { 詞語: "封神榜", 類別: "神魔敘事", 真相: "中國神魔敘事中的封神名錄與相關傳說體系。" },
  { 詞語: "八陣圖", 類別: "歷史傳說/文學", 真相: "與諸葛亮相關的陣法意象，後世視為高深兵法與神秘布局的象徵。" },
  { 詞語: "空城計", 類別: "歷史/文學", 真相: "以虛張聲勢令對手不敢進攻的謀略，後來也泛指冒險性的心理戰。" },
  { 詞語: "遠交近攻", 類別: "歷史/外交", 真相: "戰國時代的外交策略，主張聯遠方而攻近鄰。" },
  { 詞語: "焦土政策", 類別: "軍事/歷史", 真相: "撤退時破壞資源與設施，令敵軍無法利用的戰略。" },
  { 詞語: "馬奇諾防線", 類別: "戰爭史", 真相: "法國在兩次大戰之間修建的防禦工事系統，後來常被拿來比喻過時的防禦思維。" },
  { 詞語: "曼哈頓計劃", 類別: "科技史/軍事", 真相: "第二次世界大戰期間美國主導的原子彈研發計劃。" },
  { 詞語: "修昔底德陷阱", 類別: "國際關係", 真相: "指新興強權崛起可能與既有強權產生衝突的結構性風險。" },
  { 詞語: "滑坡謬誤", 類別: "邏輯學", 真相: "一種論證謬誤，把某一行動誇大成必然導致一連串極端後果。" },
  { 詞語: "確認偏誤", 類別: "心理學", 真相: "人傾向只尋找、相信或記住支持自己原有看法的資訊。" },
  { 詞語: "旁觀者效應", 類別: "社會心理學", 真相: "在場人數越多時，個體反而越可能不出手幫助他人的現象。" },
  { 詞語: "安慰劑效應", 類別: "醫學/心理", 真相: "患者因相信治療有效而產生真實改善的現象。" },
  { 詞語: "達克效應", 類別: "心理學", 真相: "能力較低者往往高估自己表現，而能力較高者反而較保守。" },
  { 詞語: "巴納姆效應", 類別: "心理學", 真相: "人容易把模糊而普遍的描述當成特別符合自己。" },
  { 詞語: "米諾斯迷宮", 類別: "神話", 真相: "希臘神話中的巨大迷宮，用來囚禁牛頭怪。" },
  { 詞語: "西西弗斯", 類別: "神話/哲學", 真相: "希臘神話中被罰永遠推石上山的人物，常象徵無盡而徒勞的努力。" },
  { 詞語: "戈耳狄俄斯之結", 類別: "神話/典故", 真相: "比喻極複雜難解的問題，也引申為用非常手段一舉解決困局。" },
  { 詞語: "尤里卡時刻", 類別: "科學史", 真相: "指靈光一閃、突然想到答案或重大發現的瞬間。" },
  { 詞語: "哥白尼式轉向", 類別: "思想史/哲學", 真相: "比喻一種徹底改變觀點中心的重大思維轉變。" },
  { 詞語: "莫比烏斯帶", 類別: "數學", 真相: "只有單側和單一邊界的曲面，是著名的拓撲學物件。" },
  { 詞語: "費米悖論", 類別: "天文/哲學", 真相: "宇宙可能有很多外星文明，但我們卻沒有觀察到明確證據的矛盾。" },
  { 詞語: "紅皇后效應", 類別: "演化生物學", 真相: "物種必須持續演化，才能在競爭中維持原有生存位置。" },
  { 詞語: "蝴蝶效應", 類別: "混沌理論", 真相: "微小初始差異可在複雜系統中造成巨大後果。" },
  { 詞語: "墨菲定律", 類別: "工程文化/俗語", 真相: "凡是可能出錯的事，往往真的會出錯。" },
  { 詞語: "羅生門", 類別: "文學/電影", 真相: "引申為同一事件因不同立場而出現多種互相矛盾的說法。" },
  { 詞語: "麥高芬", 類別: "電影敘事", 真相: "推動情節發展但本身內容未必重要的關鍵物件或目標。" },
  { 詞語: "契訶夫之槍", 類別: "文學理論", 真相: "故事中若出現重要元素，後文就應有所作用，否則不應隨便放入。" },
  { 詞語: "卡珊德拉預言", 類別: "神話/文化", 真相: "指能準確預見災難，卻無法令人相信的警告。" },
  { 詞語: "尤利西斯協議", 類別: "哲學/行為", 真相: "指人預先設下限制，防止未來的自己做出衝動或不理性的行為。" },
  { 詞語: "雙縫實驗", 類別: "物理學", 真相: "顯示微觀粒子具有波粒二象性的經典實驗。" },
  { 詞語: "熱寂", 類別: "宇宙學", 真相: "宇宙最終達到能量均勻分散、再無可用能量差的終極狀態。" },
  { 詞語: "紐結理論", 類別: "數學", 真相: "研究繩結在拓撲意義下如何分類與變形的數學分支。" }
];

const 產生房間碼 = () => Math.random().toString(36).slice(2, 6).toUpperCase();

type 畫面 = "首頁" | "房間" | "私人卡" | "討論" | "揭曉";

type 玩家卡 = {
  玩家: string;
  身份: "真玩家" | "吹水玩家";
  內容: string;
};

function 隨機排序<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function 建立洗牌牌庫(長度: number, 排除索引?: number): number[] {
  const 索引列表 = Array.from({ length: 長度 }, (_, i) => i);
  const 可用索引 =
    typeof 排除索引 === "number" ? 索引列表.filter((i) => i !== 排除索引) : 索引列表;
  return 隨機排序(可用索引);
}

function 正規化玩家名單(玩家輸入: string, 建立者名稱: string): string[] {
  const 名單 = 玩家輸入
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  const 含建立者 = 名單.includes(建立者名稱);
  const 完整名單 = 含建立者 ? 名單 : [建立者名稱, ...名單];

  return Array.from(new Set(完整名單));
}

function 建立初始分數(玩家列表: string[]): Record<string, number> {
  return Object.fromEntries(玩家列表.map((玩家) => [玩家, 0]));
}

function 抽下一題(目前索引: number, 未出題索引: number[]) {
  if (未出題索引.length === 0) {
    const 新牌庫 = 建立洗牌牌庫(題庫.length, 目前索引);
    const [下一題 = 目前索引, ...剩餘牌庫] = 新牌庫;
    return { 下一題, 剩餘牌庫 };
  }

  const [下一題 = 目前索引, ...剩餘牌庫] = 未出題索引;
  return { 下一題, 剩餘牌庫 };
}

export default function PrivateBluffGamePrototype() {
  const [畫面, set畫面] = useState<畫面>("首頁");
  const [遠端房間, set遠端房間] = useState<RoomData | null>(null);
  const [建立者名稱, set建立者名稱] = useState("Wan Ling");
  const [加入碼, set加入碼] = useState("");
  const [房間碼, set房間碼] = useState("");
  const [玩家輸入, set玩家輸入] = useState("Wan Ling, Alex, May, Chris, Jo");
  const [玩家列表, set玩家列表] = useState<string[]>(["Wan Ling", "Alex", "May", "Chris", "Jo"]);
  const [回合, set回合] = useState(1);
  const [題目索引, set題目索引] = useState(0);
  const [未出題索引, set未出題索引] = useState<number[]>(() => 建立洗牌牌庫(題庫.length, 0));
  const [真玩家, set真玩家] = useState("Alex");
  const [目前玩家, set目前玩家] = useState("Wan Ling");
  const [已揭示, set已揭示] = useState(false);
  const [分數, set分數] = useState<Record<string, number>>({
    "Wan Ling": 2,
    Alex: 4,
    May: 1,
    Chris: 3,
    Jo: 2,
  });
  
  useEffect(() => {
    if (!房間碼) return;
  
    const unsubscribe = subscribeToRoom(房間碼, (room) => {
      set遠端房間(room);
  
      if (!room) return;
  
      set玩家列表(room.players.map((p) => p.name));
  
      if (typeof room.currentPromptIndex === "number") {
        set題目索引(room.currentPromptIndex);
      }
  
      if (room.truthPlayerId) {
        const truthPlayerName =
          room.players.find((p) => p.id === room.truthPlayerId)?.name || "Alex";
        set真玩家(truthPlayerName);
      }
  
      if (room.phase === "lobby") set畫面("房間");
      if (room.phase === "privateCards") set畫面("私人卡");
      if (room.phase === "discussion") set畫面("討論");
      if (room.phase === "reveal") set畫面("揭曉");
    });
  
    return () => unsubscribe();
  }, [房間碼]);

  const 目前題目 = 題庫[題目索引];

  const 玩家卡牌 = useMemo<玩家卡[]>(() => {
    return 玩家列表.map((玩家) => {
      const 是否真玩家 = 玩家 === 真玩家;
      return {
        玩家,
        身份: 是否真玩家 ? "真玩家" : "吹水玩家",
        內容: 是否真玩家
          ? `你知道真正答案：${目前題目.真相}`
          : "你不知道真正答案。請作一個可信但假的解釋。",
      };
    });

  }, [玩家列表, 真玩家, 目前題目]);

  const 目前卡牌 = 玩家卡牌.find((x) => x.玩家 === 目前玩家);
  const 剩餘題數 = 未出題索引.length;

  const 進度 =
    畫面 === "首頁" ? 10 : 畫面 === "房間" ? 30 : 畫面 === "私人卡" ? 60 : 畫面 === "討論" ? 80 : 100;

    const 建立房間 = async () => {
        const 新房間碼 = 產生房間碼();
        const 房間資料 = await createRoom(新房間碼, 建立者名稱);
      
        set房間碼(新房間碼);
        set玩家列表(房間資料.players.map((p) => p.name));
        set遠端房間(房間資料);
        set畫面("房間");
      };

      const 加入房間 = async () => {
        try {
          const code = 加入碼 || "ABCD";
          const 房間資料 = await joinRoom(code, 建立者名稱);
      
          set房間碼(code);
          set玩家列表(房間資料.players.map((p) => p.name));
          set遠端房間(房間資料);
          set畫面("房間");
        } catch {
          alert("房間不存在");
        }
      };

      const 開始回合 = async () => {
        await startRound(房間碼, 題庫.length);
      };
    const 最終名單 = 正規化玩家名單(玩家輸入, 建立者名稱);
    const 抽中真玩家 = 最終名單[Math.floor(Math.random() * 最終名單.length)] || 最終名單[0];

    set玩家列表(最終名單);
    set分數((舊分數) => {
      const 新分數 = 建立初始分數(最終名單);
      for (const 玩家 of 最終名單) {
        if (typeof 舊分數[玩家] === "number") {
          新分數[玩家] = 舊分數[玩家];
        }
      }
      return 新分數;
    });
    set真玩家(抽中真玩家);
    set目前玩家(最終名單[0]);
    set已揭示(false);
    set畫面("私人卡");
  };

  const 全部同時揭示 = () => {
    set已揭示(true);
  };

  const 進入討論 = async () => {
    await setRoomPhase(房間碼, "discussion");
  };
    set畫面("討論");
  };

  const 揭曉答案 = async () => {
    await setRoomPhase(房間碼, "reveal");
  };
    set分數((目前分數) => ({
      ...目前分數,
      [真玩家]: (目前分數[真玩家] || 0) + 3,
    }));
    set畫面("揭曉");
  };

  const 下一回合 = () => {
    const { 下一題, 剩餘牌庫 } = 抽下一題(題目索引, 未出題索引);
    set回合((n) => n + 1);
    set題目索引(下一題);
    set未出題索引(剩餘牌庫);
    set畫面("房間");
    set已揭示(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-medium text-slate-500">面對面聚會用 · 多裝置私人卡牌原型</div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">吹水房 Bluff Room</h1>
            </div>
            <div className="flex gap-2">
              <Badge className="rounded-full px-3 py-1 text-sm">房間 {房間碼 || "----"}</Badge>
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">第 {回合} 回合</Badge>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={進度} />
          </div>
        </motion.div>

        {畫面 === "首頁" && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">建立房間（建立者也會一起玩）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">建立者/控制者名稱</label>
                  <Input value={建立者名稱} onChange={(e) => set建立者名稱(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    玩家名單（用逗號分隔，若未填入建立者會自動加入）
                  </label>
                  <Input value={玩家輸入} onChange={(e) => set玩家輸入(e.target.value)} />
                </div>
                <Button className="rounded-2xl" onClick={建立房間}>
                  建立房間
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">加入房間</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="輸入房間碼"
                  value={加入碼}
                  onChange={(e) => set加入碼(e.target.value.toUpperCase())}
                />
                <Button variant="outline" className="rounded-2xl" onClick={加入房間}>
                  加入
                </Button>
                <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
                  真正上線版中，包括主持人在內，每位朋友都會用自己的手機加入，同一時間看到各自的私人卡牌。
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {畫面 === "房間" && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="h-5 w-5" /> 房間大堂
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {玩家列表.map((玩家) => (
                    <Badge key={玩家} variant="secondary" className="rounded-full px-3 py-1 text-sm">
                      {玩家}
                    </Badge>
                  ))}
                </div>
                <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
                  玩法：包括主持人在內，所有玩家都會一起參與。系統會從全部玩家之中抽出一位「真玩家」。開始後，每位玩家會在自己的裝置同時看到私人卡牌。題庫現已改成 50 題混合版，包含歷史、神話、哲學、心理、科學、政治與少量武俠。
                </div>
                <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
                  牌庫模式：每回合會隨機抽一張未出過的題目，全部題目用完之後才會重新洗牌再開始。仲有 {剩餘題數} 題未出。
                </div>
                <Button className="rounded-2xl" onClick={開始回合}>
                  開始回合
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Trophy className="h-5 w-5" /> 分數榜
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(分數)
                  .sort((a, b) => b[1] - a[1])
                  .map(([名字, 分]) => (
                    <div key={名字} className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3">
                      <span className="font-medium text-slate-800">{名字}</span>
                      <span className="text-lg font-bold text-slate-900">{分}</span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        )}

        {畫面 === "私人卡" && (
          <div className="space-y-6">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Smartphone className="h-5 w-5" /> 同時揭示私人卡牌
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-slate-100 p-4 text-slate-800">
                  <div className="text-sm text-slate-500">本回合題目</div>
                  <div className="mt-1 text-2xl font-bold">{目前題目.詞語}</div>
                  <div className="mt-2 text-sm text-slate-600">類別：{目前題目.類別}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {玩家列表.map((玩家) => (
                    <Button
                      key={玩家}
                      variant={目前玩家 === 玩家 ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => set目前玩家(玩家)}
                    >
                      {玩家}
                    </Button>
                  ))}
                </div>
                <div className="rounded-2xl border p-5">
                  {!已揭示 ? (
                    <div className="space-y-3 text-center">
                      <div className="text-lg font-semibold text-slate-900">{目前玩家} 的私人卡牌</div>
                      <p className="text-slate-600">
                        實際上線版中，包括主持人在內，所有玩家都會在自己的手機同時看到各自的私人卡牌。
                      </p>
                      <Button className="rounded-2xl" onClick={全部同時揭示}>
                        同時揭示卡牌
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-sm text-slate-500">玩家</div>
                      <div className="text-xl font-bold text-slate-900">{目前卡牌?.玩家}</div>
                      <Badge className="rounded-full px-3 py-1 text-sm">
                        {目前卡牌?.身份 === "真玩家" ? "真玩家" : "吹水玩家"}
                      </Badge>
                      <div className="rounded-2xl bg-slate-100 p-4 text-slate-800">
                        <div className="text-sm text-slate-500">題目</div>
                        <div className="mt-1 font-semibold">{目前題目.詞語}</div>
                        <div className="mt-2 text-sm text-slate-600">類別：{目前題目.類別}</div>
                      </div>
                      <div className="rounded-2xl bg-slate-100 p-4 text-slate-800">{目前卡牌?.內容}</div>
                    </div>
                  )}
                </div>
                {已揭示 && (
                  <Button className="rounded-2xl" onClick={進入討論}>
                    進入討論階段
                  </Button>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              {隨機排序(玩家卡牌).map((卡) => (
                <Card key={卡.玩家} className="rounded-3xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{卡.玩家}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
                      {已揭示 ? 卡.身份 : "未揭示"}
                    </Badge>
                    <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
                      {已揭示 ? 卡.內容 : "等待主持人開始同時揭示。"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {畫面 === "討論" && (
          <Card className="rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <MessageSquare className="h-5 w-5" /> 討論階段
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-slate-100 p-5 text-slate-800">
                <div className="text-sm text-slate-500">題目</div>
                <div className="mt-1 text-2xl font-bold">{目前題目.詞語}</div>
                <div className="mt-2 text-sm text-slate-600">類別：{目前題目.類別}</div>
              </div>
              <div className="rounded-2xl border p-5 text-slate-700">
                大家而家可以面對面討論、吹水、估邊個知道真相。主持人都係玩家之一，只係負責按掣控制流程；討論完之後再由持有控制權的裝置揭曉答案。
              </div>
              <Button className="rounded-2xl" onClick={揭曉答案}>
                揭曉答案
              </Button>
            </CardContent>
          </Card>
        )}

        {畫面 === "揭曉" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Eye className="h-5 w-5" /> 回合結果
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-slate-100 p-4">
                  <div className="text-sm text-slate-500">真玩家</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">{真玩家}</div>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4">
                  <div className="text-sm text-slate-500">真正答案</div>
                  <div className="mt-1 text-slate-900">{目前題目.真相}</div>
                </div>
                <Button className="rounded-2xl" onClick={下一回合}>
                  下一回合
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">最新分數</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(分數)
                  .sort((a, b) => b[1] - a[1])
                  .map(([名字, 分]) => (
                    <div key={名字} className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3">
                      <span className="font-medium text-slate-800">{名字}</span>
                      <span className="text-lg font-bold text-slate-900">{分}</span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="rounded-3xl border-dashed shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Play className="h-5 w-5" /> 主持人玩法說明
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>• 建立者/控制者也會被視為正式玩家，會一起抽身份、一起看私人卡牌、一起參與討論。</p>
            <p>• 主持人只是額外擁有流程控制權，例如開始回合、揭曉答案、跳到下一題。</p>
            <p>• 目前只是前端原型。真正多人同步需要接駁 Firebase 或 Supabase。</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}