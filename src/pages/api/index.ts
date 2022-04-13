import { createApiHandler } from 'lib/api/handler';

const handler = createApiHandler();

handler.get((req, res) => {
	res.json({
		hello: 'world',
	});
});

export default handler;
