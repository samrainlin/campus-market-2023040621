import { defineStore } from 'pinia'

export interface MessageItem {
  id: number
  role: 'me' | 'other'
  content: string
  time: string
  card?: { title: string; content: string; link: string }
}

export interface Conversation {
  id: number
  name: string
  avatar: string
  time: string
  preview: string
  unread: number
  tag: string
  tagColor: string
  tagBg: string
  messages: MessageItem[]
}

export const useConversationStore = defineStore('conversation', {
  state: () => ({
    conversations: [
      {
        id: 1,
        name: '奶茶爱好者',
        avatar: 'https://picsum.photos/seed/userchat1/100/100',
        time: '10:32',
        preview: '你好，我看到你的喜茶拼单，差一个人是吧？我想报名～',
        unread: 2,
        tag: '🍜 拼单',
        tagColor: '#2563EB',
        tagBg: '#EFF6FF',
        messages: [
          { id: 1, role: 'other', content: '你好～我看到你发的喜茶拼单信息啦～', time: '10:20' },
          { id: 2, role: 'me', content: '你好呀！是的，还差1人就满4杯起送啦～ 你想喝什么呢？', time: '10:21' },
          {
            id: 3, role: 'other',
            content: '我想要一杯多肉葡萄，大杯少糖！',
            time: '10:22',
            card: { title: '🍜 喜茶拼单（4人', content: '人均 ¥22 · 北门自取', link: '/group-buy/1' },
          },
          { id: 4, role: 'me', content: '可以的～ 麻烦你把选的款式发给我就行～ 我统一微信付款，到时分摊～', time: '10:23' },
          { id: 5, role: 'other', content: '我选：喜茶 多肉葡萄大杯 少糖！😊', time: '10:25' },
          { id: 6, role: 'me', content: '好的！我记住啦～ 4点半北门见～', time: '10:26' },
          { id: 7, role: 'other', content: '好的 谢谢你～', time: '10:32' },
        ],
      },
      {
        id: 2,
        name: '粗心小李',
        avatar: 'https://picsum.photos/seed/userchat2/100/100',
        time: '昨天 18:42',
        preview: '同学你好，你发的那张蓝色一卡通图片很像我丢的那张，方便联系一下吗？',
        unread: 1,
        tag: '🔍 失物',
        tagColor: '#DC2626',
        tagBg: '#FEF2F2',
        messages: [
          { id: 1, role: 'other', content: '同学你好，我在失物招领看到你发的一卡通信息。', time: '18:30' },
          { id: 2, role: 'me', content: '你好！是的，我在教学楼捡到的。', time: '18:32' },
          { id: 3, role: 'other', content: '那张蓝卡套的一卡通是我的！方便约个时间拿吗？', time: '18:35' },
          { id: 4, role: 'me', content: '好的，我明天上午在图书馆，到时候联系你。', time: '18:40' },
          { id: 5, role: 'other', content: '同学你好，你发的那张蓝色一卡通图片很像我丢的那张，方便联系一下吗？', time: '18:42' },
        ],
      },
      {
        id: 3,
        name: '毕业学长',
        avatar: 'https://picsum.photos/seed/userchat3/100/100',
        time: '昨天 15:20',
        preview: '学长你好，那辆蓝色自行车 250 能出吗？我马上就期末了需要骑一下',
        unread: 0,
        tag: '📚 二手',
        tagColor: '#2563EB',
        tagBg: '#EFF6FF',
        messages: [
          { id: 1, role: 'other', content: '你好，请问那辆蓝色自行车还在吗？', time: '15:00' },
          { id: 2, role: 'me', content: '还在的，骑了两年，车况挺好。', time: '15:05' },
          { id: 3, role: 'other', content: '学长你好，那辆蓝色自行车 250 能出吗？我马上就期末了需要骑一下', time: '15:20' },
        ],
      },
      {
        id: 4,
        name: '跑腿小王',
        avatar: 'https://picsum.photos/seed/userchat4/100/100',
        time: '昨天 11:05',
        preview: '快递已经帮你取到了，在你宿舍楼下，现在你方便下来取吗？',
        unread: 3,
        tag: '🏃 跑腿',
        tagColor: '#059669',
        tagBg: '#D1FAE5',
        messages: [
          { id: 1, role: 'me', content: '你好，能帮我去菜鸟驿站取个快递吗？', time: '10:00' },
          { id: 2, role: 'other', content: '没问题！取件码发我一下～', time: '10:02' },
          { id: 3, role: 'me', content: '取件码是 6-8-9，谢谢你！送到南区6栋楼下就行。', time: '10:05' },
          { id: 4, role: 'other', content: '好的，我这就去取。', time: '10:10' },
          { id: 5, role: 'other', content: '快递已经帮你取到了，在你宿舍楼下，现在你方便下来取吗？', time: '11:05' },
          { id: 6, role: 'other', content: '在吗？我已经在楼下等你了。', time: '11:10' },
          { id: 7, role: 'other', content: '你好？看到消息麻烦回复一下～', time: '11:15' },
        ],
      },
      {
        id: 5,
        name: '上岸学长',
        avatar: 'https://picsum.photos/seed/userchat5/100/100',
        time: '周一',
        preview: '考研资料周一你有时间来图书馆一楼吗？我当面给你，不着急的～',
        unread: 0,
        tag: '📚 二手',
        tagColor: '#2563EB',
        tagBg: '#EFF6FF',
        messages: [
          { id: 1, role: 'other', content: '你好，考研资料还要吗？', time: '上周日 20:00' },
          { id: 2, role: 'me', content: '要的！多少钱？', time: '上周日 20:05' },
          { id: 3, role: 'other', content: '免费送你的，我上岸了用不上了。', time: '上周日 20:06' },
          { id: 4, role: 'other', content: '考研资料周一你有时间来图书馆一楼吗？我当面给你，不着急的～', time: '周一 08:00' },
        ],
      },
      {
        id: 6,
        name: '热心读者',
        avatar: 'https://picsum.photos/seed/userchat6/100/100',
        time: '上周',
        preview: '你好，我在图书馆三楼捡到一把黑色长柄伞，伞柄有小熊贴纸，是你的吗？',
        unread: 0,
        tag: '🔍 失物',
        tagColor: '#DC2626',
        tagBg: '#FEF2F2',
        messages: [
          { id: 1, role: 'other', content: '你好，我在图书馆三楼捡到一把黑色长柄伞，伞柄有小熊贴纸，是你的吗？', time: '上周 14:00' },
        ],
      },
      {
        id: 7,
        name: '周末回家',
        avatar: 'https://picsum.photos/seed/userchat7/100/100',
        time: '上周',
        preview: '周五拼车去高铁站我有兴趣，现在还差2人对吗？',
        unread: 0,
        tag: '🍜 拼单',
        tagColor: '#2563EB',
        tagBg: '#EFF6FF',
        messages: [
          { id: 1, role: 'other', content: '你好，周五拼车去高铁站还有位置吗？', time: '上周 19:00' },
          { id: 2, role: 'me', content: '有的！还差2人，你要一起吗？', time: '上周 19:02' },
          { id: 3, role: 'other', content: '好的，算我一个！周五几点出发？', time: '上周 19:05' },
        ],
      },
    ] as Conversation[],
  }),

  getters: {
    totalUnread(): number {
      return this.conversations.reduce((sum, c) => sum + c.unread, 0)
    },

    getConversationById(): (id: number) => Conversation | undefined {
      return (id: number) => this.conversations.find((c) => c.id === id)
    },
  },

  actions: {
    clearUnread(id: number) {
      const conv = this.conversations.find((c) => c.id === id)
      if (conv) {
        conv.unread = 0
      }
    },

    sendMessage(id: number, content: string) {
      const conv = this.conversations.find((c) => c.id === id)
      if (!conv) return
      conv.messages.push({
        id: Date.now(),
        role: 'me',
        content,
        time: '刚刚',
      })
    },

    // 按用户名查找会话（用于从详情页发起私信时，查询已有或新建会话
    getConversationByUser(name: string): Conversation {
      const existing = this.conversations.find((c) => c.name === name)
      if (existing) return existing
      const newId = Math.max(...this.conversations.map(c => c.id), 0) + 1
      const newConv: Conversation = {
        id: newId,
        name: name,
        avatar: `https://picsum.photos/seed/user-${name}/100/100`,
        time: '刚刚',
        preview: `对方正在输入...`,
        unread: 0,
        tag: '💬 私信',
        tagColor: '#2563EB',
        tagBg: '#EFF6FF',
        messages: [
          {
            id: 1,
            role: 'other',
            content: `你好～关于我发的信息，有什么可以帮你的吗？`,
            time: '刚刚',
          },
        ],
      }
      this.conversations.unshift(newConv)
      return newConv
    },
  },
})
