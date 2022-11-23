import axios from 'axios';

export interface DeploymentJob {
	id: string;
	state: string;
	createdAt: number;
}

const { DEPLOY_HOOK_URL } = process.env;
if (!DEPLOY_HOOK_URL) {
	console.warn('Missing DEPLOY_HOOK_URL environment variable, no redeployments will be triggered.');
}

const triggerDeployment = async () => {
	if (!DEPLOY_HOOK_URL) return;

	const res = await axios.post(DEPLOY_HOOK_URL);
	const { job } = res.data;
	console.log('Triggered deployment with job ID', job.id);
	return job;
};

export default triggerDeployment;
