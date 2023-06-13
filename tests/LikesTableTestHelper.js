/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const LikesTableTestHelper = {
	async likeComment({ id = "like-123", commentId = "comment-123", userId = "user-123" }) {
		const query = {
			text: "INSERT INTO likes VALUES($1, $2, $3)",
			values: [id, commentId, userId]
		};

		await pool.query(query);
	},

	async unlikeComment({ id = "like-123" }) {
		const query = {
			text: "DELETE FROM likes WHERE id = $1",
			values: [id]
		};

		await pool.query(query);
	},

	async findLikeById(id) {
		const query = {
			text: "SELECT * FROM likes WHERE id = $1",
			values: [id]
		};

		const result = await pool.query(query);

		return result.rows;
	},

	async cleanTable() {
		await pool.query("DELETE FROM likes WHERE 1=1");
	}
};

module.exports = LikesTableTestHelper;
