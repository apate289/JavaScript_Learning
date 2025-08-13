'use client'

import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import StarryBackground from '@/components/common/StarryBackground'
import InputField from '@/components/ui/InputField'
import PrivacyAndTerms from '@/components/ui/PrivacyAndTerms'
import SubmitBtn from '@/components/ui/SubmitBtn'

export default function Register() {
	const router = useRouter()

	const [user, setUser] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	})
	const [isSucceed, setIsSucceed] = useState(false)

	const handleRegister = async (e) => {
		e.preventDefault()
		const { name, email, password, confirmPassword } = user

		if (password !== confirmPassword) {
			alert('密碼與確認密碼不相符，請重新輸入！')
			return
		}

		try {
			const responce = await fetch(`${process.env.DB_URL}/api/user/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, email, password }),
			})
			const data = await responce.json()
			if (data.success) setIsSucceed(true)
			else alert(data.errorMessage.includes('Error') ? data.errorMessage : '註冊失敗，請重新註冊！')
		} catch (error) {
			console.error('Error: ', error)
			alert('註冊失敗，請重新註冊！')
		}
	}

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (isSucceed) router.push('/login')
		}, 3000)

		return () => clearTimeout(timeoutId)
	}, [isSucceed])

	return (
		<StarryBackground className='flex-col flex-center'>
			<div className='px-5 py-8 bg-white/10 backdrop-blur-xl dark:bg-zinc-900/50 sm:px-10 sm:rounded-xl sm:w-3/4 md:w-4/6 lg:w-1/2 xl:w-2/5'>
				<h3 className='text-zinc-100'>註冊股市光明燈</h3>
				<p className='mt-4 mb-8 space-x-1 text-sm text-zinc-100 opacity-80'>
					<sapn>已經有帳號了！</sapn>{' '}
					<Link href={'/login'} className='underline opacity-80'>
						登入
					</Link>
				</p>
				<InputField
					label='使用者名稱'
					type='text'
					onChange={(e) => setUser({ ...user, name: e.target.value })}
					placeholder='請輸入您的使用者名稱'
				/>
				<InputField
					label='Email'
					type='email'
					onChange={(e) => setUser({ ...user, email: e.target.value })}
					placeholder='請輸入您的 Email'
				/>
				<InputField
					label='密碼'
					type='password'
					onChange={(e) => setUser({ ...user, password: e.target.value })}
					placeholder='請輸入您的密碼'
				/>
				<InputField
					label='確認密碼'
					type='password'
					onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
					placeholder='請再一次輸入密碼'
				/>
				<SubmitBtn text='註冊' handleSubmit={handleRegister} style='mt-5 mb-10' />
				<PrivacyAndTerms />
			</div>
			{/* 註冊成功消息 */}
			<Dialog open={isSucceed} align='center' onClose={() => setIsSucceed(false)}>
				<DialogTitle className='dark:text-zinc-100 dark:bg-zinc-800'>註冊成功</DialogTitle>
				<DialogContent className='dark:text-zinc-100 dark:bg-zinc-800'>
					<Image src='/assets/success-symbol.svg' width={96} height={96} alt='success' className='block mx-auto' />
					<p>將在 3 秒後跳轉至登入頁面...</p>
				</DialogContent>
			</Dialog>
		</StarryBackground>
	)
}
