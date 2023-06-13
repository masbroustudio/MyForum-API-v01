const LikeRepository = require("../../Domains/likes/LikeRepository");

class LikeRepositoryPostgres extends LikeRepository {
	constructor(pool, idGenerator) {
		super();
		this._pool = pool;
		this._idGenerator = idGenerator;
	}

	async likeComment(userId, likeComment) {
		const { commentId } = likeComment;
		const likeId = `like-${this._idGenerator()}`;

		const query = {
			text: "INSERT INTO likes VALUES($1, $2, $3)",
			values: [likeId, commentId, userId]
		};

		await this._pool.query(query);
	}

	async unlikeComment(userId, unlikeComment) {
		const { likeId, commentId } = unlikeComment;

		const query = {
			text: "DELETE FROM likes WHERE id = $1 AND comment_id = $2 AND owner = $3",
			values: [likeId, commentId, userId]
		};

		await this._pool.query(query);
	}

	async findLikeByCommentId(userId, commentId) {
		const query = {
			text: "SELECT * FROM likes WHERE comment_id = $1 AND owner = $2",
			values: [commentId, userId]
		};

		const result = await this._pool.query(query);

		return result.rows[0];
	}
}

module.exports = LikeRepositoryPostgres;
