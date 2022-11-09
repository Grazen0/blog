import { Schema, model, models, Model } from 'mongoose';
import { transformIdField } from '..';

export interface IPostStats {
	id: string;
	viewCount: number;
	views: {
		address: string;
		date: number;
	}[];
	likes: string[];
	updatedAt: Date;
}

const PostStatsSchema = new Schema(
	{
		_id: String,
		viewCount: { type: Number, min: 0, default: 0 },
		views: [
			{
				address: { type: String, required: true },
				date: { type: Number, required: true, default: () => Date.now() },
			},
		],
		likes: { type: [String], required: true },
	},
	{
		timestamps: { createdAt: false, updatedAt: true },
		toJSON: {
			versionKey: false,
			transform: (doc: any, ret: any) => transformIdField(ret),
		},
	}
);

const PostStats: Model<IPostStats> = models.PostStats || model('PostStats', PostStatsSchema);

export default PostStats;
