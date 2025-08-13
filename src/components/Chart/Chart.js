import { useDarkMode } from '@/providers/DarkModeProvider'
import ReactEcharts from 'echarts-for-react'

export default function Chart({ option, customHeight = 'h-88 xl:h-[540px] rounded shadow-md' }) {
	const { isDarkMode } = useDarkMode()

	const darkTheme = {
		color: ['#4992ff', '#7cffb2', '#fddd60', '#ff6e76', '#58d9f9', '#05c091', '#ff8a45', '#8d48e3', '#dd79ff'],
		backgroundColor: 'rgba(27,29,38,1)',
		title: {
			textStyle: {
				color: '#F6F9FC',
			},
			subtextStyle: {
				color: '#B9B8CE',
			},
		},
		legend: {
			textStyle: {
				color: '#fff',
			},
			type: 'scroll',
		},
		textStyle: {
			color: '#ECF0F2',
		},
		categoryAxis: {
			axisLine: {
				lineStyle: {
					color: '#3A4361',
				},
			},
			splitLine: {
				lineStyle: {
					color: 'rgba(128,128,128,0.3)',
				},
			},
		},
		valueAxis: {
			axisLine: {
				lineStyle: {
					color: '#3A4361',
				},
			},
			splitLine: {
				lineStyle: {
					color: 'rgba(128,128,128,0.3)',
				},
			},
			splitArea: {
				show: true,
				areaStyle: {
					color: ['', 'rgba(140,177,235,0.1)'],
				},
			},
		},
		tooltip: {
			backgroundColor: '#1B1D26',
			textStyle: {
				color: '#F7F7F7',
			},
			axisPointer: {
				lineStyle: {
					color: '#817F91',
					width: '1',
				},
				crossStyle: {
					color: '#817F91',
					width: '1',
				},
				label: {
					color: '#fff',
					backgroundColor: '#3D4664',
				},
			},
		},
		dataZoom: {
			borderColor: '#71708A',
			textStyle: {
				color: '#E7EFF4',
			},
			brushStyle: {
				color: 'rgba(135,163,206,0.3)',
			},
			handleStyle: {
				color: '#353450',
				borderColor: '#C5CBE3',
			},
			moveHandleStyle: {
				color: '#B0B6C3',
				opacity: 0.3,
			},
			fillerColor: 'rgba(135,163,206,0.2)',
			emphasis: {
				handleStyle: {
					borderColor: '#91B7F2',
					color: '#4D587D',
				},
				moveHandleStyle: {
					color: '#636D9A',
					opacity: 0.7,
				},
			},
			dataBackground: {
				lineStyle: {
					color: '#71708A',
					width: 1,
				},
				areaStyle: {
					color: '#71708A',
				},
			},
			selectedDataBackground: {
				lineStyle: {
					color: '#87A3CE',
				},
				areaStyle: {
					color: '#87A3CE',
				},
			},
		},
		toolbox: {
			iconStyle: {
				borderColor: '#E7EFF4',
			},
		},
		line: {
			symbol: 'circle',
		},
		gauge: {
			title: {
				color: '#E7EFF4',
			},
			detail: {
				color: '#E7EFF4',
			},
		},
	}
	const lightTheme = {
		color: ['#4992ff', '#fddd60', '#ff6e76', '#05c091', '#ff8a45', '#8d48e3', '#dd79ff'],
		backgroundColor: '#fff',
		categoryAxis: {
			axisLine: {
				lineStyle: {
					color: '#3A4361',
				},
			},
			splitLine: {
				lineStyle: {
					color: 'rgba(128,128,128,0.3)',
				},
			},
		},
		valueAxis: {
			axisLine: {
				lineStyle: {
					color: '#3A4361',
				},
			},
			splitLine: {
				lineStyle: {
					color: 'rgba(128,128,128,0.3)',
				},
			},
			splitArea: {
				show: true,
				areaStyle: {
					color: ['', '#EEF9FF'],
				},
			},
		},
		axisPointer: {
			label: {
				backgroundColor: '#4FBAFF',
			},
		},
		toolbox: {
			iconStyle: {
				borderColor: '#3D4664',
			},
		},
		line: {
			symbol: 'circle',
		},
	}

	return (
		<ReactEcharts
			className={`border dark:border-zinc-800 ${customHeight} pl-2 md:pl-0`}
			option={option}
			theme={isDarkMode ? darkTheme : lightTheme}
			style={{
				height: '100%',
				width: '100%',
			}}
			notMerge={true}
			lazyUpdate={false}
		/>
	)
}
