// 🛡️ 本文件由 XingHuiSama 控制台自动生成，请勿手动修改
export interface Photo { url: string; caption?: string; }
export interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }

export const albums: Album[] = [
  {
    "title": "萌·王",
    "description": "关于我转生成为史莱姆这件事...",
    "cover": "https://images.alphacoders.com/136/thumb-1920-1362045.png",
    "id": "album_1777651495390",
    "photos": [
      {
        "url": "https://images.alphacoders.com/123/thumb-1920-1234142.png"
      },
      {
        "url": "https://images6.alphacoders.com/998/thumb-1920-998375.png"
      }
    ],
    "date": "2026-05-01"
  }
];