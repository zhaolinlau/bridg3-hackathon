import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const client = await serverSupabaseClient(event)
	const user = await serverSupabaseUser(event)

	const { data: myWallet } = await client
		.from('maschain')
		.select("*")
		.eq('user_id', user.id)
		.single()

	const data = await $fetch(`${config.maschainApi}/api/token/get-token-transaction`, {
		method: 'get',
		headers: {
			client_id: config.maschainClientId,
			client_secret: config.maschainClientSecret,
			'content-type': 'application/json'
		},
		params: {
			wallet_address: myWallet.wallet_address,
			contract_address: config.maschainTokenContract,
			filter: '0x00ab4E6d98EB428322ad23fd2d74854d90E3B6f5'
		}
	})

	return data
})
