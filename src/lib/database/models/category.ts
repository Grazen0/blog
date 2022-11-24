import { Schema, model, models, Model, Document, Types } from 'mongoose';
import { SerializedCategory } from 'lib/types';

export interface ICategory {
	_id: Types.ObjectId;
	slug: string;
	name: string;
	description: string;
	image: string;
	imageAlt: string;
	serializable(): SerializedCategory;
}

const CategorySchema = new Schema(
	{
		slug: { type: String, required: true, lowercase: true, trim: true, minlength: 1, unique: true },
		name: { type: String, required: true, trim: true, minlength: 1 },
		description: { type: String, required: false, trim: true, minlength: 1 },
		image: { type: String, required: false, trim: true },
		imageAlt: { type: String, required: true, trim: true, minLength: 1 },
	},
	{
		toObject: {
			versionKey: false,
			transform: (doc: unknown, ret: Document & ICategory) => {
				ret.id = ret._id.toString();
				delete ret._id;
				return ret;
			},
		},
	}
);

CategorySchema.method('serializable', function (this: Document) {
	return this.toObject();
});

const Category: Model<ICategory> = models.Category || model<ICategory>('Category', CategorySchema);

export default Category;
