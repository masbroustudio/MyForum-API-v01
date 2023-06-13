const LikeHandler = require("./handler");
const routes = require("./routes");

module.exports = {
	name: "likes",
	register: async (server, { container }) => {
		const likehandler = new LikeHandler(container);
		server.route(routes(likehandler));
	}
};
