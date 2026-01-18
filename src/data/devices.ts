// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = {
	[categoryName: string]: Device[];
} & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	Computer: [
		{
			name: "华硕天选5",
			image: "/images/device/asus-tuf5.png",
			specs: "R7-6800H / RTX4060 / 16GB / 1024GB",
			description:
				"性价比出色的游戏本，适合学习和娱乐。",
			link: "https://www.asus.com.cn/laptops/for-gaming/tuf-gaming/tuf-gaming-f15-fx506/",
		},
	],
};
