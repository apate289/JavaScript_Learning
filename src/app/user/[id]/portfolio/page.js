'use client'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Tab, Tabs } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import StarryBackground from '@/components/common/StarryBackground'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import StockSelect from '@/components/ui/StockSelect'
import stock100 from '@/data/stock100.json'

export default function Portfolio() {
	const { data: session } = useSession()
	const token = session?.token || null

	const [tabIndex, setTabIndex] = useState(0)
	const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0)
	const [rows, setRows] = useState([])
	const [portfolioData, setPortfolioData] = useState([])

	const [isCreatePortfolioOpen, setIsCreatePortfolioOpen] = useState(false)
	const [isDeletePortfolioOpen, setIsDeletePortfolioOpen] = useState(false)
	const [isEditNameOpen, setIsEditNameOpen] = useState(false)

	const [newPortfolioName, setNewPortfolioName] = useState('')
	const [newStockId, setNewStockId] = useState(1101)
	const [rowIds, setRowIds] = useState([])

	useEffect(() => {
		setTabIndex(0)
		fetchPortfolio()
	}, [token])

	useEffect(() => {
		if (portfolioData[currentPortfolioIndex]) setRows(portfolioData[currentPortfolioIndex].data)
		else setRows([])
	}, [tabIndex, portfolioData])

	// 為每檔股票資料加上 unique id 以呈現在表格上
	const generateUniqueIds = (data) => {
		let idCounter = 1
		return data.map((item) => {
			return {
				...item,
				data: item.data.map((row) => ({
					...row,
					id: idCounter++,
				})),
			}
		})
	}

	// 取得投資組合
	const fetchPortfolio = async () => {
		if (!token) return
		try {
			const response = await fetch(`${process.env.DB_URL}/api/user/getGroup`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
			})

			const data = await response.json()
			if (data.success) setPortfolioData(generateUniqueIds(data.data))
		} catch (error) {
			console.error('Error: ', error)
		}
	}

	// 新增投資組合
	const createPortfolio = async () => {
		if (newPortfolioName === '') {
			alert('請輸入您要新增的投資組合名稱！')
			return
		} else if (portfolioData.find((portfolio) => portfolio.group_name === newPortfolioName)) {
			alert('已存在相同名稱的投資組合！')
			return
		}

		try {
			const response = await fetch(`${process.env.DB_URL}/api/user/createGroup`, {
				method: 'POST',
				body: JSON.stringify({
					group_name: newPortfolioName,
					stock_id_array: [1101], // 無法為空，所以新增投資組合時，須先預設一檔股票。
				}),
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
			})
			const data = await response.json()

			if (data.success) fetchPortfolio()
			else alert('新增投資組合失敗，請稍後再試！')
		} catch (error) {
			console.error('Error: ', error)
		} finally {
			setNewPortfolioName('')
			setIsCreatePortfolioOpen(false)
		}
	}

	const handleDeletePortfolioOpen = () => {
		if (portfolioData.length === 0) {
			alert('請先新增投資組合！')
			setIsDeletePortfolioOpen(false)
			return
		}
		setIsDeletePortfolioOpen(true)
	}

	// 移除投資組合
	const deletePortfolio = async (portfolioName) => {
		try {
			const response = await fetch(`${process.env.DB_URL}/api/user/deleteGroup`, {
				method: 'DELETE',
				body: JSON.stringify({
					group_name: portfolioName,
				}),
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
			})

			if (response.ok) {
				fetchPortfolio()
				setCurrentPortfolioIndex(0)
				setIsDeletePortfolioOpen(false)
			} else alert('移除失敗，請稍後再試！')
		} catch (error) {
			console.error('Error: ', error)
		}
	}

	// 更新編輯後的投資組合
	const fetchUpdatePortfolio = async (stockIdArray, groupName) => {
		try {
			const response = await fetch(`${process.env.DB_URL}/api/user/updateGroup`, {
				method: 'PATCH',
				body: JSON.stringify({
					old_group_name: portfolioData[currentPortfolioIndex].group_name,
					new_group_name: groupName,
					stock_id_array: stockIdArray,
				}),
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
			})

			if (response.ok) {
				setIsEditNameOpen(false)
				fetchPortfolio()
			} else alert('編輯失敗，請稍後再試！')
		} catch (error) {
			console.error('Error: ', error)
		}
	}

	const handleEditNameOpen = () => {
		if (portfolioData.length === 0) {
			alert('請先新增投資組合！')
			setIsEditNameOpen(false)
			setNewPortfolioName('')
			return
		}
		setIsEditNameOpen(true)
	}

	// 編輯組合名稱
	const editPortfolioName = () => {
		fetchUpdatePortfolio([...portfolioData[currentPortfolioIndex].data.map((row) => row.stock_id)], newPortfolioName)
		setNewPortfolioName('')
	}

	// 新增股票
	const addStock = async () => {
		let newStockIdArray = [...portfolioData[currentPortfolioIndex].data.map((row) => row.stock_id)]
		if (newStockIdArray.includes(newStockId)) alert('此股票已存在於投資組合中！')
		else newStockIdArray.push(newStockId)
		fetchUpdatePortfolio(newStockIdArray, portfolioData[currentPortfolioIndex].group_name)
	}

	// 刪除股票
	const deleteStock = async () => {
		let newStockIdArray = [...portfolioData[currentPortfolioIndex].data.map((row) => row.stock_id)]
		let stocksToDelete = rows.filter((row) => rowIds.includes(row.id)).map((row) => row.stock_id)
		newStockIdArray = newStockIdArray.filter((id) => !stocksToDelete.includes(id))

		fetchUpdatePortfolio(newStockIdArray, portfolioData[currentPortfolioIndex].group_name)
	}

	return (
		<StarryBackground className='w-full px-4 pt-6 pb-12 md:px-8 lg:px-20 xl:px-32 sm:pt-10 sm:pb-20'>
			<Breadcrumbs prevPage='會員管理' curPage='會員投資組合' />
			{/* 投資組合選單 */}
			<Tabs
				variant='scrollable'
				value={tabIndex}
				onChange={(e, index) => {
					setTabIndex(index)
					setCurrentPortfolioIndex(index)
				}}
				className='bg-white rounded shadow-md dark:bg-zinc-800'
			>
				{portfolioData &&
					portfolioData.map((portfolio, index) => (
						<Tab
							label={portfolio.group_name}
							className={`${
								tabIndex === index ? 'dark:text-secondary_blue bg-secondary_blue/10' : 'dark:text-zinc-100'
							} hover:bg-sky-300/10 `}
							key={index}
						/>
					))}
			</Tabs>
			{/* 投資組合功能按鈕組 */}
			<div className='flex items-center justify-end mt-3 mb-8 space-x-1 text-zinc-100'>
				<Button color='inherit' className='text-xs hover:text-zinc-200' onClick={() => setIsCreatePortfolioOpen(true)}>
					新增投資組合
				</Button>
				<Dialog maxWidth='xs' open={isCreatePortfolioOpen} onClose={() => setIsCreatePortfolioOpen(false)} fullWidth>
					<DialogTitle>新增一個投資組合</DialogTitle>
					<DialogContent>
						<Input
							type='text'
							value={newPortfolioName}
							placeholder='輸入您的投資組合名稱'
							onChange={(e) => setNewPortfolioName(e.target.value)}
							fullWidth
							autoFocus
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setIsCreatePortfolioOpen(false)}>取消</Button>
						<Button onClick={createPortfolio}>新增</Button>
					</DialogActions>
				</Dialog>
				{portfolioData && (
					<>
						｜
						<>
							<Button color='inherit' className='text-xs hover:text-zinc-200' onClick={handleDeletePortfolioOpen}>
								移除投資組合
							</Button>
							<Dialog open={isDeletePortfolioOpen} onClose={() => setIsDeletePortfolioOpen(false)}>
								<DialogTitle>確定要移除此投資組合嗎？</DialogTitle>
								<DialogActions>
									<Button onClick={() => deletePortfolio(portfolioData[currentPortfolioIndex].group_name)}>確定</Button>
									<Button onClick={() => setIsDeletePortfolioOpen(false)} autoFocus>
										取消
									</Button>
								</DialogActions>
							</Dialog>
							｜
						</>
						<Button color='inherit' className='text-xs hover:text-zinc-200' onClick={handleEditNameOpen}>
							變更投資組合的名稱
						</Button>
						<Dialog maxWidth='xs' open={isEditNameOpen} onClose={() => setIsEditNameOpen(false)} fullWidth>
							<DialogTitle>變更投資組合的名稱</DialogTitle>
							<DialogContent>
								<Input
									type='text'
									value={newPortfolioName}
									min='1'
									placeholder='輸入您要變更的名稱'
									onChange={(e) => setNewPortfolioName(e.target.value)}
									fullWidth
									autoFocus
								/>
							</DialogContent>
							<DialogActions>
								<Button onClick={() => setIsEditNameOpen(false)}>取消</Button>
								<Button onClick={editPortfolioName}>保存</Button>
							</DialogActions>
						</Dialog>
					</>
				)}
			</div>
			{portfolioData[currentPortfolioIndex] && (
				<>
					<div className='flex items-center justify-end mb-3 space-x-2 dark:text-zinc-800'>
						<StockSelect setSelect={setNewStockId} />
						<button
							className='font-bold text-white rounded-full w-7 h-7 flex-center bg-sky-400 hover:bg-sky-500'
							onClick={addStock}
						>
							＋
						</button>
					</div>
					<DataGrid
						sx={{
							pl: 1,
							pr: 2,
							pt: 0,
							pb: 2,
							'& .css-1iyq7zh-MuiDataGrid-columnHeaders, & .MuiDataGrid-withBorderColor': {
								borderBottomWidth: '0.75px',
								borderColor: '#71717a',
							},
							'& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
								outline: 'none',
							},
							'& .css-i4bv87-MuiSvgIcon-root': {
								color: '#a1a1aa',
							},
							'& .css-1pe4mpk-MuiButtonBase-root-MuiIconButton-root': {
								color: '#40B4FF',
							},
						}}
						rows={rows}
						columns={[
							{
								field: 'stock_id',
								headerName: '股票代號 / 名稱',
								flex: 1,
								renderCell: (params) => {
									const value = params.value || 0
									return <p> {value + ' ' + stock100.find((stock) => stock.stock_id === value).name} </p>
								},
							},
							{
								field: 'opening_price',
								headerName: '開盤價',
								headerAlign: 'right',
								align: 'right',
								sortable: true,
								flex: 1,
							},
							{
								field: 'closing_price',
								headerName: '收盤價',
								headerAlign: 'right',
								align: 'right',
								sortable: true,
								flex: 1,
							},
							{
								field: 'highest_price',
								headerName: '最高價',
								headerAlign: 'right',
								align: 'right',
								sortable: true,
								flex: 1,
							},
							{
								field: 'lowest_price',
								headerName: '最低價',
								headerAlign: 'right',
								align: 'right',
								sortable: true,
								flex: 1,
							},
							{
								field: 'change',
								headerName: '漲跌 (%)',
								headerAlign: 'right',
								align: 'right',
								sortable: true,
								flex: 1,
								renderCell: (params) => {
									const value = params.value || 0
									if (value > 0) {
										return (
											<p className='flex items-center font-medium space-x-0.5 text-stock_red'>
												<ArrowDropUpIcon color='error' />
												<span>{value}</span>
											</p>
										)
									} else if (value < 0) {
										return (
											<p className='flex items-center font-medium space-x-0.5 text-stock_green'>
												<ArrowDropDownIcon color='success' />
												<span>{Math.abs(value)}</span>
											</p>
										)
									} else if (value === 0) {
										;<p className='flex items-center font-medium space-x-0.5 text-zinc-800'>
											<span>{value}</span>
										</p>
									} else {
										return value
									}
								},
							},
						]}
						onRowSelectionModelChange={(ids) => setRowIds(ids)}
						className='bg-white border-none dark:bg-zinc-800 dark:text-zinc-200'
						hideFooter
						disableColumnMenu
						checkboxSelection
					/>
					{rowIds.length !== 0 ? (
						<Button
							size='small'
							color='inherit'
							onClick={deleteStock}
							className='px-4 mt-3 rounded-full dark:text-zinc-800 bg-primary_yellow hover:filter hover:brightness-90'
						>
							刪除股票
						</Button>
					) : null}
				</>
			)}
			<p className='mt-4 text-xs text-right text-white opacity-80'>
				※ 如果您的投資組合尚未顯示，請回上一頁，重新點擊會員投資組合頁面查看。
			</p>
		</StarryBackground>
	)
}
