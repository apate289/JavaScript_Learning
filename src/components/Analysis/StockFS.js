import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { List, ListItemButton, ListItemText } from '@mui/material'
import Collapse from '@mui/material/Collapse'
import { useState } from 'react'

import CompanyGrowth from '@/components/Analysis/CompanyGrowth'
import DividendPolicy from '@/components/Analysis/DividendPolicy'
import FinancialSafety from '@/components/Analysis/FinancialSafety'
import FinancialStatement from '@/components/Analysis/FinancialStatement'
import Profitability from '@/components/Analysis/Profitability'

export default function StockFS({ stockId }) {
	const [open, setOpen] = useState({
		fs: true,
		policy: false,
		prof: false,
		grow: false,
		safe: false,
	})
	const [childOpen, setChildOpen] = useState({
		fs: {
			營收表: true,
		},
		policy: {
			股利政策: false,
		},
		prof: {
			財報三率: false,
		},
		grow: {
			每股盈餘成長率: false,
		},
		safe: {
			財務結構比率: false,
		},
	})

	const handleParentToggle = (section) => {
		setChildOpen((prevChildOpen) => {
			const updatedSection = Object.fromEntries(
				Object.entries(prevChildOpen[section]).map(([key, value], index) => [key, index === 0])
			)

			Object.keys(prevChildOpen).forEach((key) => (key !== section ? (updatedSection[key] = false) : null))

			return {
				...prevChildOpen,
				[section]: updatedSection,
			}
		})

		setOpen((prevOpen) => ({
			...Object.fromEntries(Object.keys(prevOpen).map((key) => [key, key === section ? !prevOpen[key] : false])),
		}))
	}

	const handleChildToggle = (section, childSection) => {
		setChildOpen((prevChildOpen) => {
			if (prevChildOpen[section][childSection]) return prevChildOpen
			const updatedSection = Object.fromEntries(
				Object.entries(prevChildOpen[section]).map(([key, value]) => [key, false])
			)
			updatedSection[childSection] = !prevChildOpen[section][childSection]

			return {
				...prevChildOpen,
				[section]: updatedSection,
			}
		})
	}

	return (
		<div className='flex gap-2 pt-4 overflow-hidden sm:gap-4 md:gap-6'>
			<List className='px-1 py-4 tracking-wider xl:min-w-[185px] bg-zinc-100/80 dark:bg-zinc-900/50'>
				<ListItemButton
					sx={{
						py: '4px',
					}}
					onClick={() => handleParentToggle('fs')}
				>
					<ListItemText primary='基本財報' primaryTypographyProps={{ fontSize: '14px' }} />
					{open.fs ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>
				<Collapse in={open.fs} timeout='auto' unmountOnExit>
					<List component='div' disablePadding>
						{['營收表', '每股盈餘', '每股淨值', '損益表', '總資產', '負債和股東權益', '現金流量表', '電子書'].map(
							(tab, index) => (
								<ListItemButton sx={{ pl: 4 }} key={index}>
									<ListItemText
										primary={tab}
										sx={{
											mb: '-2px',
										}}
										primaryTypographyProps={{ fontSize: '14px' }}
										onClick={() => handleChildToggle('fs', tab)}
									/>
								</ListItemButton>
							)
						)}
					</List>
				</Collapse>
				<ListItemButton
					sx={{
						py: '4px',
					}}
				>
					<ListItemText
						primary='股利政策'
						sx={{
							py: '4px',
						}}
						primaryTypographyProps={{ fontSize: '14px' }}
						onClick={() => handleParentToggle('policy')}
					/>
				</ListItemButton>
				<ListItemButton
					sx={{
						py: '4px',
					}}
					onClick={() => handleParentToggle('prof')}
				>
					<ListItemText
						primary='獲利能力'
						sx={{
							py: '4px',
						}}
						primaryTypographyProps={{ fontSize: '14px' }}
					/>
					{open.prof ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>
				<Collapse in={open.prof} timeout='auto' unmountOnExit>
					<List component='div' disablePadding>
						{['財報三率', '營業費用率', '業外佔税前淨利比', 'ROE及ROA', '經營週轉能力'].map((tab, index) => (
							<ListItemButton sx={{ pl: 4 }} key={index}>
								<ListItemText
									primary={tab}
									sx={{
										mb: '-2px',
									}}
									primaryTypographyProps={{ fontSize: '14px' }}
									onClick={() => handleChildToggle('prof', tab)}
								/>
							</ListItemButton>
						))}
					</List>
				</Collapse>
				<ListItemButton
					sx={{
						py: '4px',
					}}
					onClick={() => handleParentToggle('grow')}
				>
					<ListItemText
						primary='公司成長'
						sx={{
							py: '4px',
						}}
						primaryTypographyProps={{ fontSize: '14px' }}
					/>
					{open.grow ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>
				<Collapse in={open.grow} timeout='auto' unmountOnExit>
					<List component='div' disablePadding>
						{['每股盈餘成長率'].map((tab, index) => (
							<ListItemButton sx={{ pl: 4 }} key={index}>
								<ListItemText
									primary={tab}
									sx={{
										mb: '-2px',
									}}
									primaryTypographyProps={{ fontSize: '14px' }}
									onClick={() => handleChildToggle('grow', tab)}
								/>
							</ListItemButton>
						))}
					</List>
				</Collapse>
				<ListItemButton
					sx={{
						py: '4px',
					}}
					onClick={() => handleParentToggle('safe')}
				>
					<ListItemText primary='財務安全' primaryTypographyProps={{ fontSize: '14px' }} />
					{open.safe ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>
				<Collapse in={open.safe} timeout='auto' unmountOnExit>
					<List component='div' disablePadding>
						{['財務結構比率', '流速動比率', '利息保障倍數', '現金流量分析', '營業現金流對淨利比', '盈餘再投資比率'].map(
							(tab, index) => (
								<ListItemButton sx={{ pl: 4 }} key={index}>
									<ListItemText
										primary={tab}
										sx={{
											mb: '-2px',
										}}
										primaryTypographyProps={{ fontSize: '14px' }}
										onClick={() => handleChildToggle('safe', tab)}
									/>
								</ListItemButton>
							)
						)}
					</List>
				</Collapse>
			</List>
			{open.fs && <FinancialStatement stockId={stockId} childOpen={childOpen.fs} />}
			{open.policy && <DividendPolicy stockId={stockId} childOpen={childOpen.policy} />}
			{open.prof && <Profitability stockId={stockId} childOpen={childOpen.prof} />}
			{open.grow && <CompanyGrowth stockId={stockId} childOpen={childOpen.grow} />}
			{open.safe && <FinancialSafety stockId={stockId} childOpen={childOpen.safe} />}
		</div>
	)
}
