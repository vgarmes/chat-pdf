<script>
	import { Alert } from 'flowbite-svelte'
	import { APP_STATUS, appStatus } from '../store.ts'
	import StepUpload from './StepUpload.svelte'
	import StepLoading from './StepLoading.svelte'
	import StepChat from './StepChat.svelte'
</script>

{#if $appStatus === APP_STATUS.INIT}
	<StepUpload />
{:else if $appStatus === APP_STATUS.LOADING}
	<StepLoading />
{:else if $appStatus === APP_STATUS.ERROR}
	<Alert>
		<span class="font-medium">Something went wrong!</span>
	</Alert>
{:else if $appStatus === APP_STATUS.CHAT_MODE}
	<StepChat />
{:else}
	<Alert>
		<span class="font-medium">Try again</span>
	</Alert>
{/if}
