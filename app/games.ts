export type GameItem = {
  slug: string;
  name: string;
  label: string;
  description: string;
  highlight: string;
  cover: string;
  qrCode?: string;
  qrFormat?: "square" | "wide";
  appId: string;
  originalId: string;
  wechatPath: string;
  directUrl?: string;
};

export const games: GameItem[] = [
  {
    slug: "live-lure",
    name: "实况路亚打黑",
    label: "第一视角雷强模拟",
    description: "体验抛竿、摇轮、中鱼、鱼获结算和积分装备兑换，把水边的一整套动作带进手机。",
    highlight: "真实钓场 · 完整作钓流程",
    cover: "/live-lure-cover.jpg",
    qrCode: "/live-lure-code.png",
    qrFormat: "wide",
    appId: "wx5298b069090b612c",
    originalId: "gh_a101c7dfdcbd",
    wechatPath: "?source=lure_blog",
  },
  {
    slug: "full-grid-home",
    name: "满格收纳小屋",
    label: "轻松又烧脑的收纳闯关",
    description: "旋转并摆放不同形状的物品，在有限步数内将柜格完整填满，每局只需几分钟。",
    highlight: "旋转摆放 · 轻松闯关",
    cover: "/full-grid-home-banner.png",
    qrCode: "/full-grid-home-code.jpg",
    qrFormat: "square",
    appId: "wx264cd3105c169e1c",
    originalId: "gh_524cfa8cf5a7",
    wechatPath: "?source=lure_blog",
  },
  {
    slug: "odd-picture",
    name: "这张图不对劲",
    label: "四合一休闲益智合集",
    description: "找茬、推理、连连看与数字华容道，四种轻松益智玩法，随时来一局发现画面里的小秘密。",
    highlight: "找茬 · 推理 · 连连看 · 华容道",
    cover: "/odd-picture-cover.png",
    appId: "wx8dfa5e599bc00d26",
    originalId: "gh_59f6fb423334",
    wechatPath: "?source=lure_blog",
  },
];
