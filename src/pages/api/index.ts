import { createApiHandler } from 'lib/api/handler';

const handler = createApiHandler();

handler.get((req, res) => {
	res.statusResponse(200, 'Hello, world!');
});

export default handler;
