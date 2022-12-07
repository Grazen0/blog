import { SerializedPopulatedPost, SerializedPost } from 'lib/types';
import { Schema, model, models, Model, Types, Document } from 'mongoose';
import { ICategory } from './category';

export type IPost = {
	_id: Types.ObjectId;
	category: Types.ObjectId;
	slug: string;
	title: string;
	summary: string;
	image: string;
	imageAlt: string;
	content: string;
	views: number;
	draft: boolean;
	editedAt?: Date;
	serializable(): SerializedPost;
} & (
	| {
			draft: true;
			publishedAt?: Date;
	  }
	| {
			draft: false;
			publishedAt: Date;
	  }
);

export interface IPopulatedPost extends Omit<IPost, 'category' | 'serializable'> {
	category: ICategory;
	serializable(): SerializedPopulatedPost;
}

const PostSchema = new Schema(
	{
		category: { type: Types.ObjectId, ref: 'Category', required: false },
		slug: { type: String, required: true, lowercase: true, trim: true, minlength: 1 },
		title: { type: String, required: true, trim: true, minlength: 1 },
		summary: { type: String, required: true, trim: true, minlength: 1 },
		image: { type: String, required: true, trim: true, minLength: 1 },
		imageAlt: { type: String, required: true, trim: true, minLength: 1 },
		content: { type: String, required: true, trim: true, minlength: 1 },
		draft: { type: Boolean, required: true, default: true },
		views: { type: Number, required: true, default: 0, min: 0 },
		editedAt: { type: Date, required: false },
		publishedAt: { type: Date, required: false },
	},
	{
		toObject: {
			versionKey: false,
			transform: (doc: unknown, ret: Document & IPost) => {
				ret.id = ret._id.toString();
				delete ret._id;

				ret.publishedAt = (ret.publishedAt?.getTime() || null) as unknown as Date;
				ret.editedAt = (ret.editedAt?.getTime() || null) as unknown as Date;

				if (ret.category instanceof Types.ObjectId) {
					ret.category = ret.category.toString() as unknown as Types.ObjectId;
				}

				return ret;
			},
		},
	}
);

PostSchema.method('serializable', function (this: Document) {
	return this.toObject();
});

PostSchema.index({ category: 1, slug: 1 }, { unique: true });

const Post: Model<IPost> = models.Post || model<IPost>('Post', PostSchema);

export default Post;
